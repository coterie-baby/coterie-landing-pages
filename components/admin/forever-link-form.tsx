'use client';

import { useState } from 'react';

interface ForeverLinkFormProps {
  authToken: string;
  onSuccess: () => void;
  editingLink?: {
    utmContent: string;
    destination: string;
    notes?: string;
  } | null;
  onCancel?: () => void;
}

export function ForeverLinkForm({
  authToken,
  onSuccess,
  editingLink,
  onCancel,
}: ForeverLinkFormProps) {
  const [utmContent, setUtmContent] = useState(editingLink?.utmContent ?? '');
  const [destination, setDestination] = useState(editingLink?.destination ?? '');
  const [notes, setNotes] = useState(editingLink?.notes ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isEditing = !!editingLink;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const url = isEditing
        ? `/api/admin/forever-links/${encodeURIComponent(editingLink.utmContent)}`
        : '/api/admin/forever-links';

      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          utmContent: isEditing ? undefined : utmContent,
          destination,
          notes: notes || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save');
      }

      // Reset form
      setUtmContent('');
      setDestination('');
      setNotes('');
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setIsSubmitting(false);
    }
  }

  const isLocalPath = destination.startsWith('/');
  const isExternalUrl =
    destination.startsWith('http://') || destination.startsWith('https://');
  const isValidDestination = isLocalPath || isExternalUrl || destination === '';

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-6">
      <h2 className="text-base font-medium text-gray-900 mb-4">
        {isEditing ? 'Edit Forever Link' : 'Add New Forever Link'}
      </h2>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="utmContent"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            UTM Content Value
          </label>
          <input
            type="text"
            id="utmContent"
            value={utmContent}
            onChange={(e) => setUtmContent(e.target.value)}
            disabled={isEditing}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
            placeholder="e.g., summer_sale_diaper"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            The utm_content parameter value from your ad URL
          </p>
        </div>

        <div>
          <label
            htmlFor="destination"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Destination URL
          </label>
          <input
            type="text"
            id="destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              !isValidDestination ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="e.g., /sizing-quiz or https://coterie.com/products"
            required
          />
          <div className="mt-1 flex items-center gap-2">
            {destination && (
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                  isLocalPath
                    ? 'bg-green-100 text-green-800'
                    : isExternalUrl
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {isLocalPath ? 'Local Route' : isExternalUrl ? 'External URL' : 'Invalid'}
              </span>
            )}
            <p className="text-xs text-gray-500">
              Use /path for local routes or https://... for external URLs
            </p>
          </div>
        </div>

        <div>
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Notes (optional)
          </label>
          <input
            type="text"
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Summer 2025 Meta campaign"
          />
        </div>

        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting || !isValidDestination}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Link' : 'Add Link'}
          </button>

          {isEditing && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
