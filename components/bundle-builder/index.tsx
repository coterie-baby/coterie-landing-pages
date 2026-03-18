'use client';

import Image from 'next/image';
import { useState, useRef } from 'react';
import Link from 'next/link';
import {
  BundleSelectorProvider,
  useBundleSelector,
  WIPES_PRODUCTS,
  SKINCARE_ITEMS,
} from './bundle-selector';
import BundleSelector from './bundle-selector';
import BundleStickyBar from './bundle-sticky-bar';
import type { DiaperSize } from '@/components/purchase/context';
import { Button } from '@/components/ui/button';

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
    handleAddToCart,
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
          <p className="text-[#515151] mb-2">Your new diapering bundle awaits.</p>
          <p className="text-3xl text-[#0000c9] leading-tight">
            Designed for babies.
            <br />
            Built by you.
          </p>
        </div>

        <div className="relative h-[280px] rounded-lg overflow-hidden mb-6">
          <Image
            src="https://cdn.sanity.io/images/e4q6bkl9/production/ec5a384428110d9ddc4b1445fdfdb118d4beb658-6720x4480.png?w=800&q=80&auto=format"
            alt="Coterie diapers"
            fill
            className="object-cover"
            sizes="(max-width: 512px) 100vw, 512px"
          />
        </div>

        <div className="border border-gray-200 bg-white rounded-lg overflow-hidden">
          <button
            onClick={() => setShowItems((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-4"
          >
            <span className="text-[15px] font-medium">
              Your bundle{' '}
              <span className="font-normal text-sm text-[#515151]">({itemCount} items)</span>
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
              <span className="flex items-center gap-1.5 text-[#515151]">
                Starting price
                
              </span>
              <span className="text-gray-600">${originalTotalPrice.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-[#515151]">Bundle Savings</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">-${totalSavings.toFixed(2)}</span>
                {savingsPercent > 0 && (
                  <span className="bg-[#0000C9] text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
                    {savingsPercent}% OFF
                  </span>
                )}
              </div>
            </div>

            {totalPrice >= 110 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#515151]">Shipping</span>
                <span className="text-gray-500">Free</span>
              </div>
            )}

            <div className="border-t border-gray-100 text-[15px] pt-3 flex items-center justify-between">
              <span className="font-medium">Subtotal</span>
              <span className="font-medium">${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <Button
          onClick={handleAddToCart}
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

// ── V2: PDPHeroV2-style header ─────────────────────────────────

const STAR_PATH =
  'M6.5 0L8.02 4.68H13L8.99 7.57L10.51 12.25L6.5 9.36L2.49 12.25L4.01 7.57L0 4.68H4.98L6.5 0Z';

function StarIcon({ fillPercent = 0 }: { fillPercent?: number }) {
  const id = `bundle-star-${fillPercent}`;
  const isPartial = fillPercent > 0 && fillPercent < 100;
  return (
    <svg width="14" height="14" viewBox="0 0 13 13" aria-hidden="true">
      {isPartial && (
        <defs>
          <clipPath id={id}>
            <rect x="0" y="0" width={`${(fillPercent / 100) * 13}`} height="13" />
          </clipPath>
        </defs>
      )}
      <path d={STAR_PATH} fill="none" stroke="#D1D5DB" strokeWidth="1" />
      {fillPercent > 0 && (
        <path d={STAR_PATH} fill="#0000C9" clipPath={isPartial ? `url(#${id})` : undefined} />
      )}
    </svg>
  );
}

function BundleStarRating({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const fill = Math.min(100, Math.max(0, (rating - (star - 1)) * 100));
          return <StarIcon key={star} fillPercent={fill} />;
        })}
      </div>
      <Link className="text-xs text-gray-600 underline" href="#reviews">
        {rating}/5 ({(reviewCount ?? 0).toLocaleString()} reviews)
      </Link>
    </div>
  );
}

const SLIDE_GAP = 8;
const SLIDE_PEEK = 32;

function ImageCarouselV2({ images }: { images: { src: string; alt: string }[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={scrollRef}
      className="flex snap-x snap-mandatory overflow-x-auto min-h-[294px]"
      style={{ gap: `${SLIDE_GAP}px`, scrollbarWidth: 'none' }}
    >
      {images.map((image, index) => (
        <div
          key={index}
          className="relative aspect-square min-h-[294px] max-w-[320px] flex-shrink-0 snap-start"
          style={{ width: `calc(100% - ${SLIDE_PEEK}px)` }}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 90vw, 50vw"
            priority={index === 0}
          />
        </div>
      ))}
    </div>
  );
}

const BUNDLE_IMAGES = [
  {
    src: '/images/bundle-featured-image.jpg',
    alt: 'Coterie Build Your Bundle',
  },
  {
    src: 'https://cdn.sanity.io/images/e4q6bkl9/production/8e47d12b67b1a511fd8011809ef4a0b017a1679a-1920x2400.png',
    alt: 'The Wipe by Coterie',
  },
  {
    src: 'https://cdn.sanity.io/images/e4q6bkl9/production/3fc74efb5fcc16d6aad0a15782c67bcdb8ee2873-3390x3390.jpg',
    alt: 'Coterie skincare',
  },
];

interface BundleBuilderV2Props {
  title?: string;
  subtitle?: string;
  rating?: number;
  reviewCount?: number;
  cartImage?: string;
  images?: { src: string; alt: string }[];
}

function BundleBuilderV2Inner({
  title = 'Build Your Diapering Bundle',
  subtitle = 'Customize your perfect bundle and save 15%',
  rating = 4.9,
  reviewCount = 1284,
  images = BUNDLE_IMAGES,
}: BundleBuilderV2Props) {
  return (
    <>
      <div className="bg-white">
        {/* Rating + Title (PDPHeroV2 style) */}
        <div className="flex flex-col gap-2 px-4 py-4">
          <BundleStarRating rating={rating} reviewCount={reviewCount} />
          <div className="flex flex-col gap-0.5">
            <h4 className="text-[26px] font-medium text-black mt-1 leading-tight">
              {title}
            </h4>
            <p className="text-sm text-[#525252]">{subtitle}</p>
          </div>
        </div>

        {/* Image Carousel (PDPHeroV2 style) */}
        <ImageCarouselV2 images={images} />

        {/* Three-step selector */}
        <div className="max-w-lg mx-auto px-4 py-6">
          <BundleSelector />
        </div>
      </div>

      <BundleSummary />

      <BundleStickyBar />
    </>
  );
}

export function BundleBuilderV2(props: BundleBuilderV2Props) {
  return (
    <BundleSelectorProvider
      bundleTitle={props.title ?? 'Build Your Diapering Bundle'}
      cartImage={props.cartImage}
    >
      <BundleBuilderV2Inner {...props} />
    </BundleSelectorProvider>
  );
}
