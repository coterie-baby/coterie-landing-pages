'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { useProductOrder } from './context';
import { useCart } from '@/components/cart/cart-context';
import {
  trackAddToCart,
  trackCheckoutError,
} from '@/lib/gtm/ecommerce';
import { getDiaperImageUrl } from '@/lib/config/products';

interface AddToCartButtonProps {
  className?: string;
  title?: string;
}

export default function AddToCartButton({
  className = '',
  title = 'The Diaper',
}: AddToCartButtonProps) {
  const { state, isValid, currentPrice, originalPrice, savingsAmount, displaySize, diaperCount, bundleItems, upsellItems, selectedUpsellIndices, cartImageOverride } = useProductOrder();

  const selectedUpsells = (upsellItems ?? [])
    .filter((_, i) => selectedUpsellIndices.includes(i))
    .filter((item): item is typeof item & { shopifyVariantId: string } => {
      if (!item.shopifyVariantId) {
        console.warn('[AddToCartButton] Upsell item dropped — missing shopifyVariantId:', item.title);
        return false;
      }
      return true;
    })
    .map((item) => ({
      shopifyVariantId: item.shopifyVariantId,
      shopifySellingPlanId: item.shopifySellingPlanId,
      title: item.title,
      imageUrl: item.imageUrl,
      price: state.orderType === 'subscription'
        ? (item.subscriptionPrice ?? item.onetimePrice ?? 0)
        : (item.onetimePrice ?? 0),
    }));
  const cart = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddToCart = async () => {
    if (!isValid || !state.selectedSize) return;

    setIsLoading(true);
    setError(null);

    try {
      // Track add_to_cart event (non-blocking)
      trackAddToCart({
        planType: state.selectedPlan,
        size: state.selectedSize,
        orderType: state.orderType,
        price: currentPrice,
        quantity: state.quantity,
        location: 'LP Purchase Component',
      });

      // Add to cart context (creates or adds to Shopify cart, opens drawer)
      await cart.addToCart({
        size: state.selectedSize,
        displaySize,
        diaperCount,
        planType: state.selectedPlan,
        orderType: state.orderType,
        quantity: state.quantity,
        currentPrice,
        originalPrice,
        savingsAmount,
        title,
        imageUrl: cartImageOverride ?? getDiaperImageUrl(),
        bundleItems,
        upsellItems: selectedUpsells.length > 0 ? selectedUpsells : undefined,
      });
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

  return (
    <div className="w-full">
      <Button
        onClick={handleAddToCart}
        disabled={!isValid || isLoading}
        className={`w-full bg-[#0000C9] text-white py-3 rounded-full font-medium text-sm hover:bg-[#0000AA] transition-colors disabled:bg-[#e7e7e7] disabled:text-[#515151] disabled:opacity-100 disabled:cursor-not-allowed ${className}`}
      >
        {isLoading ? 'Adding...' : 'Add to Cart'}
      </Button>
      {error && (
        <p className="mt-2 text-sm text-red-600 text-center">{error}</p>
      )}
    </div>
  );
}
