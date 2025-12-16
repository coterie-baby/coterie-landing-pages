'use client';

import QuizHeader from '@/components/quiz/quiz-header';
import QuizProgress from '@/components/quiz/quiz-progress';
import WhyWeAsk from '@/components/quiz/why-we-ask';
import { useQuiz, getQuestion, sizingQuizConfig } from '@/lib/quiz';

const QUESTION_ID = 'diaper-size';

export default function DiaperSizeQuestion() {
  const { goToNext, flowTotalSteps } = useQuiz();
  const question = getQuestion(sizingQuizConfig, QUESTION_ID);

  const handleSelection = (value: string) => {
    goToNext(QUESTION_ID, value);
  };

  if (!question || !question.options) return null;

  // Step 5 in "already here" flow (5 questions total)
  const totalSteps = flowTotalSteps || 5;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white">
      <QuizHeader questionId={QUESTION_ID} />
      <QuizProgress currentStep={5} totalSteps={totalSteps} />

      {/* Question Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <h1 className="text-[29px] leading-[110%] tracking-[-0.64px] mb-6 text-center">
          {question.question}
        </h1>

        <div className="grid grid-cols-4 gap-3 w-full max-w-sm">
          {question.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelection(option.value)}
              className="py-4 px-4 rounded-lg text-[15px] transition-colors bg-white text-[#141414] border border-[#E7E7E7] hover:bg-[#0000C9] hover:text-white hover:border-[#0000C9] active:bg-[#0000C9] active:text-white"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      {question.helpText && question.helpAnswer && (
        <div className="flex-shrink-0 px-6 py-8">
          <WhyWeAsk helpText={question.helpText} helpAnswer={question.helpAnswer} />
        </div>
      )}
    </div>
  );
}
