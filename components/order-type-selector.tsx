'use client';

import Image from 'next/image';
import { ProductOrderProvider } from './purchase/context';
import SizeSelectionContainer from './purchase/size-selection-container';
import PlanSelector from './purchase/plan-selector';
import AddToCartButton from './purchase/add-to-cart-button';

interface ProductOrderFormProps {
  productImage?: string;
  productTitle?: string;
  productDescription?: string;
  showPlanSelector?: boolean;
}

/**
 * ProductOrderForm - Main form wrapper for product ordering
 *
 * Wraps all order selection components with the ProductOrderProvider context.
 * Supports both simple (size + order type) and bundle (size + plan) configurations.
 */
export default function ProductOrderForm({
  productImage = 'https://m.media-amazon.com/images/I/815Q-eQIQkL._AC_SX679_.jpg',
  productTitle = 'The Diaper',
  productDescription = 'A fast wicking, highly absorbent diaper with clean ingredients',
  showPlanSelector = true,
}: ProductOrderFormProps) {
  return (
    <ProductOrderProvider>
      <div className="py-6 px-4">
        <div className="flex flex-col gap-4 max-w-2xl mx-auto">
          {/* Product Image */}
          <div className="relative w-full aspect-square">
            <Image
              fill
              src={productImage}
              alt={productTitle}
              className="object-cover rounded-md"
            />
          </div>

          {/* Product Info & Form */}
          <div>
            <div className="flex flex-col gap-2 text-center mb-6">
              <h4 className="text-2xl font-bold">{productTitle}</h4>
              <p className="text-sm text-[#525252] leading-[140%]">
                {productDescription}
              </p>
            </div>

            <div className="flex flex-col gap-6">
              {/* Size Selection */}
              <SizeSelectionContainer />

              {/* Plan/Bundle Selection or Order Type */}
              {showPlanSelector ? (
                <PlanSelector />
              ) : (
                <OrderTypeSelection />
              )}

              {/* Add to Cart */}
              <AddToCartButton />
            </div>
          </div>
        </div>
      </div>
    </ProductOrderProvider>
  );
}

/**
 * OrderTypeSelection - Simple subscription/one-time selector
 *
 * Use this when not showing bundle options.
 * For bundle selection, use PlanSelector instead.
 */
import { useProductOrder } from './purchase/context';

function OrderTypeSelection() {
  const { state, setOrderType, currentPrice, originalPrice, savingsPercent } =
    useProductOrder();

  // Only show after size is selected
  if (!state.selectedSize) return null;

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p>Pick your order type:</p>
      </div>

      {/* Order Type Cards */}
      <div className="grid grid-cols-2 gap-4">
        {/* Subscription Card */}
        <button
          onClick={() => setOrderType('subscription')}
          className={`relative p-3 rounded-lg border text-left transition-all ${
            state.orderType === 'subscription'
              ? 'border-[#0000C9] bg-white'
              : 'border-gray-200 bg-gray-50 hover:border-gray-300'
          }`}
        >
          {state.orderType === 'subscription' && savingsPercent > 0 && (
            <div className="absolute top-[-12px] left-3 bg-[#0000C9] text-white text-xs font-bold px-2 py-1 rounded">
              SAVE {savingsPercent}%
            </div>
          )}
          <div>
            <span className="font-medium mb-2">Auto-Renew</span>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-sm text-[#0000C9]">
                ${currentPrice.toFixed(2)}
              </span>
              {originalPrice > currentPrice && (
                <span className="text-sm text-[#525252] line-through">
                  ${originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <div>
              <p className="text-[#525252] text-sm">
                A month&apos;s worth of diapers per order, set on autopilot
              </p>
            </div>
          </div>
        </button>

        {/* One-time Card */}
        <button
          onClick={() => setOrderType('one-time')}
          className={`relative p-3 rounded-lg border text-left transition-all ${
            state.orderType === 'one-time'
              ? 'border-[#0000C9] bg-white'
              : 'border-gray-200 bg-gray-50 hover:border-gray-300'
          }`}
        >
          <div>
            <span className="font-medium mb-2">One-time</span>
            <div className="mb-3">
              <span className="text-sm text-[#525252]">
                ${originalPrice.toFixed(2)}
              </span>
            </div>
            <div>
              <p className="text-[#525252] text-sm">
                A month&apos;s worth of diapers, single purchase
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

// Re-export for backwards compatibility
export { ProductOrderProvider } from './purchase/context';
export { default as SizeSelectionContainer } from './purchase/size-selection-container';
export { default as PlanSelector } from './purchase/plan-selector';
export { default as AddToCartButton } from './purchase/add-to-cart-button';
