'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import UGCVideo from '@/components/ugc-video';
import FlexAnnouncementBar from '@/components/flex-announcement-bar';
import USP2 from '@/components/usp2';
import TitleBanner from '@/components/title-banner';

export default function UGCPage() {
  const usp2Data = {
    headline: 'Why Parents Love Coterie',
    cards: 3,
    productCards: [
      {
        image:
          'https://cdn.sanity.io/images/e4q6bkl9/production/bd6462c2724c47ddc7cf46050ac3e940bfae9345-6000x4500.jpg?fit=max&w=1200&h=1200',
        headline: 'Fast-Wicking Technology',
        bodyCopy:
          'Keeps your baby dry all night with superior absorbency and leak protection.',
      },
      {
        image:
          'https://cdn.sanity.io/images/e4q6bkl9/production/bd6462c2724c47ddc7cf46050ac3e940bfae9345-6000x4500.jpg?fit=max&w=1200&h=1200',
        headline: 'Clean Ingredients',
        bodyCopy:
          'No fragrance, lotion, latex, dyes, chlorine, or parabens. Hypoallergenic and dermatologist tested.',
      },
      {
        image:
          'https://cdn.sanity.io/images/e4q6bkl9/production/bd6462c2724c47ddc7cf46050ac3e940bfae9345-6000x4500.jpg?fit=max&w=1200&h=1200',
        headline: 'Perfect Fit & Comfort',
        bodyCopy:
          'Soft, stretchy material with 360° fit that moves with your baby for ultimate comfort.',
      },
    ],
  };

  return (
    <div>
      <TitleBanner
        headline="Real Parents, Real Reviews"
        subheader="See why millions of parents trust Coterie for their baby's comfort and safety"
        backgroundImage="https://cdn.sanity.io/images/e4q6bkl9/production/a48c420d157d4b27a031e42fd2d24f2f0bcadecc-6720x4480.jpg?rect=0,350,6720,3780&w=2400&h=1350&q=100&fit=crop&auto=format"
        button={{
          label: 'Shop Now',
          href: '#',
        }}
      />
      <UGCVideo />
      <FlexAnnouncementBar announcement="15% Off Your First Auto-Renew Order!" />
      <USP2 {...usp2Data} />
      <div className="py-6 px-4">
        <div className="grid grid-cols-2 gap-6">
          {[...Array(5)].map((_, i) => (
            <ProductListItem key={i} />
          ))}
        </div>
      </div>

      {/* Reviews Toggle Section */}
      <ReviewsToggleSection />
    </div>
  );
}

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

function ReviewsToggleSection() {
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
        {/* Star Rating */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className="w-6 h-6 text-[#0000C9]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.215 3.74a1 1 0 00.95.69h3.932c.969 0 1.371 1.24.588 1.81l-3.184 2.314a1 1 0 00-.364 1.118l1.215 3.74c.3.921-.755 1.688-1.54 1.118L10 13.011l-3.184 2.314c-.784.57-1.838-.197-1.54-1.118l1.215-3.74a1 1 0 00-.364-1.118L3.943 9.167c-.783-.57-.38-1.81.588-1.81h3.932a1 1 0 00.95-.69l1.215-3.74z" />
            </svg>
          ))}
          <span className="text-lg font-semibold text-[#0000C9]">
            4.8 stars
          </span>
        </div>

        {/* Main Headline */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-[#0000C9]">
          Join 1,000,000+ Parents Trusting Coterie
        </h2>

        {/* Filter Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-12">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedFilter === filter
                  ? 'bg-[#0000C9] text-white'
                  : 'bg-white text-[#525252] border border-gray-300 hover:border-[#0000C9]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Testimonials */}
        <div className="space-y-6 mb-20">
          {filteredTestimonials.map((testimonial, i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
              {/* Star Rating */}
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, j) => (
                  <svg
                    key={j}
                    className="w-5 h-5 text-[#0000C9]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.215 3.74a1 1 0 00.95.69h3.932c.969 0 1.371 1.24.588 1.81l-3.184 2.314a1 1 0 00-.364 1.118l1.215 3.74c.3.921-.755 1.688-1.54 1.118L10 13.011l-3.184 2.314c-.784.57-1.838-.197-1.54-1.118l1.215-3.74a1 1 0 00-.364-1.118L3.943 9.167c-.783-.57-.38-1.81.588-1.81h3.932a1 1 0 00.95-.69l1.215-3.74z" />
                  </svg>
                ))}
              </div>
              {/* Testimonial Text */}
              <p className="text-[#525252] leading-relaxed mb-3">
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

interface ProductListItemProps {
  product?: {
    id?: string;
    title?: string;
    description?: string;
    price?: string;
    category?: string;
    imageUrl?: string;
    href?: string;
  };
}

function ProductListItem({ product }: ProductListItemProps = {}) {
  const defaultProduct = {
    title: 'Product Title',
    description: 'Product description goes here',
    price: '29.99',
    category: 'Category',
    imageUrl:
      'https://cdn.sanity.io/images/e4q6bkl9/production/bd6462c2724c47ddc7cf46050ac3e940bfae9345-6000x4500.jpg?fit=max&w=1200&h=1200',
    href: '#',
  };

  const productData = product || defaultProduct;

  return (
    <Link
      href={productData.href || '#'}
      className="flex flex-col group cursor-pointer"
    >
      <div className="relative w-full aspect-square mb-3 overflow-hidden rounded-md">
        <Image
          fill
          src={productData.imageUrl || ''}
          alt={productData.title || 'Product'}
          className="object-cover rounded-md group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="flex flex-col gap-1">
        <span className="uppercase text-xs leading-[140%] text-[#0000C9]">
          {productData.category}
        </span>
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-bold leading-[140%]">
            {productData.title}
          </p>
          <p className="text-sm text-[#525252] leading-[140%] line-clamp-2">
            {productData.description}
          </p>
        </div>
        <p className="text-sm leading-[140%] font-medium">
          ${productData.price}
        </p>
      </div>
    </Link>
  );
}
