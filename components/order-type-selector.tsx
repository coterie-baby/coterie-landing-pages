'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ProductOrderProvider } from './purchase/context';
import SizeSelectionContainer from './purchase/size-selection-container';
import PlanSelector from './purchase/plan-selector';
import AddToCartButton from './purchase/add-to-cart-button';
import ProductFeatures from './purchase/product-features';
import ProductAccordion from './purchase/product-accordion';

interface Thumbnail {
  src: string;
  alt: string;
}

interface ProductOrderFormProps {
  productImage?: string;
  productTitle?: string;
  productDescription?: string;
  showPlanSelector?: boolean;
  thumbnails?: Thumbnail[];
}

/**
 * ProductOrderForm - Main form wrapper for product ordering
 *
 * Wraps all order selection components with the ProductOrderProvider context.
 * Supports both simple (size + order type) and bundle (size + plan) configurations.
 */
const defaultThumbnails: Thumbnail[] = [
  {
    src: 'https://m.media-amazon.com/images/I/815Q-eQIQkL._AC_SX679_.jpg',
    alt: 'Diaper front view',
  },
  {
    src: 'https://cdn.sanity.io/images/e4q6bkl9/production/1458639b9c78a72b373a98d4213c139d3a0c6fd5-1000x1000.png?w=1200&h=1200&q=100&fit=crop&auto=format',
    alt: 'Diaper back view',
  },
  {
    src: 'https://cdn.sanity.io/images/e4q6bkl9/production/cbe673400b84c6c6f99d5d895cb966ed6d4c55ec-4500x6000.jpg?rect=0,722,4500,4500&w=1200&h=1200&q=100&fit=crop&auto=format',
    alt: 'Diaper side view',
  },
  {
    src: 'https://cdn.sanity.io/images/e4q6bkl9/production/efd7fded0b766b196c98f754708a81eadd664810-4500x6000.jpg?rect=0,165,4500,4500&w=1200&h=1200&q=100&fit=crop&auto=format',
    alt: 'Diaper detail',
  },
  {
    src: 'https://cdn.sanity.io/images/e4q6bkl9/production/328d487a67fbe313e45cb6a0cbbc54c162aadfdb-6720x4480.png?rect=1120,0,4480,4480&w=1200&h=1200&q=100&fit=crop&auto=format',
    alt: 'Diaper packaging',
  },
  {
    src: 'https://cdn.sanity.io/images/e4q6bkl9/production/fafaef923e0bc3fe3a063b06998eba6e567acab9-2048x2048.jpg?w=1200&h=1200&q=100&fit=crop&auto=format',
    alt: 'Diaper in use',
  },
];

