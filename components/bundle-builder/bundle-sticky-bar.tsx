'use client';

import { useBundleSelector, BabyNameDrawer } from './bundle-selector';
import { Button } from '@/components/ui/button';
import { useCart } from '@/components/cart/cart-context';
import { getDiaperImageUrl } from '@/lib/config/products';
import { trackAddToCart, trackCheckoutError } from '@/lib/gtm/ecommerce';
import { SIZE_CONFIGS } from '@/components/purchase/context';

export default function BundleStickyBar() {
  const {
    selectedSize,
    totalPrice,
    originalTotalPrice,
    totalSavings,
    planType,
    orderType,
    showBabyNameDrawer,
    setShowBabyNameDrawer,
    isLoading,
    setIsLoading,
    error,
    setError,
    setSizeError,
    sizeRef,
    getSizeLabel,
  } = useBundleSelector();

  const cart = useCart();

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      sizeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    setShowBabyNameDrawer(true);
  };

  const handleConfirmBabyName = async (babyName: string) => {
    setShowBabyNameDrawer(false);
    const bundleTitle = babyName ? `${babyName}'s Bundle` : 'The Diaper';
    setIsLoading(true);
    setError(null);
    try {
      trackAddToCart({
        planType,
        size: selectedSize!,
        orderType,
        price: totalPrice,
        quantity: 1,
        location: 'Bundle Builder',
      });
      await cart.addToCart({
        size: selectedSize!,
        displaySize: getSizeLabel(selectedSize!),
        diaperCount: SIZE_CONFIGS[selectedSize!].count,
        planType,
        orderType,
        quantity: 1,
        currentPrice: totalPrice,
        originalPrice: originalTotalPrice,
        savingsAmount: totalSavings,
        title: bundleTitle,
        imageUrl: getDiaperImageUrl(),
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(msg);
      trackCheckoutError(msg, { plan_type: planType, size: selectedSize!, order_type: orderType });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
        <div className="max-w-lg mx-auto px-4 pt-2 pb-3 space-y-2">
          {selectedSize && (
            <div className="flex items-baseline gap-1.5 text-sm">
              <span className="font-bold text-green-600">${totalPrice.toFixed(2)}</span>
              <span className="text-gray-500">
                Comp. Value:{' '}
                <span className="line-through">${originalTotalPrice.toFixed(2)}</span>
              </span>
            </div>
          )}
          {error && <p className="text-xs text-red-500">{error}</p>}
          <Button onClick={handleAddToCart} disabled={isLoading} className="w-full">
            {selectedSize ? (isLoading ? 'Adding...' : 'Add to cart') : 'Build my Bundle'}
          </Button>
        </div>
      </div>
      <BabyNameDrawer
        isOpen={showBabyNameDrawer}
        onConfirm={handleConfirmBabyName}
        onSkip={() => handleConfirmBabyName('')}
      />
    </>
  );
}
