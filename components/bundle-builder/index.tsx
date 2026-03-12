'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  BundleSelectorProvider,
  useBundleSelector,
  WIPES_PRODUCTS,
  SKINCARE_ITEMS,
} from './bundle-selector';
import BundleSelector from './bundle-selector';
import BundleStickyBar from './bundle-sticky-bar';
import type { DiaperSize } from '@/components/purchase/context';
import { SIZE_CONFIGS } from '@/components/purchase/context';

// ── Benefit Tile ───────────────────────────────────────────────

function BenefitTile({ icon, title, subtitle }: { icon: string; title: string; subtitle?: string }) {
  return (
    <div className="aspect-square bg-[#F5F5F5] flex flex-col items-center justify-center gap-4 px-4 rounded-xl">
      <div className="relative w-10 h-10">
        <Image src={icon} alt="" fill />
      </div>
      <div className="flex flex-col text-center">
        <span>{title}</span>
        {subtitle && <span className="text-xs">{subtitle}</span>}
      </div>
    </div>
  );
}

// ── Bundle Summary ─────────────────────────────────────────────

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-5 h-5 transition-transform ${open ? 'rotate-180' : ''}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

import { useState } from 'react';

function BundleSummary() {
  const {
    selectedSize,
    selectedWipes,
    selectedSkincareIndices,
    orderType,
    diaperPrice,
    wipesPrice,
    totalPrice,
    originalTotalPrice,
    totalSavings,
    isLoading,
    error,
    setShowBabyNameDrawer,
    getSizeLabel,
  } = useBundleSelector();

  const [showItems, setShowItems] = useState(false);

  const wipesConfig =
    selectedWipes && selectedWipes !== 'none'
      ? WIPES_PRODUCTS.find((w) => w.id === selectedWipes)
      : null;

  const itemCount =
    (selectedSize ? 1 : 0) + (wipesConfig ? 1 : 0) + selectedSkincareIndices.length;

  const savingsPercent =
    originalTotalPrice > 0 ? Math.round((totalSavings / originalTotalPrice) * 100) : 0;

  const getSizeLabelLocal = (size: DiaperSize) => getSizeLabel(size);

  return (
    <div className="bg-[#F9F4EC] py-10">
      <div className="max-w-lg mx-auto px-4">
        <div className="text-center mb-6">
          <p className="text-sm text-gray-400 mb-2">Your new Coterie bundle awaits.</p>
          <p className="text-3xl font-bold text-[#001A6E] leading-tight">
            Designed for babies.
            <br />
            Built by you.
          </p>
        </div>

        <div className="relative h-[280px] rounded-2xl overflow-hidden mb-6">
          <Image
            src="https://cdn.sanity.io/images/e4q6bkl9/production/ec5a384428110d9ddc4b1445fdfdb118d4beb658-6720x4480.png?w=800&q=80&auto=format"
            alt="Coterie diapers"
            fill
            className="object-cover"
            sizes="(max-width: 512px) 100vw, 512px"
          />
        </div>

        <div className="border border-gray-200 rounded-2xl overflow-hidden">
          <button
            onClick={() => setShowItems((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-4"
          >
            <span className="font-semibold text-gray-900">
              Your bundle{' '}
              <span className="font-normal text-gray-500">({itemCount} items)</span>
            </span>
            <span className="flex items-center gap-1 text-sm text-gray-600">
              Show your bundle items
              <ChevronIcon open={showItems} />
            </span>
          </button>

          {showItems && itemCount > 0 && (
            <div className="border-t border-gray-100 px-4 py-3 space-y-3">
              {selectedSize && (
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <Image
                      src="https://m.media-amazon.com/images/I/815Q-eQIQkL._AC_SX679_.jpg"
                      alt="The Diaper"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      The Diaper — {getSizeLabelLocal(selectedSize)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {SIZE_CONFIGS[selectedSize].count} diapers/delivery
                    </p>
                  </div>
                  <p className="text-sm font-semibold">${diaperPrice.toFixed(2)}</p>
                </div>
              )}

              {wipesConfig && (
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <Image
                      src={wipesConfig.image}
                      alt={wipesConfig.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{wipesConfig.name}</p>
                    <p className="text-xs text-gray-500">{wipesConfig.count} wipes</p>
                  </div>
                  <p className="text-sm font-semibold">${wipesPrice.toFixed(2)}</p>
                </div>
              )}

              {selectedSkincareIndices.map((idx) => {
                const item = SKINCARE_ITEMS[idx];
                if (!item) return null;
                const price = orderType === 'subscription' ? item.subPrice : item.otpPrice;
                return (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className={`w-12 h-12 flex-shrink-0 rounded-lg ${item.bgClass}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    </div>
                    <p className="text-sm font-semibold">${price.toFixed(2)}</p>
                  </div>
                );
              })}
            </div>
          )}

          <div className="border-t border-gray-200" />

          <div className="px-4 py-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 text-gray-600">
                Comp. Value
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                  />
                </svg>
              </span>
              <span className="text-gray-600">${originalTotalPrice.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-gray-900">Bundle Savings</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">-${totalSavings.toFixed(2)}</span>
                {savingsPercent > 0 && (
                  <span className="bg-[#1B5E50] text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
                    {savingsPercent}% OFF
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-gray-900">Shipping</span>
              <span className="text-gray-500">Free</span>
            </div>

            <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="font-semibold text-gray-900">${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <Button
          onClick={() => setShowBabyNameDrawer(true)}
          disabled={isLoading || !selectedSize}
          className="w-full mt-4 bg-[#0000C9] hover:bg-[#0000A0]"
        >
          {isLoading ? 'Processing...' : 'Add to cart'}
        </Button>
      </div>
    </div>
  );
}

// ── Inner page (uses context) ──────────────────────────────────

function BundleBuilderInner() {
  return (
    <>
      <div className="bg-white">
        {/* Banner */}
        <div
          className="relative w-full h-[325px] flex items-end bg-cover bg-center"
          style={{ backgroundImage: "url('/images/bundle-featured-image.jpg')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 via-[40%] to-transparent" />
          <h1 className="relative z-10 px-5 pb-6 text-white text-2xl">
            Build Your Diapering Bundle
          </h1>
        </div>

        <div className="flex flex-col gap-6 px-4 py-6">
          <div className="space-y-4">
            <p className="font-semibold">Customize your perfect bundle and save 15%</p>
            <p className="leading-7 text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </div>

        <div className="w-full px-4">
          <div className="border-t border-gray-200 mb-6" />
        </div>

        {/* Three-step selector */}
        <div className="max-w-lg mx-auto px-4 pt-5 pb-6">
          <BundleSelector />
        </div>
      </div>

      <BundleSummary />

      <div className="py-6 px-4">
        <div className="grid grid-cols-2 gap-6">
          <BenefitTile
            icon="/fragrance-free.svg"
            title="Free next size trial"
            subtitle="(included in first Auto-Renew box)"
          />
          <BenefitTile icon="/fragrance-free.svg" title="Manage deliveries via text" />
          <BenefitTile icon="/fragrance-free.svg" title="Size up assist" />
          <BenefitTile icon="/fragrance-free.svg" title="Auto-ships each month" />
        </div>
      </div>

      <BundleStickyBar />
    </>
  );
}

// ── Main Export ────────────────────────────────────────────────

export default function BundleBuilder() {
  return (
    <BundleSelectorProvider>
      <BundleBuilderInner />
    </BundleSelectorProvider>
  );
}
