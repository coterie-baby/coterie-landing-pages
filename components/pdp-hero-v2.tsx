'use client';

import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import Image from 'next/image';
import {
  ProductOrderProvider,
  useProductOrder,
  // SIZE_CONFIGS,
  PLAN_CONFIGS,
  SIZE_ORDER,
  type DiaperSize,
} from './purchase/context';
import { useSearchParams } from 'next/navigation';
import SizeSelectionContainer from './purchase/size-selection-container';
import AddToCartButton from './purchase/add-to-cart-button';
import { trackSelectPurchaseType } from '@/lib/gtm/ecommerce';
import ProductFeatures from './purchase/product-features';
import { ProductAccordion } from './purchase';
import Link from 'next/link';

// ─── Star Rating ──────────────────────────────────────────────

const STAR_PATH =
  'M6.5 0L8.02 4.68H13L8.99 7.57L10.51 12.25L6.5 9.36L2.49 12.25L4.01 7.57L0 4.68H4.98L6.5 0Z';

function StarIcon({ fillPercent = 0 }: { fillPercent?: number }) {
  const id = `star-clip-${fillPercent}`;
  const isPartial = fillPercent > 0 && fillPercent < 100;

  return (
    <svg width="14" height="14" viewBox="0 0 13 13" aria-hidden="true">
      {isPartial && (
        <defs>
          <clipPath id={id}>
            <rect
              x="0"
              y="0"
              width={`${(fillPercent / 100) * 13}`}
              height="13"
            />
          </clipPath>
        </defs>
      )}
      {/* Empty star background */}
      <path d={STAR_PATH} fill="none" stroke="#D1D5DB" strokeWidth="1" />
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
      <Link className="text-xs text-gray-600 underline" href="#reviews">
        {rating}/5 ({reviewCount.toLocaleString()} reviews)
      </Link>
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

  // Reset to first slide when images change (e.g. size selection swaps featured image)
  const firstSrc = images[0]?.src;
  useEffect(() => {
    setCurrentIndex(0);
    setIsAnimating(false);
  }, [firstSrc]);

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

// ─── Order Type Config ────────────────────────────────────────

export interface OrderTypeConfig {
  autoRenew?: {
    badgeText?: string;
    title?: string;
    benefits?: string[];
  };
  oneTimePurchase?: {
    title?: string;
    benefits?: string[];
  };
}

const defaultOrderTypeConfig: OrderTypeConfig = {
  autoRenew: {
    badgeText: 'Recommended for new customers',
    title: 'Auto-Renew + Next Size Trial',
    benefits: [
      "A month's supply of superior diapers",
      'First box includes next size trial',
      'Skip or cancel anytime',
    ],
  },
  oneTimePurchase: {
    title: 'One-time Purchase',
    benefits: ["A month's supply of superior diapers"],
  },
};

// ─── Order Type Selector (new design) ─────────────────────────

function OrderTypeSelector({ config }: { config: OrderTypeConfig }) {
  const { state, setOrderType } = useProductOrder();

  const diaperOnlyPlan = PLAN_CONFIGS.find((p) => p.id === 'diaper-only');
  const subscriptionPrice = diaperOnlyPlan?.subscriptionPrice ?? 95;
  const basePrice = diaperOnlyPlan?.basePrice ?? 105.5;

  const autoRenew = config.autoRenew ?? defaultOrderTypeConfig.autoRenew!;
  const otp = config.oneTimePurchase ?? defaultOrderTypeConfig.oneTimePurchase!;

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
        {autoRenew.badgeText && (
          <div className="bg-[#0000C9] text-white text-[10px] font-bold tracking-wider uppercase px-2 py-1.5">
            {autoRenew.badgeText}
          </div>
        )}
        <div className="p-2">
          <div className="flex items-start justify-between mb-2 text-[14.5px]">
            <span className="font-semibold">{autoRenew.title}</span>
            <div className="text-right flex-shrink-0 ml-3">
              <span className="text-[#0000C9]">
                ${subscriptionPrice.toFixed(2)}
              </span>
              <span className="ml-2 text-[#515151] line-through text-sm">
                ${basePrice.toFixed(2)}
              </span>
            </div>
          </div>
          {autoRenew.benefits && autoRenew.benefits.length > 0 && (
            <div className="space-y-1">
              {autoRenew.benefits.map((benefit, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-[#515151]">
                  <CheckIcon className="text-[#0000C9]" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          )}
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
          <span className="font-semibold">{otp.title}</span>
          <span className="text-[#515151] flex-shrink-0 ml-3">
            ${basePrice.toFixed(2)}
          </span>
        </div>
        {otp.benefits && otp.benefits.length > 0 && (
          <div className="space-y-1">
            {otp.benefits.map((benefit, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-[#515151]">
                <CheckIcon className="text-[#0000C9]" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        )}
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
  sizeImages?: Record<string, string>;
  orderTypeConfig: OrderTypeConfig;
}

function PDPHeroV2Content({
  rating,
  reviewCount,
  productTitle,
  images,
  sizeImages,
  orderTypeConfig,
}: PDPHeroV2ContentProps) {
  const { state } = useProductOrder();

  // Build carousel images: if the selected size has a featured image, use it as the first slide
  const carouselImages = useMemo(() => {
    if (!state.selectedSize || !sizeImages?.[state.selectedSize]) {
      return images;
    }
    const sizeImageUrl = sizeImages[state.selectedSize];
    const sizeSlide = { src: sizeImageUrl, alt: `${productTitle} Size ${state.selectedSize}` };
    return [sizeSlide, ...images.slice(1)];
  }, [state.selectedSize, sizeImages, images, productTitle]);

  return (
    <div className="bg-white">
      {/* Rating + Title */}
      <div className="flex flex-col gap-2 px-4 py-4">
        <HeroStarRating rating={rating} reviewCount={reviewCount} />
        <h4 className="text-[26px] font-medium text-black mt-1 leading-tight">
          {productTitle}
        </h4>
      </div>

      {/* Image Carousel */}
      <ImageCarousel images={carouselImages} />

      {/* Form Content */}
      <div className="px-4 pt-6 pb-6 space-y-6">
        {/* Size Selection */}
        <SizeSelectionContainer />

        {/* Order Type */}
        <OrderTypeSelector config={orderTypeConfig} />

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
  rating?: number;
  reviewCount?: number;
  productTitle?: string;
  images?: { src: string; alt: string }[];
  sizeImages?: Record<string, string>;
  orderTypeConfig?: OrderTypeConfig;
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

function parseSizeParam(raw: string | null): DiaperSize | undefined {
  if (!raw) return undefined;
  // URL-decode turns "+" into " ", so normalize "n 1" back to "n+1"
  const normalized = raw.replace(/\s/g, '+').toLowerCase();
  if ((SIZE_ORDER as string[]).includes(normalized)) {
    return normalized as DiaperSize;
  }
  return undefined;
}

export default function PDPHeroV2({
  rating = 0,
  reviewCount = 0,
  productTitle = 'The Diaper',
  images = defaultImages,
  sizeImages,
  orderTypeConfig = defaultOrderTypeConfig,
}: PDPHeroV2Props) {
  const searchParams = useSearchParams();
  const sizeFromUrl = parseSizeParam(searchParams.get('size'));

  return (
    <ProductOrderProvider initialSize={sizeFromUrl ?? '1'}>
      <PDPHeroV2Content
        rating={rating}
        reviewCount={reviewCount}
        productTitle={productTitle}
        images={images}
        sizeImages={sizeImages}
        orderTypeConfig={orderTypeConfig}
      />
    </ProductOrderProvider>
  );
}
