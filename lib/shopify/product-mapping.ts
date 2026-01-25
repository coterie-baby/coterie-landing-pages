// Shopify Product Variant Mapping
// Configure your Shopify variant IDs here

import type { DiaperSize, PlanType } from '@/components/purchase/context';
import type { ShopifyCartLine } from './types';

// =============================================================================
// CONFIGURATION: Replace these placeholder IDs with your actual Shopify variant IDs
// You can find variant IDs in Shopify Admin > Products > [Product] > Variants
// Or via the Shopify Admin API
// =============================================================================

// Diaper variant IDs by size
// These are the base diaper products (6 packs per box)
export const DIAPER_VARIANT_IDS: Record<DiaperSize, string> = {
  n: 'gid://shopify/ProductVariant/43041753464970',
  'n+1': 'gid://shopify/ProductVariant/43885931495562',
  '1': 'gid://shopify/ProductVariant/34764788334730',
  '2': 'gid://shopify/ProductVariant/34764788498570',
  '3': 'gid://shopify/ProductVariant/34764788531338',
  '4': 'gid://shopify/ProductVariant/34764788727946',
  '5': 'gid://shopify/ProductVariant/34764788957322',
  '6': 'gid://shopify/ProductVariant/34764789022858',
  '7': 'gid://shopify/ProductVariant/45082757070986',
};

// Wipes variant IDs
export const WIPES_4_PACK_VARIANT_ID =
  'gid://shopify/ProductVariant/42772878917770';
export const WIPES_8_PACK_VARIANT_ID =
  'gid://shopify/ProductVariant/42774351052938';

// Selling plan IDs for subscriptions (Ships every 4 weeks default)
// Diapers: 959119498 (3wk), 959152266 (4wk), 959185034 (5wk), 1979613322 (8wk)
// Wipes:   959021194 (3wk), 959053962 (4wk), 959086730 (5wk)
export const DIAPER_SELLING_PLAN_ID =
  process.env.NEXT_PUBLIC_DIAPER_SELLING_PLAN_ID ||
  'gid://shopify/SellingPlan/959152266';

export const WIPES_SELLING_PLAN_ID =
  process.env.NEXT_PUBLIC_WIPES_SELLING_PLAN_ID ||
  'gid://shopify/SellingPlan/959053962';

// Legacy export for backwards compatibility
export const RECURLY_SELLING_PLAN_ID = DIAPER_SELLING_PLAN_ID;

// =============================================================================
// CART LINE BUILDERS
// =============================================================================

interface CartLineOptions {
  size: DiaperSize;
  planType: PlanType;
  orderType: 'subscription' | 'one-time';
  quantity?: number;
}

/**
 * Build cart lines for a given plan configuration
 * - diaper-only: 1 line item (diapers)
 * - diaper-wipe-bundle: 2 line items (diapers + 4-pack wipes)
 * - deluxe: 2 line items (diapers + 8-pack wipes)
 */
export function buildCartLines(options: CartLineOptions): ShopifyCartLine[] {
  const { size, planType, orderType, quantity = 1 } = options;

  const diaperVariantId = DIAPER_VARIANT_IDS[size];
  if (!diaperVariantId || diaperVariantId.includes('DIAPER_SIZE_')) {
    throw new Error(`Invalid or unconfigured diaper variant for size: ${size}`);
  }

  const diaperSellingPlanId =
    orderType === 'subscription' ? DIAPER_SELLING_PLAN_ID : undefined;
  const wipesSellingPlanId =
    orderType === 'subscription' ? WIPES_SELLING_PLAN_ID : undefined;

  const lines: ShopifyCartLine[] = [];

  // All plans include diapers
  const diaperLine: ShopifyCartLine = {
    merchandiseId: diaperVariantId,
    quantity,
    ...(diaperSellingPlanId && { sellingPlanId: diaperSellingPlanId }),
  };
  lines.push(diaperLine);

  // Add wipes for bundle plans (with their own selling plan for subscription discount)
  if (planType === 'diaper-wipe-bundle') {
    if (WIPES_4_PACK_VARIANT_ID.includes('WIPES_4_PACK')) {
      throw new Error('Wipes 4-pack variant ID not configured');
    }
    lines.push({
      merchandiseId: WIPES_4_PACK_VARIANT_ID,
      quantity,
      ...(wipesSellingPlanId && { sellingPlanId: wipesSellingPlanId }),
    });
  }

  if (planType === 'deluxe') {
    if (WIPES_8_PACK_VARIANT_ID.includes('WIPES_8_PACK')) {
      throw new Error('Wipes 8-pack variant ID not configured');
    }
    lines.push({
      merchandiseId: WIPES_8_PACK_VARIANT_ID,
      quantity,
      ...(wipesSellingPlanId && { sellingPlanId: wipesSellingPlanId }),
    });
  }

  return lines;
}

/**
 * Validate that all required variant IDs are configured
 * Call this at app startup or in development to catch missing config early
 */
export function validateProductConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check diaper variants
  for (const [size, variantId] of Object.entries(DIAPER_VARIANT_IDS)) {
    if (variantId.includes('DIAPER_SIZE_')) {
      errors.push(`Diaper variant ID not configured for size: ${size}`);
    }
  }

  // Check wipes variants
  if (WIPES_4_PACK_VARIANT_ID.includes('WIPES_4_PACK')) {
    errors.push('Wipes 4-pack variant ID not configured');
  }
  if (WIPES_8_PACK_VARIANT_ID.includes('WIPES_8_PACK')) {
    errors.push('Wipes 8-pack variant ID not configured');
  }

  // Check selling plan
  if (RECURLY_SELLING_PLAN_ID.includes('RECURLY_PLAN_ID')) {
    errors.push('Recurly selling plan ID not configured');
  }

  return { valid: errors.length === 0, errors };
}
