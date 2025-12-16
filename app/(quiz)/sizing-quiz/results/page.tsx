'use client';

import { useState } from 'react';
import Image from 'next/image';
import QuizHeader from '@/components/quiz/quiz-header';
import QuizProgress from '@/components/quiz/quiz-progress';
import { Button } from '@/components/ui/button';
import { useQuiz } from '@/lib/quiz';

export default function ResultsPage() {
  const { getRecommendation, totalSteps, answers } = useQuiz();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSaved, setEmailSaved] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);

  const recommendation = getRecommendation();
  const babyName = answers.name as string;

  const handleAddToCart = () => {
    // TODO: Implement add to cart functionality
    alert('Added to cart!');
  };

  const handleAddToBabylist = () => {
    // TODO: Implement Babylist integration
    window.open('https://www.babylist.com', '_blank');
  };

  const handleSaveEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    // TODO: Implement email save API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setEmailSaved(true);
    setIsSubmitting(false);
  };

  if (!recommendation) {
    return (
      <div className="flex flex-col h-full overflow-hidden bg-white items-center justify-center">
        <p className="text-[#525252]">
          Unable to generate recommendation. Please try again.
        </p>
      </div>
    );
  }

  // Results page is the final step
  const currentStep = totalSteps + 1;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white">
      <QuizHeader questionId="results" showBackButton={false} />
      <QuizProgress currentStep={currentStep} totalSteps={totalSteps} />

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Hero Section */}
        <div className="px-6 py-6 text-center">
          <h1 className="text-[29px] leading-[110%] tracking-[-0.64px] mb-2">
            {babyName ? `${babyName}'s` : 'Your'} perfect fit
          </h1>
          <p className="text-[14px] text-[#525252]">{recommendation.reason}</p>
        </div>

        {/* Product Card */}
        <div className="px-6">
          <div className="bg-[#F7F7F7] rounded-2xl overflow-hidden">
            {/* Product Image */}
            <div className="relative aspect-square w-full">
              <Image
                src={recommendation.imageUrl}
                alt={recommendation.productName}
                fill
                className="object-cover"
              />
              {/* Size Badge */}
              <div className="absolute top-4 left-4 bg-white px-3 py-1.5 rounded-full">
                <span className="text-[13px] font-medium text-[#0000C9]">
                  {recommendation.size}
                </span>
              </div>
            </div>

            {/* Product Details */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-[18px] font-medium text-[#141414]">
                  {recommendation.productName}
                </h2>
                <span className="text-[18px] font-medium text-[#141414]">
                  {recommendation.price}
                </span>
              </div>
              <p className="text-[14px] text-[#525252] leading-[150%]">
                {recommendation.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex-shrink-0 border-t border-[#E7E7E7] px-6 py-4">
        {/* Email Form - shows when Save is clicked */}
        {showEmailForm && !emailSaved && (
          <form onSubmit={handleSaveEmail} className="flex gap-2 mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-full border border-[#E7E7E7] text-[14px] outline-none focus:border-[#0000C9] transition-colors"
              required
              autoFocus
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-[#0000C9] text-white rounded-full text-[14px] font-bold hover:bg-[#0000C9]/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? '...' : 'Send'}
            </button>
          </form>
        )}

        {emailSaved && (
          <div className="flex items-center justify-center gap-2 text-[14px] text-[#0000C9] mb-4">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>Saved! Check your inbox.</span>
          </div>
        )}

        {/* Main CTA */}
        <Button onClick={handleAddToCart} className="w-full text-xs">
          Add to cart
        </Button>

        {/* Secondary buttons */}
        <div className="flex gap-3 mt-3">
          <button
            onClick={handleAddToBabylist}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full border border-[#E7E7E7] text-[13px] font-bold bg-[#6e3264] text-white transition-colors hover:opacity-90"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/babylist-heart.png"
              alt=""
              width={20}
              height={20}
              className="object-contain"
            />
            Add to Babylist
          </button>

          {!emailSaved && (
            <button
              onClick={() => setShowEmailForm(!showEmailForm)}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#F7F7F7] text-[13px] font-bold text-[#141414] hover:border-[#0000C9] hover:text-[#0000C9] transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
