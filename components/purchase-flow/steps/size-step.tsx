'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { usePurchaseFlow } from '../context';
import { DiaperSize, SIZE_CONFIGS, SIZE_ORDER } from '@/components/purchase/context';

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
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-[343px] w-full mx-4 p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <p className="text-lg font-medium mb-1">Shopping for a newborn?</p>
        <p className="text-sm text-gray-500 mb-4">
          Choose between Newborn only or a combination pack:
        </p>

        <div className="space-y-3">
          <button
            onClick={() => setTempSelection('n')}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
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
              <div className="text-sm font-medium">Newborn Only</div>
              <div className="text-xs text-gray-500">6 packs of Size N (186 diapers)</div>
            </div>
          </button>

          <button
            onClick={() => setTempSelection('n+1')}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
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
              <div className="text-sm font-medium">N+1 Combo Pack</div>
              <div className="text-xs text-gray-500">3 packs N + 3 packs Size 1 (192 diapers)</div>
            </div>
          </button>
        </div>

        <Button
          onClick={handleConfirm}
          disabled={!tempSelection}
          className="w-full mt-4 bg-[#0000C9] hover:bg-[#0000A0] disabled:bg-gray-200"
        >
          Confirm Selection
        </Button>
      </div>
    </div>
  );
}

// Size display excludes n and n+1, shows "Newborn" as combined option
const DISPLAY_SIZES = [
  { id: 'newborn', label: 'Newborn', weightRange: 'Under 10 lbs', isCombo: true },
  ...SIZE_ORDER.filter((s) => s !== 'n' && s !== 'n+1').map((size) => ({
    id: size,
    label: SIZE_CONFIGS[size].label,
    weightRange: SIZE_CONFIGS[size].weightRange,
    isCombo: false,
  })),
];

export default function SizeStep() {
  const { state, setSize, nextStep, prevStep, selectedSizeConfig, diaperCount } = usePurchaseFlow();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isNewbornSelected = state.selectedSize === 'n' || state.selectedSize === 'n+1';

  const handleSizeClick = (sizeId: string) => {
    if (sizeId === 'newborn') {
      setIsModalOpen(true);
    } else {
      setSize(sizeId as DiaperSize);
    }
  };

  const handleNewbornConfirm = (option: 'n' | 'n+1') => {
    setSize(option);
    setIsModalOpen(false);
  };

  const getSelectedLabel = () => {
    if (!state.selectedSize) return null;
    if (state.selectedSize === 'n') return 'Newborn';
    if (state.selectedSize === 'n+1') return 'N+1 Combo';
    return `Size ${state.selectedSize}`;
  };

  return (
    <div className="flex flex-col animate-fade-up">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold mb-1">What size does your baby need?</h2>
        <p className="text-sm text-gray-500">Select based on your baby&apos;s weight</p>
      </div>

      {/* Product Preview */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl mb-6">
        <div className="relative w-20 h-20 flex-shrink-0">
          <Image
            src="https://m.media-amazon.com/images/I/815Q-eQIQkL._AC_SX679_.jpg"
            alt="The Diaper"
            fill
            className="object-cover rounded-xl"
          />
        </div>
        <div>
          <p className="font-medium">The Diaper</p>
          <p className="text-sm text-gray-500">
            {state.selectedSize
              ? `${getSelectedLabel()} • ${diaperCount} diapers/month`
              : 'Select a size below'}
          </p>
        </div>
      </div>

      {/* Size Grid */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {DISPLAY_SIZES.map((size) => {
          const isSelected = size.id === 'newborn' ? isNewbornSelected : state.selectedSize === size.id;

          return (
            <button
              key={size.id}
              onClick={() => handleSizeClick(size.id)}
              className={`p-3 rounded-xl border-2 text-left transition-all ${
                isSelected
                  ? 'border-[#0000C9] bg-blue-50/50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="font-semibold text-sm">{size.label}</div>
              <div className="text-xs text-gray-500 mt-0.5">{size.weightRange}</div>
            </button>
          );
        })}
      </div>

      {/* Selected Size Details */}
      {state.selectedSize && selectedSizeConfig && (
        <div className="bg-[#D1E3FB]/30 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{getSelectedLabel()}</p>
              <p className="text-xs text-gray-600">{selectedSizeConfig.weightRange}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{diaperCount} diapers</p>
              <p className="text-xs text-gray-600">~{selectedSizeConfig.changesPerDay} changes/day</p>
            </div>
          </div>
        </div>
      )}

      {/* Size Guide Link */}
      <button className="text-sm text-[#0000C9] font-medium mb-8 hover:underline">
        View Size + Fit Guide
      </button>

      {/* Navigation */}
      <div className="flex gap-3 mt-auto">
        <Button
          variant="outline"
          onClick={prevStep}
          className="flex-1 border-gray-200"
        >
          Back
        </Button>
        <Button
          onClick={nextStep}
          disabled={!state.selectedSize}
          className="flex-1 bg-[#0000C9] hover:bg-[#0000A0] disabled:bg-gray-200"
        >
          Continue
        </Button>
      </div>

      {/* Newborn Modal */}
      <NewbornModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleNewbornConfirm}
      />
    </div>
  );
}
