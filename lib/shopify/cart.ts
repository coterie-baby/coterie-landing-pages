// Shopify Cart Creation

import { shopifyFetch } from './client';
import { CART_CREATE_MUTATION, CART_LINES_ADD_MUTATION, CART_LINES_UPDATE_MUTATION, CART_LINES_REMOVE_MUTATION } from './mutations';
import { buildCartLines, buildBundleCartLines, buildUpsellCartLines } from './product-mapping';
import type { DiaperSize, PlanType, OrderType } from '@/components/purchase/context';
import type { BundleItem } from '@/lib/sanity/types';
import type { CartCreateResponse, CartLinesAddResponse, CartLinesUpdateResponse, CartLinesRemoveResponse, ShopifyCartLine, ShopifyCart } from './types';

export interface CreateCartOptions {
  size: DiaperSize;
  planType: PlanType;
  orderType: OrderType;
  quantity?: number;
  attributes?: { key: string; value: string }[];
  bundleItems?: BundleItem[];
  upsellItems?: { shopifyVariantId: string; shopifySellingPlanId?: string }[];
}

export interface CreateCartResult {
  success: boolean;
  checkoutUrl?: string;
  cartId?: string;
  cart?: ShopifyCart;
  error?: string;
}

/**
 * Create a new Shopify cart and return the checkout URL
 */
export async function createCart(
  options: CreateCartOptions
): Promise<CreateCartResult> {
  const { size, planType, orderType, quantity = 1, attributes = [], bundleItems, upsellItems } = options;

  try {
    // Build cart lines based on plan configuration
    const lines = buildCartLines({
      size,
      planType,
      orderType,
      quantity,
    });

    // Append bundle items to cart
    if (bundleItems && bundleItems.length > 0) {
      lines.push(...buildBundleCartLines(bundleItems, orderType));
    }

    // Append selected upsell items to cart
    if (upsellItems && upsellItems.length > 0) {
      lines.push(...buildUpsellCartLines(upsellItems, orderType));
    }

    // Add order type attribute for Recurly/analytics
    const cartAttributes = [
      { key: 'type', value: orderType === 'subscription' ? 'auto_renew' : 'one_time' },
      { key: 'source', value: 'landing_page' },
      ...attributes,
    ];

    const input = {
      lines,
      attributes: cartAttributes,
    };

    console.log('Creating cart with input:', JSON.stringify(input, null, 2));

    const response = await shopifyFetch<CartCreateResponse>(
      CART_CREATE_MUTATION,
      { input }
    );

    console.log('Shopify response:', JSON.stringify(response, null, 2));

    // Handle GraphQL errors
    if (response.errors?.length) {
      const errorMessage = response.errors.map((e) => e.message).join(', ');
      console.error('Shopify GraphQL errors:', response.errors);
      return { success: false, error: errorMessage };
    }

    // Handle user errors from the mutation
    const { cart, userErrors } = response.data?.cartCreate || {};

    if (userErrors?.length) {
      const errorMessage = userErrors.map((e) => e.message).join(', ');
      console.error('Shopify cart creation errors:', userErrors);
      return { success: false, error: errorMessage };
    }

    if (!cart?.checkoutUrl) {
      console.error('No checkout URL. Cart response:', cart);
      return { success: false, error: 'No checkout URL returned from Shopify' };
    }

    return {
      success: true,
      checkoutUrl: cart.checkoutUrl,
      cartId: cart.id,
      cart,
    };
  } catch (error) {
    console.error('Failed to create Shopify cart:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create cart',
    };
  }
}

export interface CartMutationResult {
  success: boolean;
  cart?: ShopifyCart;
  error?: string;
}

/**
 * Add lines to an existing Shopify cart
 */
export async function addCartLines(
  cartId: string,
  lines: ShopifyCartLine[]
): Promise<CartMutationResult> {
  try {
    const response = await shopifyFetch<CartLinesAddResponse>(
      CART_LINES_ADD_MUTATION,
      { cartId, lines }
    );

    if (response.errors?.length) {
      return { success: false, error: response.errors.map((e) => e.message).join(', ') };
    }

    const { cart, userErrors } = response.data?.cartLinesAdd || {};
    if (userErrors?.length) {
      return { success: false, error: userErrors.map((e) => e.message).join(', ') };
    }

    if (!cart) {
      return { success: false, error: 'No cart returned from Shopify' };
    }

    return { success: true, cart };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add cart lines',
    };
  }
}

