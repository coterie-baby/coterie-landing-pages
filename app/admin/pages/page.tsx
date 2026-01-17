'use client';

import {
  ArrowTopRightOnSquareIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';

interface LandingPage {
  name: string;
  path: string;
  description: string;
  type: 'quiz' | 'landing' | 'dynamic';
  status: 'live' | 'draft';
}

// Landing pages defined in the codebase
const allPages: LandingPage[] = [
  {
    name: 'Sizing Quiz',
    path: '/sizing-quiz',
    description: 'Interactive quiz to help parents find the right diaper size',
    type: 'quiz',
    status: 'live',
  },
  {
    name: 'Main Landing',
    path: '/landing',
    description: 'Primary paid media landing page',
    type: 'landing',
    status: 'live',
  },
  {
    name: '5 Reasons Why',
    path: '/5-reasons-why',
    description: 'Educational content highlighting product benefits',
    type: 'landing',
    status: 'live',
  },
  {
    name: 'Influencer',
    path: '/influencer',
    description: 'Landing page for influencer partnership traffic',
    type: 'landing',
    status: 'live',
  },
  {
    name: 'UGC',
    path: '/ugc',
    description: 'User-generated content and social proof showcase',
    type: 'landing',
    status: 'live',
  },
  {
    name: 'Subscription Perks',
    path: '/subscription-perks',
    description: 'Highlights subscription benefits and savings',
    type: 'landing',
    status: 'live',
  },
  {
    name: 'Q&A',
    path: '/qa',
    description: 'Frequently asked questions page',
    type: 'landing',
    status: 'live',
  },
  {
    name: 'Dynamic Pages',
    path: '/[...page]',
    description: 'CMS-driven pages from Sanity',
    type: 'dynamic',
    status: 'live',
  },
];

const typeColors = {
  quiz: 'bg-purple-50 text-purple-700 border-purple-200',
  landing: 'bg-green-50 text-green-700 border-green-200',
  dynamic: 'bg-blue-50 text-blue-700 border-blue-200',
};

const statusColors = {
  live: 'bg-green-500',
  draft: 'bg-yellow-500',
};

export default function PagesPage() {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredPages = allPages.filter((page) => {
    const matchesSearch =
      page.name.toLowerCase().includes(search.toLowerCase()) ||
      page.path.toLowerCase().includes(search.toLowerCase()) ||
      page.description.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'all' || page.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-5xl space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Pages</h1>
        <p className="text-gray-500 mt-1">
          All landing pages in your application
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search pages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'landing', 'quiz', 'dynamic'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors capitalize ${
                filterType === type
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Pages Table */}
      <div className="bg-white rounded-xl border border-gray-200/60 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50/80 border-b border-gray-200/60">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Page
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Path
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredPages.map((page) => (
              <tr
                key={page.path}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-5 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {page.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {page.description}
                    </p>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <code className="text-sm bg-gray-100/80 px-2 py-1 rounded-md text-gray-700 font-mono">
                    {page.path}
                  </code>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border capitalize ${typeColors[page.type]}`}
                  >
                    {page.type}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${statusColors[page.status]}`}
                    />
                    <span className="text-sm text-gray-600 capitalize">
                      {page.status}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4 text-right">
                  {page.type !== 'dynamic' && (
                    <a
                      href={page.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      View
                      <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredPages.length === 0 && (
          <div className="px-5 py-12 text-center">
            <p className="text-gray-500">No pages match your search.</p>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>
          Showing {filteredPages.length} of {allPages.length} pages
        </span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            {allPages.filter((p) => p.status === 'live').length} live
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-yellow-500" />
            {allPages.filter((p) => p.status === 'draft').length} draft
          </span>
        </div>
      </div>
    </div>
  );
}
