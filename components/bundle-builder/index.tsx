'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import {
  DiaperSize,
  PLAN_CONFIGS,
  DISPLAY_SIZES,
  SIZE_CONFIGS,
} from '@/components/purchase/context';
import type { SizeOption } from '@/components/purchase/context';
import PianoKey from '@/components/purchase/piano-key';
import SizeFitGuideDrawer from '@/components/purchase/size-fit-guide-drawer';
import { Button } from '@/components/ui/button';
import { useCart } from '@/components/cart/cart-context';
import { getDiaperImageUrl } from '@/lib/config/products';
import {
  trackAddToCart,
  trackCheckoutError,
} from '@/lib/gtm/ecommerce';

type WipesSelection = 'the-wipe' | 'the-soft-wipe' | 'none' | null;
type OrderType = 'subscription' | 'one-time';

interface WipesProduct {
  id: 'the-wipe' | 'the-soft-wipe';
  name: string;
  description: string;
  count: number;
  basePrice: number;
  subscriptionPrice: number;
  image: string;
  badge?: string;
}

const WIPES_PRODUCTS: WipesProduct[] = [
  {
    id: 'the-wipe',
    name: 'The Wipe',
    description: 'Our classic, ultra-soft wipe for everyday use',
    count: 224,
    basePrice: 33,
    subscriptionPrice: 28,
    image:
      'https://cdn.sanity.io/images/e4q6bkl9/production/8e47d12b67b1a511fd8011809ef4a0b017a1679a-1920x2400.png',
    badge: 'Most Popular',
  },
  {
    id: 'the-soft-wipe',
    name: 'The Soft Wipe',
    description: 'Extra gentle formula for sensitive skin',
    count: 224,
    basePrice: 33,
    subscriptionPrice: 28,
    image:
      'https://cdn.sanity.io/images/e4q6bkl9/production/2efc22da90edbd361a2b1fa39fd32c76ab9c90f1-1920x2400.png',
  },
];

// -- Hardcoded skincare placeholders --

interface SkincareItem {
  id: string;
  name: string;
  description: string;
  subPrice: number;
  otpPrice: number;
  bgClass: string;
  image?: string;
}

const SKINCARE_ITEMS: SkincareItem[] = [
  {
    id: 'first-wash',
    name: 'First Wash',
    description: 'Tear-free hair + body wash for a gentle cleanse',
    subPrice: 14.0,
    otpPrice: 16.0,
    bgClass: 'bg-sky-50',
    image: 'https://cdn.sanity.io/images/e4q6bkl9/production/3fc74efb5fcc16d6aad0a15782c67bcdb8ee2873-3390x3390.jpg', 
  },
  {
    id: 'soft-cream',
    name: 'Soft Cream',
    description: 'Face + body moisturizer for up to 24-hr hydration',
    subPrice: 14.0,
    otpPrice: 16.0,
    bgClass: 'bg-amber-50',
    image: 'https://cdn.sanity.io/images/e4q6bkl9/production/576070920de4d78aa3ab57fafda90e461e910ee1-3390x3390.jpg'
  },
  {
    id: 'bun-balm',
    name: 'Bun Balm',
    description: 'Diaper + dry skin ointment for skin barrier support',
    subPrice: 12.0,
    otpPrice: 14.0,
    bgClass: 'bg-emerald-50',
    image: 'https://cdn.sanity.io/images/e4q6bkl9/production/28ead0f676c048788e047c876189be9e80ff2a06-3390x3390.jpg'
  },
];

// -- Icons --

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-5 h-5 transition-transform ${open ? 'rotate-180' : ''}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

// function TruckIcon() {
//   return (
//     <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
//       <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
//     </svg>
//   );
// }

