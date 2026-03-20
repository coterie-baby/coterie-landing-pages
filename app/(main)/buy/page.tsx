import { client } from '@/lib/sanity/client';
import { purchaseFlowSkincareQuery } from '@/lib/sanity/queries';
import PurchaseFlow from '@/components/purchase-flow';
import type { SkincareProduct } from '@/components/purchase-flow';

export const revalidate = 60;

export default async function BuyPage() {
  const skincareProducts = await client.fetch<SkincareProduct[]>(
    purchaseFlowSkincareQuery
  ).catch(() => []) as SkincareProduct[];

  return <PurchaseFlow skincareProducts={skincareProducts ?? []} />;
}
