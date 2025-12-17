'use client';

import { useState } from 'react';
import QuizHeader from '@/components/quiz/quiz-header';
import QuizProgress from '@/components/quiz/quiz-progress';
import WhyWeAsk from '@/components/quiz/why-we-ask';
import PageTransition from '@/components/quiz/page-transition';
import { Button } from '@/components/ui/button';
import { useQuiz, getQuestion, sizingQuizConfig } from '@/lib/quiz';

const QUESTION_ID = 'due-date';

export default function DueDateQuestion() {
  const { goToNext, flowTotalSteps } = useQuiz();
  const question = getQuestion(sizingQuizConfig, QUESTION_ID);

  const [dateValue, setDateValue] = useState('');

  const handleNext = () => {
    if (dateValue) {
      // Convert mm/dd/yyyy to yyyy-mm-dd for storage
      const [month, day, year] = dateValue.split('/');
      if (month && day && year) {
        const dueDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        goToNext(QUESTION_ID, dueDate);
      }
    }
  };

  // Validate date format mm/dd/yyyy
  const isValidDate = (value: string) => {
    const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
    return regex.test(value);
  };

  const isComplete = isValidDate(dateValue);

  if (!question) return null;

  return (
    <PageTransition>
      <div className="flex flex-col h-full overflow-hidden bg-white">
        <QuizHeader questionId={QUESTION_ID} />
        <QuizProgress currentStep={2} totalSteps={flowTotalSteps} />

        {/* Question Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <h1 className="text-[29px] leading-[110%] tracking-[-0.64px] mb-6 text-center">
            my baby&apos;s due date is
          </h1>

          <div className="w-full max-w-sm flex flex-col items-center">
            <input
              type="text"
              value={dateValue}
              onChange={(e) => {
                let value = e.target.value.replace(/[^\d/]/g, '');
                // Auto-format as user types
                if (value.length === 2 && !value.includes('/')) {
                  value = value + '/';
                } else if (value.length === 5 && value.split('/').length === 2) {
                  value = value + '/';
                }
                // Limit to mm/dd/yyyy format length
                if (value.length <= 10) {
                  setDateValue(value);
                }
              }}
              placeholder="mm/dd/yyyy"
              className="w-full text-center text-[24px] text-[#525252] placeholder:text-[#525252] border-b border-[#0000C9] pb-2 outline-none bg-transparent"
            />
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
              <Button
                onClick={handleNext}
                disabled={!isComplete}
                className="py-4 px-12 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
