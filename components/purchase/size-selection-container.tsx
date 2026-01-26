'use client';

import { useState } from 'react';
import PianoKey from './piano-key';
import { Button } from '../ui/button';
import {
  useProductOrder,
  DiaperSize,
  SIZE_CONFIGS,
  DISPLAY_SIZES,
  SizeOption,
} from './context';
import { trackSelectProductVariant } from '@/lib/gtm/ecommerce';
import SizeFitGuideDrawer from './size-fit-guide-drawer';

interface NewbornModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (option: 'n' | 'n+1') => void;
}

function NewbornModal({ isOpen, onClose, onConfirm }: NewbornModalProps) {
  const [tempSelection, setTempSelection] = useState<'n' | 'n+1' | null>(null);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (tempSelection) {
      onConfirm(tempSelection);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl max-w-[343px] w-full mx-4 p-[26px]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Content */}
        <p className="text-lg text-gray-900 mb-2">Shopping for a newborn?</p>
        <p className="text-xs text-gray-600 mb-2">
          Choose between Newborn only or a combination of Size N and 1:
        </p>

        {/* Options */}
        <div className="space-y-3">
          {/* Newborn only option */}
          <button
            onClick={() => setTempSelection('n')}
            className={`w-full flex items-center gap-4 p-4 py-2 rounded-lg border transition-all ${
              tempSelection === 'n'
                ? 'border-[#0000C9] bg-blue-50/30'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                tempSelection === 'n' ? 'border-[#0000C9]' : 'border-gray-300'
              }`}
            >
              {tempSelection === 'n' && (
                <div className="w-2.5 h-2.5 rounded-full bg-[#0000C9]" />
              )}
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold text-gray-900">
                Newborn only
              </div>
              <div className="text-xs text-gray-500">6 packs of Size N</div>
            </div>
          </button>

          {/* N+1 option */}
          <button
            onClick={() => setTempSelection('n+1')}
            className={`w-full flex items-center gap-4 p-4 py-2 rounded-lg border transition-all ${
              tempSelection === 'n+1'
                ? 'border-[#0000C9] bg-blue-50/30'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                tempSelection === 'n+1' ? 'border-[#0000C9]' : 'border-gray-300'
              }`}
            >
              {tempSelection === 'n+1' && (
                <div className="w-2.5 h-2.5 rounded-full bg-[#0000C9]" />
              )}
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold text-gray-900">N+1</div>
              <div className="text-xs text-gray-500">Combo pack</div>
            </div>
          </button>
        </div>

        {/* Confirm Button */}
        <Button
          onClick={handleConfirm}
          disabled={!tempSelection}
          className={`w-full mt-3 transition-all ${
            tempSelection
              ? 'bg-[#0000C9] hover:bg-[#0000A0]'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
}

export default function SizeSelectionContainer() {
  const { state, setSize } = useProductOrder();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Track if newborn option was selected (n or n+1)
  const isNewbornSize =
    state.selectedSize === 'n' || state.selectedSize === 'n+1';

  const handleSizeClick = (sizeId: string) => {
    if (sizeId === 'n-or-n1') {
      setIsModalOpen(true);
    } else {
      setSize(sizeId as DiaperSize);
      trackSelectProductVariant({
        itemName: 'The Diaper',
        itemVariant: SIZE_CONFIGS[sizeId as DiaperSize].variantName,
        location: 'LP Purchase Component',
      });
    }
  };

  const handleNewbornConfirm = (option: 'n' | 'n+1') => {
    setSize(option);
    setIsModalOpen(false);
    trackSelectProductVariant({
      itemName: 'The Diaper',
      itemVariant: SIZE_CONFIGS[option].variantName,
      location: 'LP Purchase Component',
    });
  };

  // Get the display label for the first piano key
  const getFirstKeyLabel = (): string => {
    if (state.selectedSize === 'n') return 'N';
    if (state.selectedSize === 'n+1') return 'N+1';
    return 'N or N+1';
  };

  // Build sizes array with dynamic first key label
  const displaySizes: SizeOption[] = [
    { id: 'n-or-n1', label: getFirstKeyLabel(), weightRange: 'Under 10 lbs' },
    ...DISPLAY_SIZES.slice(1),
  ];

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-between">
          <p className="text-sm">Pick your size</p>
        </div>
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="text-xs text-[#0000C9] font-semibold underline underline-offset-2 hover:text-[#0000A0]"
        >
          Size + Fit Guide
        </button>
      </div>

      {/* Size Grid */}
      <div className="grid grid-cols-4 gap-2">
        {displaySizes.map((size) => (
          <PianoKey
            key={size.id}
            size={size}
            isSelected={
              size.id === 'n-or-n1'
                ? isNewbornSize
                : state.selectedSize === size.id
            }
            onSelect={() => handleSizeClick(size.id)}
          />
        ))}
      </div>

      {/* Newborn Modal */}
      <NewbornModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleNewbornConfirm}
      />

      {/* Size + Fit Guide Drawer */}
      <SizeFitGuideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}
