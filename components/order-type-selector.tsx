'use client';
import Image from 'next/image';
import { useState } from 'react';
import posthog from 'posthog-js';
import SizeSelection from './purchase/size-selection';

const productImages = [
  'https://cdn.sanity.io/images/e4q6bkl9/production/06b542d7c42f8d13e7ff5eb01c9c6639a4c13cd2-1000x1000.png?w=1200&h=1200&q=100&fit=crop&auto=format',
  'https://cdn.sanity.io/images/e4q6bkl9/production/ca826b382f8e50448263267efcf0921f65b7ee72-1000x1000.png?w=1200&h=1200&q=100&fit=crop&auto=format',
  'https://cdn.sanity.io/images/e4q6bkl9/production/efd7fded0b766b196c98f754708a81eadd664810-4500x6000.jpg?rect=0,210,4500,4500&w=1200&h=1200&q=100&fit=crop&auto=format',
  'https://cdn.sanity.io/images/e4q6bkl9/production/644df5dcb728f049e2cfdfcd49c18334381b6e4d-2048x2048.png?w=1200&h=1200&q=100&fit=crop&auto=format',
  'https://cdn.sanity.io/images/e4q6bkl9/production/3c20c51cd9553fabe021430f158272ac0c097539-2251x2251.png?w=1200&h=1200&q=100&fit=crop&auto=format',
  'https://cdn.sanity.io/images/e4q6bkl9/production/3c20c51cd9553fabe021430f158272ac0c097539-2251x2251.png?w=1200&h=1200&q=100&fit=crop&auto=format',
];

function ImageGallery() {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative w-full aspect-square">
        <Image
          fill
          src={productImages[selectedImage]}
          alt="The Diaper product"
          className="object-cover rounded-md"
        />
      </div>
      <div className="grid grid-cols-6 gap-2">
        {productImages.map((src, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${
              selectedImage === index
                ? 'border-[#0000C9]'
                : 'border-transparent hover:border-gray-300'
            }`}
          >
            <Image
              fill
              src={src}
              alt={`Product thumbnail ${index + 1}`}
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function OrderTypeSelector() {
  return (
    <div className="py-6 px-4">
      <div className="flex flex-col gap-4 max-w-2xl mx-auto">
        <ImageGallery />
        <div>
          <div className="flex flex-col gap-2 text-center mb-6">
            <h4 className="text-2xl font-bold">The Diaper</h4>
            <p className="text-sm text-[#525252] leading-[140%]">
              A fast wicking, highly absorbent diaper with clean ingredients
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <SizeSelection />

            {/* Order Type Selection */}
            <OrderTypeSelection />
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderTypeSelection() {
  const [selectedType, setSelectedType] = useState<'auto-renew' | 'one-time'>(
    'auto-renew'
  );

  const handleOrderTypeSelect = (type: 'auto-renew' | 'one-time') => {
    setSelectedType(type);
    posthog.capture('order_type_selected', {
      order_type: type,
      price: type === 'auto-renew' ? 95.0 : 105.5,
      discount_applied: type === 'auto-renew',
      product_name: 'The Diaper',
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm">Pick your order type:</p>
      </div>

      {/* Order Type Cards */}
      <div className="grid grid-cols-2 gap-4">
        {/* Auto-Renew Card */}
        <button
          onClick={() => handleOrderTypeSelect('auto-renew')}
          className={`relative p-3 rounded-lg border-1 text-left transition-all bg-white ${
            selectedType === 'auto-renew'
              ? 'border-[#0000C9]'
              : 'border-gray-200'
          }`}
        >
          {selectedType === 'auto-renew' && (
            <div className="absolute top-[-24px] left-3 bg-[#0000C9] text-white text-xs font-bold px-2 py-1 rounded">
              SAVE 10%
            </div>
          )}
          <div className="">
            <span className="font-medium mb-2">Auto-Renew</span>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-sm text-[#0000C9]">$95.00</span>
              <span className="text-sm text-[#525252] line-through">
                $105.50
              </span>
            </div>
            <div>
              <p className="text-[#525252] text-sm">
                A months worth of diapers per order, set on autopilot
              </p>
            </div>
          </div>
        </button>

        {/* One-time Card */}
        <button
          onClick={() => handleOrderTypeSelect('one-time')}
          className={`relative p-3 rounded-lg border-1 text-left transition-all bg-white ${
            selectedType === 'one-time' ? 'border-[#0000C9]' : 'border-gray-200'
          }`}
        >
          <div className="">
            <span className="font-medium mb-2">One-time</span>
            <div className="mb-3">
              <span className="text-sm text-[#525252]">$105.50</span>
            </div>
            <div>
              <p className="text-[#525252] text-sm">
                A months worth of diapers per order, set on autopilot
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Add to Cart Button */}
      <button className="w-full bg-[#0000C9] text-white py-3 rounded-full font-medium text-sm hover:bg-[#0000AA] transition-colors">
        Checkout
      </button>
    </div>
  );
}
