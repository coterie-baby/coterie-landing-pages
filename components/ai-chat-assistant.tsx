'use client';
import { useState } from 'react';
import { Button } from './ui/button';
import { ArrowUpIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface AIChatAssistantProps {
  suggestedQuestions?: string[];
  onMessageSent?: (message: string) => void;
  compact?: boolean;
}

const defaultSuggestedQuestions = [
  'What sizes do you offer?',
  'How much do they cost?',
  'Are they safe for sensitive skin?',
  'Tell me about your subscription',
];

export default function AIChatAssistant({
  suggestedQuestions = defaultSuggestedQuestions,
  onMessageSent,
  compact = false,
}: AIChatAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    onMessageSent?.(userMessage);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const responses: Record<string, string> = {
        size: 'Our diapers come in sizes N, 1, 2, 3, and 4. What size is your baby currently wearing?',
        price:
          'Our subscription starts at $95/month for Size 2, with 10% savings on auto-renew. One-time purchases are $105.50.',
        ingredients:
          "Coterie diapers are made with clean ingredients - no fragrance, lotion, latex, dyes, chlorine, or parabens. They're hypoallergenic and dermatologist tested.",
        subscription:
          'Yes! Our auto-renew subscription saves you 10% and ensures you never run out. You can pause, skip, or cancel anytime.',
      };

      const lowerInput = userMessage.toLowerCase();
      let response =
        "I'd be happy to help! Our premium diapers feature fast-wicking technology, clean ingredients, and superior absorbency. What would you like to know more about?";

      if (lowerInput.includes('size') || lowerInput.includes('sizing')) {
        response = responses['size'];
      } else if (
        lowerInput.includes('price') ||
        lowerInput.includes('cost') ||
        lowerInput.includes('how much')
      ) {
        response = responses['price'];
      } else if (
        lowerInput.includes('ingredient') ||
        lowerInput.includes('safe') ||
        lowerInput.includes('chemical')
      ) {
        response = responses['ingredients'];
      } else if (
        lowerInput.includes('subscription') ||
        lowerInput.includes('subscribe') ||
        lowerInput.includes('auto-renew')
      ) {
        response = responses['subscription'];
      }

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: response },
      ]);
      setIsLoading(false);
    }, 1000);
  };

  const content = (
    <div
      className={
        compact ? 'h-full flex flex-col' : 'bg-[#F9F9F9] rounded-lg p-6 mb-6'
      }
    >
      {!compact && (
        <>
          <p className="flex items-center text-xl gap-2 mb-4 text-[#0000C9]">
            <SparklesIcon className="w-6 h-6" />
            Hi Ian, I&apos;m Clara!
          </p>
          <p className="text-[#525252] mb-6">
            Get instant answers about sizing, ingredients, subscriptions, and
            more.
          </p>
        </>
      )}

      {/* Chat Messages */}
      {messages.length > 0 && (
        <div className={`mb-6 space-y-4 ${compact ? 'flex-1 overflow-y-auto p-4' : ''}`}>
          {messages.map((message, i) => (
            <div
              key={i}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-[#0000C9] text-white'
                    : 'bg-white border border-gray-200 text-[#525252]'
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
                <p className="text-sm text-[#525252]">Thinking...</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Suggested Questions */}
      {!compact && messages.length === 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {suggestedQuestions.map((question, i) => (
            <button
              key={i}
              onClick={() => setInput(question)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm text-[#525252] hover:border-[#0000C9] hover:text-[#0000C9] transition-colors"
            >
              {question}
            </button>
          ))}
        </div>
      )}

      {/* Chat Input */}
      <div className={compact ? 'p-4 border-t border-gray-200' : ''}>
        <ChatForm
          input={input}
          setInput={setInput}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );

  if (compact) {
    return content;
  }

  return (
    <section id="chat" className="py-8 px-4 bg-white">
      <div className="max-w-4xl mx-auto">{content}</div>
    </section>
  );
}

function ChatForm({
  input,
  setInput,
  onSubmit,
  isLoading,
}: {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}) {
  return (
    <form onSubmit={onSubmit} className="flex gap-3">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="flex-1 border border-gray-300 rounded-full px-4 py-3 text-sm focus:outline-none focus:border-[#0000C9] focus:ring-2 focus:ring-[#0000C9]/20 transition-colors"
        placeholder="Ask me anything..."
        disabled={isLoading}
      />
      <Button
        type="submit"
        disabled={isLoading || !input.trim()}
        className="rounded-full w-12 h-12 shrink-0"
      >
        <ArrowUpIcon className="size-5 stroke-[2.5]" />
      </Button>
    </form>
  );
}
