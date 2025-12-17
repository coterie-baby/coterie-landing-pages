'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import QuizHeader from '@/components/quiz/quiz-header';
import { useQuiz } from '@/lib/quiz';

// Icon paths for value props
const VALUE_PROP_ICONS = {
  'fragrance-free': '/fragrance-free.svg',
  sleep: '/sleep.svg',
  leaks: '/leaks.svg',
} as const;

type IconType = keyof typeof VALUE_PROP_ICONS;

interface ValueProp {
  icon: IconType;
  title: string;
  description: string;
}

// Loading screen component
function LoadingScreen({ babyName }: { babyName?: string }) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#FAF9F7] items-center justify-center">
      {/* Animated container */}
      <div className="flex flex-col items-center animate-loading-fade-in">
        {/* Coterie Logo */}
        <div className="animate-loading-pulse">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="#0000C9"
            viewBox="0 0 88.5 18.5"
            role="presentation"
            className="w-[120px]"
          >
            <path
              fill="#0000C9"
              d="M0 9.016C0 3.79 4.03 0 9.482 0c4.686 0 7.576 2.178 9.065 4.944L15.919 6.26c-1.204-2.374-3.503-3.767-6.295-3.767-4.423.01-6.755 3.32-6.755 6.522 0 3.779 2.912 6.469 6.711 6.469 2.781 0 5.08-1.177 6.263-3.42l2.496 1.274c-.985 1.786-3.328 4.628-8.562 4.628C4.14 17.99 0 14.374 0 9.017ZM26.605 5.14c4.106 0 6.942 2.7 6.942 6.446 0 3.746-2.803 6.403-6.92 6.403s-6.92-2.635-6.92-6.446c0-3.616 2.913-6.403 6.898-6.403Zm.022 10.562c2.43 0 4.292-1.764 4.292-4.05 0-2.45-1.861-4.204-4.292-4.204-2.43 0-4.292 1.764-4.292 4.051 0 2.44 1.861 4.203 4.292 4.203ZM36.59 5.466V1.361h2.781v4.084h4.883V7.73h-4.948v5.293c0 1.807.941 2.45 2.496 2.45.694 0 1.372-.205 1.949-.588l1.412 2.145c-.591.435-1.883.958-3.591.958-2.606 0-4.993-1.503-4.993-4.791V7.797h-2.584l-.054-2.33h2.65Zm15.635-.326c3.966 0 6.55 2.918 6.55 6.773v.174l-10.557.044c.273 2.156 1.752 3.571 4.335 3.571a4.238 4.238 0 0 0 1.997-.485 4.213 4.213 0 0 0 1.529-1.366l2.411 1.154c-.528.893-2.32 2.962-5.915 2.995-4.105.022-6.963-2.614-6.963-6.49 0-3.931 2.868-6.37 6.613-6.37Zm3.66 5.03c-.32-1.807-1.905-2.82-3.66-2.82-1.818 0-3.416.958-3.876 2.831l7.536-.01Zm4.902-4.704h2.63v1.906c1.117-1.503 3.011-1.906 4.533-1.906h.328V8.21h-.306c-2.934 0-4.555 1.481-4.555 3.681v5.771h-2.63V5.466ZM71.782.218a1.618 1.618 0 0 1 1.223.451 1.6 1.6 0 0 1 .485 1.204 1.593 1.593 0 0 1-.481 1.211 1.61 1.61 0 0 1-1.227.455c-1.03 0-1.73-.675-1.73-1.655a1.625 1.625 0 0 1 .5-1.209 1.642 1.642 0 0 1 1.23-.457Zm-1.336 5.248h2.636v12.196h-2.627l-.009-12.196ZM81.9 5.14c3.963 0 6.547 2.918 6.547 6.773v.174l-10.555.044c.274 2.156 1.752 3.571 4.336 3.571a4.238 4.238 0 0 0 1.996-.485 4.213 4.213 0 0 0 1.53-1.366l2.408 1.154c-.525.893-2.321 2.962-5.912 2.995-4.106.022-6.963-2.614-6.963-6.49 0-3.931 2.868-6.37 6.612-6.37Zm3.656 5.03c-.306-1.807-1.916-2.83-3.657-2.83-1.817 0-3.415.958-3.875 2.83h7.532Z"
            ></path>
          </svg>
        </div>

        {/* Loading message */}
        <div className="mt-8 text-center">
          <p className="text-[18px] text-[#141414] tracking-[-0.3px]">
            Finding {babyName ? `${babyName}'s` : 'your'} perfect fit
            <span className="inline-block w-[24px] text-left">{dots}</span>
          </p>
        </div>

        {/* Animated progress indicator */}
        <div className="mt-6 flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-[#0000C9] animate-loading-dot"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>

        {/* Subtle reassurance */}
        <p className="mt-8 text-[12px] text-[#8A8A8A] tracking-wide">
          Analyzing your answers
        </p>
      </div>
    </div>
  );
}

