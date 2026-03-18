'use client';

import { useState, useRef, createContext, useContext } from 'react';
import type { ReactNode, RefObject } from 'react';
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
import { trackAddToCart, trackCheckoutError } from '@/lib/gtm/ecommerce';

// ── Types ──────────────────────────────────────────────────────

export type WipesSelection = 'the-wipe' | 'the-soft-wipe' | 'none' | null;
export type OrderType = 'subscription' | 'one-time';

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

interface SkincareItem {
  id: string;
  name: string;
  description: string;
  subPrice: number;
  otpPrice: number;
  bgClass: string;
  image?: string;
}

// ── Product Data ───────────────────────────────────────────────

export const WIPES_PRODUCTS: WipesProduct[] = [
  {
    id: 'the-wipe',
    name: 'The Wipe',
    description: 'Our classic, ultra-soft wipe for everyday use',
    count: 224,
    basePrice: 33,
    subscriptionPrice: 28,
    image: 'https://cdn.sanity.io/images/e4q6bkl9/production/8e47d12b67b1a511fd8011809ef4a0b017a1679a-1920x2400.png',
    badge: 'Most Popular',
  },
  {
    id: 'the-soft-wipe',
    name: 'The Soft Wipe',
    description: 'Extra gentle formula for sensitive skin',
    count: 224,
    basePrice: 33,
    subscriptionPrice: 28,
    image: 'https://cdn.sanity.io/images/e4q6bkl9/production/2efc22da90edbd361a2b1fa39fd32c76ab9c90f1-1920x2400.png',
  },
];

export const SKINCARE_ITEMS: SkincareItem[] = [
  {
    id: 'first-wash',
    name: 'First Wash',
    description: 'Tear-free hair + body wash for a gentle cleanse',
    subPrice: 35.0,
    otpPrice: 40.0,
    bgClass: 'bg-sky-50',
    image: 'https://cdn.sanity.io/images/e4q6bkl9/production/3fc74efb5fcc16d6aad0a15782c67bcdb8ee2873-3390x3390.jpg',
  },
  {
    id: 'soft-cream',
    name: 'Soft Cream',
    description: 'Face + body moisturizer for up to 24-hr hydration',
    subPrice: 35.0,
    otpPrice: 40.0,
    bgClass: 'bg-amber-50',
    image: 'https://cdn.sanity.io/images/e4q6bkl9/production/576070920de4d78aa3ab57fafda90e461e910ee1-3390x3390.jpg',
  },
  {
    id: 'bun-balm',
    name: 'Bun Balm',
    description: 'Diaper + dry skin ointment for skin barrier support',
    subPrice: 35.0,
    otpPrice: 40.0,
    bgClass: 'bg-emerald-50',
    image: 'https://cdn.sanity.io/images/e4q6bkl9/production/28ead0f676c048788e047c876189be9e80ff2a06-3390x3390.jpg',
  },
];

// ── Context ────────────────────────────────────────────────────

interface BundleSelectorContextValue {
  selectedSize: DiaperSize | null;
  selectedWipes: WipesSelection;
  selectedSkincareIndices: number[];
  orderType: OrderType;
  diaperPrice: number;
  wipesPrice: number;
  totalPrice: number;
  originalTotalPrice: number;
  totalSavings: number;
  planType: 'diaper-only' | 'diaper-wipe-bundle';
  bundleTitle: string;
  sizeError: boolean;
  wipesOpen: boolean;
  skincareOpen: boolean;
  showNewbornModal: boolean;
  showSizeGuide: boolean;
  isLoading: boolean;
  error: string | null;
  sizeRef: RefObject<HTMLDivElement>;
  wipesRef: RefObject<HTMLDivElement>;
  skincareRef: RefObject<HTMLDivElement>;
  setSizeError: (v: boolean) => void;
  setWipesOpen: (v: boolean) => void;
  setSkincareOpen: (v: boolean) => void;
  setShowNewbornModal: (v: boolean) => void;
  setShowSizeGuide: (v: boolean) => void;
  setIsLoading: (v: boolean) => void;
  setError: (v: string | null) => void;
  handleSizeSelect: (sizeId: string) => void;
  handleNewbornConfirm: (option: 'n' | 'n+1') => void;
  handleWipesSelect: (wipes: WipesSelection) => void;
  toggleSkincare: (index: number) => void;
  getSizeLabel: (size: DiaperSize) => string;
  handleAddToCart: () => Promise<void>;
}

const BundleSelectorContext = createContext<BundleSelectorContextValue | null>(null);

export function useBundleSelector() {
  const ctx = useContext(BundleSelectorContext);
  if (!ctx) throw new Error('useBundleSelector must be used inside BundleSelectorProvider');
  return ctx;
}

