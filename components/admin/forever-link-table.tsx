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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-8 text-center">
        <p className="text-gray-500">No forever links configured yet.</p>
        <p className="text-sm text-gray-400 mt-1">
          Add your first link using the form above.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50/80 border-b border-gray-200/60">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                UTM Content
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Destination
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Notes
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Updated
              </th>
              <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {entries.map(([utmContent, mapping]) => (
              <tr key={utmContent} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-3.5">
                  <code className="text-sm bg-gray-100/80 px-2 py-1 rounded-md text-gray-800 font-mono">
                    {utmContent}
                  </code>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                        isLocalPath(mapping.destination)
                          ? 'bg-green-50 text-green-700'
                          : 'bg-blue-50 text-blue-700'
                      }`}
                    >
                      {isLocalPath(mapping.destination) ? 'Local' : 'External'}
                    </span>
                    <span className="text-sm text-gray-900 truncate max-w-[200px]">
                      {mapping.destination}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-sm text-gray-500">
                    {mapping.notes || '—'}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-sm text-gray-500">
                    {formatDate(mapping.updatedAt)}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => onEdit(utmContent, mapping)}
                      className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
                    >
                      Edit
                    </button>

                    {confirmDelete === utmContent ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDelete(utmContent)}
                          disabled={deletingKey === utmContent}
                          className="text-sm text-red-600 hover:text-red-700 font-medium disabled:opacity-50 transition-colors"
                        >
                          {deletingKey === utmContent ? 'Deleting...' : 'Confirm'}
                        </button>
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDelete(utmContent)}
                        className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
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