// Generate personalized value props based on quiz answers
function getPersonalizedValueProps(
  answers: Record<string, string | string[]>,
  babyName?: string
): ValueProp[] {
  const isExpecting = answers.baby === 'expecting';
  const name = babyName || 'your baby';

  if (isExpecting) {
    return [
      {
        icon: 'fragrance-free',
        title: 'Fragrance free',
        description: `No harsh chemicals or irritants for ${name}'s delicate skin`,
      },
      {
        icon: 'sleep',
        title: '12-hour comfort',
        description: 'Soft, breathable materials for peaceful nights',
      },
      {
        icon: 'leaks',
        title: 'Leak protection',
        description: 'Triple-layer core keeps newborn messes contained',
      },
    ];
  }

  // For babies already here - personalized based on name
  return [
    {
      icon: 'fragrance-free',
      title: 'Fragrance free',
      description: `Clean, gentle ingredients safe for ${name}'s sensitive skin`,
    },
    {
      icon: 'sleep',
      title: '12-hour overnight',
      description: `Superior absorption so ${name} wakes up dry`,
    },
    {
      icon: 'leaks',
      title: 'No leaks',
      description: `Flexible fit that moves with ${name} all day`,
    },
  ];
}

export default function ResultsPage() {
  const { getRecommendation, answers } = useQuiz();
  const [isLoading, setIsLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSaved, setEmailSaved] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);

  const recommendation = getRecommendation();
  const babyName = answers.name as string;

  // Get personalized value props based on quiz answers
  const personalizedValueProps = useMemo(
    () => getPersonalizedValueProps(answers, babyName),
    [answers, babyName]
  );

  // Handle loading to results transition
  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      // Small delay before showing results for smooth transition
      setTimeout(() => setShowResults(true), 100);
    }, 2400);

    return () => clearTimeout(loadingTimer);
  }, []);

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

  // Show loading screen
  if (isLoading) {
    return <LoadingScreen babyName={babyName} />;
  }

  if (!recommendation) {
    return (
      <div className="flex flex-col h-full overflow-hidden bg-[#FAF9F7] items-center justify-center">
        <p className="text-[#525252]">
          Unable to generate recommendation. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col h-full overflow-hidden bg-[#FAF9F7] transition-opacity duration-500 ${
        showResults ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <QuizHeader questionId="results" showBackButton={false} />

      {/* Main Content - Flex to fill available space */}
      <div className="flex-1 flex flex-col px-5 pb-5 overflow-y-auto">
        {/* Personalized Message */}
        <div
          className="text-center mt-5 animate-fade-up"
          style={{ opacity: 0, animationDelay: '200ms' }}
        >
          <h1 className="text-[24px] leading-[120%] tracking-[-0.5px] text-[#141414]">
            {babyName ? `${babyName}'s` : 'Your'} perfect fit
          </h1>
          <p className="text-[13px] text-[#525252] mt-1.5 leading-[140%] max-w-[280px] mx-auto">
            {recommendation.reason}
          </p>
        </div>

        {/* Enhanced Product Recommendation Card */}
        <div
          className="relative bg-white rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.08)] animate-scale-in mt-5"
          style={{ opacity: 0, animationDelay: '300ms' }}
        >
          {/* Top Section: Product Info */}
          <div className="flex p-4 gap-4">
            {/* Product Image */}
            <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-[#F5F4F2] flex-shrink-0">
              <Image
                src={recommendation.imageUrl}
                alt={recommendation.productName}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Product Details */}
            <div className="flex flex-col justify-center flex-1 min-w-0">
              <span className="text-[11px] font-medium tracking-[0.5px] uppercase text-[#0000C9]">
                Recommended
              </span>
              <span className="text-[20px] text-[#141414] mt-0.5 leading-tight">
                {recommendation.productName}
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-[#525252]">
                  {recommendation.size}
                </span>
                <span className="text-[#D4D4D4]">|</span>
                <span className="text-sm text-[#525252]">
                  {recommendation.price} per month
                </span>
              </div>
            </div>
          </div>

          {/* Divider with subtle gradient */}
          <div className="h-px bg-gradient-to-r from-transparent via-[#E8E4DF] to-transparent mx-4" />

          {/* Bottom Section: Personalized Value Props */}
          <div className="px-4 py-4">
            <p className="text-[10px] font-medium tracking-[0.8px] uppercase text-[#8A8A8A] mb-3">
              Why we chose this for {babyName || 'your baby'}
            </p>
            <div className="space-y-3">
              {personalizedValueProps.map((prop, index) => (
                <div
                  key={prop.title}
                  className="flex items-start gap-3 animate-fade-up"
                  style={{
                    opacity: 0,
                    animationDelay: `${500 + index * 100}ms`,
                    animationFillMode: 'forwards',
                  }}
                >
                  {/* Icon */}
                  <div className="w-5 h-5 flex-shrink-0 mt-0.5">
                    <Image
                      src={VALUE_PROP_ICONS[prop.icon]}
                      alt=""
                      width={20}
                      height={20}
                    />
                  </div>
                  {/* Text Content */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className="text-sm font-medium text-[#141414] leading-tight">
                      {prop.title}
                    </p>
                    <p className="text-[12px] text-[#6B6B6B] leading-[1.4] mt-0.5">
                      {prop.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1 min-h-4" />

        {/* CTA Section */}
        <div
          className="animate-fade-up pt-2"
          style={{ opacity: 0, animationDelay: '700ms' }}
        >
          {/* Email Form - shows when Save is clicked */}
          {showEmailForm && !emailSaved && (
            <form onSubmit={handleSaveEmail} className="flex gap-2 mb-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-full bg-white border border-[#E8E4DF] text-[14px] outline-none focus:border-[#0000C9] transition-colors"
                required
                autoFocus
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-3 bg-[#0000C9] text-white rounded-full text-[13px] font-semibold hover:bg-[#0000A0] transition-colors disabled:opacity-50"
              >
                {isSubmitting ? '···' : 'Send'}
              </button>
            </form>
          )}

          {emailSaved && (
            <div className="flex items-center justify-center gap-2 text-[13px] text-[#0000C9] mb-3 py-2">
              <svg
                className="w-4 h-4"
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
              <span className="font-medium">Saved! Check your inbox.</span>
            </div>
          )}

          {/* Primary CTA */}
          <Button
            onClick={handleAddToCart}
            className="w-full bg-[#0000C9] text-white rounded-full text-xs font-semibold tracking-wide hover:bg-[#0000A0] active:scale-[0.98] transition-all"
          >
            Add to cart
          </Button>

          {/* Secondary Actions */}
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleAddToBabylist}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#6e3264] text-white rounded-full text-[12px] font-semibold hover:opacity-90 active:scale-[0.98] transition-all"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/babylist-heart.png"
                alt=""
                width={16}
                height={16}
                className="object-contain"
              />
              Add to Babylist
            </button>

            {!emailSaved && (
              <button
                onClick={() => setShowEmailForm(!showEmailForm)}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-[#E8E4DF] text-[#141414] rounded-full text-[12px] font-semibold hover:border-[#0000C9] hover:text-[#0000C9] active:scale-[0.98] transition-all"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
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
    </div>
  );
}
