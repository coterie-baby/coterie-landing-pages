'use client';

import CartUpsellCard, { type UpsellProduct } from './cart-upsell-card';

// Hardcoded upsell products — can be driven by Sanity/Shopify later
const UPSELL_PRODUCTS: UpsellProduct[] = [
  {
    id: 'wipes-4',
    title: 'The Wipe',
    subtitle: '4 packs (224 wipes)',
    price: 33.0,
    imageUrl: '',
  },
  {
    id: 'diaper-cream',
    title: 'The Cream',
    subtitle: 'Diaper rash cream',
    price: 14.0,
    imageUrl: '',
  },
];

interface CartUpsellSectionProps {
  onAddProduct: (product: UpsellProduct) => void;
}

export default function CartUpsellSection({ onAddProduct }: CartUpsellSectionProps) {
  return (
    <div className="px-4 py-4">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
        Complete your routine
      </p>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {UPSELL_PRODUCTS.map((product) => (
          <CartUpsellCard
            key={product.id}
            product={product}
            onAdd={onAddProduct}
          />
        ))}
      </div>
    </div>
  );
}
