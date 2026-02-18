'use client';

import { useRef, useMemo, useEffect, Suspense } from 'react';
import Image from 'next/image';
import {
  ProductOrderProvider,
  useProductOrder,
  // SIZE_CONFIGS,
  PLAN_CONFIGS,
  SIZE_ORDER,
  type DiaperSize,
  type UpsellCartItem,
} from './purchase/context';
import type { BundleItem } from '@/lib/sanity/types';
import type { PortableTextBlock } from '@portabletext/types';
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
        {rating ?? 0}/5 ({(reviewCount ?? 0).toLocaleString()} reviews)
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
const SLIDE_PEEK = 32; // px visible of next slide

function ImageCarousel({ images }: { images: { src: string; alt: string }[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset to first slide when images change (e.g. size selection swaps featured image)
  const firstSrc = images[0]?.src;
  useEffect(() => {
    scrollRef.current?.scrollTo({
      left: 0,
      behavior: 'instant' as ScrollBehavior,
    });
  }, [firstSrc]);

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

// ─── Order Type Config ────────────────────────────────────────

export interface OrderTypeConfig {
  autoRenew?: {
    badgeText?: string;
    title?: string;
    benefits?: string[];
    showTrialPack?: boolean;
    trialPackImage?: string;
    trialPackTitle?: string;
    trialPackDescription?: string;
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
    showTrialPack: true,
    trialPackImage: '/images/diaper_s1.png',
    trialPackTitle: 'Next Size Trial Pack',
    trialPackDescription:
      'A trial pack of size 2 diapers, giving you a head start on the next stage.',
  },
  oneTimePurchase: {
    title: 'One-time Purchase',
    benefits: ["A month's supply of superior diapers"],
  },
};

function UpsellModule() {
  const { state, upsellItems, selectedUpsellIndices, toggleUpsell } = useProductOrder();

  if (!upsellItems?.length) return null;

  return (
    <div className="space-y-3">
      <p className="text-sm">Complete your diaper bag:</p>
      <div className="grid grid-cols-2 gap-2">
        {upsellItems.map((product, i) => {
          const isSelected = selectedUpsellIndices.includes(i);
          const price =
            state.orderType === 'subscription'
              ? (product.subscriptionPrice ?? product.onetimePrice)
              : product.onetimePrice;

          return (
            <button
              key={i}
              type="button"
              onClick={() => toggleUpsell(i)}
              className={`flex items-center gap-3 rounded-lg border p-2 text-left w-full transition-all ${
                isSelected
                  ? 'border-[#0000C9] bg-white'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="relative w-10 h-10 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                {product.imageUrl && (
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                )}
              </div>
              <div>
                <p className="font-bold text-sm text-black leading-tight">{product.title}</p>
                {price != null && (
                  <p className="text-sm text-gray-600 mt-0.5">${price}</p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Order Type Selector (new design) ─────────────────────────

function OrderTypeSelector({ config }: { config: OrderTypeConfig }) {
  const { state, setOrderType } = useProductOrder();

  const diaperOnlyPlan = PLAN_CONFIGS.find((p) => p.id === 'diaper-only');
  const subscriptionPrice = diaperOnlyPlan?.subscriptionPrice ?? 95;
  const basePrice = diaperOnlyPlan?.basePrice ?? 105.5;

  const defaults = defaultOrderTypeConfig.autoRenew!;
  const cms = config.autoRenew;
  const autoRenew = {
    badgeText: cms?.badgeText ?? defaults.badgeText,
    title: cms?.title ?? defaults.title,
    benefits: cms?.benefits ?? defaults.benefits,
    showTrialPack: cms?.showTrialPack ?? defaults.showTrialPack,
    trialPackImage: cms?.trialPackImage ?? defaults.trialPackImage,
    trialPackTitle: cms?.trialPackTitle ?? defaults.trialPackTitle,
    trialPackDescription:
      cms?.trialPackDescription ?? defaults.trialPackDescription,
  };
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
        <div className="p-3">
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
                <div
                  key={i}
                  className="flex items-center gap-2 text-xs text-[#515151]"
                >
                  <CheckIcon className="text-[#0000C9]" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          )}
          {autoRenew.showTrialPack &&
            (autoRenew.trialPackTitle || autoRenew.trialPackDescription) && (
              <>
                <div className="border-t border-gray-200 my-3" />
                <div className="flex items-center gap-3">
                  {autoRenew.trialPackImage && (
                    <div className="relative w-12 h-12 flex-shrink-0 rounded overflow-hidden">
                      <Image
                        src={autoRenew.trialPackImage}
                        alt={autoRenew.trialPackTitle || 'Trial pack'}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                  )}
                  <div className="min-w-0">
                    {autoRenew.trialPackTitle && (
                      <p className="text-xs font-semibold text-black">
                        {autoRenew.trialPackTitle}
                      </p>
                    )}
                    {autoRenew.trialPackDescription && (
                      <p className="text-xs text-[#515151]">
                        {autoRenew.trialPackDescription}
                      </p>
                    )}
                  </div>
                </div>
              </>
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
              <div
                key={i}
                className="flex items-center gap-2 text-xs text-[#515151]"
              >
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
  hideSizeSelector?: boolean;
  features?: { icon: string; label: string }[];
  accordionItems?: { title: string; content?: PortableTextBlock[] }[];
}

function PDPHeroV2Content({
  rating,
  reviewCount,
  productTitle,
  images,
  sizeImages,
  orderTypeConfig,
  hideSizeSelector,
  features,
  accordionItems,
}: PDPHeroV2ContentProps) {
  const { state } = useProductOrder();

  // Build carousel images: if the selected size has a featured image, use it as the first slide
  const carouselImages = useMemo(() => {
    if (!state.selectedSize || !sizeImages?.[state.selectedSize]) {
      return images;
    }
    const sizeImageUrl = sizeImages[state.selectedSize];
    const sizeSlide = {
      src: sizeImageUrl,
      alt: `${productTitle} Size ${state.selectedSize}`,
    };
    return [sizeSlide, ...images.slice(1)];
  }, [state.selectedSize, sizeImages, images, productTitle]);

  return (
    <div className="bg-white">
      {/* Rating + Title */}
      <div className="flex flex-col gap-2 px-4 py-4">
        <HeroStarRating rating={rating} reviewCount={reviewCount} />
        <div className="flex flex-col gap-0.5">
          <h4 className="text-[26px] font-medium text-black mt-1 leading-tight">
            {productTitle}
          </h4>
          <p className="text-sm text-[#525252]">
            A combo pack of Newborn and Size 1 diapers
          </p>
        </div>
      </div>

      {/* Image Carousel */}
      <ImageCarousel images={carouselImages} />

      {/* Form Content */}
      <div className="px-4 pt-6 pb-6 space-y-6">
        {/* Size Selection — hidden in bundle mode when size is pre-selected */}
        {!hideSizeSelector && <SizeSelectionContainer />}

        <UpsellModule />

        {/* Order Type */}
        <OrderTypeSelector config={orderTypeConfig} />

        {/* Add to Cart */}
        <AddToCartButton title={productTitle} />
      </div>
      <div className="px-4 py-2 space-y-6">
        <ProductFeatures features={features} />
        <ProductAccordion items={accordionItems} />
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
  hideSizeSelector?: boolean;
  preselectedSize?: string;
  bundleItems?: BundleItem[];
  upsellProducts?: UpsellCartItem[];
  features?: { icon: string; label: string }[];
  accordionItems?: { title: string; content?: PortableTextBlock[] }[];
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

function PDPHeroV2Inner({
  rating = 0,
  reviewCount = 0,
  productTitle = 'The Diaper',
  images = defaultImages,
  sizeImages,
  orderTypeConfig = defaultOrderTypeConfig,
  hideSizeSelector,
  preselectedSize,
  bundleItems,
  upsellProducts,
  features,
  accordionItems,
}: PDPHeroV2Props) {
  const searchParams = useSearchParams();
  const sizeFromUrl = parseSizeParam(searchParams.get('size'));

  return (
    <ProductOrderProvider
      initialSize={(preselectedSize as DiaperSize) ?? sizeFromUrl ?? '1'}
      bundleItems={bundleItems}
      upsellItems={upsellProducts}
    >
      <PDPHeroV2Content
        rating={rating}
        reviewCount={reviewCount}
        productTitle={productTitle}
        images={images}
        sizeImages={sizeImages}
        orderTypeConfig={orderTypeConfig}
        hideSizeSelector={hideSizeSelector}
        features={features}
        accordionItems={accordionItems}
      />
    </ProductOrderProvider>
  );
}

export default function PDPHeroV2(props: PDPHeroV2Props) {
  return (
    <Suspense>
      <PDPHeroV2Inner {...props} />
    </Suspense>
  );
}
