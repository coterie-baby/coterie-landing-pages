export type QuestionType = 'single-select' | 'multi-select' | 'input' | 'date';

export interface QuestionOption {
  label: string;
  value: string;
  description?: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  subtext?: string;
  options?: QuestionOption[];
  placeholder?: string;
  helpText?: string;
  // For branching logic - function that returns next question ID based on answer
  getNextQuestion?: (answer: string | string[]) => string;
  // Default next question if no branching logic
  nextQuestion?: string;
  // Whether to auto-advance on selection (for single-select)
  autoAdvance?: boolean;
}

export interface QuizConfig {
  id: string;
  title: string;
  questions: Question[];
  // Order of question IDs for the default flow
  questionOrder: string[];
  // Starting question ID
  startQuestion: string;
}

// Quiz configuration
export const sizingQuizConfig: QuizConfig = {
  id: 'sizing-quiz',
  title: 'Sizing Quiz',
  startQuestion: 'baby',
  questionOrder: ['baby', 'age', 'weight', 'plan'],
  questions: [
    {
      id: 'baby',
      type: 'single-select',
      question: 'My baby is',
      helpText: 'Why do we ask?',
      autoAdvance: true,
      options: [
        { label: 'Already here', value: 'here' },
        { label: 'On the way', value: 'expecting' },
      ],
      getNextQuestion: (answer) => {
        // Could branch to different questions based on answer
        return answer === 'expecting' ? 'due-date' : 'age';
      },
      nextQuestion: 'age',
    },
    {
      id: 'due-date',
      type: 'date',
      question: "When is your baby due?",
      helpText: 'Why do we ask?',
      autoAdvance: false,
      nextQuestion: 'plan',
    },
    {
      id: 'age',
      type: 'single-select',
      question: "What's your baby's age?",
      helpText: 'Why do we ask?',
      autoAdvance: true,
      options: [
        { label: '0-3 months', value: '0-3' },
        { label: '3-6 months', value: '3-6' },
        { label: '6-12 months', value: '6-12' },
        { label: '12-18 months', value: '12-18' },
        { label: '18-24 months', value: '18-24' },
        { label: '24+ months', value: '24+' },
      ],
      nextQuestion: 'weight',
    },
    {
      id: 'weight',
      type: 'single-select',
      question: "What's your baby's weight?",
      helpText: 'Why do we ask?',
      autoAdvance: true,
      options: [
        { label: 'Under 6 lbs', value: 'under-6' },
        { label: '6-9 lbs', value: '6-9' },
        { label: '9-14 lbs', value: '9-14' },
        { label: '14-20 lbs', value: '14-20' },
        { label: '20-26 lbs', value: '20-26' },
        { label: '26-34 lbs', value: '26-34' },
        { label: '34+ lbs', value: '34+' },
      ],
      nextQuestion: 'plan',
    },
    {
      id: 'plan',
      type: 'multi-select',
      question: 'What are you looking for?',
      helpText: 'Why do we ask?',
      autoAdvance: false,
      options: [
        { label: 'Diapers', value: 'diapers' },
        { label: 'Pants', value: 'pants' },
        { label: 'Wipes', value: 'wipes' },
        { label: 'Not sure yet', value: 'unsure' },
      ],
      nextQuestion: 'results',
    },
  ],
};

// Helper to get question by ID
export function getQuestion(config: QuizConfig, questionId: string): Question | undefined {
  return config.questions.find((q) => q.id === questionId);
}

// Helper to get previous question ID
export function getPreviousQuestion(config: QuizConfig, currentQuestionId: string): string | null {
  const index = config.questionOrder.indexOf(currentQuestionId);
  if (index <= 0) return null;
  return config.questionOrder[index - 1];
}

// Helper to get question index (1-based for display)
export function getQuestionIndex(config: QuizConfig, questionId: string): number {
  const index = config.questionOrder.indexOf(questionId);
  return index + 1;
}

// Helper to get total questions count
export function getTotalQuestions(config: QuizConfig): number {
  return config.questionOrder.length;
}
