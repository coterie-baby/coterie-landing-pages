'use client';

import QuizHeader from '@/components/quiz/quiz-header';
import QuizProgress from '@/components/quiz/quiz-progress';
import { useQuiz, getQuestion, sizingQuizConfig } from '@/lib/quiz';

const QUESTION_ID = 'baby';

export default function BabyQuestion() {
  const { goToNext, totalSteps } = useQuiz();
  const question = getQuestion(sizingQuizConfig, QUESTION_ID);
  const currentStep = sizingQuizConfig.questionOrder.indexOf(QUESTION_ID) + 1;

  const handleSelection = (value: string) => {
    goToNext(QUESTION_ID, value);
  };

  if (!question || !question.options) return null;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white">
      <QuizHeader questionId={QUESTION_ID} />
      <QuizProgress currentStep={currentStep} totalSteps={totalSteps} />

      {/* Question Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <h1 className="text-[32px] leading-[110%] tracking-[-0.64px] mb-6">
          {question.question}
        </h1>

        <div className="flex gap-3 w-full max-w-sm">
          {question.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelection(option.value)}
              className="flex-1 py-4 px-6 rounded-lg text-[15px] font-medium transition-colors bg-white text-[#141414] border border-[#E7E7E7] hover:bg-[#0000C9] hover:text-white hover:border-[#0000C9] active:bg-[#0000C9] active:text-white"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      {question.helpText && (
        <div className="flex-shrink-0 px-6 py-8">
          <div className="flex flex-col items-center gap-2">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#0000C9]"
            >
              <circle cx="16" cy="16" r="15" stroke="currentColor" strokeWidth="2" />
              <circle cx="11" cy="13" r="1.5" fill="currentColor" />
              <circle cx="21" cy="13" r="1.5" fill="currentColor" />
              <path
                d="M11 20C11 20 13 23 16 23C19 23 21 20 21 20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M23 10C23 10 25 8 27 9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <button className="text-[14px] text-[#0000C9] font-medium">
              {question.helpText}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
