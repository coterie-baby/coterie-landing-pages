interface QuizProgressProps {
  currentStep: number;
  totalSteps: number;
}

export default function QuizProgress({
  currentStep,
  totalSteps,
}: QuizProgressProps) {
  return (
    <div className="w-full px-4 py-4 border-b border-[#E7E7E7]">
      <div className="flex items-center justify-between mb-2">
        {/* Progress bar */}
        <div className="flex items-center flex-1">
          {Array.from({ length: totalSteps }, (_, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;

            return (
              <div key={index} className="flex items-center flex-1 last:flex-none">
                {/* Step dot */}
                <div
                  className={`w-2.5 h-2.5 rounded-full flex-shrink-0 border ${
                    isCompleted
                      ? 'bg-[#0000C9] border-[#0000C9]'
                      : isCurrent
                        ? 'bg-transparent border-[#0000C9]'
                        : 'bg-transparent border-[#E7E7E7]'
                  }`}
                />
                {/* Connector line */}
                {index < totalSteps - 1 && (
                  <div
                    className={`h-[2px] flex-1 mx-1 ${
                      isCompleted ? 'bg-[#0000C9]' : 'bg-[#E7E7E7]'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
      {/* Labels */}
      <div className="flex justify-between">
        <span className="text-[12px] text-[#0000C9] font-medium">My baby</span>
        <span className="text-[12px] text-[#525252]">My plan</span>
      </div>
    </div>
  );
}