function CheckCircle() {
  return (
    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

// -- Newborn Modal --

function NewbornModal({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (option: 'n' | 'n+1') => void;
}) {
  const [tempSelection, setTempSelection] = useState<'n' | 'n+1' | null>(null);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl max-w-[343px] w-full mx-4 p-[26px]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <p className="text-lg text-gray-900 mb-2">Shopping for a newborn?</p>
        <p className="text-xs text-gray-600 mb-2">
          Choose between Newborn only or a combination of Size N and 1:
        </p>
        <div className="space-y-3">
          {(
            [
              { id: 'n' as const, label: 'Newborn only', desc: '6 packs of Size N' },
              { id: 'n+1' as const, label: 'N+1', desc: 'Combo pack' },
            ] as const
          ).map((opt) => (
            <button
              key={opt.id}
              onClick={() => setTempSelection(opt.id)}
              className={`w-full flex items-center gap-4 p-4 py-2 rounded-lg border transition-all ${
                tempSelection === opt.id
                  ? 'border-[#0000C9] bg-blue-50/30'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                  tempSelection === opt.id ? 'border-[#0000C9]' : 'border-gray-300'
                }`}
              >
                {tempSelection === opt.id && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#0000C9]" />
                )}
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-gray-900">{opt.label}</div>
                <div className="text-xs text-gray-500">{opt.desc}</div>
              </div>
            </button>
          ))}
        </div>
        <button
          onClick={() => tempSelection && onConfirm(tempSelection)}
          disabled={!tempSelection}
          className="w-full mt-3 py-3 rounded-full bg-[#0000C9] text-white font-medium text-sm disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}

// -- Bundle Items Sheet --

// function BundleItemsSheet({
//   isOpen,
//   onClose,
//   selectedSize,
//   selectedWipes,
//   selectedSkincareIndices,
//   orderType,
//   diaperPrice,
//   wipesPrice,
//   totalPrice,
//   originalTotalPrice,
//   onCheckout,
//   isLoading,
// }: {
//   isOpen: boolean;
//   onClose: () => void;
//   selectedSize: DiaperSize | null;
//   selectedWipes: WipesSelection;
//   selectedSkincareIndices: number[];
//   orderType: OrderType;
//   diaperPrice: number;
//   wipesPrice: number;
//   totalPrice: number;
//   originalTotalPrice: number;
//   onCheckout: () => void;
//   isLoading: boolean;
// }) {
//   const wipesConfig = selectedWipes ? WIPES_PRODUCTS.find((w) => w.id === selectedWipes) : null;

//   const getSizeLabel = (size: DiaperSize) => {
//     if (size === 'n') return 'Newborn';
//     if (size === 'n+1') return 'N+1 Combo';
//     return `Size ${size}`;
//   };

//   return (
//     <>
//       {isOpen && <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />}
//       <div
//         className={`fixed left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl max-h-[70vh] overflow-y-auto transition-transform duration-300 ${
//           isOpen ? 'translate-y-0' : 'translate-y-full'
//         }`}
//         style={{ bottom: '96px' }}
//       >
//         {/* Drag handle */}
//         <div className="flex justify-center pt-3 pb-1">
//           <div className="w-8 h-1 bg-gray-300 rounded-full" />
//         </div>

//         <div className="px-4 pb-4 pt-2">
//           <div className="space-y-3">
//             {selectedSize && (
//               <div className="flex items-center gap-3">
//                 <div className="relative w-12 h-12 flex-shrink-0">
//                   <Image
//                     src="https://m.media-amazon.com/images/I/815Q-eQIQkL._AC_SX679_.jpg"
//                     alt="The Diaper"
//                     fill
//                     className="object-cover rounded-lg"
//                   />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <p className="text-sm font-medium">The Diaper — {getSizeLabel(selectedSize)}</p>
//                   <p className="text-xs text-gray-500">{SIZE_CONFIGS[selectedSize].count} diapers/delivery</p>
//                 </div>
//                 <p className="text-sm font-semibold text-[#0000C9]">${diaperPrice.toFixed(2)}</p>
//               </div>
//             )}

//             {selectedWipes && selectedWipes !== 'none' && wipesConfig && (
//               <div className="flex items-center gap-3">
//                 <div className="relative w-12 h-12 flex-shrink-0">
//                   <Image
//                     src="https://cdn.sanity.io/images/e4q6bkl9/production/fafaef923e0bc3fe3a063b06998eba6e567acab9-2048x2048.jpg?w=200&h=200&q=90&fit=crop&auto=format"
//                     alt="The Wipe"
//                     fill
//                     className="object-cover rounded-lg"
//                   />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <p className="text-sm font-medium">{wipesConfig.name}</p>
//                   <p className="text-xs text-gray-500">{wipesConfig.count} wipes</p>
//                 </div>
//                 <p className="text-sm font-semibold text-[#0000C9]">${wipesPrice.toFixed(2)}</p>
//               </div>
//             )}

//             {selectedSkincareIndices.map((idx) => {
//               const item = SKINCARE_ITEMS[idx];
//               if (!item) return null;
//               const price = orderType === 'subscription' ? item.subPrice : item.otpPrice;
//               return (
//                 <div key={item.id} className="flex items-center gap-3">
//                   <div className={`w-12 h-12 flex-shrink-0 rounded-lg ${item.bgClass}`} />
//                   <div className="flex-1 min-w-0">
//                     <p className="text-sm font-medium">{item.name}</p>
//                   </div>
//                   <p className="text-sm font-semibold text-[#0000C9]">${price.toFixed(2)}</p>
//                 </div>
//               );
//             })}

//             {!selectedSize && (
//               <p className="text-sm text-gray-400 text-center py-2">No items selected yet</p>
//             )}
//           </div>

//           <div className="border-t border-gray-100 mt-4 pt-4 flex items-center justify-between">
//             <span className="font-semibold">Total</span>
//             <div className="flex items-baseline gap-2">
//               <span className="font-bold text-lg">${totalPrice.toFixed(2)}</span>
//               {orderType === 'subscription' && <span className="text-sm text-gray-500">/mo</span>}
//               {originalTotalPrice > totalPrice && (
//                 <span className="text-sm text-gray-400 line-through">${originalTotalPrice.toFixed(2)}</span>
//               )}
//             </div>
//           </div>

//           <Button
//             onClick={onCheckout}
//             disabled={isLoading}
//             className="w-full mt-4"
//           >
//             {isLoading ? 'Adding...' : 'Add to cart'}
//           </Button>
//         </div>
//       </div>
//     </>
//   );
// }

// -- Wipes Card --

function WipesCard({
  product,
  isSelected,
  onClick,
  orderType,
}: {
  product: WipesProduct;
  isSelected: boolean;
  onClick: () => void;
  orderType: OrderType;
}) {
  const price = orderType === 'subscription' ? product.subscriptionPrice : product.basePrice;

  return (
    <button
      onClick={onClick}
      className={`rounded-2xl border overflow-hidden text-left transition-all w-full ${
        isSelected ? 'border-[#0000C9] shadow-sm' : 'border-[#E0E0E0] hover:border-gray-300'
      }`}
    >
      <div className="relative aspect-square bg-gray-50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 300px"
        />
        {product.badge && (
          <div className="absolute top-2 left-2 bg-[#0000C9] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
            {product.badge}
          </div>
        )}
        {isSelected && (
          <div className="absolute top-2 right-2 w-6 h-6 bg-[#0000C9] rounded-full flex items-center justify-center">
            <CheckCircle />
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="font-semibold text-gray-900 text-sm leading-tight mb-1">{product.name}</p>
        <p className="text-xs text-gray-500 mb-1">{product.description}</p>
        <p className="text-xs text-gray-500 mb-2">4-pack · {product.count} wipes</p>
        <p className="text-sm font-bold text-[#0000C9]">
          +${price.toFixed(2)}
          {orderType === 'subscription' && <span className="font-normal text-xs">/mo</span>}
        </p>
      </div>
    </button>
  );
}

// -- Skincare Card --

function SkincareCard({
  item,
  isSelected,
  onClick,
  orderType,
}: {
  item: SkincareItem;
  isSelected: boolean;
  onClick: () => void;
  orderType: OrderType;
}) {
  const price = orderType === 'subscription' ? item.subPrice : item.otpPrice;
  // const savings = item.otpPrice - item.subPrice;

  return (
    <button
      onClick={onClick}
      className={`rounded-2xl border overflow-hidden text-left transition-all w-full ${
        isSelected ? 'border-[#0000C9] shadow-sm' : 'border-[#E0E0E0] hover:border-gray-300'
      }`}
    >
      <div className={`relative aspect-square ${item.bgClass}`}>
        {item.image ? (
          <Image src={item.image} alt={item.name} fill className="object-cover" sizes="(max-width: 768px) 50vw, 300px" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl opacity-20 select-none">✦</span>
          </div>
        )}
        {isSelected && (
          <div className="absolute top-2 right-2 w-6 h-6 bg-[#0000C9] rounded-full flex items-center justify-center">
            <CheckCircle />
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="font-semibold text-gray-900 text-sm leading-tight mb-1">{item.name}</p>
        <p className="text-xs text-gray-500 mb-2">{item.description}</p>
        <p className="text-sm font-bold text-[#0000C9]">
          +${price.toFixed(2)}
          {orderType === 'subscription' && <span className="font-normal text-xs">/mo</span>}
        </p>
        {/* {orderType === 'subscription' && savings > 0 && (
          <p className="text-xs text-gray-400 mt-0.5">
            Comp. Value: <span className="line-through">${item.otpPrice.toFixed(2)}</span>
          </p>
        )} */}
      </div>
    </button>
  );
}

// -- Benefit Tile --

function BenefitTile({ icon, title, subtitle }: { icon: string; title: string; subtitle?: string }) {
  return (
    <div className='aspect-square bg-[#F5F5F5] flex flex-col items-center justify-center gap-4 px-4 rounded-xl'>
      <div className='relative w-10 h-10'>
        <Image src={icon} alt='' fill />
      </div>
      <div className='flex flex-col text-center'>
        <span className=''>{title}</span>
        {subtitle && <span className='text-xs'>{subtitle}</span>}
      </div>
    </div>
  );
}

// -- Section Header --

function SectionHeader({
  step,
  title,
  label,
  isOpen,
  isDone,
  onClick,
}: {
  step: number;
  title: string;
  label: string;
  isOpen: boolean;
  isDone: boolean;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-between py-4">
      <p className="text-base text-left">
        <span className="font-semibold">Step {step}:</span>{' '}
        <span className="">{title}</span>
      </p>
      <div
        className={`flex items-center gap-1.5 text-xs font-medium shrink-0 ml-2 ${
          isDone ? 'text-[#0000C9]' : 'text-gray-500'
        }`}
      >
        <span>{isDone ? 'Selected' : label}</span>
        <ChevronIcon open={isOpen} />
      </div>
    </button>
  );
}

// -- Bundle Summary --

function BundleSummary({
  selectedSize,
  selectedWipes,
  selectedSkincareIndices,
  orderType,
  diaperPrice,
  wipesPrice,
  totalPrice,
  originalTotalPrice,
  totalSavings,
  isLoading,
  error,
  onCheckout,
}: {
  selectedSize: DiaperSize | null;
  selectedWipes: WipesSelection;
  selectedSkincareIndices: number[];
  orderType: OrderType;
  diaperPrice: number;
  wipesPrice: number;
  totalPrice: number;
  originalTotalPrice: number;
  totalSavings: number;
  isLoading: boolean;
  error: string | null;
  onCheckout: () => void;
}) {
  const [showItems, setShowItems] = useState(false);

  const wipesConfig =
    selectedWipes && selectedWipes !== 'none'
      ? WIPES_PRODUCTS.find((w) => w.id === selectedWipes)
      : null;

  const getSizeLabel = (size: DiaperSize) => {
    if (size === 'n') return 'Newborn';
    if (size === 'n+1') return 'N+1 Combo';
    return `Size ${size}`;
  };

  const itemCount =
    (selectedSize ? 1 : 0) +
    (wipesConfig ? 1 : 0) +
    selectedSkincareIndices.length;

  const savingsPercent =
    originalTotalPrice > 0
      ? Math.round((totalSavings / originalTotalPrice) * 100)
      : 0;

  return (
    <div className="bg-[#F9F4EC] py-10">
      <div className="max-w-lg mx-auto px-4">
      {/* Tagline + Headline */}
      <div className="text-center mb-6">
        <p className="text-sm text-gray-400 mb-2">Your new Coterie bundle awaits.</p>
        <p className="text-3xl font-bold text-[#001A6E] leading-tight">
          Designed for babies.
          <br />
          Built by you.
        </p>
      </div>

      {/* Hero Image */}
      <div className="relative h-[280px] rounded-2xl overflow-hidden mb-6">
        <Image
          src="https://cdn.sanity.io/images/e4q6bkl9/production/ec5a384428110d9ddc4b1445fdfdb118d4beb658-6720x4480.png?w=800&q=80&auto=format"
          alt="Coterie diapers"
          fill
          className="object-cover"
          sizes="(max-width: 512px) 100vw, 512px"
        />
      </div>

      {/* Bundle Summary Card */}
      <div className="border border-gray-200 rounded-2xl overflow-hidden">
        {/* Header row */}
        <button
          onClick={() => setShowItems((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-4"
        >
          <span className="font-semibold text-gray-900">
            Your bundle{' '}
            <span className="font-normal text-gray-500">({itemCount} items)</span>
          </span>
          <span className="flex items-center gap-1 text-sm text-gray-600">
            Show your bundle items
            <ChevronIcon open={showItems} />
          </span>
        </button>

        {/* Expanded items list */}
        {showItems && itemCount > 0 && (
          <div className="border-t border-gray-100 px-4 py-3 space-y-3">
            {selectedSize && (
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 flex-shrink-0">
                  <Image
                    src="https://m.media-amazon.com/images/I/815Q-eQIQkL._AC_SX679_.jpg"
                    alt="The Diaper"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    The Diaper — {getSizeLabel(selectedSize)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {SIZE_CONFIGS[selectedSize].count} diapers/delivery
                  </p>
                </div>
                <p className="text-sm font-semibold">${diaperPrice.toFixed(2)}</p>
              </div>
            )}

            {wipesConfig && (
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 flex-shrink-0">
                  <Image
                    src="https://cdn.sanity.io/images/e4q6bkl9/production/fafaef923e0bc3fe3a063b06998eba6e567acab9-2048x2048.jpg?w=200&h=200&q=90&fit=crop&auto=format"
                    alt="The Wipe"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{wipesConfig.name}</p>
                  <p className="text-xs text-gray-500">{wipesConfig.count} wipes</p>
                </div>
                <p className="text-sm font-semibold">${wipesPrice.toFixed(2)}</p>
              </div>
            )}

            {selectedSkincareIndices.map((idx) => {
              const item = SKINCARE_ITEMS[idx];
              if (!item) return null;
              const price = orderType === 'subscription' ? item.subPrice : item.otpPrice;
              return (
                <div key={item.id} className="flex items-center gap-3">
                  <div className={`w-12 h-12 flex-shrink-0 rounded-lg ${item.bgClass}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  </div>
                  <p className="text-sm font-semibold">${price.toFixed(2)}</p>
                </div>
              );
            })}
          </div>
        )}

        <div className="border-t border-gray-200" />

        {/* Pricing rows */}
        <div className="px-4 py-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5 text-gray-600">
              Comp. Value
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                />
              </svg>
            </span>
            <span className="text-gray-600">${originalTotalPrice.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-gray-900">Bundle Savings</span>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">-${totalSavings.toFixed(2)}</span>
              {savingsPercent > 0 && (
                <span className="bg-[#1B5E50] text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
                  {savingsPercent}% OFF
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-gray-900">Shipping</span>
            <span className="text-gray-500">Free</span>
          </div>

          <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
            <span className="font-semibold text-gray-900">Total</span>
            <span className="font-semibold text-gray-900">${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <Button
        onClick={onCheckout}
        disabled={isLoading}
        className="w-full mt-4 bg-[#0000C9] hover:bg-[#0000A0]"
      >
        {isLoading ? 'Processing...' : 'Add to cart'}
      </Button>
      </div>
    </div>
  );
}

// -- Main Component --

export default function BundleBuilder() {
  const cart = useCart();
  const [selectedSize, setSelectedSize] = useState<DiaperSize | null>(null);
  const [selectedWipes, setSelectedWipes] = useState<WipesSelection>(null);
  const [selectedSkincareIndices, setSelectedSkincareIndices] = useState<number[]>([]);
  const [orderType] = useState<OrderType>('subscription');
  const [wipesOpen, setWipesOpen] = useState(false);
  const [skincareOpen, setSkincareOpen] = useState(false);

  const [showNewbornModal, setShowNewbornModal] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);

  const wipesRef = useRef<HTMLDivElement>(null);
  const skincareRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef<HTMLDivElement>(null);

  // Piano key sizes — dynamic label for newborn key
  const getNewbornLabel = (): string => {
    if (selectedSize === 'n') return 'N';
    if (selectedSize === 'n+1') return 'N+1';
    return 'N or N+1';
  };
  const pianoKeySizes: SizeOption[] = [
    { id: 'n-or-n1', label: getNewbornLabel(), weightRange: 'Under 10 lbs' },
    ...DISPLAY_SIZES.slice(1),
  ];
  const isNewbornSelected = selectedSize === 'n' || selectedSize === 'n+1';

  // Pricing
  const diaperPlanConfig = PLAN_CONFIGS.find((p) => p.id === 'diaper-only')!;
  const diaperPrice =
    orderType === 'subscription' ? diaperPlanConfig.subscriptionPrice : diaperPlanConfig.basePrice;
  const originalDiaperPrice = diaperPlanConfig.basePrice;

  const wipesConfig = selectedWipes ? WIPES_PRODUCTS.find((w) => w.id === selectedWipes) : null;
  const wipesPrice = wipesConfig
    ? orderType === 'subscription'
      ? wipesConfig.subscriptionPrice
      : wipesConfig.basePrice
    : 0;
  const originalWipesPrice = wipesConfig?.basePrice ?? 0;

  const skincarePrice = selectedSkincareIndices.reduce((sum, idx) => {
    const item = SKINCARE_ITEMS[idx];
    return sum + (item ? (orderType === 'subscription' ? item.subPrice : item.otpPrice) : 0);
  }, 0);
  const originalSkincarePrice = selectedSkincareIndices.reduce(
    (sum, idx) => sum + (SKINCARE_ITEMS[idx]?.otpPrice ?? 0),
    0
  );

  const totalPrice = (selectedSize ? diaperPrice : 0) + wipesPrice + skincarePrice;
  const originalTotalPrice =
    (selectedSize ? originalDiaperPrice : 0) + originalWipesPrice + originalSkincarePrice;
  const totalSavings = originalTotalPrice - totalPrice;

  const planType =
    selectedWipes && selectedWipes !== 'none'
      ? ('diaper-wipe-bundle' as const)
      : ('diaper-only' as const);

  const getSizeLabel = (size: DiaperSize) => {
    if (size === 'n') return 'Newborn';
    if (size === 'n+1') return 'N+1 Combo';
    return `Size ${size}`;
  };

  const handleSizeSelect = (sizeId: string) => {
    if (sizeId === 'n-or-n1') {
      setShowNewbornModal(true);
    } else {
      setSelectedSize(sizeId as DiaperSize);
      setSizeError(false);
      if (!wipesOpen) {
        setWipesOpen(true);
        setTimeout(() => wipesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
      }
    }
  };

  const handleNewbornConfirm = (option: 'n' | 'n+1') => {
    setSelectedSize(option);
    setShowNewbornModal(false);
    setSizeError(false);
    if (!wipesOpen) {
      setWipesOpen(true);
      setTimeout(() => wipesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
    }
  };

  const handleWipesSelect = (wipes: WipesSelection) => {
    setSelectedWipes(wipes);
    if (!skincareOpen) {
      setSkincareOpen(true);
      setTimeout(() => skincareRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
    }
  };

  const toggleSkincare = (index: number) => {
    setSelectedSkincareIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      setSizeError(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      trackAddToCart({ planType, size: selectedSize, orderType, price: totalPrice, quantity: 1, location: 'Bundle Builder' });

      await cart.addToCart({
        size: selectedSize,
        displaySize: getSizeLabel(selectedSize),
        diaperCount: SIZE_CONFIGS[selectedSize].count,
        planType,
        orderType,
        quantity: 1,
        currentPrice: totalPrice,
        originalPrice: originalTotalPrice,
        savingsAmount: totalSavings,
        title: 'The Diaper',
        imageUrl: getDiaperImageUrl(),
        // TODO: wire up skincare upsellItems once Shopify variant IDs are available
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
      <div className="bg-white">
        {/* Banner */}
        <div
          className="relative w-full h-[325px] flex items-end bg-cover bg-center"
          style={{ backgroundImage: "url('/images/bundle-featured-image.jpg')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 via-[40%] to-transparent" />
          <h1 className="relative z-10 px-5 pb-6 text-white text-2xl">
            Build Your Diapering Bundle
          </h1>
        </div>
        <div className='flex flex-col gap-6 px-4 py-6'>
          <div className='space-y-4'>
            <p className='font-semibold'>Customize your perfect bundle and save 15%</p>
            <p className='leading-7 text-sm'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </div>
        </div>
        <div className='w-full px-4'>
          <div className="border-t border-gray-200 mb-6" /> 
        </div>
        <div className="max-w-lg mx-auto px-4 pt-5 pb-6">
          {/* <h4 className="mb-5">Build Your Diapering Bundle</h4> */}

          {/* Hero image */}
          {/* <div className="relative h-[220px] rounded-2xl overflow-hidden mb-6">
            <Image
              src="/images/bundle-featured-image.jpg"
              alt="Coterie diapers"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 512px) 100vw, 512px"
            />
          </div> */}

          {/* Intro */}
          {/* <div className='bg-[#F5F5F5] p-3 rounded'>
            <p className="font-semibold text-gray-900 mb-2 text-base">
            Customize your bundle and save 10%
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            Build a subscription tailored to your baby. Start with the right diaper size, add wipes for even more value, and top it off with gentle skincare essentials.
          </p>

          </div> */}
          {/* <div className="border-t border-gray-200 my-6" /> */}

          {/* Step 1: Size */}
          <div ref={sizeRef} className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <p className="text-base">
                <span className="font-semibold">Step 1:</span>{' '}
                <span className="text-gray-900">Select your size:</span>
              </p>
              <button
                onClick={() => setShowSizeGuide(true)}
                className="text-xs text-[#0000C9] font-semibold underline underline-offset-2 hover:text-[#0000A0]"
              >
                Size + Fit Guide
              </button>
            </div>

            {sizeError && (
              <p className="text-red-500 text-sm mb-3">Please select a diaper size to continue.</p>
            )}

            {/* Piano keys */}
            <div className="grid grid-cols-4 gap-2">
              {pianoKeySizes.map((size) => (
                <PianoKey
                  key={size.id}
                  size={size}
                  isSelected={size.id === 'n-or-n1' ? isNewbornSelected : selectedSize === size.id}
                  onSelect={() => handleSizeSelect(size.id)}
                />
              ))}
            </div>

            {selectedSize && (
              <p className="text-sm text-gray-500 mt-3">
                {getSizeLabel(selectedSize)} · {SIZE_CONFIGS[selectedSize].weightRange} ·{' '}
                {SIZE_CONFIGS[selectedSize].count} diapers per delivery
              </p>
            )}
          </div>

          {/* Step 2: Wipes */}
          <div ref={wipesRef}>
            <SectionHeader
              step={2}
              title="Select a wipe:"
              label="Required section"
              isOpen={wipesOpen}
              isDone={selectedWipes !== null}
              onClick={() => setWipesOpen((v) => !v)}
            />
            <div className={`h-px w-full ${wipesOpen ? 'bg-[#0000C9]' : 'bg-gray-200'}`} />

            {wipesOpen && (
              <div className="pt-4 pb-2">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {WIPES_PRODUCTS.map((product) => (
                    <WipesCard
                      key={product.id}
                      product={product}
                      isSelected={selectedWipes === product.id}
                      onClick={() => handleWipesSelect(product.id)}
                      orderType={orderType}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Step 3: Skincare */}
          <div ref={skincareRef} className="mt-2">
            <SectionHeader
              step={3}
              title="Add skincare:"
              label="Optional section"
              isOpen={skincareOpen}
              isDone={selectedSkincareIndices.length > 0}
              onClick={() => setSkincareOpen((v) => !v)}
            />
            <div className={`h-px w-full ${skincareOpen ? 'bg-[#0000C9]' : 'bg-gray-200'}`} />

            {skincareOpen && (
              <div className="pt-4 pb-2">
                <div className="grid grid-cols-2 gap-3">
                  {SKINCARE_ITEMS.map((item, index) => (
                    <SkincareCard
                      key={item.id}
                      item={item}
                      isSelected={selectedSkincareIndices.includes(index)}
                      onClick={() => toggleSkincare(index)}
                      orderType={orderType}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      <BundleSummary
        selectedSize={selectedSize}
        selectedWipes={selectedWipes}
        selectedSkincareIndices={selectedSkincareIndices}
        orderType={orderType}
        diaperPrice={diaperPrice}
        wipesPrice={wipesPrice}
        totalPrice={totalPrice}
        originalTotalPrice={originalTotalPrice}
        totalSavings={totalSavings}
        isLoading={isLoading}
        error={error}
        onCheckout={handleAddToCart}
      />
      <div className='py-6 px-4'>
        <div className='grid grid-cols-2 gap-6'>
            <BenefitTile icon='/fragrance-free.svg' title='Free next size trial' subtitle='(included in first Auto-Renew box)' />
            <BenefitTile icon='/fragrance-free.svg' title='Manage deliveries via text' />
            <BenefitTile icon='/fragrance-free.svg' title='Size up assist' />
            <BenefitTile icon='/fragrance-free.svg' title='Auto-ships each month' />
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200">
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
          <Button
            onClick={selectedSize ? handleAddToCart : () => sizeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            disabled={isLoading}
            className="w-full"
          >
            {selectedSize ? (isLoading ? 'Adding...' : 'Add to cart') : 'Build my Bundle'}
          </Button>
        </div>
      </div>

      <NewbornModal
        isOpen={showNewbornModal}
        onClose={() => setShowNewbornModal(false)}
        onConfirm={handleNewbornConfirm}
      />
      <SizeFitGuideDrawer
        isOpen={showSizeGuide}
        onClose={() => setShowSizeGuide(false)}
      />
    </>
  );
}
