/**
 * Amplitude API Integration
 *
 * Uses Amplitude's Dashboard REST API and Event Segmentation API
 * to fetch analytics data for the admin dashboard.
 *
 * Required environment variables:
 * - AMPLITUDE_API_KEY: Your Amplitude API key
 * - AMPLITUDE_SECRET_KEY: Your Amplitude Secret key
 *
 * Find these in Amplitude → Settings → Projects → [Your Project] → General
 */

function getCredentials() {
  return {
    apiKey: process.env.AMPLITUDE_API_KEY,
    secretKey: process.env.AMPLITUDE_SECRET_KEY,
  };
}

function getAuthHeader(): string {
  const { apiKey, secretKey } = getCredentials();
  if (!apiKey || !secretKey) {
    throw new Error('Amplitude API credentials not configured');
  }
  return `Basic ${Buffer.from(`${apiKey}:${secretKey}`).toString('base64')}`;
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0].replace(/-/g, '');
}

function getDateRange(days: number): { start: string; end: string } {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);
  return {
    start: formatDate(start),
    end: formatDate(end),
  };
}

export interface AmplitudeEventData {
  series: number[][];
  seriesLabels: number[];
  seriesCollapsed: { setId: string; value: number }[][];
}

export interface AmplitudeSegmentationResponse {
  data: AmplitudeEventData;
}

/**
 * Fetch event segmentation data from Amplitude
 */
