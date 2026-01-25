// Shopify Storefront API Client

import type { ShopifyGraphQLResponse } from './types';

const SHOPIFY_STORE_DOMAIN =
  process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'staging-shop.coterie.com';
const SHOPIFY_STOREFRONT_ACCESS_TOKEN =
  process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';

const STOREFRONT_API_VERSION = '2025-10';

export const STOREFRONT_API_URL = `https://${SHOPIFY_STORE_DOMAIN}/api/${STOREFRONT_API_VERSION}/graphql`;

export async function shopifyFetch<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<ShopifyGraphQLResponse<T>> {
  if (!SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    throw new Error(
      'Missing NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN environment variable'
    );
  }

  const response = await fetch(STOREFRONT_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();
  return json as ShopifyGraphQLResponse<T>;
}
