'use client';

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import WhyWeAskIcon from './why-we-ask-icon';

interface WhyWeAskProps {
  helpText: string;
  helpAnswer: string;
}

export default function WhyWeAsk({ helpText, helpAnswer }: WhyWeAskProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative">
      {/* Collapsed state - icon and text are both clickable */}
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={() => setIsExpanded(true)}
          className={`flex flex-col items-center gap-2 group transition-opacity duration-300 ${
            isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          aria-expanded={isExpanded}
        >
          <WhyWeAskIcon className="text-[#0000C9] transition-transform duration-300 group-hover:scale-110" />
          <span className="text-[14px] text-[#0000C9]">{helpText}</span>
        </button>
      </div>

      {/* Expanded state - absolute positioned to overlay without affecting layout */}
      <div
        className={`absolute bottom-0 left-0 right-0 transition-all duration-500 ease-out origin-bottom ${
          isExpanded
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-2 pointer-events-none'
        }`}
      >
        {/* Icon overlapping the card */}
        <div
          className={`absolute -top-5 left-4 z-10 transition-all duration-500 delay-100 ${
            isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          <WhyWeAskIcon className="text-[#0000C9]" />
        </div>

        {/* Card */}
        <div
          className={`border border-[#0000C9] rounded-2xl p-4 pt-8 relative bg-white transition-all duration-500 ${
            isExpanded ? 'shadow-lg shadow-[#0000C9]/10' : ''
          }`}
        >
          {/* Close button */}
          <button
            onClick={() => setIsExpanded(false)}
            className="absolute top-3 right-3 p-1 transition-transform duration-200 hover:scale-110"
            aria-label="Close"
          >
            <XMarkIcon className="w-5 h-5 text-[#141414]" />
          </button>

          {/* Content */}
          <div
            className={`pr-6 transition-all duration-500 delay-150 ${
              isExpanded
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-2'
            }`}
          >
            <span className="text-sm text-[#0000C9]">{helpText}</span>
            <p className="text-sm text-[#141414] mt-2 leading-[150%]">
              {helpAnswer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
