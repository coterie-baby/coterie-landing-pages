'use client';

import QuizHeader from '@/components/quiz/quiz-header';
import QuizProgress from '@/components/quiz/quiz-progress';
import WhyWeAsk from '@/components/quiz/why-we-ask';
import PageTransition from '@/components/quiz/page-transition';
import { useQuiz, getQuestion, sizingQuizConfig } from '@/lib/quiz';

const QUESTION_ID = 'baby';

export default function BabyQuestion() {
  const { goToNext, flowTotalSteps, flowSelected } = useQuiz();
  const question = getQuestion(sizingQuizConfig, QUESTION_ID);

  const handleSelection = (value: string) => {
    goToNext(QUESTION_ID, value);
  };

  if (!question || !question.options) return null;

  return (
    <PageTransition>
      <div className="flex flex-col h-full overflow-hidden bg-white">
        <QuizHeader questionId={QUESTION_ID} />
        <QuizProgress currentStep={1} totalSteps={flowTotalSteps} flowSelected={flowSelected} />

        {/* Question Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <h1 className="text-[29px] leading-[110%] tracking-[-0.64px] mb-6">
            {question.question}
          </h1>

          <div className="flex gap-3 w-full max-w-sm">
            {question.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelection(option.value)}
                className="flex-1 py-4 px-6 rounded-lg text-[15px] transition-colors bg-white text-[#141414] border border-[#E7E7E7] hover:bg-[#0000C9] hover:text-white hover:border-[#0000C9] active:bg-[#0000C9] active:text-white"
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
    </PageTransition>
  );
}
