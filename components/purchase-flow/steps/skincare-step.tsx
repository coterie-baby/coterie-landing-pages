'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { usePurchaseFlow } from '../context';
import { urlFor } from '@/lib/sanity/image';

export default function SkincareStep() {
  const { skincareProducts, state, toggleSkincare, nextStep, prevStep } = usePurchaseFlow();

  const getProductImageUrl = (index: number) => {
    const item = skincareProducts[index];
    if (!item) return '';
    const imageSource = item.variantImage ?? item.product?.thumbnail;
    if (!imageSource?.asset) return '';
    return urlFor(imageSource).width(200).height(200).fit('crop').url();
  };

  const getProductPrice = (index: number) => {
    const item = skincareProducts[index];
    if (!item) return 0;
    return state.orderType === 'subscription'
      ? (item.product?.pricing?.autoRenew ?? item.product?.pricing?.oneTimePurchase ?? 0)
      : (item.product?.pricing?.oneTimePurchase ?? 0);
  };

  const isSelected = (index: number) => state.selectedSkincareIndices.includes(index);

  if (skincareProducts.length === 0) {
    // No skincare products available — skip the step automatically
    nextStep();
    return null;
  }

  return (
    <div className="flex flex-col animate-fade-up">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold mb-1">Complete your routine</h2>
        <p className="text-sm text-gray-500">Add skincare essentials to your bundle</p>
      </div>

      {/* Product Cards */}
      <div className="space-y-3 mb-6">
        {skincareProducts.map((item, index) => {
          const selected = isSelected(index);
          const imageUrl = getProductImageUrl(index);
          const price = getProductPrice(index);

          return (
            <button
              key={item.product?._id ?? index}
              onClick={() => toggleSkincare(index)}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                selected
                  ? 'border-[#0000C9] bg-blue-50/30'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Checkbox */}
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                    selected ? 'border-[#0000C9] bg-[#0000C9]' : 'border-gray-300'
                  }`}
                >
                  {selected && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>

                {/* Product Image */}
                {imageUrl ? (
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <Image
                      src={imageUrl}
                      alt={item.product?.title ?? 'Skincare product'}
                      fill
                      className="object-cover rounded-xl"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-xl" />
                )}

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{item.product?.title}</p>
                  {price > 0 && (
                    <p className="text-sm text-[#0000C9] font-medium mt-0.5">
                      +${price.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={prevStep}
          className="flex-1 border-gray-200"
        >
          Back
        </Button>
        {state.selectedSkincareIndices.length === 0 ? (
          <Button
            variant="outline"
            onClick={nextStep}
            className="flex-1 border-gray-200"
          >
            Skip
          </Button>
        ) : (
          <Button
            onClick={nextStep}
            className="flex-1 bg-[#0000C9] hover:bg-[#0000A0]"
          >
            Continue
          </Button>
        )}
      </div>
    </div>
  );
}
