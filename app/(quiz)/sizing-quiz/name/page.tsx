'use client';

import { useState } from 'react';
import QuizHeader from '@/components/quiz/quiz-header';
import QuizProgress from '@/components/quiz/quiz-progress';
import WhyWeAsk from '@/components/quiz/why-we-ask';
import { Button } from '@/components/ui/button';
import { useQuiz, getQuestion, sizingQuizConfig } from '@/lib/quiz';

const QUESTION_ID = 'name';

export default function NameQuestion() {
  const { goToNext, flowTotalSteps } = useQuiz();
  const question = getQuestion(sizingQuizConfig, QUESTION_ID);
  const [inputValue, setInputValue] = useState('');

  const handleNext = () => {
    goToNext(QUESTION_ID, inputValue);
  };

  if (!question) return null;

  // Step 2 in "already here" flow (5 questions total)
  const totalSteps = flowTotalSteps || 5;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white">
      <QuizHeader questionId={QUESTION_ID} />
      <QuizProgress currentStep={2} totalSteps={totalSteps} />

      {/* Question Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <h1 className="text-[29px] leading-[110%] tracking-[-0.64px] mb-6">
          {question.question}
        </h1>

        <div className="w-full max-w-sm flex flex-col items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={question.placeholder}
            className="w-full text-center text-[24px] text-[#525252] placeholder:text-[#525252] border-b border-[#0000C9] pb-2 outline-none bg-transparent"
          />
          {question.subtext && (
            <span className="text-[14px] text-[#525252] mt-2">
              {question.subtext}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex-shrink-0">
        {question.helpText && question.helpAnswer && (
          <div className="px-6 mb-6">
            <WhyWeAsk
              helpText={question.helpText}
              helpAnswer={question.helpAnswer}
            />
          </div>
        )}

        <div className="border-t border-[#E7E7E7] px-6 py-4">
          <div className="flex justify-center">
            <Button onClick={handleNext} className="py-4 px-12 text-xs">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
