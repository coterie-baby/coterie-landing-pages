// Shopify integration exports

export { shopifyFetch, STOREFRONT_API_URL } from './client';
export { CART_CREATE_MUTATION, CART_LINES_ADD_MUTATION, CART_FRAGMENT } from './mutations';
export { buildCartLines, validateProductConfig } from './product-mapping';
export { createCart, createCartWithLines, type CreateCartOptions, type CreateCartResult } from './cart';
export type * from './types';

// Re-export config getters for convenience
export {
  getDiaperVariantIds,
  getDiaperSellingPlanId,
  getWipes4PackVariantId,
  getWipes8PackVariantId,
  getWipesSellingPlanId,
} from '@/lib/config/products';
