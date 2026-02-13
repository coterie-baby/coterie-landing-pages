'use client';
import { useState } from 'react';
import { trackBeginCheckout } from '@/lib/gtm/ecommerce';
import type { CartItem } from './cart-context';

interface CartCheckoutButtonProps {
  checkoutUrl: string | null;
  items: CartItem[];
  subtotal: number;
}

export default function CartCheckoutButton({
  checkoutUrl,
  items,
  subtotal,
}: CartCheckoutButtonProps) {
  const [isNavigating, setIsNavigating] = useState(false);

  const handleCheckout = () => {
    if (!checkoutUrl) return;

    setIsNavigating(true);

    // Fire begin_checkout for each item (using first item's data for the aggregate event)
    const firstItem = items[0];
    if (firstItem) {
      trackBeginCheckout({
        size: firstItem.size,
        planType: firstItem.planType,
        orderType: firstItem.orderType,
        price: subtotal,
        quantity: items.reduce((sum, i) => sum + i.quantity, 0),
        location: 'Cart Drawer',
      });
    }

    window.location.href = checkoutUrl;
  };

  // const variantIds = items.flatMap((item) =>
  //   Array.from({ length: item.quantity }, () => item.merchandiseId)
  // );

  return (
    <div className="px-4 pb-4">
      <button
        onClick={handleCheckout}
        disabled={!checkoutUrl || isNavigating || items.length === 0}
        className="w-full bg-[#0000C9] text-white py-3 rounded-full font-medium text-sm hover:bg-[#0000AA] transition-colors disabled:bg-[#e7e7e7] disabled:text-[#515151] disabled:cursor-not-allowed"
      >
        {isNavigating ? 'Redirecting...' : 'Continue to Checkout'}
      </button>
      {/* {checkoutUrl && items.length > 0 && (
        <>
          <div className="flex items-center gap-3 my-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 uppercase">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <ShopPayButton
            variantIds={variantIds}
            className="w-full"
          />
        </>
      )} */}
    </div>
  );
}
