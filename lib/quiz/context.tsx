'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import {
  QuizConfig,
  Question,
  getQuestion,
  getPreviousQuestion,
  getQuestionIndex,
  getTotalQuestions,
  sizingQuizConfig,
} from './config';

export interface QuizAnswers {
  [questionId: string]: string | string[];
}

interface QuizContextValue {
  config: QuizConfig;
  answers: QuizAnswers;
  currentQuestionId: string | null;
  currentQuestion: Question | null;
  currentStep: number;
  totalSteps: number;
  setAnswer: (questionId: string, answer: string | string[]) => void;
  getAnswer: (questionId: string) => string | string[] | undefined;
  goToNext: (currentQuestionId: string, answer?: string | string[]) => void;
  goToPrevious: (currentQuestionId: string) => void;
  goToQuestion: (questionId: string) => void;
  canGoBack: () => boolean;
  resetQuiz: () => void;
  getRecommendation: () => ProductRecommendation | null;
}

export interface ProductRecommendation {
  productId: string;
  productName: string;
  size: string;
  reason: string;
}

const QuizContext = createContext<QuizContextValue | null>(null);

interface QuizProviderProps {
  children: ReactNode;
  config?: QuizConfig;
  basePath?: string;
}

export function QuizProvider({
  children,
  config = sizingQuizConfig,
  basePath = '/sizing-quiz',
}: QuizProviderProps) {
  const router = useRouter();
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null);

  const currentQuestion = currentQuestionId
    ? getQuestion(config, currentQuestionId) ?? null
    : null;

  const currentStep = currentQuestionId
    ? getQuestionIndex(config, currentQuestionId)
    : 0;

  const totalSteps = getTotalQuestions(config);

  const setAnswer = useCallback((questionId: string, answer: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  }, []);

  const getAnswer = useCallback(
    (questionId: string) => answers[questionId],
    [answers]
  );

  const goToQuestion = useCallback(
    (questionId: string) => {
      setCurrentQuestionId(questionId);
      if (questionId === 'results') {
        router.push(`${basePath}/results`);
      } else {
        router.push(`${basePath}/${questionId}`);
      }
    },
    [router, basePath]
  );

  const goToNext = useCallback(
    (currentQId: string, answer?: string | string[]) => {
      const question = getQuestion(config, currentQId);
      if (!question) return;

      // Save answer if provided
      if (answer !== undefined) {
        setAnswer(currentQId, answer);
      }

      // Determine next question
      let nextQuestionId: string | undefined;

      if (question.getNextQuestion && answer !== undefined) {
        nextQuestionId = question.getNextQuestion(answer);
      } else {
        nextQuestionId = question.nextQuestion;
      }

      if (nextQuestionId) {
        goToQuestion(nextQuestionId);
      }
    },
    [config, setAnswer, goToQuestion]
  );

  const goToPrevious = useCallback(
    (currentQId: string) => {
      const previousId = getPreviousQuestion(config, currentQId);
      if (previousId) {
        goToQuestion(previousId);
      } else {
        // Go back to quiz landing page
        router.push(basePath);
      }
    },
    [config, goToQuestion, router, basePath]
  );

  const canGoBack = useCallback(
    () => {
      return true; // Can always go back (to previous question or landing)
    },
    []
  );

  const resetQuiz = useCallback(() => {
    setAnswers({});
    setCurrentQuestionId(null);
    router.push(basePath);
  }, [router, basePath]);

  const getRecommendation = useCallback((): ProductRecommendation | null => {
    // Logic to determine product recommendation based on answers
    const weight = answers.weight as string;
    const babyStatus = answers.baby as string;

    if (!weight && babyStatus === 'expecting') {
      return {
        productId: 'newborn-bundle',
        productName: 'Newborn Bundle',
        size: 'Newborn',
        reason: 'Perfect for expecting parents to be prepared',
      };
    }

    // Size recommendation based on weight
    const sizeMap: Record<string, { size: string; productId: string }> = {
      'under-6': { size: 'Preemie', productId: 'diaper-preemie' },
      '6-9': { size: 'Newborn', productId: 'diaper-newborn' },
      '9-14': { size: 'Size 1', productId: 'diaper-size-1' },
      '14-20': { size: 'Size 2', productId: 'diaper-size-2' },
      '20-26': { size: 'Size 3', productId: 'diaper-size-3' },
      '26-34': { size: 'Size 4', productId: 'diaper-size-4' },
      '34+': { size: 'Size 5', productId: 'diaper-size-5' },
    };

    const recommendation = sizeMap[weight];
    if (recommendation) {
      return {
        productId: recommendation.productId,
        productName: 'The Diaper',
        size: recommendation.size,
        reason: `Based on your baby's weight of ${weight} lbs`,
      };
    }

    return null;
  }, [answers]);

  const value: QuizContextValue = {
    config,
    answers,
    currentQuestionId,
    currentQuestion,
    currentStep,
    totalSteps,
    setAnswer,
    getAnswer,
    goToNext,
    goToPrevious,
    goToQuestion,
    canGoBack,
    resetQuiz,
    getRecommendation,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}
