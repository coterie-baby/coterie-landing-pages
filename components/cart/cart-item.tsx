'use client';

import type { CartItem as CartItemType } from './cart-context';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (lineId: string, quantity: number) => void;
  onRemove: (lineId: string) => void;
}

export default function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) {
  const hasDiscount = item.savingsAmount > 0;

  return (
    <div className="flex gap-3 py-4 border-b border-gray-100">
      {/* Product image */}
      <div className="w-20 h-20 bg-[#F5F5F5] rounded-lg flex-shrink-0 overflow-hidden">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
            No image
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="leading-tight">{item.title}</p>
            {!item.isAddOn && (
              <p className="text-xs text-[#515151] mt-0.5">
                Size {item.displaySize} &middot; {item.diaperCount} diapers
              </p>
            )}
            {/* {item.orderType === 'subscription' && (
              <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-medium bg-[#d1e3fb] text-[#0000C9] rounded-full">
                Subscribe & Save
              </span>
            )} */}
          </div>

          {/* Delete button */}
          <button
            onClick={() => onRemove(item.lineId)}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Remove item"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>

        {/* Price + Quantity */}
        <div className="flex items-center justify-between mt-2">
          {/* Price */}
          <div className="flex items-baseline gap-1.5 text-sm">
            <span className="text-[#0000C9]">
              ${item.currentPrice.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="line-through">
                ${item.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Quantity controls */}
          <div className="flex items-center border border-gray-200 rounded-full">
            <button
              onClick={() =>
                onUpdateQuantity(item.lineId, Math.max(1, item.quantity - 1))
              }
              disabled={item.quantity <= 1}
              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-30"
              aria-label="Decrease quantity"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 12H4"
                />
              </svg>
            </button>
            <span className="w-6 text-center text-xs font-medium">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.lineId, item.quantity + 1)}
              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Increase quantity"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
