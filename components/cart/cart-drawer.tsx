'use client';

import { useEffect, useState } from 'react';
import { useCart } from './cart-context';
import CartHeader from './cart-header';
import CartItem from './cart-item';
import CartSummary from './cart-summary';
import CartCheckoutButton from './cart-checkout-button';
import { useDiscount } from '@/components/discount-context';

export default function CartDrawer() {
  const {
    state,
    pendingLineIds,
    closeCart,
    updateQuantity,
    removeItem,
    syncOrderType,
    itemCount,
    subtotal,
    totalSavings,
    yearlySavingsProjection,
    hasFreeShipping,
  } = useCart();

  const { discountClaimed, discountPercent } = useDiscount();

  const promoDiscount = discountClaimed
    ? state.items.reduce((sum, item) => {
        if (item.orderType === 'subscription') {
          return sum + Math.round(item.currentPrice * discountPercent * 100) / 100 * item.quantity;
        }
        return sum;
      }, 0)
    : 0;

  // AR toggle — default to true if any cart item is a subscription
  const [isAR, setIsAR] = useState(() =>
    state.items.some((i) => i.orderType === 'subscription')
  );

  // Sync when cart items change (e.g. hydrated from localStorage)
  useEffect(() => {
    if (state.items.length > 0) {
      setIsAR(state.items.some((i) => i.orderType === 'subscription'));
    }
  }, [state.items.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const otpSubtotal = state.items.reduce(
    (sum, item) => sum + item.originalPrice * item.quantity,
    0
  );

  const displaySubtotal = isAR ? subtotal - promoDiscount : otpSubtotal;

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
      <div className="absolute inset-0 bg-white" onClick={closeCart} />

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
              <p className="text-sm text-[#525252]">Your cart is empty</p>
            </div>
          ) : (
            <div className="px-4">
              {state.items.map((item) => {
                const discountedPrice =
                  discountClaimed && item.orderType === 'subscription'
                    ? Math.round(item.currentPrice * (1 - discountPercent) * 100) / 100
                    : undefined;
                return (
                  <CartItem
                    key={item.lineId}
                    item={item}
                    isPending={pendingLineIds.includes(item.lineId)}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                    discountedPrice={discountedPrice}
                    isSubscription={isAR}
                  />
                );
              })}
            </div>
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
          <>
            <CartSummary
              isAR={isAR}
              onToggleAR={(next) => { setIsAR(next); syncOrderType(next); }}
              arSubtotal={subtotal - promoDiscount}
              otpSubtotal={otpSubtotal}
              totalSavings={isAR ? totalSavings : 0}
              yearlySavingsProjection={isAR ? yearlySavingsProjection : 0}
              hasFreeShipping={hasFreeShipping}
              subtotalForShipping={displaySubtotal}
            />
            <CartCheckoutButton
              checkoutUrl={state.checkoutUrl}
              items={state.items}
              subtotal={displaySubtotal}
            />
          </>
        )}
      </div>
    </div>
  );
}
