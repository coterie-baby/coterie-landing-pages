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
  flowTotalSteps: number;
  flowSelected: boolean;
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
  imageUrl: string;
  price: string;
  description: string;
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

  // Determine flow based on baby answer
  const babyAnswer = answers.baby as string | undefined;
  const flowSelected = !!babyAnswer;

  // "Already here" flow: baby → name → birthdate → diaper-brand → diaper-size → results (5 questions + results = 6)
  // "On the way" flow: baby → due-date → results (2 questions + results = 3)
  const flowTotalSteps = babyAnswer === 'expecting' ? 2 : babyAnswer === 'here' ? 5 : 0;

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
    const babyStatus = answers.baby as string;
    const diaperSize = answers['diaper-size'] as string;
    const babyName = answers.name as string;

    const baseImageUrl = 'https://cdn.sanity.io/images/e4q6bkl9/production';

    // For expecting parents
    if (babyStatus === 'expecting') {
      return {
        productId: 'newborn-bundle',
        productName: 'The Newborn Bundle',
        size: 'Newborn',
        reason: 'Everything you need to be prepared for baby\'s arrival',
        imageUrl: `${baseImageUrl}/4a078422f76dfdda4483b4c621917c725061e9a8-2919x4355.jpg`,
        price: '$89',
        description: 'Our softest diapers in sizes Newborn and 1, plus a pack of our gentle wipes.',
      };
    }

    // Size recommendation based on current diaper size
    const sizeMap: Record<string, { size: string; displaySize: string }> = {
      'n': { size: 'Newborn', displaySize: 'Newborn' },
      '1': { size: '1', displaySize: 'Size 1' },
      '2': { size: '2', displaySize: 'Size 2' },
      '3': { size: '3', displaySize: 'Size 3' },
      '4': { size: '4', displaySize: 'Size 4' },
      '5': { size: '5', displaySize: 'Size 5' },
      '6': { size: '6', displaySize: 'Size 6' },
      '7': { size: '7', displaySize: 'Size 7' },
    };

    const sizeInfo = sizeMap[diaperSize] || { size: '3', displaySize: 'Size 3' };
    const personalizedName = babyName ? `${babyName}'s` : 'Your baby\'s';

    return {
      productId: `diaper-size-${sizeInfo.size}`,
      productName: 'The Diaper',
      size: sizeInfo.displaySize,
      reason: `${personalizedName} perfect fit based on their current size`,
      imageUrl: `${baseImageUrl}/4a078422f76dfdda4483b4c621917c725061e9a8-2919x4355.jpg`,
      price: '$85',
      description: 'Ultra-soft, ultra-absorbent diapers that keep baby comfortable day and night.',
    };
  }, [answers]);

  const value: QuizContextValue = {
    config,
    answers,
    currentQuestionId,
    currentQuestion,
    currentStep,
    totalSteps,
    flowTotalSteps,
    flowSelected,
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
