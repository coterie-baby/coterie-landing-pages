import { NextRequest, NextResponse } from 'next/server';
import {
  getDashboardMetrics,
  isAmplitudeConfigured,
  DashboardMetrics,
  getEventSegmentation,
} from '@/lib/amplitude-api';

const ADMIN_SECRET = process.env.ADMIN_SECRET;

function validateAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return false;
  }
  const token = authHeader.slice(7);
  return token === ADMIN_SECRET;
}

export async function GET(request: NextRequest) {
  // Validate authentication
  if (!validateAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check if Amplitude is configured
  if (!isAmplitudeConfigured()) {
    return NextResponse.json(
      {
        error: 'Amplitude not configured',
        message: 'Add AMPLITUDE_API_KEY and AMPLITUDE_SECRET_KEY to your environment variables',
        configured: false,
      },
      { status: 200 } // Return 200 so dashboard can handle gracefully
    );
  }

  // Get time range from query params (default 7 days)
  const searchParams = request.nextUrl.searchParams;
  const days = parseInt(searchParams.get('days') || '7', 10);
  const debug = searchParams.get('debug') === 'true';

  try {
    // Debug mode: return raw API response to help identify event names
    if (debug) {
      const testEvents = [
        // Page view variations
        '[Amplitude] Page Viewed',
        'Page View',
        'page_view',
        'pageview',
        '$pageview',
        // Session variations
        '[Amplitude] Start Session',
        '[Amplitude] Session Start',
        'session_start',
        'Session Start',
        '$session_start',
        // Custom events in codebase
        'floating_cta_clicked',
        'cta_clicked',
        // Any event (for testing connectivity)
        '_active',
      ];
      const results: Record<string, unknown> = {};

      for (const eventType of testEvents) {
        try {
          const response = await getEventSegmentation({
            eventType,
            days,
            metric: 'totals',
          });
          results[eventType] = {
            success: true,
            value: response?.data?.seriesCollapsed?.[0]?.[0]?.value ?? 0,
            raw: response?.data,
          };
        } catch (e) {
          results[eventType] = {
            success: false,
            error: e instanceof Error ? e.message : 'Unknown error',
          };
        }
      }

      return NextResponse.json({
        configured: true,
        debug: true,
        message: 'Testing event names. Find ones with non-zero values and update lib/amplitude-api.ts',
        results,
      });
    }

    const metrics: DashboardMetrics = await getDashboardMetrics(days);

    return NextResponse.json({
      configured: true,
      days,
      metrics,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching Amplitude metrics:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch metrics',
        message: error instanceof Error ? error.message : 'Unknown error',
        configured: true,
      },
      { status: 500 }
    );
  }
}
