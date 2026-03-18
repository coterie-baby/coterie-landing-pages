'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { usePurchaseFlow, WIPES_CONFIGS, WipesOption } from '../context';

function CheckIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`w-4 h-4 ${className}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

const WIPES_FEATURES = [
  'Plant-based, 99% water formula',
  'Thick & durable for fewer wipes used',
  'Fragrance-free, hypoallergenic',
];

export default function BundleStep() {
  const {
    state,
    setWipes,
    nextStep,
    prevStep,
    diaperCount,
  } = usePurchaseFlow();

  const getSelectedLabel = () => {
    if (!state.selectedSize) return '';
    if (state.selectedSize === 'n') return 'Newborn';
    if (state.selectedSize === 'n+1') return 'N+1 Combo';
    return `Size ${state.selectedSize}`;
  };

  return (
    <div className="flex flex-col animate-fade-up">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold mb-1">Add wipes to your bundle?</h2>
        <p className="text-sm text-gray-500">Save more when you bundle</p>
      </div>

      {/* Current Selection Summary */}
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-6">
        <div className="relative w-14 h-14 flex-shrink-0">
          <Image
            src="https://m.media-amazon.com/images/I/815Q-eQIQkL._AC_SX679_.jpg"
            alt="The Diaper"
            fill
            className="object-cover rounded-lg"
          />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">The Diaper - {getSelectedLabel()}</p>
          <p className="text-xs text-gray-500">{diaperCount} diapers per delivery</p>
        </div>
        <CheckIcon className="text-green-600" />
      </div>

      {/* Wipes Product Info */}
      <div className="mb-4">
        <div className="flex items-center gap-4 mb-3">
          <div className="relative w-20 h-20 flex-shrink-0">
            <Image
              src="https://cdn.sanity.io/images/e4q6bkl9/production/fafaef923e0bc3fe3a063b06998eba6e567acab9-2048x2048.jpg?w=200&h=200&q=90&fit=crop&auto=format"
              alt="The Wipe"
              fill
              className="object-cover rounded-xl"
            />
          </div>
          <div>
            <p className="font-medium">The Wipe</p>
            <p className="text-sm text-gray-500">Our best-selling water wipes</p>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-1.5 mb-4">
          {WIPES_FEATURES.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
              <CheckIcon className="text-[#0000C9] w-3.5 h-3.5" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Wipes Options */}
      <div className="space-y-3 mb-6">
        {WIPES_CONFIGS.map((config) => {
          const isSelected = state.selectedWipes === config.id;
          const subPrice = config.subscriptionPrice;
          const otpPrice = config.basePrice;
          const savings = otpPrice - subPrice;

          return (
            <button
              key={config.id}
              onClick={() => setWipes(config.id as WipesOption)}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                isSelected
                  ? 'border-[#0000C9] bg-blue-50/30'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                      isSelected ? 'border-[#0000C9]' : 'border-gray-300'
                    }`}
                  >
                    {isSelected && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#0000C9]" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{config.name}</p>
                    <p className="text-xs text-gray-500">{config.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  {config.id !== 'none' ? (
                    <>
                      <p className="text-sm font-medium">
                        <span className="text-[#0000C9]">+${subPrice}</span>
                        <span className="text-gray-400 line-through text-xs ml-1.5">
                          ${otpPrice}
                        </span>
                      </p>
                      {savings > 0 && (
                        <p className="text-xs text-green-600">Save ${savings} w/ Auto-Renew</p>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-gray-400">Included</p>
                  )}
                </div>
              </div>

              {/* Most Popular Badge for 4-pack */}
              {config.id === '4-pack' && (
                <div className="mt-2 inline-flex items-center px-2 py-0.5 bg-[#D1E3FB] rounded-full">
                  <span className="text-xs font-medium text-[#0000C9]">Most Popular</span>
                </div>
              )}
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
        <Button
          onClick={nextStep}
          className="flex-1 bg-[#0000C9] hover:bg-[#0000A0]"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
