// GTM E-commerce Event Tracking (GA4 Schema)

import type { DiaperSize, PlanType, OrderType } from '@/components/purchase/context';

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
  planType: PlanType;
  size: DiaperSize;
  orderType: OrderType;
  price: number;
  quantity?: number;
  currency?: string;
}

/**
 * Track begin_checkout event when user is redirected to Shopify checkout
 */
export function trackBeginCheckout(data: BeginCheckoutEventData): void {
  const { planType, size, orderType, price, quantity = 1, currency = 'USD' } = data;

  pushToDataLayer({ ecommerce: null });

  pushToDataLayer({
    event: 'begin_checkout',
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
    plan_type: planType,
    diaper_size: size,
    order_type: orderType,
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
