'use client';
import { useState } from 'react';

interface QuickQuestion {
  id: string;
  question: string;
  icon: React.ReactNode;
}

interface AIQuickQuestionsProps {
  onQuestionClick?: (question: string) => void;
}

const quickQuestions: QuickQuestion[] = [
  {
    id: 'size',
    question: 'What size do I need?',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
  },
  {
    id: 'price',
    question: 'How much does it cost?',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 'ingredients',
    question: 'Are they safe?',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    id: 'subscription',
    question: 'Tell me about subscription',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
];

export default function AIQuickQuestions({
  onQuestionClick,
}: AIQuickQuestionsProps) {
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);

  const handleQuestionClick = (question: QuickQuestion) => {
    setSelectedQuestion(question.id);
    onQuestionClick?.(question.question);

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        size: 'Our diapers come in sizes N, 1, 2, 3, and 4. Size N fits babies under 10 lbs, Size 1 fits 8-12 lbs, Size 2 fits 10-16 lbs, Size 3 fits 14-24 lbs, and Size 4 fits 20-32 lbs.',
        price:
          'Our subscription starts at $95/month for Size 2, with 10% savings on auto-renew. One-time purchases are $105.50. You can save up to $10.50 per month with our subscription!',
        ingredients:
          "Yes! Coterie diapers are made with clean ingredients - no fragrance, lotion, latex, dyes, chlorine, or parabens. They're hypoallergenic, dermatologist tested, and perfect for sensitive skin.",
        subscription:
          'Our auto-renew subscription saves you 10% and ensures you never run out. You can pause, skip, or cancel anytime with no commitment. Plus, your first box includes a next size trial!',
      };

      setAnswer(responses[question.id] || 'I\'d be happy to help with that!');
    }, 800);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {quickQuestions.map((q) => (
          <button
            key={q.id}
            onClick={() => handleQuestionClick(q)}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              selectedQuestion === q.id
                ? 'border-[#0000C9] bg-[#D1E3FB]'
                : 'border-gray-200 bg-white hover:border-[#0000C9] hover:bg-[#F9F9F9]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${
                  selectedQuestion === q.id
                    ? 'bg-[#0000C9] text-white'
                    : 'bg-[#D1E3FB] text-[#0000C9]'
                }`}
              >
                {q.icon}
              </div>
              <span
                className={`text-sm font-medium ${
                  selectedQuestion === q.id
                    ? 'text-[#0000C9]'
                    : 'text-[#525252]'
                }`}
              >
                {q.question}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* AI Answer Display */}
      {selectedQuestion && answer && (
        <div className="bg-[#D1E3FB] rounded-lg p-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#0000C9] flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-bold">AI</span>
            </div>
            <div className="flex-1">
              <p className="text-sm text-[#0000C9] leading-relaxed">{answer}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

