'use client';

import { useEffect, useState } from 'react';

import { MetricsCard, MetricsCardSkeleton } from './metrics-card';

const AUTH_COOKIE_NAME = 'admin_auth';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

interface MetricData {
  current: number;
  previous: number;
  change: number;
}

interface DashboardMetrics {
  visitors: MetricData;
  pageViews: MetricData;
  bounceRate: MetricData;
  clickThroughRate: MetricData;
}

interface MetricsResponse {
  configured: boolean;
  metrics?: DashboardMetrics;
  error?: string;
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toLocaleString();
}

export function QuickInsightCards() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugData, setDebugData] = useState<Record<string, unknown> | null>(null);
  const [showDebug, setShowDebug] = useState(false);

  const authToken = getCookie(AUTH_COOKIE_NAME) || '';

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const response = await fetch('/api/admin/metrics?days=7', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        const data: MetricsResponse = await response.json();

        if (!data.configured) {
          setError('Amplitude not configured');
          return;
        }

        if (data.error) {
          setError(data.error);
          return;
        }

        if (data.metrics) {
          setMetrics(data.metrics);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
      } finally {
        setLoading(false);
      }
    }

    fetchMetrics();
  }, [authToken]);

  async function fetchDebugData() {
    setShowDebug(true);
    try {
      const response = await fetch('/api/admin/metrics?days=7&debug=true', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await response.json();
      setDebugData(data);
    } catch (err) {
      setDebugData({ error: err instanceof Error ? err.message : 'Failed to fetch debug data' });
    }
  }

  const metricsData = [
    {
      label: 'Total Visitors',
      value: formatNumber(metrics?.visitors.current ?? 0),
      trend: metrics?.visitors.change ?? 0,
      trendMessage: '',
      subtitle: 'Last 7 days',
    },
    {
      label: 'Total Page Views',
      value: formatNumber(metrics?.pageViews.current ?? 0),
      trend: metrics?.pageViews.change ?? 0,
      trendMessage: '',
      subtitle: 'Last 7 days',
    },
    {
      label: 'Bounce Rate',
      value: `${metrics?.bounceRate.current ?? 0}%`,
      trend: metrics?.bounceRate.change ?? 0,
      trendMessage: '',
      subtitle: 'Last 7 days',
    },
    {
      label: 'Click-through Rate',
      value: `${metrics?.clickThroughRate.current ?? 0}%`,
      trend: metrics?.clickThroughRate.change ?? 0,
      trendMessage: '',
      subtitle: 'Last 7 days',
    },
  ];

  if (error) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800">
        <p className="font-medium">Unable to load metrics</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-4 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <MetricsCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-4 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {metricsData.map((metric) => (
          <MetricsCard key={metric.label} {...metric} />
        ))}
      </div>

      {/* Debug section - remove after fixing event names */}
      <div className="text-right">
        <button
          onClick={fetchDebugData}
          className="text-xs text-gray-400 hover:text-gray-600 underline"
        >
          Debug: Test event names
        </button>
      </div>

      {showDebug && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium text-sm text-gray-700">Debug: Event Name Test Results</h4>
            <button
              onClick={() => setShowDebug(false)}
              className="text-gray-400 hover:text-gray-600 text-sm"
            >
              Close
            </button>
          </div>
          {debugData ? (
            <pre className="text-xs overflow-auto max-h-96 bg-white p-3 rounded border">
              {JSON.stringify(debugData, null, 2)}
            </pre>
          ) : (
            <p className="text-sm text-gray-500">Loading...</p>
          )}
        </div>
      )}
    </div>
  );
}
