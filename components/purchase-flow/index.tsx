'use client';

import { PurchaseFlowProvider, usePurchaseFlow } from './context';
import ProgressBar from './progress-bar';
import WelcomeStep from './steps/welcome-step';
import SizeStep from './steps/size-step';
import BundleStep from './steps/bundle-step';
import ReviewStep from './steps/review-step';

function PurchaseFlowContent() {
  const { state } = usePurchaseFlow();

  const renderStep = () => {
    switch (state.currentStep) {
      case 'welcome':
        return <WelcomeStep />;
      case 'size':
        return <SizeStep />;
      case 'bundle':
        return <BundleStep />;
      case 'review':
        return <ReviewStep />;
      default:
        return <WelcomeStep />;
    }
  };

  // Add top padding when progress bar is visible (not on welcome step)
  const showProgressBar = state.currentStep !== 'welcome';

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Progress Bar */}
      <ProgressBar />

      {/* Container with dynamic top padding for fixed progress bar */}
      <div className={`max-w-md mx-auto px-4 pb-12 ${showProgressBar ? 'pt-16' : 'py-6'}`}>
        {/* Step Content */}
        <div className="relative">
          {renderStep()}
        </div>
      </div>
    </div>
  );
}

export default function PurchaseFlow() {
  return (
    <PurchaseFlowProvider>
      <PurchaseFlowContent />
    </PurchaseFlowProvider>
  );
}

// Re-export context for external use
export { usePurchaseFlow, PurchaseFlowProvider } from './context';
export type { PurchaseFlowStep, WipesOption } from './context';
