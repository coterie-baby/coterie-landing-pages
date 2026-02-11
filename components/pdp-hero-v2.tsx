'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import {
  ProductOrderProvider,
  useProductOrder,
  SIZE_CONFIGS,
  PLAN_CONFIGS,
} from './purchase/context';
import SizeSelectionContainer from './purchase/size-selection-container';
import AddToCartButton from './purchase/add-to-cart-button';
import { trackSelectPurchaseType } from '@/lib/gtm/ecommerce';
import ProductFeatures from './purchase/product-features';
import ProductAccordion from './purchase/product-accordion';

// ─── Star Rating ──────────────────────────────────────────────

const STAR_PATH =
  'M6.5 0L8.02 4.68H13L8.99 7.57L10.51 12.25L6.5 9.36L2.49 12.25L4.01 7.57L0 4.68H4.98L6.5 0Z';

function StarIcon({ fillPercent = 0 }: { fillPercent?: number }) {
  const id = `star-clip-${fillPercent}`;
  const isPartial = fillPercent > 0 && fillPercent < 100;

  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 13 13"
      aria-hidden="true"
    >
      {isPartial && (
        <defs>
          <clipPath id={id}>
            <rect x="0" y="0" width={`${(fillPercent / 100) * 13}`} height="13" />
          </clipPath>
        </defs>
      )}
      {/* Empty star background */}
      <path
        d={STAR_PATH}
        fill="none"
        stroke="#D1D5DB"
        strokeWidth="1"
      />
      {/* Filled portion */}
      {fillPercent > 0 && (
        <path
          d={STAR_PATH}
          fill="#0000C9"
          clipPath={isPartial ? `url(#${id})` : undefined}
        />
      )}
    </svg>
  );
}

function HeroStarRating({
  rating,
  reviewCount,
}: {
  rating: number;
  reviewCount: number;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const fill = Math.min(100, Math.max(0, (rating - (star - 1)) * 100));
          return <StarIcon key={star} fillPercent={fill} />;
        })}
      </div>
      <span className="text-xs text-gray-600">
        {rating}/5 ({reviewCount.toLocaleString()} reviews)
      </span>
    </div>
  );
}

// ─── Check Icon ───────────────────────────────────────────────

function CheckIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`w-4 h-4 flex-shrink-0 ${className}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

// ─── Image Carousel ───────────────────────────────────────────

const SLIDE_GAP = 8; // px gap between slides

function ImageCarousel({ images }: { images: { src: string; alt: string }[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);
  const isSwiping = useRef(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const slideCount = images.length;

  const goTo = useCallback(
    (index: number) => {
      if (isAnimating || index < 0 || index >= slideCount) return;
      setIsAnimating(true);
      setCurrentIndex(index);
    },
    [isAnimating, slideCount]
  );

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
    isSwiping.current = true;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isSwiping.current) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!isSwiping.current) return;
    isSwiping.current = false;
    const threshold = 50;
    if (touchDeltaX.current < -threshold && currentIndex < slideCount - 1) {
      goTo(currentIndex + 1);
    } else if (touchDeltaX.current > threshold && currentIndex > 0) {
      goTo(currentIndex - 1);
    }
  }, [currentIndex, slideCount, goTo]);

  return (
    <div className="relative w-full overflow-hidden">
      {/* Slide track – each slide is calc(100% - peek - gap) wide */}
      <div
        ref={trackRef}
        className="flex min-h-[294px]"
        style={{
          gap: `${SLIDE_GAP}px`,
          transform: `translateX(calc(-${currentIndex} * (100% - 32px + ${SLIDE_GAP}px)))`,
          transition: isAnimating ? 'transform 300ms ease-out' : 'none',
        }}
        onTransitionEnd={() => setIsAnimating(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="relative aspect-square min-h-[294px] max-w-[320px] flex-shrink-0"
            style={{ width: 'calc(100% - 32px)' }}
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
    </div>
  );
}

// ─── Order Type Selector (new design) ─────────────────────────

function OrderTypeSelector() {
  const { state, setOrderType } = useProductOrder();

  const diaperOnlyPlan = PLAN_CONFIGS.find((p) => p.id === 'diaper-only');
  const subscriptionPrice = diaperOnlyPlan?.subscriptionPrice ?? 95;
  const basePrice = diaperOnlyPlan?.basePrice ?? 105.5;

  return (
    <div className="space-y-3">
      <p className="text-sm">Pick your order type:</p>

      {/* Auto-Renew Card */}
      <button
        onClick={() => {
          setOrderType('subscription');
          trackSelectPurchaseType({
            location: 'PDP Hero V2',
            isSubscription: true,
          });
        }}
        className={`w-full text-left rounded-lg border overflow-hidden transition-all ${
          state.orderType === 'subscription'
            ? 'border-[#0000C9] bg-white'
            : 'border-gray-200 bg-white hover:border-gray-300'
        }`}
      >
        {/* Recommended badge */}
        <div className="bg-[#0000C9] text-white text-[10px] font-bold tracking-wider uppercase px-2 py-1.5">
          Recommended for new customers
        </div>
        <div className="p-2">
          <div className="flex items-start justify-between mb-2 text-[14.5px]">
            <span className="font-semibold">Auto-Renew + Next Size Trial</span>
            <div className="text-right flex-shrink-0 ml-3">
              <span className="text-[#0000C9]">
                ${subscriptionPrice.toFixed(2)}
              </span>
              <span className="ml-2 text-[#515151] line-through text-sm">
                ${basePrice.toFixed(2)}
              </span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-[#515151]">
              <CheckIcon className="text-[#0000C9]" />
              <span>A month&apos;s supply of superior diapers</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#515151]">
              <CheckIcon className="text-[#0000C9]" />
              <span>First box includes next size trial</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#515151]">
              <CheckIcon className="text-[#0000C9]" />
              <span>Skip or cancel anytime</span>
            </div>
          </div>
        </div>
      </button>

      {/* One-time Purchase Card */}
      <button
        onClick={() => {
          setOrderType('one-time');
          trackSelectPurchaseType({
            location: 'PDP Hero V2',
            isSubscription: false,
          });
        }}
        className={`w-full text-left p-2 rounded-lg border transition-all ${
          state.orderType === 'one-time'
            ? 'border-[#0000C9] bg-white'
            : 'border-gray-200 bg-white hover:border-gray-300'
        }`}
      >
        <div className="flex items-start justify-between mb-2 text-[14.5px]">
          <span className="font-semibold">One-time Purchase</span>
          <span className="text-[#515151] flex-shrink-0 ml-3">
            ${basePrice.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#515151]">
          <CheckIcon className="text-[#0000C9]" />
          <span>A month&apos;s supply of superior diapers</span>
        </div>
      </button>
    </div>
  );
}

// ─── Inner Content (uses context) ────────────────────────────

interface PDPHeroV2ContentProps {
  rating: number;
  reviewCount: number;
  productTitle: string;
  images: { src: string; alt: string }[];
}

function PDPHeroV2Content({
  rating,
  reviewCount,
  productTitle,
  images,
}: PDPHeroV2ContentProps) {
  const { state } = useProductOrder();

  // Dynamic title with selected size
  const sizeLabel = state.selectedSize
    ? state.selectedSize === 'n'
      ? 'N'
      : state.selectedSize === 'n+1'
        ? 'N+1'
        : SIZE_CONFIGS[state.selectedSize].label
    : null;
  const titleDisplay = sizeLabel
    ? `${productTitle} (Size ${sizeLabel})`
    : productTitle;

  return (
    <div className="bg-white">
      {/* Rating + Title */}
      <div className="flex flex-col gap-2 px-4 py-4">
        <HeroStarRating rating={rating} reviewCount={reviewCount} />
        <h4 className="text-[26px] font-medium text-black mt-1 leading-tight">
          {titleDisplay}
        </h4>
      </div>

      {/* Image Carousel */}
      <ImageCarousel images={images} />

      {/* Form Content */}
      <div className="px-4 pt-6 pb-6 space-y-6">
        {/* Size Selection */}
        <SizeSelectionContainer />

        {/* Order Type */}
        <OrderTypeSelector />

        {/* Add to Cart */}
        <AddToCartButton />
      </div>
      <div className="px-4 py-2 space-y-6">
        <ProductFeatures />
        <ProductAccordion />
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────

interface PDPHeroV2Props {
  rating: number;
  reviewCount: number;
  productTitle?: string;
  images?: { src: string; alt: string }[];
}

const defaultImages = [
  {
    src: '/images/diaper_s1.png',
    alt: 'Coterie Diaper product shot',
  },
  {
    src: 'https://cdn.sanity.io/images/e4q6bkl9/production/cbe673400b84c6c6f99d5d895cb966ed6d4c55ec-4500x6000.jpg?rect=0,722,4500,4500&w=1200&h=1200&q=100&fit=crop&auto=format',
    alt: 'Baby wearing Coterie diaper',
  },
];

export default function PDPHeroV2({
  rating,
  reviewCount,
  productTitle = 'The Diaper',
  images = defaultImages,
}: PDPHeroV2Props) {
  return (
    <ProductOrderProvider initialSize="1">
      <PDPHeroV2Content
        rating={rating}
        reviewCount={reviewCount}
        productTitle={productTitle}
        images={images}
      />
    </ProductOrderProvider>
  );
}
