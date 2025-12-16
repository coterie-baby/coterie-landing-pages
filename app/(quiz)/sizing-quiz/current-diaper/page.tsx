'use client';

import { useState } from 'react';
import QuizHeader from '@/components/quiz/quiz-header';
import QuizProgress from '@/components/quiz/quiz-progress';
import WhyWeAsk from '@/components/quiz/why-we-ask';
import { Button } from '@/components/ui/button';
import { useQuiz, getQuestion, sizingQuizConfig } from '@/lib/quiz';

const QUESTION_ID = 'current-diaper';

export default function CurrentDiaperQuestion() {
  const { goToNext, totalSteps, setAnswer } = useQuiz();
  const question = getQuestion(sizingQuizConfig, QUESTION_ID);
  const currentStep = sizingQuizConfig.questionOrder.indexOf(QUESTION_ID) + 1;

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  const handleNext = () => {
    if (selectedSize && selectedBrand) {
      // Store both values as a combined answer
      setAnswer('diaper-size', selectedSize);
      setAnswer('diaper-brand', selectedBrand);
      goToNext(QUESTION_ID, `${selectedSize}:${selectedBrand}`);
    }
  };

  const isComplete = selectedSize && selectedBrand;

  if (!question || !question.sizeOptions || !question.brandOptions) return null;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white">
      <QuizHeader questionId={QUESTION_ID} />
      <QuizProgress currentStep={currentStep} totalSteps={totalSteps} />

      {/* Question Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 overflow-y-auto">
        <h1 className="text-[29px] leading-[110%] tracking-[-0.64px] mb-6 text-center">
          {question.question}
        </h1>

        <div className="w-full max-w-sm space-y-6">
          {/* Size Selection */}
          <div>
            <p className="text-[14px] text-[#525252] mb-3 text-center">Size</p>
            <div className="grid grid-cols-4 gap-2">
              {question.sizeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedSize(option.value)}
                  className={`py-3 px-2 rounded-lg text-[14px] transition-colors border ${
                    selectedSize === option.value
                      ? 'bg-[#0000C9] text-white border-[#0000C9]'
                      : 'bg-white text-[#141414] border-[#E7E7E7] hover:border-[#0000C9]'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Brand Selection */}
          <div>
            <p className="text-[14px] text-[#525252] mb-3 text-center">Brand</p>
            <div className="grid grid-cols-3 gap-2">
              {question.brandOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedBrand(option.value)}
                  className={`py-3 px-2 rounded-lg text-[14px] transition-colors border ${
                    selectedBrand === option.value
                      ? 'bg-[#0000C9] text-white border-[#0000C9]'
                      : 'bg-white text-[#141414] border-[#E7E7E7] hover:border-[#0000C9]'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex-shrink-0">
        {question.helpText && question.helpAnswer && (
          <div className="px-6 mb-6">
            <WhyWeAsk helpText={question.helpText} helpAnswer={question.helpAnswer} />
          </div>
        )}

        <div className="border-t border-[#E7E7E7] px-6 py-4">
          <div className="flex justify-center">
            <Button
              onClick={handleNext}
              disabled={!isComplete}
              className="py-4 px-12 text-[15px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
