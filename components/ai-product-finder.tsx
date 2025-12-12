'use client';
import { useState } from 'react';
import Link from 'next/link';

interface ProductFinderProps {
  onRecommendation?: (size: string) => void;
}

export default function AIProductFinder({
  onRecommendation,
}: ProductFinderProps) {
  const [babyAge, setBabyAge] = useState<string>('');
  const [currentSize, setCurrentSize] = useState<string>('');
  const [concerns, setConcerns] = useState<string[]>([]);
  const [recommendation, setRecommendation] = useState<{
    size: string;
    reason: string;
  } | null>(null);

  const concernOptions = [
    'Sensitive Skin',
    'Night Leaks',
    'Rash Prevention',
    'Eco-Friendly',
  ];

  const handleFind = () => {
    // AI logic to recommend product
    let recommendedSize = 'Size 2';
    let reason =
      'Based on your inputs, we recommend Size 2 for optimal fit and comfort.';

    if (currentSize) {
      recommendedSize = currentSize;
      reason = `Since your baby is currently wearing ${currentSize}, we recommend continuing with this size for consistency.`;
    } else if (babyAge) {
      if (babyAge === 'newborn') {
        recommendedSize = 'Size N';
        reason =
          'For newborns, Size N provides the perfect fit for babies under 10 lbs.';
      } else if (babyAge === 'infant') {
        recommendedSize = 'Size 1';
        reason =
          'For infants 3-6 months, Size 1 offers the ideal balance of fit and absorbency.';
      } else {
        recommendedSize = 'Size 2';
        reason =
          'For older babies, Size 2 provides excellent coverage and absorbency.';
      }
    }

    if (concerns.includes('Sensitive Skin')) {
      reason += ' Our clean ingredients make them perfect for sensitive skin.';
    }
    if (concerns.includes('Night Leaks')) {
      reason += ' Our fast-wicking technology prevents leaks all night long.';
    }

    setRecommendation({ size: recommendedSize, reason });
    onRecommendation?.(recommendedSize);
  };

  const toggleConcern = (concern: string) => {
    setConcerns((prev) =>
      prev.includes(concern)
        ? prev.filter((c) => c !== concern)
        : [...prev, concern]
    );
  };

  return (
    <div className="p-4">
      <div className="bg-[#F7F7F7] rounded-lg p-6 ">
        <div className="flex items-center gap-3 mb-6">
          <div>
            <p className="text-xl text-[#0000C9]">AI Product Finder</p>
            <p className="text-sm text-[#525252]">
              Tell me about your baby, I&apos;ll find the perfect fit
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Baby Age */}
          <div>
            <label className="text-sm font-medium text-[#525252] mb-2 block">
              Baby&apos;s Age
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'newborn', label: '0-3 mo' },
                { value: 'infant', label: '3-6 mo' },
                { value: 'older', label: '6+ mo' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setBabyAge(option.value)}
                  className={`p-3 rounded-lg border-1 text-sm transition-all ${
                    babyAge === option.value
                      ? 'border-[#0000C9] bg-[#D1E3FB] text-[#0000C9] font-medium'
                      : 'border-gray-200 bg-white text-[#525252] hover:border-gray-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Current Size */}
          <div>
            <label className="text-sm font-medium text-[#525252] mb-2 block">
              Current Diaper Size (if known)
            </label>
            <div className="grid grid-cols-5 gap-2">
              {['N', '1', '2', '3', '4', '5', '6', '7'].map((size) => (
                <button
                  key={size}
                  onClick={() => setCurrentSize(size)}
                  className={`p-3 rounded-lg border-1 text-sm transition-all ${
                    currentSize === size
                      ? 'border-[#0000C9] bg-[#0000C9] text-white font-medium'
                      : 'border-gray-200 bg-white text-[#525252] hover:border-gray-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Concerns */}
          <div>
            <label className="text-sm font-medium text-[#525252] mb-2 block">
              Any Concerns?
            </label>
            <div className="flex flex-wrap gap-2">
              {concernOptions.map((concern) => (
                <button
                  key={concern}
                  onClick={() => toggleConcern(concern)}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                    concerns.includes(concern)
                      ? 'bg-[#0000C9] text-white'
                      : 'bg-gray-100 text-[#525252] hover:bg-gray-200'
                  }`}
                >
                  {concern}
                </button>
              ))}
            </div>
          </div>

          {/* Find Button */}
          <button
            onClick={handleFind}
            className="w-full bg-[#0000C9] text-white py-3 rounded-full font-semibold text-sm hover:bg-[#0000AA] transition-colors"
          >
            Find My Perfect Fit
          </button>

          {/* Recommendation */}
          {recommendation && (
            <div className="bg-[#D1E3FB] rounded-lg p-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#0000C9] flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">AI</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#0000C9] mb-1">
                    I recommend: {recommendation.size}
                  </p>
                  <p className="text-sm text-[#0000C9] leading-relaxed">
                    {recommendation.reason}
                  </p>
                  <Link
                    href="#shop"
                    className="inline-block mt-3 text-sm font-semibold text-[#0000C9] hover:underline"
                  >
                    Shop {recommendation.size} →
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
