// Product Configuration
// All product-related constants centralized here, reading from environment variables
// This allows different values for staging vs production environments
// Uses getter functions for lazy loading to ensure env vars are available at runtime

import type { DiaperSize } from '@/components/purchase/context';

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Extract numeric variant ID from Shopify GID
 */
export function extractVariantId(gid: string): number | undefined {
  const match = gid.match(/ProductVariant\/(\d+)/);
  return match ? parseInt(match[1], 10) : undefined;
}

/**
 * Build a Shopify ProductVariant GID from a numeric ID
 */
export function toVariantGid(numericId: string | number): string {
  return `gid://shopify/ProductVariant/${numericId}`;
}

/**
 * Build a Shopify SellingPlan GID from a numeric ID
 */
export function toSellingPlanGid(numericId: string | number): string {
  return `gid://shopify/SellingPlan/${numericId}`;
}

// =============================================================================
// DIAPER PRODUCT CONFIG
// =============================================================================

// Diaper variant IDs - using static access for Next.js client-side bundling
// Next.js only replaces process.env.VAR_NAME with literal string access, not dynamic access
const DIAPER_VARIANT_IDS: Record<DiaperSize, string | undefined> = {
  n: process.env.NEXT_PUBLIC_DIAPER_VARIANT_ID_N,
  'n+1': process.env.NEXT_PUBLIC_DIAPER_VARIANT_ID_N1,
  '1': process.env.NEXT_PUBLIC_DIAPER_VARIANT_ID_1,
  '2': process.env.NEXT_PUBLIC_DIAPER_VARIANT_ID_2,
  '3': process.env.NEXT_PUBLIC_DIAPER_VARIANT_ID_3,
  '4': process.env.NEXT_PUBLIC_DIAPER_VARIANT_ID_4,
  '5': process.env.NEXT_PUBLIC_DIAPER_VARIANT_ID_5,
  '6': process.env.NEXT_PUBLIC_DIAPER_VARIANT_ID_6,
  '7': process.env.NEXT_PUBLIC_DIAPER_VARIANT_ID_7,
};

/**
 * Get diaper variant IDs
 */
export function getDiaperVariantIds(): Record<DiaperSize, string> {
  const missing = Object.entries(DIAPER_VARIANT_IDS)
    .filter(([, v]) => !v)
    .map(([k]) => k);
  if (missing.length > 0) {
    throw new Error(`Missing diaper variant IDs for sizes: ${missing.join(', ')}`);
  }
  return DIAPER_VARIANT_IDS as Record<DiaperSize, string>;
}

// Static access for client-side bundling
const DIAPER_PRODUCT_ID = process.env.NEXT_PUBLIC_DIAPER_PRODUCT_ID;
const DIAPER_IMAGE_URL = process.env.NEXT_PUBLIC_DIAPER_IMAGE_URL;
const DIAPER_BASE_PRICE = process.env.NEXT_PUBLIC_DIAPER_BASE_PRICE;
const DIAPER_SUBSCRIPTION_PRICE = process.env.NEXT_PUBLIC_DIAPER_SUBSCRIPTION_PRICE;
const DIAPER_SELLING_PLAN_ID = process.env.NEXT_PUBLIC_DIAPER_SELLING_PLAN_ID;

export const getDiaperProductId = () => {
  if (!DIAPER_PRODUCT_ID) throw new Error('Missing NEXT_PUBLIC_DIAPER_PRODUCT_ID');
  return Number(DIAPER_PRODUCT_ID);
};
export const getDiaperImageUrl = () => {
  if (!DIAPER_IMAGE_URL) throw new Error('Missing NEXT_PUBLIC_DIAPER_IMAGE_URL');
  return DIAPER_IMAGE_URL;
};
export const getDiaperBasePrice = () => {
  if (!DIAPER_BASE_PRICE) throw new Error('Missing NEXT_PUBLIC_DIAPER_BASE_PRICE');
  return Number(DIAPER_BASE_PRICE);
};
export const getDiaperSubscriptionPrice = () => {
  if (!DIAPER_SUBSCRIPTION_PRICE) throw new Error('Missing NEXT_PUBLIC_DIAPER_SUBSCRIPTION_PRICE');
  return Number(DIAPER_SUBSCRIPTION_PRICE);
};
export const getDiaperSellingPlanId = () => {
  if (!DIAPER_SELLING_PLAN_ID) throw new Error('Missing NEXT_PUBLIC_DIAPER_SELLING_PLAN_ID');
  return DIAPER_SELLING_PLAN_ID;
};

