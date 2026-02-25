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

  return (
    <div className="px-4 pb-4">
      <button
        onClick={handleCheckout}
        disabled={!checkoutUrl || isNavigating || items.length === 0}
        className="w-full bg-[#0000C9] text-white py-3 rounded-full font-medium text-sm hover:bg-[#0000AA] transition-colors disabled:bg-[#e7e7e7] disabled:text-[#515151] disabled:cursor-not-allowed"
      >
        {isNavigating ? 'Redirecting...' : 'Continue to Checkout'}
      </button>

      {/* Full-screen overlay to mask the white flash during Shopify redirect */}
      {isNavigating && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center gap-4">
          <svg
            className="animate-spin h-8 w-8 text-[#0000C9]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="text-sm text-[#515151]">Taking you to checkout...</p>
        </div>
      )}
    </div>
  );
}
