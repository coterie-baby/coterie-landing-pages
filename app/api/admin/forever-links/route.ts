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

// GET - Fetch all forever links
export async function GET(request: Request) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const config = await get<ForeverLinksConfig>('foreverLinks');

    return NextResponse.json({
      default: config?.default ?? 'https://www.coterie.com/products/the-diaper',
      mappings: config?.mappings ?? {},
    });
  } catch (error) {
    console.error('Error fetching forever links:', error);
    return NextResponse.json(
      { error: 'Failed to fetch forever links' },
      { status: 500 }
    );
  }
}

// POST - Create a new forever link mapping
export async function POST(request: Request) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { utmContent, destination, notes } = body;

    if (!utmContent || !destination) {
      return NextResponse.json(
        { error: 'utmContent and destination are required' },
        { status: 400 }
      );
    }

    // Get current config
    const currentConfig = await get<ForeverLinksConfig>('foreverLinks');
    const config: ForeverLinksConfig = {
      default: currentConfig?.default ?? 'https://www.coterie.com/products/the-diaper',
      mappings: currentConfig?.mappings ?? {},
    };

    // Check if mapping already exists
    if (config.mappings[utmContent]) {
      return NextResponse.json(
        { error: 'Mapping for this utm_content already exists' },
        { status: 409 }
      );
    }

    // Add new mapping
    const now = new Date().toISOString();
    config.mappings[utmContent] = {
      destination,
      notes: notes || undefined,
      createdAt: now,
      updatedAt: now,
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
      mapping: { utmContent, ...config.mappings[utmContent] },
    });
  } catch (error) {
    console.error('Error creating forever link:', error);
    return NextResponse.json(
      { error: 'Failed to create forever link' },
      { status: 500 }
    );
  }
}

// PUT - Update the default destination
export async function PUT(request: Request) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { default: defaultDestination } = body;

    if (!defaultDestination) {
      return NextResponse.json(
        { error: 'default destination is required' },
        { status: 400 }
      );
    }

    // Get current config
    const currentConfig = await get<ForeverLinksConfig>('foreverLinks');
    const config: ForeverLinksConfig = {
      default: defaultDestination,
      mappings: currentConfig?.mappings ?? {},
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
      default: defaultDestination,
    });
  } catch (error) {
    console.error('Error updating default:', error);
    return NextResponse.json(
      { error: 'Failed to update default destination' },
      { status: 500 }
    );
  }
}
