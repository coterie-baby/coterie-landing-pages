// Shopify Product Variant Mapping
// Re-exports from centralized config and provides cart line builders

import type { DiaperSize, PlanType } from '@/components/purchase/context';
import type { ShopifyCartLine } from './types';

import {
  getDiaperVariantIds,
  getDiaperSellingPlanId,
  getWipes4PackVariantId,
  getWipes8PackVariantId,
  getWipesSellingPlanId,
  validateProductConfig,
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
