// Shopify Cart Creation

import { shopifyFetch } from './client';
import { CART_CREATE_MUTATION } from './mutations';
import { buildCartLines, buildBundleCartLines } from './product-mapping';
import type { DiaperSize, PlanType, OrderType } from '@/components/purchase/context';
import type { BundleItem } from '@/lib/sanity/types';
import type { CartCreateResponse, ShopifyCartLine } from './types';

export interface CreateCartOptions {
  size: DiaperSize;
  planType: PlanType;
  orderType: OrderType;
  quantity?: number;
  attributes?: { key: string; value: string }[];
  bundleItems?: BundleItem[];
}

export interface CreateCartResult {
  success: boolean;
  checkoutUrl?: string;
  cartId?: string;
  error?: string;
}

/**
 * Create a new Shopify cart and return the checkout URL
 */
export async function createCart(
  options: CreateCartOptions
): Promise<CreateCartResult> {
  const { size, planType, orderType, quantity = 1, attributes = [], bundleItems } = options;

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
    };
  } catch (error) {
    console.error('Failed to create Shopify cart:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create cart',
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
