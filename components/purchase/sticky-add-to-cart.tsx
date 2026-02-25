'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useProductOrder } from './context';
import { useCart } from '@/components/cart/cart-context';
import { trackAddToCart, trackCheckoutError } from '@/lib/gtm/ecommerce';
import { getDiaperImageUrl } from '@/lib/config/products';

interface StickyAddToCartProps {
  productTitle: string;
  imageUrl: string;
  show: boolean;
}

export default function StickyAddToCart({
  productTitle,
  imageUrl,
  show,
}: StickyAddToCartProps) {
  const {
    state,
    isValid,
    currentPrice,
    originalPrice,
    savingsAmount,
    displaySize,
    diaperCount,
    bundleItems,
    upsellItems,
    selectedUpsellIndices,
    cartImageOverride,
  } = useProductOrder();

  const selectedUpsells = (upsellItems ?? [])
    .filter((_, i) => selectedUpsellIndices.includes(i))
    .filter(
      (
        item
      ): item is typeof item & { shopifyVariantId: string } => {
        if (!item.shopifyVariantId) return false;
        return true;
      }
    )
    .map((item) => ({
      shopifyVariantId: item.shopifyVariantId,
      shopifySellingPlanId: item.shopifySellingPlanId,
      title: item.title,
      imageUrl: item.imageUrl,
      price:
        state.orderType === 'subscription'
          ? (item.subscriptionPrice ?? item.onetimePrice ?? 0)
          : (item.onetimePrice ?? 0),
    }));

  const cart = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const isSubscription = state.orderType === 'subscription';
  const hasDiscount = isSubscription && savingsAmount > 0;

  const handleAddToCart = async () => {
    if (!isValid || !state.selectedSize) return;

    setIsLoading(true);

    try {
      trackAddToCart({
        planType: state.selectedPlan,
        size: state.selectedSize,
        orderType: state.orderType,
        price: currentPrice,
        quantity: state.quantity,
        location: 'Sticky Add to Cart Bar',
      });

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
        title: productTitle,
        imageUrl: cartImageOverride ?? getDiaperImageUrl(),
        bundleItems,
        upsellItems: selectedUpsells.length > 0 ? selectedUpsells : undefined,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unexpected error occurred';
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
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 lg:hidden transition-all duration-500 ease-out ${
        show
          ? 'translate-y-0 opacity-100'
          : 'translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      <div className="bg-white rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)] px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        {/* Product info row */}
        <div className="flex items-center gap-3 mb-3">
          <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={imageUrl}
              alt={productTitle}
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
          <p className="font-bold text-sm text-black leading-tight line-clamp-2">
            {productTitle}
          </p>
        </div>

        {/* CTA button */}
        <button
          onClick={handleAddToCart}
          disabled={!isValid || isLoading}
          className="w-full bg-[#0000C9] text-white py-3 rounded-full font-medium text-sm hover:bg-[#0000AA] transition-colors disabled:bg-[#e7e7e7] disabled:text-[#515151] disabled:opacity-100 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            'Adding...'
          ) : (
            <>
              ADD TO CART –{' '}
              {hasDiscount && (
                <span className="line-through opacity-70 mr-1">
                  ${originalPrice.toFixed(2)}
                </span>
              )}
              ${currentPrice.toFixed(2)} / mo
            </>
          )}
        </button>
      </div>
    </div>
  );
}
