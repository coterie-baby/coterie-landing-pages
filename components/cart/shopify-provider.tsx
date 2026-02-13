'use client';

import { ShopifyProvider } from '@shopify/hydrogen-react';

const rawDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'staging-shop.coterie.com';
const storeDomain = rawDomain.startsWith('https://') ? rawDomain : `https://${rawDomain}`;
const storefrontToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';
const storefrontApiVersion = '2025-10';

export default function ShopifyProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ShopifyProvider
      storeDomain={storeDomain}
      storefrontToken={storefrontToken}
      storefrontApiVersion={storefrontApiVersion}
      countryIsoCode="US"
      languageIsoCode="EN"
    >
      {children}
    </ShopifyProvider>
  );
}