export async function getEventSegmentation(params: {
  eventType: string;
  days?: number;
  metric?: 'totals' | 'uniques' | 'avg' | 'pct_dau';
  groupBy?: { type: string; value: string }[];
  filters?: { subprop_type: string; subprop_key: string; subprop_op: string; subprop_value: string[] }[];
}): Promise<AmplitudeSegmentationResponse> {
  const { eventType, days = 7, metric = 'totals', groupBy, filters } = params;
  const { start, end } = getDateRange(days);

  const eventConfig: Record<string, unknown> = {
    event_type: eventType,
  };

  if (groupBy) {
    eventConfig.group_by = groupBy;
  }

  if (filters) {
    eventConfig.filters = filters;
  }

  const queryParams = new URLSearchParams({
    e: JSON.stringify(eventConfig),
    start,
    end,
    m: metric,
  });

  const response = await fetch(
    `https://amplitude.com/api/2/events/segmentation?${queryParams}`,
    {
      headers: {
        Authorization: getAuthHeader(),
      },
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Amplitude API error: ${response.status} - ${error}`);
  }

  return response.json();
}

/**
 * Fetch data from a saved Amplitude chart
 */
export async function getChartData(chartId: string): Promise<unknown> {
  const response = await fetch(
    `https://amplitude.com/api/3/chart/${chartId}/query`,
    {
      headers: {
        Authorization: getAuthHeader(),
      },
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Amplitude API error: ${response.status} - ${error}`);
  }

  return response.json();
}

/**
 * Metric with current value and trend data
 */
export interface MetricData {
  current: number;
  previous: number;
  change: number;
}

/**
 * Dashboard metrics structure
 */
export interface DashboardMetrics {
  visitors: MetricData;
  pageViews: MetricData;
  bounceRate: MetricData;
  clickThroughRate: MetricData;
}

/**
 * Calculate percentage change between two values
 */
function calculateChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

/**
 * Fetch all dashboard metrics
 * Aggregates multiple Amplitude API calls into a single response
 */
export async function getDashboardMetrics(days: number = 7): Promise<DashboardMetrics> {
  // Event names - update these to match your Amplitude events
  const PAGE_VIEW_EVENT = '[Amplitude] Page Viewed';
  const SESSION_START_EVENT = 'session_start';
  const CTA_CLICK_EVENT = 'floating_cta_clicked';

  // Parallel fetch for better performance
  const [
    currentVisitors,
    previousVisitors,
    currentPageViews,
    previousPageViews,
    currentSessions,
    previousSessions,
    currentCtaClicks,
    previousCtaClicks,
  ] = await Promise.all([
    // Current period unique visitors
    getEventSegmentation({
      eventType: PAGE_VIEW_EVENT,
      days,
      metric: 'uniques',
    }).catch(() => null),

    // Previous period unique visitors
    fetchPreviousPeriod(PAGE_VIEW_EVENT, 'uniques', days).catch(() => null),

    // Current period total page views
    getEventSegmentation({
      eventType: PAGE_VIEW_EVENT,
      days,
      metric: 'totals',
    }).catch(() => null),

    // Previous period total page views
    fetchPreviousPeriod(PAGE_VIEW_EVENT, 'totals', days).catch(() => null),

    // Current period total sessions
    getEventSegmentation({
      eventType: SESSION_START_EVENT,
      days,
      metric: 'totals',
    }).catch(() => null),

    // Previous period total sessions
    fetchPreviousPeriod(SESSION_START_EVENT, 'totals', days).catch(() => null),

    // Current period CTA clicks
    getEventSegmentation({
      eventType: CTA_CLICK_EVENT,
      days,
      metric: 'totals',
    }).catch(() => null),

    // Previous period CTA clicks
    fetchPreviousPeriod(CTA_CLICK_EVENT, 'totals', days).catch(() => null),
  ]);

  // Extract values from responses (seriesCollapsed is nested: [0][0].value)
  const currentVisitorCount = currentVisitors?.data?.seriesCollapsed?.[0]?.[0]?.value ?? 0;
  const previousVisitorCount = previousVisitors?.data?.seriesCollapsed?.[0]?.[0]?.value ?? 0;

  const currentPageViewCount = currentPageViews?.data?.seriesCollapsed?.[0]?.[0]?.value ?? 0;
  const previousPageViewCount = previousPageViews?.data?.seriesCollapsed?.[0]?.[0]?.value ?? 0;

  const currentSessionCount = currentSessions?.data?.seriesCollapsed?.[0]?.[0]?.value ?? 0;
  const previousSessionCount = previousSessions?.data?.seriesCollapsed?.[0]?.[0]?.value ?? 0;

  const currentCtaClickCount = currentCtaClicks?.data?.seriesCollapsed?.[0]?.[0]?.value ?? 0;
  const previousCtaClickCount = previousCtaClicks?.data?.seriesCollapsed?.[0]?.[0]?.value ?? 0;

  // Calculate bounce rate (approximation: sessions with only 1 page view)
  // Using pages per session as proxy: if avg pages/session is low, bounce rate is high
  const currentPagesPerSession = currentSessionCount > 0
    ? currentPageViewCount / currentSessionCount
    : 0;
  const previousPagesPerSession = previousSessionCount > 0
    ? previousPageViewCount / previousSessionCount
    : 0;
  // Estimate bounce rate: assume bounce if < 1.5 pages per session on average
  // This is a rough approximation - for accurate bounce rate, use Amplitude's built-in metrics
  const currentBounceRate = currentPagesPerSession > 0
    ? Math.max(0, Math.min(100, (1 / currentPagesPerSession) * 50))
    : 0;
  const previousBounceRate = previousPagesPerSession > 0
    ? Math.max(0, Math.min(100, (1 / previousPagesPerSession) * 50))
    : 0;

  // Calculate click-through rate (CTA clicks / sessions)
  const currentCtr = currentSessionCount > 0
    ? (currentCtaClickCount / currentSessionCount) * 100
    : 0;
  const previousCtr = previousSessionCount > 0
    ? (previousCtaClickCount / previousSessionCount) * 100
    : 0;

  return {
    visitors: {
      current: currentVisitorCount,
      previous: previousVisitorCount,
      change: calculateChange(currentVisitorCount, previousVisitorCount),
    },
    pageViews: {
      current: currentPageViewCount,
      previous: previousPageViewCount,
      change: calculateChange(currentPageViewCount, previousPageViewCount),
    },
    bounceRate: {
      current: Math.round(currentBounceRate * 10) / 10,
      previous: Math.round(previousBounceRate * 10) / 10,
      change: calculateChange(currentBounceRate, previousBounceRate),
    },
    clickThroughRate: {
      current: Math.round(currentCtr * 10) / 10,
      previous: Math.round(previousCtr * 10) / 10,
      change: calculateChange(currentCtr, previousCtr),
    },
  };
}

/**
 * Fetch metrics for the previous period (for comparison)
 */
async function fetchPreviousPeriod(
  eventType: string,
  metric: 'totals' | 'uniques',
  days: number
): Promise<AmplitudeSegmentationResponse> {
  const end = new Date();
  end.setDate(end.getDate() - days);
  const start = new Date();
  start.setDate(start.getDate() - days * 2);

  const queryParams = new URLSearchParams({
    e: JSON.stringify({ event_type: eventType }),
    start: formatDate(start),
    end: formatDate(end),
    m: metric,
  });

  const response = await fetch(
    `https://amplitude.com/api/2/events/segmentation?${queryParams}`,
    {
      headers: {
        Authorization: getAuthHeader(),
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Amplitude API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Check if Amplitude is configured
 */
export function isAmplitudeConfigured(): boolean {
  const { apiKey, secretKey } = getCredentials();
  return Boolean(apiKey && secretKey);
}
