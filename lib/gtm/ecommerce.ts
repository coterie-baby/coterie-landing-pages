// GTM E-commerce Event Tracking (GA4 Schema)

import { sendGTMEvent } from '@next/third-parties/google';
import amplitude from '@/amplitude';
import { trackConversion } from '@/lib/umami';
import type { DiaperSize, PlanType, OrderType } from '@/components/purchase/context';
import { SIZE_CONFIGS } from '@/components/purchase/context';
import {
  getDiaperVariantIds,
  getDiaperProductId,
  getDiaperImageUrl,
  getDiaperBasePrice,
  getDiaperSubscriptionPrice,
  getWipes4PackVariantId,
  getWipes8PackVariantId,
  getWipesProductId,
  getWipesImageUrl,
  getWipes4PackPrice,
  getWipes4PackSubscriptionPrice,
  getWipes8PackPrice,
  getWipes8PackSubscriptionPrice,
  extractVariantId,
} from '@/lib/config/products';

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
  location?: string;
}

/**
 * Track add_to_cart event with GA4 e-commerce schema
 * Uses the same item structure as begin_checkout for consistency
 * Non-blocking - fires asynchronously via dataLayer push and Amplitude
 */
export function trackAddToCart(data: AddToCartEventData): void {
  const { planType, size, orderType, price, quantity = 1, currency = 'USD', location } = data;

  const purchaseType = orderType === 'subscription' ? 'Auto Renew' : 'One-Time';
  const items = buildCheckoutItems(size, planType, purchaseType, quantity, location);

  // Clear previous ecommerce data
  pushToDataLayer({ ecommerce: null });

  const eventData = {
    currency,
    location: location || '',
    value: price * quantity,
    items,
  };

  // Send to GTM
  pushToDataLayer({
    event: 'add_to_cart',
    user_properties: {
      session_id: '',
      session_count: '',
    },
    ecommerce: eventData,
  });

  // Send to Amplitude
  amplitude.track('add_to_cart', eventData);

  // Send to Umami (conversion event for funnel dashboard)
  trackConversion('add_to_cart');
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
  const isSubscription = purchaseType === 'Auto Renew';

  // Always add diapers
  const diaperVariantId = getDiaperVariantIds()[size];
  const diaperPrice = isSubscription ? getDiaperSubscriptionPrice() : getDiaperBasePrice();
  items.push({
    item_brand: 'Coterie',
    item_category: 'Diapers',
    item_image_url: getDiaperImageUrl(),
    item_name: 'The Diaper',
    item_product_id: getDiaperProductId(),
    item_variant: SIZE_CONFIGS[size].variantName,
    item_variant_id: extractVariantId(diaperVariantId),
    location,
    price: diaperPrice,
    purchase_type: purchaseType,
    quantity,
  });

  // Add wipes for bundle plans
  if (planType === 'diaper-wipe-bundle') {
    const wipes4Price = isSubscription ? getWipes4PackSubscriptionPrice() : getWipes4PackPrice();
    items.push({
      item_brand: 'Coterie',
      item_category: 'Wipes',
      item_image_url: getWipesImageUrl(),
      item_name: 'The Wipe',
      item_product_id: getWipesProductId(),
      item_variant: '4 packs (224 wipes)',
      item_variant_id: extractVariantId(getWipes4PackVariantId()),
      location,
      price: wipes4Price,
      purchase_type: purchaseType,
      quantity,
    });
  }

  if (planType === 'deluxe') {
    const wipes8Price = isSubscription ? getWipes8PackSubscriptionPrice() : getWipes8PackPrice();
    items.push({
      item_brand: 'Coterie',
      item_category: 'Wipes',
      item_image_url: getWipesImageUrl(),
      item_name: 'The Wipe',
      item_product_id: getWipesProductId(),
      item_variant: '8 packs (448 wipes)',
      item_variant_id: extractVariantId(getWipes8PackVariantId()),
      location,
      price: wipes8Price,
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

  const eventData = {
    actionField: { step: 1 },
    currency,
    location: location || '',
    value: price * quantity,
    items,
  };

  // Send to GTM
  pushToDataLayer({
    event: 'begin_checkout',
    user_properties: {
      session_id: '',
      session_count: '',
    },
    ecommerce: eventData,
  });

  // Send to Amplitude
  amplitude.track('begin_checkout', eventData);
}

/**
 * Track checkout error for debugging/monitoring
 */
export function trackCheckoutError(error: string, context?: Record<string, unknown>): void {
  const eventData = {
    error_message: error,
    ...context,
  };

  // Send to GTM
  pushToDataLayer({
    event: 'checkout_error',
    ...eventData,
  });

  // Send to Amplitude
  amplitude.track('checkout_error', eventData);
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
  const eventData = {
    item_name: data.itemName,
    item_variant: data.itemVariant,
    location: data.location,
  };

  // Send to GTM
  sendGTMEvent({
    event: 'ui_custom_event',
    customEventPayload: {
      name: 'select_product_variant',
      value: eventData,
    },
  });

  // Send to Amplitude
  amplitude.track('select_product_variant', eventData);
}

export interface SelectPurchaseTypeEventData {
  location: string;
  isSubscription: boolean;
}

/**
 * Track purchase type selection (Auto Renew vs One Time)
 * Fires for all plan selections
 */
export function trackSelectPurchaseType(data: SelectPurchaseTypeEventData): void {
  const eventData = {
    location: data.location,
    version: data.isSubscription ? 'Auto Renew' : 'One Time',
  };

  // Send to GTM
  sendGTMEvent({
    event: 'ui_custom_event',
    customEventPayload: {
      name: 'select_purchase_type',
      value: eventData,
    },
  });

  // Send to Amplitude
  amplitude.track('select_purchase_type', eventData);
}

export interface SelectSubOnlyPlanTypeEventData {
  location: string;
  planType: PlanType;
}

/**
 * Track subscription plan type selection
 * Only fires when user selects an Auto Renew option
 */
export function trackSelectSubOnlyPlanType(data: SelectSubOnlyPlanTypeEventData): void {
  const eventData = {
    location: data.location,
    version: PLAN_NAMES[data.planType],
  };

  // Send to GTM
  sendGTMEvent({
    event: 'ui_custom_event',
    customEventPayload: {
      name: 'select_sub_only_plan_type',
      value: eventData,
    },
  });

  // Send to Amplitude
  amplitude.track('select_sub_only_plan_type', eventData);
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
  const eventData = {
    image: getImageIdentifier(data.imageSrc),
    location: data.location,
  };

  // Send to GTM
  sendGTMEvent({
    event: 'ui_custom_event',
    customEventPayload: {
      name: 'click_carousel_thumbnail',
      value: eventData,
    },
  });

  // Send to Amplitude
  amplitude.track('click_carousel_thumbnail', eventData);
}

/**
 * Track view popup event (e.g., Size + Fit Guide)
 */
export function trackViewPopup(popupName: string): void {
  const eventData = {
    popup_name: popupName,
  };

  // Send to GTM
  sendGTMEvent({
    event: 'ui_custom_event',
    customEventPayload: {
      name: 'view_popup',
      value: eventData,
    },
  });

  // Send to Amplitude
  amplitude.track('view_popup', eventData);
}
