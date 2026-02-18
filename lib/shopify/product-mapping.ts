// Shopify Product Variant Mapping
// Re-exports from centralized config and provides cart line builders

import type { DiaperSize, PlanType } from '@/components/purchase/context';
import type { BundleItem } from '@/lib/sanity/types';
import type { ShopifyCartLine } from './types';

import {
  getDiaperVariantIds,
  getDiaperSellingPlanId,
  getWipes4PackVariantId,
  getWipes8PackVariantId,
  getWipesSellingPlanId,
  toVariantGid,
  toSellingPlanGid,
} from '@/lib/config/products';

// Re-export for other modules
export { validateProductConfig } from '@/lib/config/products';

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

  const diaperVariantIds = getDiaperVariantIds();
  const diaperVariantId = diaperVariantIds[size];
  if (!diaperVariantId) {
    throw new Error(`Invalid or unconfigured diaper variant for size: ${size}`);
  }

  const diaperSellingPlanId =
    orderType === 'subscription' ? getDiaperSellingPlanId() : undefined;
  const wipesSellingPlanId =
    orderType === 'subscription' ? getWipesSellingPlanId() : undefined;

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
    lines.push({
      merchandiseId: getWipes4PackVariantId(),
      quantity,
      ...(wipesSellingPlanId && { sellingPlanId: wipesSellingPlanId }),
    });
  }

  if (planType === 'deluxe') {
    lines.push({
      merchandiseId: getWipes8PackVariantId(),
      quantity,
      ...(wipesSellingPlanId && { sellingPlanId: wipesSellingPlanId }),
    });
  }

  return lines;
}

/**
 * Build cart lines for upsell items selected by the user.
 */
export function buildUpsellCartLines(
  items: { shopifyVariantId: string; shopifySellingPlanId?: string }[],
  orderType: 'subscription' | 'one-time'
): ShopifyCartLine[] {
  return items.map((item) => {
    const line: ShopifyCartLine = {
      merchandiseId: toVariantGid(item.shopifyVariantId),
      quantity: 1,
    };
    if (orderType === 'subscription' && item.shopifySellingPlanId) {
      line.sellingPlanId = toSellingPlanGid(item.shopifySellingPlanId);
    }
    return line;
  });
}

/**
 * Build cart lines for bundle items (additional products included in a bundle).
 * Filters out items without a resolved shopifyVariantId.
 */
export function buildBundleCartLines(
  items: BundleItem[],
  orderType: 'subscription' | 'one-time'
): ShopifyCartLine[] {
  return items
    .filter((item) => item.shopifyVariantId)
    .map((item) => {
      const line: ShopifyCartLine = {
        merchandiseId: toVariantGid(item.shopifyVariantId!),
        quantity: item.quantity,
      };
      if (orderType === 'subscription' && item.shopifySellingPlanId) {
        line.sellingPlanId = toSellingPlanGid(item.shopifySellingPlanId);
      }
      return line;
    });
}
