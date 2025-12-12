'use client';

import { useState } from 'react';
import {
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';

interface Issue {
  id: string;
  issue: string;
  parentThought: string;
  actualCause: string;
  howCoterieHelps: string;
  icon?: string;
}

interface DiaperIssueBreakdownProps {
  issues?: Issue[];
}

const defaultIssues: Issue[] = [
  {
    id: '1',
    issue: 'Restless Nights',
    parentThought: 'Is my baby going through a sleep regression?',
    actualCause:
      'Wet, uncomfortable diapers wake babies throughout the night. Poor absorbency means moisture stays against the skin, causing irritation and disrupting sleep.',
    howCoterieHelps:
      'Fast-wicking technology pulls moisture away from skin instantly, keeping your baby dry and comfortable all night long.',
  },
  {
    id: '2',
    issue: 'Persistent Diaper Rash',
    parentThought: 'Am I not changing diapers often enough?',
    actualCause:
      'Many diapers contain harsh chemicals (fragrances, chlorine, lotions) that irritate sensitive skin. Even with frequent changes, these ingredients can cause persistent rashes.',
    howCoterieHelps:
      'Clean ingredients only—no fragrance, lotion, latex, dyes, chlorine, or parabens. Hypoallergenic and dermatologist tested for sensitive skin.',
  },
  {
    id: '3',
    issue: 'Constant Leaks',
    parentThought: 'Do I need to size up? Is the fit wrong?',
    actualCause:
      'Inferior absorbency and poor fit design cause leaks regardless of size. Many diapers simply can’t handle overnight or extended wear.',
    howCoterieHelps:
      'Superior absorbency with 360° stretch ensures perfect fit and leak protection, even during long stretches between changes.',
  },
  {
    id: '4',
    issue: 'Fussiness During Changes',
    parentThought: 'Is my baby just sensitive to being changed?',
    actualCause:
      'Rough materials, poor fit causing chafing, or chemical irritation can make diaper changes uncomfortable for babies.',
    howCoterieHelps:
      'Soft, breathable materials with a perfect fit reduce irritation and make changes more comfortable for your baby.',
  },
];

export default function DiaperIssueBreakdown({
  issues = defaultIssues,
}: DiaperIssueBreakdownProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#0000C9] mb-4">
            Common Issues, Uncommon Causes
          </h2>
          <p className="text-lg text-[#525252] max-w-2xl mx-auto">
            What you might be thinking vs. what&apos;s actually happening—and
            how the right diaper makes all the difference
          </p>
        </div>

        <div className="space-y-4">
          {issues.map((item) => {
            const isExpanded = expandedId === item.id;

            return (
              <div
                key={item.id}
                className="border border-gray-200 rounded-lg overflow-hidden transition-all hover:shadow-md"
              >
                <button
                  onClick={() =>
                    setExpandedId(isExpanded ? null : item.id)
                  }
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-[#0000C9] mb-2">
                      {item.issue}
                    </h3>
                    <p className="text-sm text-[#525252] italic">
                      &quot;{item.parentThought}&quot;
                    </p>
                  </div>
                  {isExpanded ? (
                    <ChevronUpIcon className="w-6 h-6 text-[#0000C9] flex-shrink-0 ml-4" />
                  ) : (
                    <ChevronDownIcon className="w-6 h-6 text-gray-400 flex-shrink-0 ml-4" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-6 pb-6 space-y-4 border-t border-gray-200 pt-4">
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                      <p className="text-xs font-semibold text-red-700 uppercase mb-2">
                        Actual Cause
                      </p>
                      <p className="text-sm text-red-900">{item.actualCause}</p>
                    </div>
                    <div className="bg-[#D1E3FB] border-l-4 border-[#0000C9] p-4 rounded">
                      <p className="text-xs font-semibold text-[#0000C9] uppercase mb-2">
                        How Coterie Helps
                      </p>
                      <p className="text-sm text-[#0000C9]">
                        {item.howCoterieHelps}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