export function BundleSelectorProvider({
  children,
  bundleTitle = 'The Diaper',
}: {
  children: ReactNode;
  bundleTitle?: string;
}) {
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

  const wipesRef = useRef<HTMLDivElement>(null!);
  const skincareRef = useRef<HTMLDivElement>(null!);
  const sizeRef = useRef<HTMLDivElement>(null!);

  // Pricing
  const diaperPlanConfig = PLAN_CONFIGS.find((p) => p.id === 'diaper-only')!;
  const diaperPrice =
    orderType === 'subscription' ? diaperPlanConfig.subscriptionPrice : diaperPlanConfig.basePrice;
  const originalDiaperPrice = diaperPlanConfig.basePrice;

  const wipesConfig =
    selectedWipes && selectedWipes !== 'none'
      ? WIPES_PRODUCTS.find((w) => w.id === selectedWipes)
      : null;
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

  const planType: 'diaper-only' | 'diaper-wipe-bundle' =
    selectedWipes && selectedWipes !== 'none' ? 'diaper-wipe-bundle' : 'diaper-only';

  const getSizeLabel = (size: DiaperSize): string => {
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
        setTimeout(
          () => wipesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
          150
        );
      }
    }
  };

  const handleNewbornConfirm = (option: 'n' | 'n+1') => {
    setSelectedSize(option);
    setShowNewbornModal(false);
    setSizeError(false);
    if (!wipesOpen) {
      setWipesOpen(true);
      setTimeout(
        () => wipesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
        150
      );
    }
  };

  const handleWipesSelect = (wipes: WipesSelection) => {
    if (selectedWipes === wipes) {
      setSelectedWipes(null);
      return;
    }
    setSelectedWipes(wipes);
    if (!skincareOpen) {
      setSkincareOpen(true);
      setTimeout(
        () => skincareRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
        150
      );
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
      sizeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      trackAddToCart({
        planType,
        size: selectedSize,
        orderType,
        price: totalPrice,
        quantity: 1,
        location: 'Bundle Builder',
      });
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
        title: bundleTitle,
        imageUrl: getDiaperImageUrl(),
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(msg);
      trackCheckoutError(msg, { plan_type: planType, size: selectedSize, order_type: orderType });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BundleSelectorContext.Provider
      value={{
        selectedSize,
        selectedWipes,
        selectedSkincareIndices,
        orderType,
        diaperPrice,
        wipesPrice,
        totalPrice,
        originalTotalPrice,
        totalSavings,
        planType,
        bundleTitle,
        sizeError,
        wipesOpen,
        skincareOpen,
        showNewbornModal,
        showSizeGuide,
        isLoading,
        error,
        sizeRef,
        wipesRef,
        skincareRef,
        setSizeError,
        setWipesOpen,
        setSkincareOpen,
        setShowNewbornModal,
        setShowSizeGuide,
        setIsLoading,
        setError,
        handleSizeSelect,
        handleNewbornConfirm,
        handleWipesSelect,
        toggleSkincare,
        getSizeLabel,
        handleAddToCart,
      }}
    >
      {children}
    </BundleSelectorContext.Provider>
  );
}

// ── Internal Sub-components ────────────────────────────────────

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

function CheckCircle() {
  return (
    <svg
      className="w-3.5 h-3.5 text-white"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={3}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
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
        <p className="font-semibold text-sm leading-tight mb-1">{product.name}</p>
        <p className="text-xs text-[#515151] mb-2">4-pack · {product.count} wipes</p>
        <p className="text-xs text-[#515151] mb-1">{product.description}</p>
        <p className="text-sm font-bold text-[#0000C9]">+${price.toFixed(2)}</p>
      </div>
    </button>
  );
}

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
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl border overflow-hidden text-left transition-all w-full ${
        isSelected ? 'border-[#0000C9] shadow-sm' : 'border-[#E0E0E0] hover:border-gray-300'
      }`}
    >
      <div className={`relative aspect-square ${item.bgClass}`}>
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 300px"
          />
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
        <p className="font-semibold text-sm leading-tight mb-1">{item.name}</p>
        <p className="text-xs text-[#515151] mb-2">{item.description}</p>
        <p className="text-sm font-bold text-[#0000C9]">+${price.toFixed(2)}</p>
      </div>
    </button>
  );
}

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
      <p className="text-base text-left text-[15px]">
        <span className="font-semibold">Step {step}:</span>{' '}
        <span>{title}</span>
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

// ── BundleSelector (standalone 3-step UI) ─────────────────────

export default function BundleSelector() {
  const {
    selectedSize,
    selectedWipes,
    selectedSkincareIndices,
    orderType,
    sizeError,
    wipesOpen,
    skincareOpen,
    showNewbornModal,
    showSizeGuide,
    sizeRef,
    wipesRef,
    skincareRef,
    setWipesOpen,
    setSkincareOpen,
    setShowNewbornModal,
    setShowSizeGuide,
    handleSizeSelect,
    handleNewbornConfirm,
    handleWipesSelect,
    toggleSkincare,
    getSizeLabel,
  } = useBundleSelector();

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

  return (
    <>
      {/* Step 1: Size */}
      <div ref={sizeRef} className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <p className="text-base text-[15px]">
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
          label="Optional"
          isOpen={wipesOpen}
          isDone={selectedWipes !== null && selectedWipes !== 'none'}
          onClick={() => setWipesOpen(!wipesOpen)}
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
          label="Optional"
          isOpen={skincareOpen}
          isDone={selectedSkincareIndices.length > 0}
          onClick={() => setSkincareOpen(!skincareOpen)}
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
