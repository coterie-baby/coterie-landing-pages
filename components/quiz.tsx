'use client';
import { useState } from 'react';
import { Button } from './ui/button';

interface QuizQuestion {
  id: string;
  question: string;
  options: {
    id: string;
    label: string;
    value: string;
  }[];
}

interface QuizProps {
  title?: string;
  questions?: QuizQuestion[];
  onComplete?: (answers: Record<string, string>) => void;
}

const defaultQuestions: QuizQuestion[] = [
  {
    id: '1',
    question: 'What is your baby\'s current age?',
    options: [
      { id: 'newborn', label: 'Newborn (0-3 months)', value: 'newborn' },
      { id: 'infant', label: 'Infant (3-6 months)', value: 'infant' },
      { id: 'older', label: '6+ months', value: 'older' },
    ],
  },
  {
    id: '2',
    question: 'What size diaper does your baby wear?',
    options: [
      { id: 'size-n', label: 'Size N or N+1', value: 'size-n' },
      { id: 'size-1', label: 'Size 1', value: 'size-1' },
      { id: 'size-2', label: 'Size 2', value: 'size-2' },
      { id: 'size-3', label: 'Size 3', value: 'size-3' },
      { id: 'size-4', label: 'Size 4', value: 'size-4' },
    ],
  },
  {
    id: '3',
    question: 'What is most important to you in a diaper?',
    options: [
      { id: 'absorbency', label: 'Maximum absorbency', value: 'absorbency' },
      { id: 'comfort', label: 'Comfort and softness', value: 'comfort' },
      { id: 'ingredients', label: 'Clean ingredients', value: 'ingredients' },
      { id: 'leak', label: 'Leak protection', value: 'leak' },
    ],
  },
  {
    id: '4',
    question: 'How many diapers do you typically use per day?',
    options: [
      { id: '4-6', label: '4-6 diapers', value: '4-6' },
      { id: '6-8', label: '6-8 diapers', value: '6-8' },
      { id: '8-10', label: '8-10 diapers', value: '8-10' },
      { id: '10+', label: '10+ diapers', value: '10+' },
    ],
  },
  {
    id: '5',
    question: 'Would you prefer a subscription or one-time purchase?',
    options: [
      { id: 'subscription', label: 'Subscription (save 10%)', value: 'subscription' },
      { id: 'one-time', label: 'One-time purchase', value: 'one-time' },
    ],
  },
];

export default function Quiz({
  title = 'Find Your Perfect Diaper',
  questions = defaultQuestions,
  onComplete,
}: QuizProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isComplete, setIsComplete] = useState(false);

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;
  const isLastStep = currentStep === questions.length - 1;
  const isFirstStep = currentStep === 0;
  const hasAnswer = answers[currentQuestion.id] !== undefined;

  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const handleNext = () => {
    if (isLastStep) {
      setIsComplete(true);
      onComplete?.(answers);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setAnswers({});
    setIsComplete(false);
  };

  if (isComplete) {
    return (
      <section className="py-12 px-4 bg-[#D1E3FB]">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-lg p-8 md:p-12">
            <div className="mb-6">
              <svg
                className="w-16 h-16 mx-auto text-[#0000C9]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#0000C9]">
              Quiz Complete!
            </h2>
            <p className="text-[#525252] text-base mb-8 leading-relaxed">
              Based on your answers, we&apos;ve found the perfect products for
              your baby. Check out your personalized recommendations below.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handleRestart} variant="outline">
                Start Over
              </Button>
              <Button asChild>
                <a href="#products">View Recommendations</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-[#0000C9]">
            {title}
          </h2>
          <p className="text-[#525252] text-sm">
            Step {currentStep + 1} of {questions.length}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#0000C9] h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-[#D1E3FB] rounded-lg p-6 md:p-8 mb-6">
          <h3 className="text-xl md:text-2xl font-bold mb-6 text-[#0000C9]">
            {currentQuestion.question}
          </h3>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const isSelected = answers[currentQuestion.id] === option.value;
              return (
                <button
                  key={option.id}
                  onClick={() => handleAnswer(option.value)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-[#0000C9] bg-white shadow-md'
                      : 'border-gray-300 bg-white hover:border-[#0000C9] hover:bg-[#F9F9F9]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-medium ${
                        isSelected ? 'text-[#0000C9]' : 'text-[#525252]'
                      }`}
                    >
                      {option.label}
                    </span>
                    {isSelected && (
                      <svg
                        className="w-5 h-5 text-[#0000C9]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4">
          <Button
            onClick={handleBack}
            disabled={isFirstStep}
            variant="outline"
            className={isFirstStep ? 'opacity-50 cursor-not-allowed' : ''}
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!hasAnswer}
            className={!hasAnswer ? 'opacity-50 cursor-not-allowed' : ''}
          >
            {isLastStep ? 'Complete' : 'Next'}
          </Button>
        </div>
      </div>
    </section>
  );
}

