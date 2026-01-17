'use client';

import { useState, useEffect, useCallback } from 'react';
import { ForeverLinkForm } from '@/components/admin/forever-link-form';
import { ForeverLinkTable } from '@/components/admin/forever-link-table';

interface ForeverLinkMapping {
  destination: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface ForeverLinksData {
  default: string;
  mappings: Record<string, ForeverLinkMapping>;
}

const AUTH_COOKIE_NAME = 'admin_auth';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

export default function ForeverLinksPage() {
  const [data, setData] = useState<ForeverLinksData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingLink, setEditingLink] = useState<{
    utmContent: string;
    destination: string;
    notes?: string;
  } | null>(null);
  const [defaultUrl, setDefaultUrl] = useState('');
  const [isUpdatingDefault, setIsUpdatingDefault] = useState(false);

  const authToken = getCookie(AUTH_COOKIE_NAME) || '';

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/forever-links', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const result = await response.json();
      setData(result);
      setDefaultUrl(result.default);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleUpdateDefault() {
    setIsUpdatingDefault(true);

    try {
      const response = await fetch('/api/admin/forever-links', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ default: defaultUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to update default');
      }

      fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update');
    } finally {
      setIsUpdatingDefault(false);
    }
  }

  function handleEdit(utmContent: string, mapping: ForeverLinkMapping) {
    setEditingLink({
      utmContent,
      destination: mapping.destination,
      notes: mapping.notes,
    });
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleFormSuccess() {
    setEditingLink(null);
    fetchData();
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
        <button
          onClick={fetchData}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Forever Links</h1>
        <p className="text-gray-500 mt-1">
          Manage UTM-based routing for your ad traffic.
        </p>
      </div>

      {/* Default Fallback Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-6">
        <h2 className="text-base font-medium text-gray-900 mb-1">
          Default Fallback URL
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Traffic with an unrecognized utm_content value will be redirected here.
        </p>

        <div className="flex gap-3">
          <input
            type="text"
            value={defaultUrl}
            onChange={(e) => setDefaultUrl(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://www.coterie.com/products/the-diaper"
          />
          <button
            onClick={handleUpdateDefault}
            disabled={isUpdatingDefault || defaultUrl === data?.default}
            className="bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-900 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdatingDefault ? 'Saving...' : 'Update Default'}
          </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      <ForeverLinkForm
        authToken={authToken}
        onSuccess={handleFormSuccess}
        editingLink={editingLink}
        onCancel={editingLink ? () => setEditingLink(null) : undefined}
      />

      {/* Mappings Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-medium text-gray-900">
            Link Mappings
          </h2>
          <span className="text-sm text-gray-500">
            {Object.keys(data?.mappings || {}).length} total
          </span>
        </div>

        <ForeverLinkTable
          mappings={data?.mappings || {}}
          authToken={authToken}
          onEdit={handleEdit}
          onRefresh={fetchData}
        />
      </div>

      {/* Help Section */}
      <div className="bg-gray-50 rounded-xl border border-gray-200/60 p-5">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          How it works
        </h3>
        <ul className="text-sm text-gray-600 space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-gray-400 mt-1">•</span>
            Traffic with a <code className="bg-gray-200/70 px-1.5 py-0.5 rounded text-xs font-mono">utm_content</code> parameter is matched against your configured links
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gray-400 mt-1">•</span>
            Matching traffic is redirected to the destination (all UTM params preserved)
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gray-400 mt-1">•</span>
            Unmatched traffic goes to the default fallback URL
          </li>
        </ul>
      </div>
    </div>
  );
}
