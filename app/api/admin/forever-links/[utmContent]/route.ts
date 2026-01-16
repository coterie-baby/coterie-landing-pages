import { NextResponse } from 'next/server';
import { get } from '@vercel/edge-config';

interface ForeverLinkMapping {
  destination: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface ForeverLinksConfig {
  default: string;
  mappings: Record<string, ForeverLinkMapping>;
}

// Verify admin auth
function verifyAuth(request: Request): boolean {
  const authHeader = request.headers.get('Authorization');
  const adminSecret = process.env.ADMIN_SECRET;

  if (!adminSecret || !authHeader) return false;

  const token = authHeader.replace('Bearer ', '');
  return token === adminSecret;
}

// Update Edge Config via Vercel API
async function updateEdgeConfig(config: ForeverLinksConfig): Promise<boolean> {
  const edgeConfigId = process.env.EDGE_CONFIG_ID;
  const vercelToken = process.env.VERCEL_API_TOKEN;

  if (!edgeConfigId || !vercelToken) {
    console.error('Missing EDGE_CONFIG_ID or VERCEL_API_TOKEN');
    return false;
  }

  try {
    const response = await fetch(
      `https://api.vercel.com/v1/edge-config/${edgeConfigId}/items`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${vercelToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [
            {
              operation: 'upsert',
              key: 'foreverLinks',
              value: config,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Edge Config update failed:', errorText);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Edge Config update error:', error);
    return false;
  }
}

interface RouteContext {
  params: Promise<{ utmContent: string }>;
}

// GET - Fetch a single forever link mapping
export async function GET(request: Request, context: RouteContext) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { utmContent } = await context.params;
  const decodedUtmContent = decodeURIComponent(utmContent);

  try {
    const config = await get<ForeverLinksConfig>('foreverLinks');
    const mapping = config?.mappings?.[decodedUtmContent];

    if (!mapping) {
      return NextResponse.json(
        { error: 'Mapping not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      utmContent: decodedUtmContent,
      ...mapping,
    });
  } catch (error) {
    console.error('Error fetching forever link:', error);
    return NextResponse.json(
      { error: 'Failed to fetch forever link' },
      { status: 500 }
    );
  }
}

// PUT - Update a forever link mapping
export async function PUT(request: Request, context: RouteContext) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { utmContent } = await context.params;
  const decodedUtmContent = decodeURIComponent(utmContent);

  try {
    const body = await request.json();
    const { destination, notes } = body;

    if (!destination) {
      return NextResponse.json(
        { error: 'destination is required' },
        { status: 400 }
      );
    }

    // Get current config
    const currentConfig = await get<ForeverLinksConfig>('foreverLinks');

    if (!currentConfig?.mappings?.[decodedUtmContent]) {
      return NextResponse.json(
        { error: 'Mapping not found' },
        { status: 404 }
      );
    }

    const config: ForeverLinksConfig = {
      default: currentConfig.default,
      mappings: { ...currentConfig.mappings },
    };

    // Update mapping
    config.mappings[decodedUtmContent] = {
      ...config.mappings[decodedUtmContent],
      destination,
      notes: notes || undefined,
      updatedAt: new Date().toISOString(),
    };

    // Update Edge Config
    const success = await updateEdgeConfig(config);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update Edge Config' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      mapping: {
        utmContent: decodedUtmContent,
        ...config.mappings[decodedUtmContent],
      },
    });
  } catch (error) {
    console.error('Error updating forever link:', error);
    return NextResponse.json(
      { error: 'Failed to update forever link' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a forever link mapping
export async function DELETE(request: Request, context: RouteContext) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { utmContent } = await context.params;
  const decodedUtmContent = decodeURIComponent(utmContent);

  try {
    // Get current config
    const currentConfig = await get<ForeverLinksConfig>('foreverLinks');

    if (!currentConfig?.mappings?.[decodedUtmContent]) {
      return NextResponse.json(
        { error: 'Mapping not found' },
        { status: 404 }
      );
    }

    const config: ForeverLinksConfig = {
      default: currentConfig.default,
      mappings: { ...currentConfig.mappings },
    };

    // Remove mapping
    delete config.mappings[decodedUtmContent];

    // Update Edge Config
    const success = await updateEdgeConfig(config);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update Edge Config' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      deleted: decodedUtmContent,
    });
  } catch (error) {
    console.error('Error deleting forever link:', error);
    return NextResponse.json(
      { error: 'Failed to delete forever link' },
      { status: 500 }
    );
  }
}