export default function ProductOrderForm({
  productImage = 'https://m.media-amazon.com/images/I/815Q-eQIQkL._AC_SX679_.jpg',
  productTitle = 'The Diaper',
  productDescription = 'A fast wicking, highly absorbent diaper with clean ingredients',
  showPlanSelector = false,
  thumbnails = defaultThumbnails,
}: ProductOrderFormProps) {
  const slides =
    thumbnails.length > 0
      ? thumbnails
      : [{ src: productImage, alt: productTitle }];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [animDirection, setAnimDirection] = useState<'none' | 'next' | 'prev'>(
    'none'
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasAdvanced, setHasAdvanced] = useState(false);
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);
  const isSwiping = useRef(false);

  const wrapIndex = useCallback(
    (i: number) => ((i % slides.length) + slides.length) % slides.length,
    [slides.length]
  );

  const goNext = useCallback(() => {
    if (isAnimating) return;
    setHasAdvanced(true);
    setAnimDirection('next');
    setIsAnimating(true);
  }, [isAnimating]);

  const goPrev = useCallback(() => {
    if (isAnimating) return;
    setAnimDirection('prev');
    setIsAnimating(true);
  }, [isAnimating]);

  const handleTransitionEnd = useCallback(() => {
    setCurrentIndex((prev) => {
      if (animDirection === 'next') return wrapIndex(prev + 1);
      if (animDirection === 'prev') return wrapIndex(prev - 1);
      return prev;
    });
    setAnimDirection('none');
    setIsAnimating(false);
  }, [animDirection, wrapIndex]);

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
    if (touchDeltaX.current < -threshold) {
      goNext();
    } else if (touchDeltaX.current > threshold) {
      goPrev();
    }
  }, [goNext, goPrev]);

  const prevIndex = wrapIndex(currentIndex - 1);
  const nextIndex = wrapIndex(currentIndex + 1);
  const animShift =
    animDirection === 'next' ? -100 : animDirection === 'prev' ? 100 : 0;

  const visibleSlides = [
    { slideIndex: prevIndex, basePos: -100, key: `prev-${prevIndex}` },
    { slideIndex: currentIndex, basePos: 0, key: `curr-${currentIndex}` },
    { slideIndex: nextIndex, basePos: 100, key: `next-${nextIndex}` },
  ];

  return (
    <ProductOrderProvider>
      <div id="purchase">
        {/* Image Slider */}
        <div
          className="relative w-full aspect-square overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {visibleSlides.map(({ slideIndex, basePos, key }) => (
            <div
              key={key}
              className="absolute inset-0"
              style={{
                transform: `translateX(${basePos + animShift}%)`,
                transition: isAnimating ? 'transform 300ms ease-out' : 'none',
              }}
              onTransitionEnd={basePos === 0 ? handleTransitionEnd : undefined}
            >
              <Image
                fill
                src={slides[slideIndex].src}
                alt={slides[slideIndex].alt}
                className="object-cover"
                priority={basePos === 0}
              />
            </div>
          ))}

          {/* Back Arrow - visible after first advance */}
          {slides.length > 1 && hasAdvanced && (
            <button
              onClick={goPrev}
              aria-label="Previous slide"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 text-gray-800 shadow-sm"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 3L5 8L10 13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}

          {/* Forward Arrow */}
          {slides.length > 1 && (
            <button
              onClick={goNext}
              aria-label="Next slide"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 text-gray-800 shadow-sm"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 3L11 8L6 13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Product Info & Form - padded and constrained */}
        <div className="py-6 px-4">
          <div className="flex flex-col gap-4 max-w-2xl mx-auto">
            <div>
              <div className="flex flex-col gap-2 text-center mb-2">
                <h4 className="text-2xl font-bold">{productTitle}</h4>
                <p className="text-sm text-[#525252] leading-[140%]">
                  {productDescription}
                </p>
              </div>

              <div className="w-full text-center text-sm font-semibold mb-2">
                <span>Starting at $95/month.</span>
              </div>

              <div className="flex flex-col gap-6">
                {/* Size Selection */}
                <SizeSelectionContainer />

                {/* Plan/Bundle Selection or Order Type */}
                {showPlanSelector ? <PlanSelector /> : <OrderTypeSelection />}

                {/* Add to Cart */}
                <AddToCartButton />

                {/* Product Features Grid */}
                <ProductFeatures />

                {/* Product Info Accordion */}
                <ProductAccordion />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProductOrderProvider>
  );
}

/**
 * OrderTypeSelection - Simple subscription/one-time selector
 *
 * Use this when not showing bundle options.
 * For bundle selection, use PlanSelector instead.
 */
import { useProductOrder } from './purchase/context';

function OrderTypeSelection() {
  const { state, setOrderType, currentPrice, originalPrice, savingsPercent } =
    useProductOrder();

  // Only show after size is selected
  if (!state.selectedSize) return null;

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p>Pick your order type:</p>
      </div>

      {/* Order Type Cards */}
      <div className="grid grid-cols-2 gap-4">
        {/* Subscription Card */}
        <button
          onClick={() => setOrderType('subscription')}
          className={`relative p-3 rounded-lg border text-left transition-all ${
            state.orderType === 'subscription'
              ? 'border-[#0000C9] bg-white'
              : 'border-gray-200 bg-gray-50 hover:border-gray-300'
          }`}
        >
          {state.orderType === 'subscription' && savingsPercent > 0 && (
            <div className="absolute top-[-12px] left-3 bg-[#0000C9] text-white text-xs font-bold px-2 py-1 rounded">
              SAVE {savingsPercent}%
            </div>
          )}
          <div>
            <span className="font-medium mb-2">Auto-Renew</span>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-sm text-[#0000C9]">
                ${currentPrice.toFixed(2)}
              </span>
              {originalPrice > currentPrice && (
                <span className="text-sm text-[#525252] line-through">
                  ${originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <div>
              <p className="text-[#525252] text-sm">
                A month&apos;s worth of diapers per order, set on autopilot
              </p>
            </div>
          </div>
        </button>

        {/* One-time Card */}
        <button
          onClick={() => setOrderType('one-time')}
          className={`relative p-3 rounded-lg border text-left transition-all ${
            state.orderType === 'one-time'
              ? 'border-[#0000C9] bg-white'
              : 'border-gray-200 bg-gray-50 hover:border-gray-300'
          }`}
        >
          <div>
            <span className="font-medium mb-2">One-time</span>
            <div className="mb-3">
              <span className="text-sm text-[#525252]">
                ${originalPrice.toFixed(2)}
              </span>
            </div>
            <div>
              <p className="text-[#525252] text-sm">
                A month&apos;s worth of diapers, single purchase
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

// Re-export for backwards compatibility
export { ProductOrderProvider } from './purchase/context';
export { default as SizeSelectionContainer } from './purchase/size-selection-container';
export { default as PlanSelector } from './purchase/plan-selector';
export { default as AddToCartButton } from './purchase/add-to-cart-button';
