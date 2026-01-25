'use client';
import { useState, memo } from 'react';
import amplitude from '@/amplitude';
import { track } from '@vercel/analytics';
import { sendGTMEvent } from '@next/third-parties/google';
import { StarRating } from './reviews/star-rating';

interface Testimonial {
  category: string;
  text: string;
  author: string;
}

const TestimonialCard = memo(function TestimonialCard({
  testimonial,
}: {
  testimonial: Testimonial;
}) {
  return (
    <div className="bg-[#f5f5f5] rounded-lg p-4 flex flex-col gap-3">
      <StarRating rating={5} />
      <p className="text-[#525252] text-sm leading-relaxed">
        {testimonial.text}
      </p>
      <p className="text-sm">{testimonial.author}</p>
    </div>
  );
});

const reviewTestimonials = [
  {
    category: 'Sleep',
    text: 'So soft! Any my 5 week old went from sleeping 4 hours at night to 7 hours!',
    author: 'Sari',
  },
  {
    category: 'Sleep',
    text: 'The only diaper that our little one will sleep thru the night with',
    author: 'Mackenzie',
  },
  {
    category: 'Skin',
    text: 'We are so happy with Coterie diapers! My granddaughter’s diaper rash is GONE!',
    author: 'Susan',
  },
  {
    category: 'Skin',
    text: 'Amazing quality, my daughter’s skin is soft now and completely free of rash!',
    author: 'Dina',
  },
  {
    category: 'vs. Others',
    text: "We absolutely love these diapers. We tried several brands and this one has by far been the best. We were a little hesitant to try at first, but I'm so glad that we did. Our little guy seems to like them too!",
    author: 'Drew',
  },
  {
    category: 'vs. Others',
    text: 'I turned to Coterie because my baby HATES a wet diaper. He will cry the minute he feels it, even waking him from sleep. We tried multiple brands but online research said that Coterie was the most absorbent on the market. I was hesitant because of the price but I have to say that he lasts longer while wearing them and is able to stay asleep!',
    author: 'Michelle',
  },
  {
    category: 'Benefits',
    text: 'We love these diapers. Everything about them. They are soft, absorbent, and protect against rash. We’ve used NB-size 2 and wipes. We will continue!',
    author: 'Danielle',
  },
  {
    category: 'Benefits',
    text: 'Great quality and absorbency. My baby has yet to get any diaper rash or skin irritations as well. Love these diapers!',
    author: 'Jesse',
  },
  {
    category: 'Ingredients',
    text: 'Soft, durable, clean ingredients and my baby’s bum loves it. Other diapers have her a rash but not these! These diapers are the Tesla of diapers hands down!',
    author: 'Anna',
  },
  {
    category: 'Ingredients',
    text: 'So thankful for coterie and their ingredients! I feel safe using them on my baby! The auto shipping is so convenient!',
    author: 'Jamie',
  },
  {
    category: 'Value',
    text: 'I hate to say it but this diaper is worth the price. I tried every single diaper with my first son and eventually tried these once he was in size 4 and I needed something great for overnight. I was sold night one when I touched the inside of the diaper in the morning and it was so dry!!',
    author: 'Kara',
  },
  {
    category: 'Value',
    text: 'I was very hesitant to spend so much on diapers, and with my first, I didn’t. But I decided to try a pack of Coterie when my second was 9 months old and I can’t go back. Before, we constantly had blowouts and some pretty gnarly diaper rashes. My son has eczema and I know these diapers have helped to relieve that some. I highly recommend them for any baby with sensitive skin',
    author: 'Chelsea',
  },
];
export function ReviewsToggleSection() {
  const [selectedFilter, setSelectedFilter] = useState<string>('Sleep');

  const filters = [
    'Sleep',
    'Skin',
    'vs. Others',
    'Benefits',
    'Ingredients',
    'Value',
  ];

  const handleFilterClick = (filter: string) => {
    setSelectedFilter(filter);

    amplitude.track('reviews_filter_clicked', {
      filter_name: filter,
    });

    track('reviews_filter_clicked', {
      filter_name: filter,
    });

    sendGTMEvent({
      event: 'ui_custom_event',
      customEventPayload: {
        name: 'reviews_filter_clicked',
        value: {
          cta_text: filter,
          location: 'Reviews Toggle',
        },
      },
    });
  };

  // Filter testimonials based on selected filter
  const filteredTestimonials = reviewTestimonials.filter(
    (testimonial) => testimonial.category === selectedFilter
  );

  return (
    <section className="relative py-12 px-4 md:px-10 bg-white">
      <div className="">
        {/* Main Headline */}
        <h3 className="text-3xl md:text-4xl font-bold text-center mb-8 text-[#0000C9]">
          The Internet&apos;s Favorite Diaper
        </h3>

        {/* Filter Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-12">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterClick(filter)}
              className={`cursor-pointer px-4 py-2 rounded-full text-sm text-[#0000C9] font-medium transition-all ${
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
            <TestimonialCard
              key={`${testimonial.category}-${i}`}
              testimonial={testimonial}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
