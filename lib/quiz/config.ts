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
  // For combined size/brand question
  sizeOptions?: QuestionOption[];
  brandOptions?: QuestionOption[];
  placeholder?: string;
  helpText?: string;
  // Answer shown when "Why do we ask?" is expanded
  helpAnswer?: string;
  // For branching logic - function that returns next question ID based on answer
  getNextQuestion?: (answer: string | string[]) => string;
  // Default next question if no branching logic
  nextQuestion?: string;
  // Whether to auto-advance on selection (for single-select)
  autoAdvance?: boolean;
  // Whether the question is optional (can skip without answering)
  optional?: boolean;
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
  questionOrder: ['baby', 'name', 'birthdate', 'current-diaper'],
  questions: [
    {
      id: 'baby',
      type: 'single-select',
      question: 'My baby is',
      helpText: 'Why do we ask?',
      helpAnswer:
        "If they're already here, we'll use your baby's current diaper fit for reference. Otherwise, we'll rely on our predictive sizing algorithm.",
      autoAdvance: true,
      options: [
        { label: 'Already here', value: 'here' },
        { label: 'On the way', value: 'expecting' },
      ],
      getNextQuestion: (answer) => {
        // Branch to different questions based on answer
        return answer === 'expecting' ? 'due-date' : 'name';
      },
      nextQuestion: 'name',
    },
    {
      id: 'name',
      type: 'input',
      question: "My baby's name is",
      placeholder: "enter baby's name",
      subtext: '(This is optional)',
      helpText: 'Why do we ask?',
      helpAnswer:
        "We'd love to personalize your experience! Your baby's name helps us make recommendations just for them.",
      autoAdvance: false,
      optional: true,
      nextQuestion: 'birthdate',
    },
    {
      id: 'birthdate',
      type: 'date',
      question: 'When was your baby born?',
      helpText: 'Why do we ask?',
      helpAnswer:
        "Your baby's age helps us understand their growth stage and recommend the most comfortable diaper fit for their current needs.",
      autoAdvance: false,
      nextQuestion: 'current-diaper',
    },
    {
      id: 'due-date',
      type: 'date',
      question: 'When is your baby due?',
      helpText: 'Why do we ask?',
      helpAnswer:
        "Knowing your due date helps us recommend the right newborn sizes and quantities so you're prepared when baby arrives.",
      autoAdvance: false,
      nextQuestion: 'results',
    },
    {
      id: 'current-diaper',
      type: 'single-select',
      question: 'What diaper does your baby currently wear?',
      helpText: 'Why do we ask?',
      helpAnswer:
        'Different brands fit differently. Knowing your current size and brand helps us recommend the best Coterie fit for your baby.',
      autoAdvance: false,
      sizeOptions: [
        { label: 'N', value: 'n' },
        { label: '1', value: '1' },
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
        { label: '5', value: '5' },
        { label: '6', value: '6' },
        { label: '7', value: '7' },
      ],
      brandOptions: [
        { label: 'Pampers', value: 'pampers' },
        { label: 'Huggies', value: 'huggies' },
        { label: 'Luvs', value: 'luvs' },
        { label: 'Honest', value: 'honest' },
        { label: 'Hello Bello', value: 'hello-bello' },
        { label: 'Other', value: 'other' },
      ],
      nextQuestion: 'results',
    },
  ],
};

// Helper to get question by ID
export function getQuestion(
  config: QuizConfig,
  questionId: string
): Question | undefined {
  return config.questions.find((q) => q.id === questionId);
}

// Helper to get previous question ID
export function getPreviousQuestion(
  config: QuizConfig,
  currentQuestionId: string
): string | null {
  const index = config.questionOrder.indexOf(currentQuestionId);
  if (index <= 0) return null;
  return config.questionOrder[index - 1];
}

// Helper to get question index (1-based for display)
export function getQuestionIndex(
  config: QuizConfig,
  questionId: string
): number {
  const index = config.questionOrder.indexOf(questionId);
  return index + 1;
}

// Helper to get total questions count
export function getTotalQuestions(config: QuizConfig): number {
  return config.questionOrder.length;
}
