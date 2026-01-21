'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { useProductOrder } from './context';

interface AddToCartButtonProps {
  className?: string;
}

export default function AddToCartButton({ className = '' }: AddToCartButtonProps) {
  const { state, isValid, displaySize, variantId, currentPrice } =
    useProductOrder();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    if (!isValid || !variantId) return;

    setIsLoading(true);

    try {
      // Build cart payload for Shopify
      const cartPayload = {
        variantId,
        quantity: state.quantity,
        size: state.selectedSize,
        plan: state.selectedPlan,
        orderType: state.orderType,
        price: currentPrice,
        // Include subscription info if applicable
        sellingPlan: state.orderType === 'subscription' ? 'subscription-plan-id' : null,
      };

      // TODO: Implement actual Shopify cart addition
      // This could be:
      // 1. Direct Shopify Storefront API call
      // 2. Server action that handles cart logic
      // 3. Redirect to Shopify checkout with pre-filled cart
      console.log('Adding to cart:', cartPayload);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Success - could redirect to cart or show confirmation
      // window.location.href = '/cart';
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Button text based on selection state
  const getButtonText = () => {
    if (isLoading) return 'Adding...';
    if (!state.selectedSize) return 'Select a size';
    return `Add to cart – Size ${displaySize}`;
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={!isValid || isLoading}
      className={`w-full bg-[#0000C9] text-white py-3 rounded-full font-medium text-sm hover:bg-[#0000AA] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed ${className}`}
    >
      {getButtonText()}
    </Button>
  );
}
