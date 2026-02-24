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
  rating: number;
}

const TestimonialCard = memo(function TestimonialCard({
  testimonial,
  cardWidth,
}: {
  testimonial: Testimonial;
  cardWidth?: string;
}) {
  return (
    <div
      className="bg-[#f0f0f0] rounded-2xl p-4 flex flex-col gap-3 min-h-[290px] flex-shrink-0"
      style={{ width: cardWidth ?? '170px', minWidth: cardWidth ?? '170px' }}
    >
      <StarRating rating={testimonial.rating} />
      <p className="text-[#525252] text-base leading-[140%] flex-1">
        {testimonial.text}
      </p>
      <p className="text-sm text-[#525252] leading-[140%]">
        {testimonial.author}
      </p>
    </div>
  );
});

const defaultTestimonials: Testimonial[] = [
  {
    category: 'Sleep',
    text: 'So soft! Any my 5 week old went from sleeping 4 hours at night to 7 hours!',
    author: 'Sari',
    rating: 5,
  },
  {
    category: 'Sleep',
    text: 'The only diaper that our little one will sleep thru the night with',
    author: 'Mackenzie',
    rating: 5,
  },
  {
    category: 'Skin',
    text: 'We are so happy with Coterie diapers! My granddaughter\u2019s diaper rash is GONE!',
    author: 'Susan',
    rating: 5,
  },
  {
    category: 'Skin',
    text: 'Amazing quality, my daughter\u2019s skin is soft now and completely free of rash!',
    author: 'Dina',
    rating: 5,
  },
  {
    category: 'vs. Others',
    text: "We absolutely love these diapers. We tried several brands and this one has by far been the best. We were a little hesitant to try at first, but I'm so glad that we did. Our little guy seems to like them too!",
    author: 'Drew',
    rating: 5,
  },
  {
    category: 'vs. Others',
    text: 'I turned to Coterie because my baby HATES a wet diaper. He will cry the minute he feels it, even waking him from sleep. We tried multiple brands but online research said that Coterie was the most absorbent on the market. I was hesitant because of the price but I have to say that he lasts longer while wearing them and is able to stay asleep!',
    author: 'Michelle',
    rating: 5,
  },
  {
    category: 'Benefits',
    text: 'We love these diapers. Everything about them. They are soft, absorbent, and protect against rash. We\u2019ve used NB-size 2 and wipes. We will continue!',
    author: 'Danielle',
    rating: 5,
  },
  {
    category: 'Benefits',
    text: 'Great quality and absorbency. My baby has yet to get any diaper rash or skin irritations as well. Love these diapers!',
    author: 'Jesse',
    rating: 5,
  },
  {
    category: 'Ingredients',
    text: 'Soft, durable, clean ingredients and my baby\u2019s bum loves it. Other diapers have her a rash but not these! These diapers are the Tesla of diapers hands down!',
    author: 'Anna',
    rating: 5,
  },
  {
    category: 'Ingredients',
    text: 'So thankful for coterie and their ingredients! I feel safe using them on my baby! The auto shipping is so convenient!',
    author: 'Jamie',
    rating: 5,
  },
  {
    category: 'Value',
    text: 'I hate to say it but this diaper is worth the price. I tried every single diaper with my first son and eventually tried these once he was in size 4 and I needed something great for overnight. I was sold night one when I touched the inside of the diaper in the morning and it was so dry!!',
    author: 'Kara',
    rating: 5,
  },
  {
    category: 'Value',
    text: "I was very hesitant to spend so much on diapers, and with my first, I didn't. But I decided to try a pack of Coterie when my second was 9 months old and I can't go back. Before, we constantly had blowouts and some pretty gnarly diaper rashes. My son has eczema and I know these diapers have helped to relieve that some. I highly recommend them for any baby with sensitive skin",
    author: 'Chelsea',
    rating: 5,
  },
];

export function ReviewsToggleSection({
  headline,
  categoryDescriptions,
  testimonials = defaultTestimonials,
}: {
  headline?: string;
  categoryDescriptions?: { category: string; description: string }[];
  testimonials?: Testimonial[];
}) {
  const filters = [
    'Sleep',
    'Skin',
    'vs. Others',
    'Benefits',
    'Ingredients',
    'Value',
  ];

  const [selectedFilter, setSelectedFilter] = useState<string>(filters[0]);

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

  const activeDescription = categoryDescriptions?.find(
    (d) => d.category === selectedFilter
  )?.description;

  // Filter testimonials based on selected filter
  const filteredTestimonials = testimonials.filter(
    (testimonial) => testimonial.category === selectedFilter
  );

  return (
    <section className="relative py-12 bg-white overflow-hidden" id="reviews">
      {/* Headline + description */}
      <div className="px-4 md:px-10 mb-6">
        <h3 className="text-5xl md:text-6xl font-bold text-black mb-2">
          {headline ?? 'The Internet\u2019s Favorite Diaper'}
        </h3>
        {activeDescription && (
          <p className="text-[#525252] text-lg leading-[110%]">
            {activeDescription}
          </p>
        )}
      </div>

      {/* Filter buttons — horizontal scroll */}
      <div className="flex gap-2 overflow-x-auto px-4 md:px-10 mb-4 scrollbar-hide">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => handleFilterClick(filter)}
            className={`cursor-pointer whitespace-nowrap px-3 py-2 rounded-full text-xs text-[#0000C9] font-medium transition-all flex-shrink-0 ${
              selectedFilter === filter
                ? 'bg-[#D1E3FB]'
                : 'bg-white border border-[#E0E0E0] hover:border-[#0000C9]'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Cards — horizontal scroll */}
      <div className="flex gap-3 overflow-x-auto px-4 md:px-10 scrollbar-hide [--scroll-pad:32px] md:[--scroll-pad:80px]">
        {filteredTestimonials.map((testimonial, i) => (
          <TestimonialCard
            key={`${testimonial.category}-${i}`}
            testimonial={testimonial}
            cardWidth={
              filteredTestimonials.length > 2
                ? 'calc((100vw - var(--scroll-pad) - 24px) / 2.15)'
                : undefined
            }
          />
        ))}
      </div>
    </section>
  );
}
