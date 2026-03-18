'use client';

import { PurchaseFlowProvider, usePurchaseFlow } from './context';
import type { SkincareProduct } from './context';
import ProgressBar from './progress-bar';
import SizeStep from './steps/size-step';
import BundleStep from './steps/bundle-step';
import SkincareStep from './steps/skincare-step';
import ReviewStep from './steps/review-step';

function PurchaseFlowContent() {
  const { state } = usePurchaseFlow();

  const renderStep = () => {
    switch (state.currentStep) {
      case 'size':
        return <SizeStep />;
      case 'bundle':
        return <BundleStep />;
      case 'skincare':
        return <SkincareStep />;
      case 'review':
        return <ReviewStep />;
      default:
        return <SizeStep />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Progress Bar */}
      <ProgressBar />

      {/* Container with top padding for fixed progress bar */}
      <div className="max-w-md mx-auto px-4 pb-12 pt-16">
        {/* Step Content */}
        <div className="relative">
          {renderStep()}
        </div>
      </div>
    </div>
  );
}

interface PurchaseFlowProps {
  skincareProducts?: SkincareProduct[];
}

export default function PurchaseFlow({ skincareProducts = [] }: PurchaseFlowProps) {
  return (
    <PurchaseFlowProvider skincareProducts={skincareProducts}>
      <PurchaseFlowContent />
    </PurchaseFlowProvider>
  );
}

// Re-export context for external use
export { usePurchaseFlow, PurchaseFlowProvider } from './context';
export type { PurchaseFlowStep, WipesOption, SkincareProduct } from './context';
