'use client';
import { useState, useEffect } from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

interface PressTestimonial {
  id: string;
  quote: string;
  source: string;
  publication?: string;
}

interface PressTestimonialsProps {
  testimonials?: PressTestimonial[];
}

const defaultTestimonials: PressTestimonial[] = [
  {
    id: '1',
    quote:
      "In eight years of testing powders, pills, and potions, there's only one that I liked enough to then spend my own money on: Coterie's premium diapers.",
    source: 'bon appétit',
    publication: 'Bon Appétit',
  },
  {
    id: '2',
    quote:
      'If you want the best for your baby, Coterie is the only choice. Premium quality that actually works.',
    source: 'Parents Magazine',
    publication: 'Parents',
  },
  {
    id: '3',
    quote:
      'The comfort and quality of Coterie products is unmatched. Our baby has never been happier.',
    source: 'The Bump',
    publication: 'The Bump',
  },
  {
    id: '4',
    quote:
      'After trying every brand, Coterie stands out for its clean ingredients and superior performance.',
    source: 'Vogue',
    publication: 'Vogue',
  },
];

export default function PressTestimonials({
  testimonials = defaultTestimonials,
}: PressTestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentTestimonial = testimonials[currentIndex];

  // Auto-scroll functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === testimonials.length - 1 ? 0 : prev + 1
      );
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <section className="py-8 px-4 bg-[#F7F7F7]">
      <div className="max-w-4xl mx-auto">
        <div className="relative bg-[#F7F7F7]">
          {/* Testimonial Content */}
          <div className="relative px-8 md:px-16">
            {/* Left Arrow */}
            <button
              onClick={handlePrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors z-10"
              aria-label="Previous testimonial"
            >
              <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
            </button>

            {/* Main Testimonial */}
            <div className="text-center">
              <blockquote className="text-sm md:text-xl lg:text-2xl leading-relaxed mb-6">
                &ldquo;{currentTestimonial.quote}&rdquo;
              </blockquote>
              <p className="text-sm md:text-base text-gray-600 italic font-serif">
                {currentTestimonial.source}
              </p>
            </div>

            {/* Right Arrow */}
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors z-10"
              aria-label="Next testimonial"
            >
              <ChevronRightIcon className="w-6 h-6 text-gray-700" />
            </button>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-gray-900 w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
