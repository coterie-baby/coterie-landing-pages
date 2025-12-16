'use client';

import { useState, useMemo } from 'react';
import QuizHeader from '@/components/quiz/quiz-header';
import QuizProgress from '@/components/quiz/quiz-progress';
import WhyWeAsk from '@/components/quiz/why-we-ask';
import { Button } from '@/components/ui/button';
import { useQuiz, getQuestion, sizingQuizConfig } from '@/lib/quiz';

const QUESTION_ID = 'birthdate';

const MONTHS = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

export default function BirthdateQuestion() {
  const { goToNext, totalSteps } = useQuiz();
  const question = getQuestion(sizingQuizConfig, QUESTION_ID);
  const currentStep = sizingQuizConfig.questionOrder.indexOf(QUESTION_ID) + 1;

  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [year, setYear] = useState('');

  // Generate years from current year back to 4 years ago (babies up to ~4 years)
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const yearOptions = [];
    for (let y = currentYear; y >= currentYear - 4; y--) {
      yearOptions.push(y.toString());
    }
    return yearOptions;
  }, []);

  // Generate days based on selected month and year
  const days = useMemo(() => {
    if (!month || !year) {
      return Array.from({ length: 31 }, (_, i) =>
        (i + 1).toString().padStart(2, '0')
      );
    }
    const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) =>
      (i + 1).toString().padStart(2, '0')
    );
  }, [month, year]);

  const handleNext = () => {
    if (month && day && year) {
      const birthdate = `${year}-${month}-${day}`;
      goToNext(QUESTION_ID, birthdate);
    }
  };

  const isComplete = month && day && year;

  if (!question) return null;

  const selectClassName =
    'flex-1 py-3 px-4 rounded-lg text-[15px] bg-white text-[#141414] border border-[#E7E7E7] outline-none appearance-none cursor-pointer focus:border-[#0000C9] transition-colors';

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white">
      <QuizHeader questionId={QUESTION_ID} />
      <QuizProgress currentStep={currentStep} totalSteps={totalSteps} />

      {/* Question Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <h1 className="text-[29px] leading-[110%] tracking-[-0.64px] mb-8 text-center">
          {question.question}
        </h1>

        <div className="w-full max-w-sm flex flex-col gap-3">
          {/* Month Select */}
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className={selectClassName}
            aria-label="Month"
          >
            <option value="" disabled>
              Month
            </option>
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>

          {/* Day Select */}
          <select
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className={selectClassName}
            aria-label="Day"
          >
            <option value="" disabled>
              Day
            </option>
            {days.map((d) => (
              <option key={d} value={d}>
                {parseInt(d)}
              </option>
            ))}
          </select>

          {/* Year Select */}
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className={selectClassName}
            aria-label="Year"
          >
            <option value="" disabled>
              Year
            </option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
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
  );
}