/**
 * Update the quantity of one or more cart lines
 */
export async function updateCartLineQuantity(
  cartId: string,
  lineIds: string | string[],
  quantity: number
): Promise<CartMutationResult> {
  try {
    const ids = Array.isArray(lineIds) ? lineIds : [lineIds];
    const lines = ids.map((id) => ({ id, quantity }));
    const response = await shopifyFetch<CartLinesUpdateResponse>(
      CART_LINES_UPDATE_MUTATION,
      { cartId, lines }
    );

    if (response.errors?.length) {
      return { success: false, error: response.errors.map((e) => e.message).join(', ') };
    }

    const { cart, userErrors } = response.data?.cartLinesUpdate || {};
    if (userErrors?.length) {
      return { success: false, error: userErrors.map((e) => e.message).join(', ') };
    }

    if (!cart) {
      return { success: false, error: 'No cart returned from Shopify' };
    }

    return { success: true, cart };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update cart line',
    };
  }
}

/**
 * Remove one or more lines from the cart
 */
export async function removeCartLine(
  cartId: string,
  lineIds: string | string[]
): Promise<CartMutationResult> {
  try {
    const ids = Array.isArray(lineIds) ? lineIds : [lineIds];
    const response = await shopifyFetch<CartLinesRemoveResponse>(
      CART_LINES_REMOVE_MUTATION,
      { cartId, lineIds: ids }
    );

    if (response.errors?.length) {
      return { success: false, error: response.errors.map((e) => e.message).join(', ') };
    }

    const { cart, userErrors } = response.data?.cartLinesRemove || {};
    if (userErrors?.length) {
      return { success: false, error: userErrors.map((e) => e.message).join(', ') };
    }

    if (!cart) {
      return { success: false, error: 'No cart returned from Shopify' };
    }

    return { success: true, cart };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to remove cart line',
    };
  }
}

/**
 * Update arbitrary fields on one or more cart lines (e.g. clear sellingPlanId)
 */
export async function updateCartLines(
  cartId: string,
  lines: { id: string; sellingPlanId?: string | null; quantity?: number }[]
): Promise<CartMutationResult> {
  try {
    const response = await shopifyFetch<CartLinesUpdateResponse>(
      CART_LINES_UPDATE_MUTATION,
      { cartId, lines }
    );

    if (response.errors?.length) {
      return { success: false, error: response.errors.map((e) => e.message).join(', ') };
    }

    const { cart, userErrors } = response.data?.cartLinesUpdate || {};
    if (userErrors?.length) {
      return { success: false, error: userErrors.map((e) => e.message).join(', ') };
    }

    if (!cart) {
      return { success: false, error: 'No cart returned from Shopify' };
    }

    return { success: true, cart };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update cart lines',
    };
  }
}

/**
 * Create a cart with raw line items (for advanced use cases)
 */
export async function createCartWithLines(
  lines: ShopifyCartLine[],
  attributes?: { key: string; value: string }[]
): Promise<CreateCartResult> {
  try {
    const input = {
      lines,
      attributes: attributes || [],
    };

    const response = await shopifyFetch<CartCreateResponse>(
      CART_CREATE_MUTATION,
      { input }
    );

    if (response.errors?.length) {
      const errorMessage = response.errors.map((e) => e.message).join(', ');
      return { success: false, error: errorMessage };
    }

    const { cart, userErrors } = response.data?.cartCreate || {};

    if (userErrors?.length) {
      const errorMessage = userErrors.map((e) => e.message).join(', ');
      return { success: false, error: errorMessage };
    }

    if (!cart?.checkoutUrl) {
      return { success: false, error: 'No checkout URL returned' };
    }

    return {
      success: true,
      checkoutUrl: cart.checkoutUrl,
      cartId: cart.id,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create cart',
    };
  }
}
