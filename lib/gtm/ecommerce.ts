// GTM E-commerce Event Tracking (GA4 Schema)

import { sendGTMEvent } from '@next/third-parties/google';
import type { DiaperSize, PlanType, OrderType } from '@/components/purchase/context';
import { SIZE_CONFIGS } from '@/components/purchase/context';

function pushToDataLayer(data: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push(data);
}

// Plan display names for analytics
const PLAN_NAMES: Record<PlanType, string> = {
  'diaper-only': 'Diaper Plan',
  'diaper-wipe-bundle': 'Diaper + Wipe Bundle',
  deluxe: 'Deluxe Plan',
};

// Size display names
function getDisplaySize(size: DiaperSize): string {
  if (size === 'n') return 'N';
  if (size === 'n+1') return 'N+1';
  return size;
}

export interface AddToCartEventData {
  planType: PlanType;
  size: DiaperSize;
  orderType: OrderType;
  price: number;
  quantity?: number;
  currency?: string;
}

/**
 * Track add_to_cart event with GA4 e-commerce schema
 */
export function trackAddToCart(data: AddToCartEventData): void {
  const { planType, size, orderType, price, quantity = 1, currency = 'USD' } = data;

  // Clear previous ecommerce data
  pushToDataLayer({ ecommerce: null });

  pushToDataLayer({
    event: 'add_to_cart',
    ecommerce: {
      currency,
      value: price * quantity,
      items: [
        {
          item_id: `${planType}-${size}`,
          item_name: PLAN_NAMES[planType],
          item_category: 'Subscription',
          item_category2: orderType === 'subscription' ? 'Auto-Renew' : 'One-Time',
          item_variant: getDisplaySize(size),
          price,
          quantity,
        },
      ],
    },
    // Custom dimensions
    plan_type: planType,
    diaper_size: size,
    order_type: orderType,
  });
}

export interface BeginCheckoutEventData {
  size: DiaperSize;
  orderType: OrderType;
  price: number;
  variantId: string;
  quantity?: number;
  currency?: string;
  productId?: number;
  imageUrl?: string;
  location?: string;
}

// Default product constants
const DEFAULT_PRODUCT_ID = 4471557914690;
const DEFAULT_IMAGE_URL = 'https://cdn.shopify.com/s/files/1/0254/8118/3298/products/TheDiaper.jpg?v=1682295124';

/**
 * Extract numeric variant ID from Shopify GID
 */
function extractVariantId(gid: string): number | undefined {
  const match = gid.match(/ProductVariant\/(\d+)/);
  return match ? parseInt(match[1], 10) : undefined;
}

/**
 * Track begin_checkout event when user is redirected to Shopify checkout
 */
export function trackBeginCheckout(data: BeginCheckoutEventData): void {
  const {
    size,
    orderType,
    price,
    variantId,
    quantity = 1,
    currency = 'USD',
    productId = DEFAULT_PRODUCT_ID,
    imageUrl = DEFAULT_IMAGE_URL,
    location,
  } = data;

  const purchaseType = orderType === 'subscription' ? 'Auto Renew' : 'One-Time';
  const numericVariantId = extractVariantId(variantId);

  pushToDataLayer({ ecommerce: null });

  pushToDataLayer({
    event: 'begin_checkout',
    ecommerce: {
      actionField: { step: 1 },
      currency,
      value: price * quantity,
      items: [
        {
          item_brand: 'Coterie',
          item_category: 'Diapers',
          item_image_url: imageUrl,
          item_name: 'The Diaper',
          item_product_id: productId,
          item_variant: SIZE_CONFIGS[size].variantName,
          item_variant_id: numericVariantId,
          location,
          price,
          purchase_type: purchaseType,
          quantity,
        },
      ],
      purchase_type: purchaseType,
    },
  });
}

/**
 * Track checkout error for debugging/monitoring
 */
export function trackCheckoutError(error: string, context?: Record<string, unknown>): void {
  pushToDataLayer({
    event: 'checkout_error',
    error_message: error,
    ...context,
  });
}

export interface SelectProductVariantEventData {
  itemName: string;
  itemVariant: string;
  location: string;
}

/**
 * Track product variant selection (e.g., size selection)
 */
export function trackSelectProductVariant(data: SelectProductVariantEventData): void {
  sendGTMEvent({
    event: 'ui_custom_event',
    customEventPayload: {
      name: 'select_product_variant',
      value: {
        item_name: data.itemName,
        item_variant: data.itemVariant,
        location: data.location,
      },
    },
  });
}

export interface SelectPlanTypeEventData {
  location: string;
  planType: PlanType | 'one-time';
}

/**
 * Track plan type selection
 */
export function trackSelectPlanType(data: SelectPlanTypeEventData): void {
  const version =
    data.planType === 'one-time'
      ? 'One-Time Purchase'
      : PLAN_NAMES[data.planType];

  sendGTMEvent({
    event: 'ui_custom_event',
    customEventPayload: {
      name: 'select_plan_type',
      value: {
        location: data.location,
        version,
      },
    },
  });
}

/**
 * Extract image identifier from URL for tracking
 * Converts Sanity URLs to format like "image-{id}-{dimensions}-{format}"
 */
function getImageIdentifier(src: string): string {
  // Try to extract Sanity image ID
  const sanityMatch = src.match(/\/([a-f0-9]+-\d+x\d+)\.(jpg|png|webp)/i);
  if (sanityMatch) {
    return `image-${sanityMatch[1]}-${sanityMatch[2]}`;
  }

  // Fallback: use last path segment
  const urlPath = src.split('?')[0];
  const filename = urlPath.split('/').pop() || 'unknown';
  return `image-${filename.replace(/\./g, '-')}`;
}

export interface ClickCarouselThumbnailEventData {
  imageSrc: string;
  location: string;
}

/**
 * Track carousel thumbnail click
 */
export function trackClickCarouselThumbnail(data: ClickCarouselThumbnailEventData): void {
  sendGTMEvent({
    event: 'ui_custom_event',
    customEventPayload: {
      name: 'click_carousel_thumbnail',
      value: {
        image: getImageIdentifier(data.imageSrc),
        location: data.location,
      },
    },
  });
}
