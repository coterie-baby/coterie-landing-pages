'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  useBundleSelector,
  WIPES_PRODUCTS,
  SKINCARE_ITEMS,
} from './bundle-selector';
import { Button } from '@/components/ui/button';
import { SIZE_CONFIGS } from '@/components/purchase/context';
import { getDiaperImageUrl } from '@/lib/config/products';

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export default function BundleStickyBar() {
  const [showItems, setShowItems] = useState(false);

  const {
    selectedSize,
    selectedWipes,
    selectedSkincareIndices,
    orderType,
    diaperPrice,
    wipesPrice,
    totalPrice,
    originalTotalPrice,
    isLoading,
    error,
    getSizeLabel,
    handleAddToCart,
  } = useBundleSelector();

  const wipesConfig =
    selectedWipes && selectedWipes !== 'none'
      ? WIPES_PRODUCTS.find((w) => w.id === selectedWipes)
      : null;

  const hasItems =
    !!selectedSize || !!wipesConfig || selectedSkincareIndices.length > 0;

  let diaperImageUrl: string | null = null;
  try {
    diaperImageUrl = getDiaperImageUrl();
  } catch {
    diaperImageUrl = null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
      {/* Bundle items panel */}
      {showItems && hasItems && (
        <div className="max-w-lg mx-auto px-4 pt-4 pb-2 space-y-3 border-b border-gray-100 shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
          {selectedSize && (
            <div className="flex items-center gap-3">
              {diaperImageUrl && (
                <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={diaperImageUrl}
                    alt="The Diaper"
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  The Diaper — {getSizeLabel(selectedSize)}
                </p>
                <p className="text-xs text-gray-500">
                  {SIZE_CONFIGS[selectedSize].count} diapers/delivery
                </p>
              </div>
              <p className="text-sm font-semibold text-gray-900">
                ${diaperPrice.toFixed(2)}
              </p>
            </div>
          )}

          {wipesConfig && (
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={wipesConfig.image}
                  alt={wipesConfig.name}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {wipesConfig.name}
                </p>
                <p className="text-xs text-gray-500">
                  {wipesConfig.count} wipes
                </p>
              </div>
              <p className="text-sm font-semibold text-gray-900">
                ${wipesPrice.toFixed(2)}
              </p>
            </div>
          )}

          {selectedSkincareIndices.map((idx) => {
            const item = SKINCARE_ITEMS[idx];
            if (!item) return null;
            const price =
              orderType === 'subscription' ? item.subPrice : item.otpPrice;
            return (
              <div key={item.id} className="flex items-center gap-3">
                {item.image ? (
                  <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                ) : (
                  <div
                    className={`w-12 h-12 flex-shrink-0 rounded-lg ${item.bgClass}`}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {item.name}
                  </p>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  ${price.toFixed(2)}
                </p>
              </div>
            );
          })}
        </div>
      )}

      <div className="max-w-lg mx-auto px-4 pt-2 pb-3 space-y-2">
        {selectedSize && (
          <div className="flex items-baseline justify-end gap-1.5 text-sm">
            <span className="font-bold text-[#0000C9]">
              ${totalPrice.toFixed(2)}
            </span>
            {originalTotalPrice > totalPrice && (
              <span className="text-gray-400 line-through">
                ${originalTotalPrice.toFixed(2)}
              </span>
            )}
          </div>
        )}
        {error && <p className="text-xs text-red-500">{error}</p>}
        <div className="flex items-stretch gap-2">
          <Button
            onClick={handleAddToCart}
            disabled={isLoading}
            className="flex-1"
          >
            {selectedSize
              ? isLoading
                ? 'Adding...'
                : 'Add to cart'
              : 'Build my Bundle'}
          </Button>
          {hasItems && (
            <button
              onClick={() => setShowItems((v) => !v)}
              className="flex flex-col items-center justify-center gap-0.5 px-3 border border-[#0000C9] rounded-lg text-[#0000C9] text-[11px] font-medium leading-tight min-w-[72px]"
            >
              <span>
                View your
                <br />
                bundle items
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
