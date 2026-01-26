'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { useProductOrder } from './context';
import { createCart } from '@/lib/shopify/cart';
import {
  trackAddToCart,
  trackBeginCheckout,
  trackCheckoutError,
} from '@/lib/gtm/ecommerce';

interface AddToCartButtonProps {
  className?: string;
}

export default function AddToCartButton({
  className = '',
}: AddToCartButtonProps) {
  const { state, isValid, currentPrice } = useProductOrder();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddToCart = async () => {
    if (!isValid || !state.selectedSize) return;

    setIsLoading(true);
    setError(null);

    try {
      // Track add_to_cart event
      trackAddToCart({
        planType: state.selectedPlan,
        size: state.selectedSize,
        orderType: state.orderType,
        price: currentPrice,
        quantity: state.quantity,
      });

      // Create Shopify cart
      const result = await createCart({
        size: state.selectedSize,
        planType: state.selectedPlan,
        orderType: state.orderType,
        quantity: state.quantity,
      });

      if (!result.success || !result.checkoutUrl) {
        const errorMessage = result.error || 'Failed to create cart';
        setError(errorMessage);
        trackCheckoutError(errorMessage, {
          plan_type: state.selectedPlan,
          size: state.selectedSize,
          order_type: state.orderType,
        });
        return;
      }

      // Track begin_checkout before redirect
      trackBeginCheckout({
        size: state.selectedSize,
        planType: state.selectedPlan,
        orderType: state.orderType,
        price: currentPrice,
        quantity: state.quantity,
      });

      // Redirect to Shopify checkout
      window.location.href = result.checkoutUrl;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      trackCheckoutError(errorMessage, {
        plan_type: state.selectedPlan,
        size: state.selectedSize,
        order_type: state.orderType,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Button text based on selection state
  // const getButtonText = () => {
  //   if (isLoading) return 'Adding...';
  //   if (!state.selectedSize) return 'Select a size';
  //   return `Add to cart – Size ${displaySize}`;
  // };

  return (
    <div className="w-full">
      <Button
        onClick={handleAddToCart}
        disabled={!isValid || isLoading}
        className={`w-full bg-[#0000C9] text-white py-3 rounded-full font-medium text-sm hover:bg-[#0000AA] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed ${className}`}
      >
        {/* {getButtonText()} */}
        Continue to Checkout
      </Button>
      {error && (
        <p className="mt-2 text-sm text-red-600 text-center">{error}</p>
      )}
    </div>
  );
}
