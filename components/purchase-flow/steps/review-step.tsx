'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { usePurchaseFlow } from '../context';
import { createCart } from '@/lib/shopify/cart';
import {
  trackAddToCart,
  trackBeginCheckout,
  trackCheckoutError,
} from '@/lib/gtm/ecommerce';

function EditIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
  );
}

function CheckIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={`w-4 h-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

const BENEFITS = [
  'Free shipping on every order',
  'Skip, pause, or cancel anytime',
  '30-day money-back guarantee',
];

export default function ReviewStep() {
  const {
    state,
    setStep,
    prevStep,
    diaperCount,
    diaperPrice,
    wipesPrice,
    totalPrice,
    originalTotalPrice,
    totalSavings,
    selectedWipesConfig,
    planType,
  } = usePurchaseFlow();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSelectedLabel = () => {
    if (!state.selectedSize) return '';
    if (state.selectedSize === 'n') return 'Newborn';
    if (state.selectedSize === 'n+1') return 'N+1 Combo';
    return `Size ${state.selectedSize}`;
  };

  const handleCheckout = async () => {
    if (!state.selectedSize) return;

    setIsLoading(true);
    setError(null);

    try {
      // Track add_to_cart event
      trackAddToCart({
        planType,
        size: state.selectedSize,
        orderType: state.orderType,
        price: totalPrice,
        quantity: 1,
        location: 'Purchase Flow - Review Step',
      });

      // Create Shopify cart
      const result = await createCart({
        size: state.selectedSize,
        planType,
        orderType: state.orderType,
        quantity: 1,
      });

      if (!result.success || !result.checkoutUrl) {
        const errorMessage = result.error || 'Failed to create cart';
        setError(errorMessage);
        trackCheckoutError(errorMessage, {
          plan_type: planType,
          size: state.selectedSize,
          order_type: state.orderType,
        });
        return;
      }

      // Track begin_checkout before redirect
      trackBeginCheckout({
        size: state.selectedSize,
        planType,
        orderType: state.orderType,
        price: totalPrice,
        quantity: 1,
        location: 'Purchase Flow - Review Step',
      });

      // Redirect to Shopify checkout
      window.location.href = result.checkoutUrl;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      trackCheckoutError(errorMessage, {
        plan_type: planType,
        size: state.selectedSize,
        order_type: state.orderType,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col animate-fade-up">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold mb-1">Review Your Bundle</h2>
        <p className="text-sm text-gray-500">Everything look good?</p>
      </div>

      {/* Order Summary */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-6">
        {/* Diaper Item */}
        <div className="p-4 flex items-start gap-4">
          <div className="relative w-16 h-16 flex-shrink-0">
            <Image
              src="https://m.media-amazon.com/images/I/815Q-eQIQkL._AC_SX679_.jpg"
              alt="The Diaper"
              fill
              className="object-cover rounded-xl"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-sm">The Diaper</p>
                <p className="text-xs text-gray-500">{getSelectedLabel()} • {diaperCount} diapers</p>
              </div>
              <button
                onClick={() => setStep('size')}
                className="text-[#0000C9] hover:text-[#0000A0] p-1"
              >
                <EditIcon />
              </button>
            </div>
            <p className="text-sm font-medium mt-1">${diaperPrice.toFixed(2)}</p>
          </div>
        </div>

        {/* Wipes Item (if selected) */}
        {state.selectedWipes !== 'none' && selectedWipesConfig && (
          <>
            <div className="border-t border-gray-100" />
            <div className="p-4 flex items-start gap-4">
              <div className="relative w-16 h-16 flex-shrink-0">
                <Image
                  src="https://cdn.sanity.io/images/e4q6bkl9/production/fafaef923e0bc3fe3a063b06998eba6e567acab9-2048x2048.jpg?w=200&h=200&q=90&fit=crop&auto=format"
                  alt="The Wipe"
                  fill
                  className="object-cover rounded-xl"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-sm">The Wipe</p>
                    <p className="text-xs text-gray-500">{selectedWipesConfig.name} • {selectedWipesConfig.count} wipes</p>
                  </div>
                  <button
                    onClick={() => setStep('bundle')}
                    className="text-[#0000C9] hover:text-[#0000A0] p-1"
                  >
                    <EditIcon />
                  </button>
                </div>
                <p className="text-sm font-medium mt-1">${wipesPrice.toFixed(2)}</p>
              </div>
            </div>
          </>
        )}

        {/* Delivery Schedule */}
        <div className="border-t border-gray-100" />
        <div className="p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
              <span className="text-sm text-gray-600">
                {state.orderType === 'subscription' ? 'Ships monthly' : 'One-time purchase'}
              </span>
            </div>
            <button
              onClick={() => setStep('bundle')}
              className="text-xs text-[#0000C9] font-medium hover:underline"
            >
              Change
            </button>
          </div>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span>${originalTotalPrice.toFixed(2)}</span>
        </div>
        {totalSavings > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-green-600">Auto-Renew Savings</span>
            <span className="text-green-600">-${totalSavings.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="text-green-600">FREE</span>
        </div>
        <div className="border-t border-gray-200 pt-2">
          <div className="flex justify-between">
            <span className="font-semibold">Total</span>
            <div className="text-right">
              <span className="font-semibold text-lg">${totalPrice.toFixed(2)}</span>
              {state.orderType === 'subscription' && (
                <span className="text-sm text-gray-500">/month</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Benefits */}
      {state.orderType === 'subscription' && (
        <div className="bg-[#D1E3FB]/30 rounded-xl p-4 mb-6">
          <p className="text-sm font-medium mb-2">Auto-Renew Benefits</p>
          <div className="space-y-1.5">
            {BENEFITS.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                <CheckIcon className="text-[#0000C9] w-3.5 h-3.5" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={isLoading}
          className="flex-1 border-gray-200"
        >
          Back
        </Button>
        <Button
          onClick={handleCheckout}
          disabled={isLoading || !state.selectedSize}
          className="flex-1 bg-[#0000C9] hover:bg-[#0000A0] disabled:bg-gray-200"
        >
          {isLoading ? 'Processing...' : 'Continue to Checkout'}
        </Button>
      </div>

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
        <span>Secure checkout powered by Shopify</span>
      </div>
    </div>
  );
}
