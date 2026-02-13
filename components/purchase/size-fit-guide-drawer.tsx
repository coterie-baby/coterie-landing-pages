'use client';

import { useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SIZE_CONFIGS, SIZE_ORDER } from './context';

interface SizeFitGuideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SizeFitGuideDrawer({
  isOpen,
  onClose,
}: SizeFitGuideDrawerProps) {
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-out animate-slide-in-right"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <p id="drawer-title" className="text-sm font-normal">
            Size + Fit Guide
          </p>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close drawer"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="py-8 px-4 overflow-y-auto h-[calc(100%-65px)]">
          <Tabs defaultValue="size-chart">
            <TabsList className="bg-transparent gap-2 mb-6 text-xs">
              <TabsTrigger
                value="size-chart"
                className="h-[36px] rounded-full px-4 py-2 text-xs leading-[1.4] font-medium border border-[hsla(0,0%,8%,0.1)] data-[state=active]:bg-[#d1e3fb] data-[state=active]:text-[#0000C9] data-[state=active]:shadow-none data-[state=inactive]:bg-white data-[state=inactive]:text-gray-900"
              >
                Size Chart
              </TabsTrigger>
              <TabsTrigger
                value="fit-guide"
                className="h-[36px] rounded-full px-4 py-2 text-xs font-medium border border-[hsla(0,0%,8%,0.1)] data-[state=active]:bg-[#d1e3fb] data-[state=active]:text-[#0000C9] data-[state=active]:shadow-none data-[state=inactive]:bg-white data-[state=inactive]:text-gray-900"
              >
                Fit Guide
              </TabsTrigger>
            </TabsList>

            <TabsContent value="size-chart">
              <p className="text-lg font-normal mb-4">The Diaper Size Chart</p>

              {/* Size Chart Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-center text-sm text-[#515151]">
                      <th className="pb-3 pr-4 font-normal">Size</th>
                      <th className="pb-3 pr-4 font-normal">
                        Weight ranges
                        <br />
                        (lbs)
                      </th>
                      <th className="pb-3 pr-4 font-normal">
                        Diapers per
                        <br />
                        delivery
                      </th>
                      <th className="pb-3 font-normal">
                        Changes
                        <br />
                        per day
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {SIZE_ORDER.map((sizeKey) => {
                      const config = SIZE_CONFIGS[sizeKey];
                      return (
                        <tr
                          key={sizeKey}
                          className="border-t border-gray-100 text-sm text-center"
                        >
                          <td className="py-5 pr-4 text-left">
                            {config.label}
                          </td>
                          <td className="py-5 pr-4">
                            {formatWeightRange(config.weightRange)}
                          </td>
                          <td className="py-5 pr-4">{config.count}</td>
                          <td className="py-5">~{config.changesPerDay}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="fit-guide">
              <div className="space-y-4 text-sm">
                <p className="text-lg">The right diaper fit looks like...</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    The waistband should sit at your baby&apos;s belly button or
                    just below
                  </li>
                  <li>
                    You should be able to fit two fingers between the diaper and
                    your baby&apos;s skin
                  </li>
                  <li>Leg cuffs should be gently snug but not leaving marks</li>
                  <li>
                    If you notice red marks or frequent leaks, it may be time to
                    size up
                  </li>
                </ul>
                <p className="pt-2 text-lg">Signs it&apos;s time to size up</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Frequent leaks or blowouts</li>
                  <li>Red marks on baby&apos;s skin</li>
                  <li>Difficulty fastening the tabs</li>
                  <li>Baby seems uncomfortable</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

    </div>
  );
}

// Helper to format weight range to match the screenshot format
function formatWeightRange(range: string): string {
  // Convert "Under 6 lbs" -> "< 6", "8-12 lbs" -> "8 - 12", "27+ lbs" -> "27+"
  if (range.toLowerCase().includes('under')) {
    return '< 10';
  }
  return range.replace(' lbs', '').replace('-', ' - ');
}
