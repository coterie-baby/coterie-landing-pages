'use client';
import { useState } from 'react';
import { StarRating } from './reviews/star-rating';

const reviewTestimonials = [
  {
    category: 'Comfort',
    text: "10/10 would recommend. The comfort and fit are amazing! My baby sleeps through the night without any leaks. Plus the soft material doesn't irritate sensitive skin - absolutely excellent!",
    author: 'Sarah M.',
  },
  {
    category: 'Comfort',
    text: 'These diapers are so soft and comfortable. My baby never seems bothered by them, even during long car rides. The perfect fit means no leaks and no complaints!',
    author: 'Jessica L.',
  },
  {
    category: 'Value',
    text: 'Worth every penny! The quality is outstanding and the subscription saves us money. We used to buy premium diapers at the store for more, and these are even better quality.',
    author: 'Michael R.',
  },
  {
    category: 'Value',
    text: 'The subscription model is a game changer. We save money and never run out. The convenience plus the savings makes this the best value we&apos;ve found.',
    author: 'Emily T.',
  },
  {
    category: 'vs. Others',
    text: 'We tried every brand before finding Coterie. These are hands down the best. No leaks, no rashes, and the clean ingredients give us peace of mind. Nothing else compares.',
    author: 'David K.',
  },
  {
    category: 'vs. Others',
    text: 'Switched from a major brand and will never go back. These diapers are superior in every way - better absorbency, softer material, and cleaner ingredients.',
    author: 'Lisa P.',
  },
  {
    category: 'Benefits',
    text: 'The fast wicking technology is incredible. My baby stays dry all night, which means better sleep for everyone. The clean ingredients are a huge bonus too.',
    author: 'Rachel S.',
  },
  {
    category: 'Benefits',
    text: 'Love that these are hypoallergenic and dermatologist tested. My baby has sensitive skin and these are the only diapers that don&apos;t cause irritation.',
    author: 'Mark D.',
  },
  {
    category: 'Ingredients',
    text: 'Finally, a diaper brand that cares about what goes on my baby&apos;s skin. Clean ingredients, no harmful chemicals, and no fragrances. Exactly what we were looking for.',
    author: 'Amanda W.',
  },
  {
    category: 'Ingredients',
    text: 'The peace of mind knowing these are made with clean ingredients is priceless. No chlorine, no latex, no parabens - just safe, quality materials.',
    author: 'Chris B.',
  },
  {
    category: 'Convenience',
    text: 'The auto-renewal subscription is so convenient. Never run out of diapers again, and the quality is amazing. Highly recommend!',
    author: 'Jennifer H.',
  },
  {
    category: 'Convenience',
    text: 'Set it and forget it! The subscription service means we never have to remember to buy diapers. They just arrive when we need them. Game changer!',
    author: 'Tom M.',
  },
];
export function ReviewsToggleSection() {
  const [selectedFilter, setSelectedFilter] = useState<string>('Comfort');

  const filters = [
    'Comfort',
    'Value',
    'vs. Others',
    'Benefits',
    'Ingredients',
    'Convenience',
  ];

  // Filter testimonials based on selected filter
  const filteredTestimonials = reviewTestimonials.filter(
    (testimonial) => testimonial.category === selectedFilter
  );

  return (
    <section className="relative py-12 px-4 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Main Headline */}
        <h3 className="text-3xl md:text-4xl font-bold text-center mb-8 text-[#0000C9]">
          Join 1,000,000+ Parents Trusting Coterie
        </h3>

        {/* Filter Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-12">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm text-[#0000C9] font-medium transition-all ${
                selectedFilter === filter
                  ? 'bg-[#D1E3FB]'
                  : 'bg-white border border-gray-300 hover:border-[#0000C9]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Testimonials */}
        <div className="space-y-6">
          {filteredTestimonials.map((testimonial, i) => (
            <div
              key={i}
              className="bg-[#f5f5f5] rounded-lg p-4 flex flex-col gap-3"
            >
              <StarRating rating={5} />
              {/* Testimonial Text */}
              <p className="text-[#525252] text-sm leading-relaxed">
                {testimonial.text}
              </p>
              {/* Author */}
              <p className="text-sm font-semibold text-[#0000C9]">
                {testimonial.author}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Floating CTA Button */}
      {/* <button className="fixed bottom-6 left-6 bg-[#0000C9] text-white px-6 py-3 rounded-full font-semibold text-sm shadow-lg hover:bg-[#0000AA] transition-colors z-50 flex items-center gap-2">
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Claim 15% Off!
        </button> */}

      {/* Floating Chat Icon */}
      {/* <button className="fixed bottom-6 right-6 bg-[#0000C9] text-white w-14 h-14 rounded-full shadow-lg hover:bg-[#0000AA] transition-colors z-50 flex items-center justify-center">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button> */}
    </section>
  );
}
