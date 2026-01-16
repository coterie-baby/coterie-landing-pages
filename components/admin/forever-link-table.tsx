'use client';

import { useState } from 'react';

interface ForeverLinkMapping {
  destination: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface ForeverLinkTableProps {
  mappings: Record<string, ForeverLinkMapping>;
  authToken: string;
  onEdit: (utmContent: string, mapping: ForeverLinkMapping) => void;
  onRefresh: () => void;
}

export function ForeverLinkTable({
  mappings,
  authToken,
  onEdit,
  onRefresh,
}: ForeverLinkTableProps) {
  const [deletingKey, setDeletingKey] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const entries = Object.entries(mappings).sort((a, b) => {
    // Sort by updatedAt descending (most recent first)
    return new Date(b[1].updatedAt).getTime() - new Date(a[1].updatedAt).getTime();
  });

  async function handleDelete(utmContent: string) {
    setDeletingKey(utmContent);

    try {
      const response = await fetch(
        `/api/admin/forever-links/${encodeURIComponent(utmContent)}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete');
      }

      onRefresh();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete mapping');
    } finally {
      setDeletingKey(null);
      setConfirmDelete(null);
    }
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function isLocalPath(url: string): boolean {
    return url.startsWith('/');
  }

  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <p className="text-gray-500">No forever links configured yet.</p>
        <p className="text-sm text-gray-400 mt-1">
          Add your first link using the form above.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                UTM Content
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Destination
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Notes
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Updated
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {entries.map(([utmContent, mapping]) => (
              <tr key={utmContent} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-800">
                    {utmContent}
                  </code>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        isLocalPath(mapping.destination)
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {isLocalPath(mapping.destination) ? 'Local' : 'External'}
                    </span>
                    <span className="text-sm text-gray-900 truncate max-w-[200px]">
                      {mapping.destination}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-gray-500">
                    {mapping.notes || '—'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-gray-500">
                    {formatDate(mapping.updatedAt)}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(utmContent, mapping)}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Edit
                    </button>

                    {confirmDelete === utmContent ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDelete(utmContent)}
                          disabled={deletingKey === utmContent}
                          className="text-sm text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
                        >
                          {deletingKey === utmContent ? 'Deleting...' : 'Confirm'}
                        </button>
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="text-sm text-gray-500 hover:text-gray-700 font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDelete(utmContent)}
                        className="text-sm text-red-600 hover:text-red-800 font-medium"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
