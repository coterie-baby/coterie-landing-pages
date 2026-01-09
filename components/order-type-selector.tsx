'use client';
import Image from 'next/image';
import { useState } from 'react';
import posthog from 'posthog-js';

export default function OrderTypeSelector() {
  return (
    <div className="py-6 px-4">
      <div className="flex flex-col gap-4 max-w-2xl mx-auto">
        <div className="relative w-full aspect-square">
          <Image
            fill
            src="https://m.media-amazon.com/images/I/815Q-eQIQkL._AC_SX679_.jpg"
            alt="The Diaper product"
            className="object-cover rounded-md"
          />
        </div>
        <div>
          <div className="flex flex-col gap-2 text-center mb-6">
            <h4 className="text-2xl font-bold">The Diaper</h4>
            <p className="text-sm text-[#525252] leading-[140%]">
              A fast wicking, highly absorbent diaper with clean ingredients
            </p>
          </div>

          {/* Order Type Selection */}
          <OrderTypeSelection />
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
        <p className="">Pick your order type:</p>
      </div>

      {/* Order Type Cards */}
      <div className="grid grid-cols-2 gap-4">
        {/* Auto-Renew Card */}
        <button
          onClick={() => handleOrderTypeSelect('auto-renew')}
          className={`relative p-3 rounded-lg border-1 text-left transition-all ${
            selectedType === 'auto-renew'
              ? 'border-[#0000C9] bg-white'
              : 'border-gray-200 bg-gray-50'
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
          className={`relative p-3 rounded-lg border-1 text-left transition-all ${
            selectedType === 'one-time'
              ? 'border-[#0000C9] bg-white'
              : 'border-gray-200 bg-gray-50'
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
        Add to cart – Size 2
      </button>
    </div>
  );
}

