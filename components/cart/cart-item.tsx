'use client';

import { memo } from 'react';
import Image from 'next/image';
import type { CartItem as CartItemType, BundleLineItem } from './cart-context';
import { getCartThumbnailUrl } from '@/lib/image-utils';

interface CartItemProps {
  item: CartItemType;
  isPending?: boolean;
  onUpdateQuantity: (lineId: string, quantity: number) => void;
  onRemove: (lineId: string) => void;
  discountedPrice?: number;
  isSubscription?: boolean;
}

function BundleBreakdown({
  items,
  isSubscription,
}: {
  items: BundleLineItem[];
  isSubscription: boolean;
}) {
  return (
    <div className="pt-3 space-y-2">
      {items.map((item, i) => {
        const price = isSubscription ? item.currentPrice : item.originalPrice;
        const hasDiscount = isSubscription && item.originalPrice > item.currentPrice;
        return (
          <div key={i} className="flex items-center gap-2">
            {item.image ? (
              <div className="relative w-16 h-16 flex-shrink-0 rounded overflow-hidden bg-[#F5F5F5]">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                  unoptimized={item.image.includes('cdn.sanity.io')}
                />
              </div>
            ) : (
              <div className="w-16 h-16 flex-shrink-0 rounded bg-[#F5F5F5]" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-normal leading-[140%] text-[#141414]">{item.name}</p>
              {item.detail && (
                <p className="text-xs font-normal leading-[140%] text-[#525252] mt-0.5">{item.detail}</p>
              )}
            </div>
            <div className="flex items-baseline gap-1 flex-shrink-0">
              {hasDiscount && (
                <span className="line-through text-[#525252] text-xs font-normal leading-[140%]">
                  ${item.originalPrice.toFixed(2)}
                </span>
              )}
              <span className="text-[#141414] text-sm font-normal leading-[140%]">${price.toFixed(2)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const CartItem = memo(function CartItem({
  item,
  isPending,
  onUpdateQuantity,
  onRemove,
  discountedPrice,
  isSubscription = item.orderType === 'subscription',
}: CartItemProps) {
  const hasDiscount =
    (isSubscription && item.savingsAmount > 0) || discountedPrice != null;
  const displayPrice = discountedPrice ?? (isSubscription ? item.currentPrice : item.originalPrice);
  const strikethroughPrice = discountedPrice != null
    ? item.currentPrice
    : isSubscription
    ? item.originalPrice
    : undefined;
  const thumbnailUrl = item.imageUrl ? getCartThumbnailUrl(item.imageUrl) : '';
  const isSanityUrl = item.imageUrl?.includes('cdn.sanity.io');

  return (
    <div
      className={`py-4 transition-opacity${
        item.isBundleBuilder && item.bundleLineItems?.length ? '' : ' border-b border-gray-100'
      }${isPending ? ' opacity-60 pointer-events-none' : ''}`}
    >
      <div className="flex gap-3">
        {/* Product image */}
        <div className="relative w-[81px] h-[81px] bg-[#F5F5F5] rounded-lg flex-shrink-0 overflow-hidden">
          {item.imageUrl ? (
            <Image
              src={thumbnailUrl}
              alt={item.title}
              fill
              sizes="80px"
              className="object-cover"
              loading="eager"
              {...(isSanityUrl ? { unoptimized: true } : {})}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
              No image
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="leading-tight text-sm">{item.title}</p>
              {!item.isAddOn && !item.isBundleBuilder && (
                <p className="text-xs text-[#525252] mt-0.5">
                  Size {item.displaySize} &middot; {item.diaperCount} diapers
                </p>
              )}
            </div>

            {/* Delete button */}
            <button
              onClick={() => onRemove(item.lineId)}
              className="p-1 transition-opacity hover:opacity-60"
              aria-label="Remove item"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M13.59 3.67001H10.66V2.39001C10.66 1.98001 10.33 1.64001 9.93998 1.64001H6.06998C5.66998 1.64001 5.33998 1.97001 5.33998 2.39001V3.67001H2.41998C2.27998 3.67001 2.16998 3.78001 2.16998 3.92001C2.16998 4.06001 2.27998 4.17001 2.41998 4.17001H3.19998L3.92998 14.13C3.92998 14.26 4.04998 14.36 4.17998 14.36H11.83C11.96 14.36 12.07 14.26 12.08 14.13L12.81 4.17001H13.59C13.73 4.17001 13.84 4.06001 13.84 3.92001C13.84 3.78001 13.73 3.67001 13.59 3.67001ZM5.83998 2.39001C5.83998 2.26001 5.93998 2.14001 6.06998 2.14001H9.93998C10.06 2.14001 10.16 2.25001 10.16 2.39001V3.67001H5.83998V2.39001ZM11.59 13.86H4.39998L3.68998 4.17001H12.29L11.58 13.86H11.59Z" fill="#141414"/>
                <path d="M8 11.86C8.14 11.86 8.25 11.75 8.25 11.61V6.41998C8.25 6.27998 8.14 6.16998 8 6.16998C7.86 6.16998 7.75 6.27998 7.75 6.41998V11.61C7.75 11.75 7.86 11.86 8 11.86Z" fill="#141414"/>
                <path d="M5.88 11.86C6.02 11.86 6.13 11.75 6.13 11.61V6.41998C6.13 6.27998 6.02 6.16998 5.88 6.16998C5.74 6.16998 5.63 6.27998 5.63 6.41998V11.61C5.63 11.75 5.74 11.86 5.88 11.86Z" fill="#141414"/>
                <path d="M10.12 11.86C10.26 11.86 10.37 11.75 10.37 11.61V6.41998C10.37 6.27998 10.26 6.16998 10.12 6.16998C9.98 6.16998 9.87 6.27998 9.87 6.41998V11.61C9.87 11.75 9.98 11.86 10.12 11.86Z" fill="#141414"/>
              </svg>
            </button>
          </div>

          {/* Quantity + Price */}
          <div className="flex items-center justify-between">
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
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="w-6 text-center text-xs font-medium">{item.quantity}</span>
              <button
                onClick={() => onUpdateQuantity(item.lineId, item.quantity + 1)}
                className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Increase quantity"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>

            <div className="flex items-baseline gap-1.5 text-sm">
              {hasDiscount && strikethroughPrice != null && (
                <span className="line-through text-[#525252] text-xs font-normal leading-[140%]">
                  ${strikethroughPrice.toFixed(2)}
                </span>
              )}
              <span className="text-[#141414] text-sm font-semibold leading-[140%]">${displayPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bundle breakdown */}
      {item.isBundleBuilder && item.bundleLineItems && item.bundleLineItems.length > 0 && (
        <div className="border-t border-gray-100 mt-3">
          <BundleBreakdown items={item.bundleLineItems} isSubscription={isSubscription} />
        </div>
      )}
    </div>
  );
});

export default CartItem;