// =============================================================================
// WIPES PRODUCT CONFIG
// =============================================================================

// Static access for client-side bundling
const WIPES_PRODUCT_ID = process.env.NEXT_PUBLIC_WIPES_PRODUCT_ID;
const WIPES_IMAGE_URL = process.env.NEXT_PUBLIC_WIPES_IMAGE_URL;
const WIPES_4_PACK_PRICE = process.env.NEXT_PUBLIC_WIPES_4_PACK_PRICE;
const WIPES_4_PACK_SUBSCRIPTION_PRICE = process.env.NEXT_PUBLIC_WIPES_4_PACK_SUBSCRIPTION_PRICE;
const WIPES_8_PACK_PRICE = process.env.NEXT_PUBLIC_WIPES_8_PACK_PRICE;
const WIPES_8_PACK_SUBSCRIPTION_PRICE = process.env.NEXT_PUBLIC_WIPES_8_PACK_SUBSCRIPTION_PRICE;
const WIPES_4_PACK_VARIANT_ID = process.env.NEXT_PUBLIC_WIPES_4_PACK_VARIANT_ID;
const WIPES_8_PACK_VARIANT_ID = process.env.NEXT_PUBLIC_WIPES_8_PACK_VARIANT_ID;
const WIPES_SELLING_PLAN_ID = process.env.NEXT_PUBLIC_WIPES_SELLING_PLAN_ID;

export const getWipesProductId = () => {
  if (!WIPES_PRODUCT_ID) throw new Error('Missing NEXT_PUBLIC_WIPES_PRODUCT_ID');
  return Number(WIPES_PRODUCT_ID);
};
export const getWipesImageUrl = () => {
  if (!WIPES_IMAGE_URL) throw new Error('Missing NEXT_PUBLIC_WIPES_IMAGE_URL');
  return WIPES_IMAGE_URL;
};
export const getWipes4PackPrice = () => {
  if (!WIPES_4_PACK_PRICE) throw new Error('Missing NEXT_PUBLIC_WIPES_4_PACK_PRICE');
  return Number(WIPES_4_PACK_PRICE);
};
export const getWipes4PackSubscriptionPrice = () => {
  if (!WIPES_4_PACK_SUBSCRIPTION_PRICE) throw new Error('Missing NEXT_PUBLIC_WIPES_4_PACK_SUBSCRIPTION_PRICE');
  return Number(WIPES_4_PACK_SUBSCRIPTION_PRICE);
};
export const getWipes8PackPrice = () => {
  if (!WIPES_8_PACK_PRICE) throw new Error('Missing NEXT_PUBLIC_WIPES_8_PACK_PRICE');
  return Number(WIPES_8_PACK_PRICE);
};
export const getWipes8PackSubscriptionPrice = () => {
  if (!WIPES_8_PACK_SUBSCRIPTION_PRICE) throw new Error('Missing NEXT_PUBLIC_WIPES_8_PACK_SUBSCRIPTION_PRICE');
  return Number(WIPES_8_PACK_SUBSCRIPTION_PRICE);
};
export const getWipes4PackVariantId = () => {
  if (!WIPES_4_PACK_VARIANT_ID) throw new Error('Missing NEXT_PUBLIC_WIPES_4_PACK_VARIANT_ID');
  return WIPES_4_PACK_VARIANT_ID;
};
export const getWipes8PackVariantId = () => {
  if (!WIPES_8_PACK_VARIANT_ID) throw new Error('Missing NEXT_PUBLIC_WIPES_8_PACK_VARIANT_ID');
  return WIPES_8_PACK_VARIANT_ID;
};
export const getWipesSellingPlanId = () => {
  if (!WIPES_SELLING_PLAN_ID) throw new Error('Missing NEXT_PUBLIC_WIPES_SELLING_PLAN_ID');
  return WIPES_SELLING_PLAN_ID;
};

// =============================================================================
// VALIDATION
// =============================================================================

/**
 * Validate that all required product config is set
 */
export function validateProductConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  try {
    getDiaperVariantIds();
    getDiaperProductId();
    getDiaperImageUrl();
    getDiaperBasePrice();
    getDiaperSellingPlanId();
    getWipesProductId();
    getWipesImageUrl();
    getWipes4PackPrice();
    getWipes8PackPrice();
    getWipes4PackVariantId();
    getWipes8PackVariantId();
    getWipesSellingPlanId();
  } catch (error) {
    if (error instanceof Error) {
      errors.push(error.message);
    }
  }

  return { valid: errors.length === 0, errors };
}
