'use client';

import { useEffect } from 'react';
import { useCart } from './cart-context';
import CartHeader from './cart-header';
import CartItem from './cart-item';
import CartSummary from './cart-summary';
import CartCheckoutButton from './cart-checkout-button';

export default function CartDrawer() {
  const {
    state,
    pendingLineIds,
    closeCart,
    updateQuantity,
    removeItem,
    itemCount,
    subtotal,
    totalSavings,
    yearlySavingsProjection,
    hasFreeShipping,
  } = useCart();

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (state.isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [state.isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    if (state.isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [state.isOpen, closeCart]);

  if (!state.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-white"
        onClick={closeCart}
      />

      {/* Drawer panel */}
      <div
        className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl animate-slide-in-right flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <CartHeader itemCount={itemCount} onClose={closeCart} />

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {state.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-4 text-center">
              <p className="text-sm text-[#515151]">Your cart is empty</p>
            </div>
          ) : (
            <>
              {/* Cart items */}
              <div className="px-4">
                {state.items.map((item) => (
                  <CartItem
                    key={item.lineId}
                    item={item}
                    isPending={pendingLineIds.includes(item.lineId)}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}
              </div>

              {/* Upsells */}
              {/* <CartUpsellSection onAddProduct={() => {}} /> */}
            </>
          )}
        </div>

        {/* Error message */}
        {state.error && (
          <div className="px-4 py-2">
            <p className="text-xs text-red-600 text-center">{state.error}</p>
          </div>
        )}

        {/* Summary + Checkout (sticky bottom) */}
        {state.items.length > 0 && (
          <div className="border-t border-gray-100">
            <CartSummary
              subtotal={subtotal}
              totalSavings={totalSavings}
              yearlySavingsProjection={yearlySavingsProjection}
              hasFreeShipping={hasFreeShipping}
            />
            <CartCheckoutButton
              checkoutUrl={state.checkoutUrl}
              items={state.items}
              subtotal={subtotal}
            />
          </div>
        )}
      </div>
    </div>
  );
}
