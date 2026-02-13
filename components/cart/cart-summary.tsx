'use client';

import CartShippingBar from './cart-shipping-bar';

interface CartSummaryProps {
  subtotal: number;
  totalSavings: number;
  yearlySavingsProjection: number;
  hasFreeShipping: boolean;
}

export default function CartSummary({
  subtotal,
  totalSavings,
  yearlySavingsProjection,
  hasFreeShipping,
}: CartSummaryProps) {
  return (
    <div className="px-4 py-3 space-y-2">
      <CartShippingBar subtotal={subtotal} hasFreeShipping={hasFreeShipping} />
      <div>
        {totalSavings > 0 && (
          <div className="flex items-center justify-between text-xs text-[#515151]">
            <span className="">Saved</span>
            <div className="flex gap-2">
              {yearlySavingsProjection > 0 && (
                <span className="text-gray-500">
                  Thats ${yearlySavingsProjection.toFixed(0)}/yr
                </span>
              )}
              <span className="text-[#0000c9]">${totalSavings.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Subtotal</span>
        <span className="text-sm font-medium">${subtotal.toFixed(2)}</span>
      </div>
      <p className="text-[11px] text-gray-500">
        Shipping & taxes calculated at checkout
      </p>
    </div>
  );
}
