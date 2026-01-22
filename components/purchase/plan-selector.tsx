'use client';

import { useProductOrder, PLAN_CONFIGS, PlanType } from './context';

function CheckIcon() {
  return (
    <svg
      className="w-4 h-4 text-[#0000C9]"
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

interface PlanCardProps {
  planId: PlanType;
  name: string;
  features: string[];
  subscriptionPrice: number;
  basePrice: number;
  isSelected: boolean;
  onSelect: () => void;
}

function PlanCard({
  name,
  features,
  subscriptionPrice,
  basePrice,
  isSelected,
  onSelect,
}: PlanCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`w-full p-2 rounded-lg border text-left transition-all ${
        isSelected
          ? 'border-[#0000C9] bg-white'
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between mb-2 text-[14.5px]">
        <span className="font-semibold">{name}</span>
        <div className="text-right">
          <span className="text-[#0000C9]">
            ${subscriptionPrice.toFixed(2)}
          </span>
          {subscriptionPrice < basePrice && (
            <span className="ml-2 text-[#515151] line-through text-sm">
              ${basePrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      {/* Features list */}
      <div className="space-y-1">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex items-center gap-2 text-xs text-[#515151]"
          >
            <CheckIcon />
            <span>{feature}</span>
          </div>
        ))}
      </div>
    </button>
  );
}

export default function PlanSelector() {
  const { state, setPlan } = useProductOrder();

  // Only show after size is selected
  if (!state.selectedSize) return null;

  return (
    <div className="space-y-2">
      {/* Header */}
      <p className="text-sm">Pick your plan:</p>

      {/* Plan cards */}
      <div className="space-y-4">
        {PLAN_CONFIGS.map((plan) => (
          <PlanCard
            key={plan.id}
            planId={plan.id}
            name={plan.name}
            features={plan.features}
            subscriptionPrice={plan.subscriptionPrice}
            basePrice={plan.basePrice}
            isSelected={state.selectedPlan === plan.id}
            onSelect={() => setPlan(plan.id)}
          />
        ))}
      </div>
    </div>
  );
}
