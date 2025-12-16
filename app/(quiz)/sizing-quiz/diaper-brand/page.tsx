'use client';

import QuizHeader from '@/components/quiz/quiz-header';
import QuizProgress from '@/components/quiz/quiz-progress';
import WhyWeAsk from '@/components/quiz/why-we-ask';
import { useQuiz, getQuestion, sizingQuizConfig } from '@/lib/quiz';

const QUESTION_ID = 'diaper-brand';

const BRAND_LOGOS: Record<string, string> = {
  pampers: '/brand-logos/pampers.png',
  huggies: '/brand-logos/huggies.png',
  'millie-moon': '/brand-logos/millie-moon.webp',
  honest: '/brand-logos/honest.jpg',
  'hello-bello': '/brand-logos/hello-bello.png',
};

export default function DiaperBrandQuestion() {
  const { goToNext, flowTotalSteps } = useQuiz();
  const question = getQuestion(sizingQuizConfig, QUESTION_ID);

  const handleSelection = (value: string) => {
    goToNext(QUESTION_ID, value);
  };

  if (!question || !question.options) return null;

  // Step 4 in "already here" flow (5 questions total)
  const totalSteps = flowTotalSteps || 5;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white">
      <QuizHeader questionId={QUESTION_ID} />
      <QuizProgress currentStep={4} totalSteps={totalSteps} />

      {/* Question Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <h1 className="text-[29px] leading-[110%] tracking-[-0.64px] mb-6 text-center">
          {question.question}
        </h1>

        <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
          {question.options.map((option) => {
            const logoSrc = BRAND_LOGOS[option.value];
            return (
              <button
                key={option.value}
                onClick={() => handleSelection(option.value)}
                className="py-4 px-4 rounded-lg transition-colors bg-white text-[#141414] border border-[#E7E7E7] hover:border-[#0000C9] active:border-[#0000C9] flex items-center justify-center min-h-[72px]"
              >
                {logoSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logoSrc}
                    alt={option.label}
                    className="max-h-[40px] max-w-full object-contain"
                  />
                ) : (
                  <span className="text-[15px]">{option.label}</span>
                )}
              </button>
            );
          })}
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
