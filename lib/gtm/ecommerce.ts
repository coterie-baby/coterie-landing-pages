// GTM E-commerce Event Tracking (GA4 Schema)

import { sendGTMEvent } from '@next/third-parties/google';
import type { DiaperSize, PlanType, OrderType } from '@/components/purchase/context';
import { SIZE_CONFIGS } from '@/components/purchase/context';
import {
  DIAPER_VARIANT_IDS,
  WIPES_4_PACK_VARIANT_ID,
  WIPES_8_PACK_VARIANT_ID,
} from '@/lib/shopify/product-mapping';

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
 * Uses the same item structure as begin_checkout for consistency
 */
export function trackAddToCart(data: AddToCartEventData): void {
  const { planType, size, orderType, price, quantity = 1, currency = 'USD' } = data;

  const purchaseType = orderType === 'subscription' ? 'Auto Renew' : 'One-Time';
  const items = buildCheckoutItems(size, planType, purchaseType, quantity);

  // Clear previous ecommerce data
  pushToDataLayer({ ecommerce: null });

  pushToDataLayer({
    event: 'add_to_cart',
    ecommerce: {
      currency,
      value: price * quantity,
      items,
      purchase_type: purchaseType,
    },
  });
}

export interface BeginCheckoutEventData {
  size: DiaperSize;
  planType: PlanType;
  orderType: OrderType;
  price: number;
  quantity?: number;
  currency?: string;
  location?: string;
}

// Default product constants for diapers
const DIAPER_PRODUCT_ID = 4471557914690;
const DIAPER_IMAGE_URL = 'https://cdn.shopify.com/s/files/1/0254/8118/3298/products/TheDiaper.jpg?v=1682295124';

// Default product constants for wipes
// TODO: Replace with actual wipes product info from environment variables
const WIPES_PRODUCT_ID = 4471557914691; // Placeholder - update with real ID
const WIPES_IMAGE_URL = 'https://cdn.shopify.com/s/files/1/0254/8118/3298/products/TheWipe.jpg'; // Placeholder

// Price breakdown for tracking (approximate - total prices are in PLAN_CONFIGS)
const DIAPER_BASE_PRICE = 105.5;
const WIPES_4_PACK_PRICE = 33; // 138.5 - 105.5
const WIPES_8_PACK_PRICE = 66; // 171.5 - 105.5

/**
 * Extract numeric variant ID from Shopify GID
 */
function extractVariantId(gid: string): number | undefined {
  const match = gid.match(/ProductVariant\/(\d+)/);
  return match ? parseInt(match[1], 10) : undefined;
}

/**
 * Build items array for checkout tracking based on plan type
 */
function buildCheckoutItems(
  size: DiaperSize,
  planType: PlanType,
  purchaseType: string,
  quantity: number,
  location?: string
): Record<string, unknown>[] {
  const items: Record<string, unknown>[] = [];

  // Always add diapers
  const diaperVariantId = DIAPER_VARIANT_IDS[size];
  items.push({
    item_brand: 'Coterie',
    item_category: 'Diapers',
    item_image_url: DIAPER_IMAGE_URL,
    item_name: 'The Diaper',
    item_product_id: DIAPER_PRODUCT_ID,
    item_variant: SIZE_CONFIGS[size].variantName,
    item_variant_id: extractVariantId(diaperVariantId),
    location,
    price: DIAPER_BASE_PRICE,
    purchase_type: purchaseType,
    quantity,
  });

  // Add wipes for bundle plans
  if (planType === 'diaper-wipe-bundle') {
    items.push({
      item_brand: 'Coterie',
      item_category: 'Wipes',
      item_image_url: WIPES_IMAGE_URL,
      item_name: 'The Wipe',
      item_product_id: WIPES_PRODUCT_ID,
      item_variant: '4 packs (224 wipes)',
      item_variant_id: extractVariantId(WIPES_4_PACK_VARIANT_ID),
      location,
      price: WIPES_4_PACK_PRICE,
      purchase_type: purchaseType,
      quantity,
    });
  }

  if (planType === 'deluxe') {
    items.push({
      item_brand: 'Coterie',
      item_category: 'Wipes',
      item_image_url: WIPES_IMAGE_URL,
      item_name: 'The Wipe',
      item_product_id: WIPES_PRODUCT_ID,
      item_variant: '8 packs (448 wipes)',
      item_variant_id: extractVariantId(WIPES_8_PACK_VARIANT_ID),
      location,
      price: WIPES_8_PACK_PRICE,
      purchase_type: purchaseType,
      quantity,
    });
  }

  return items;
}

/**
 * Track begin_checkout event when user is redirected to Shopify checkout
 */
export function trackBeginCheckout(data: BeginCheckoutEventData): void {
  const {
    size,
    planType,
    orderType,
    price,
    quantity = 1,
    currency = 'USD',
    location,
  } = data;

  const purchaseType = orderType === 'subscription' ? 'Auto Renew' : 'One-Time';
  const items = buildCheckoutItems(size, planType, purchaseType, quantity, location);

  pushToDataLayer({ ecommerce: null });

  pushToDataLayer({
    event: 'begin_checkout',
    ecommerce: {
      actionField: { step: 1 },
      currency,
      value: price * quantity,
      items,
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
