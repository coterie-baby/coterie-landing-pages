'use client';

import { usePurchaseFlow, STEPS } from './context';

export default function ProgressBar() {
  const { currentStepIndex, state } = usePurchaseFlow();

  // Don't show on welcome step
  if (state.currentStep === 'welcome') return null;

  // Calculate progress (excluding welcome step)
  const visibleSteps = STEPS.filter((s) => s !== 'welcome');
  const adjustedIndex = currentStepIndex - 1; // Adjust for hidden welcome step
  const progress = ((adjustedIndex + 1) / visibleSteps.length) * 100;

  const stepLabels = ['Size', 'Bundle', 'Review'];

  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-white">
      {/* Progress bar track */}
      <div className="h-1 bg-gray-100 w-full">
        {/* Progress bar fill */}
        <div
          className="h-full bg-[#0000C9] transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step labels */}
      <div className="flex justify-between px-4 py-3 max-w-md mx-auto">
        {stepLabels.map((label, index) => {
          const isCompleted = index < adjustedIndex;
          const isCurrent = index === adjustedIndex;

          return (
            <div key={label} className="flex items-center gap-1.5">
              {/* Step number/check */}
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                  isCompleted
                    ? 'bg-[#0000C9] text-white'
                    : isCurrent
                    ? 'bg-[#0000C9] text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {isCompleted ? (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              {/* Label */}
              <span
                className={`text-xs transition-colors ${
                  isCurrent
                    ? 'text-[#0000C9] font-medium'
                    : isCompleted
                    ? 'text-gray-600'
                    : 'text-gray-400'
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
