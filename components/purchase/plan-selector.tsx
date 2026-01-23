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
  name: string;
  features: string[];
  price: number;
  originalPrice?: number;
  isSelected: boolean;
  onSelect: () => void;
}

function PlanCard({
  name,
  features,
  price,
  originalPrice,
  isSelected,
  onSelect,
}: PlanCardProps) {
  const showStrikethrough =
    originalPrice !== undefined && price < originalPrice;

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
          <span className="text-[#0000C9]">${price.toFixed(2)}</span>
          {showStrikethrough && (
            <span className="ml-2 text-[#515151] line-through text-sm">
              ${originalPrice.toFixed(2)}
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
  const { state, setPlan, setOrderType } = useProductOrder();

  // Only show after size is selected
  if (!state.selectedSize) return null;

  const diaperOnlyPlan = PLAN_CONFIGS.find((p) => p.id === 'diaper-only');
  const isOneTimePurchaseSelected =
    state.orderType === 'one-time' && state.selectedPlan === 'diaper-only';

  const handlePlanSelect = (planId: PlanType) => {
    setPlan(planId);
    setOrderType('subscription');
  };

  const handleOneTimePurchase = () => {
    setPlan('diaper-only');
    setOrderType('one-time');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <p className="text-sm">Pick your Auto-Renew plan:</p>
        <div className="py-1 px-2 bg-[#D1E3FB] uppercase text-xs rounded">
          <span>Save 10%</span>
        </div>
      </div>

      {/* Plan cards */}
      <div className="space-y-4">
        {PLAN_CONFIGS.map((plan) => (
          <PlanCard
            key={plan.id}
            name={plan.name}
            features={plan.features}
            price={plan.subscriptionPrice}
            originalPrice={plan.basePrice}
            isSelected={
              state.selectedPlan === plan.id &&
              state.orderType === 'subscription'
            }
            onSelect={() => handlePlanSelect(plan.id)}
          />
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-4" />

      {/* One-time purchase option */}
      {diaperOnlyPlan && (
        <PlanCard
          name="One-Time Purchase"
          features={['6 packs of diapers, single purchase']}
          price={diaperOnlyPlan.basePrice}
          isSelected={isOneTimePurchaseSelected}
          onSelect={handleOneTimePurchase}
        />
      )}
    </div>
  );
}
