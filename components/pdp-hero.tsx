'use client';

import { useState } from 'react';
import Image from 'next/image';
import PianoKey from './purchase/piano-key';
import { SizeOption, DISPLAY_SIZES } from './purchase/context';

interface Thumbnail {
  src: string;
  alt: string;
  isVideo?: boolean;
}

interface AwardBadge {
  id: string;
  type: 'purple' | 'yellow' | 'blue';
  topText?: string;
  mainText: string;
  bottomText?: string;
  icon?: 'heart' | 'star';
}

interface FeatureQuestion {
  id: string;
  text: string;
  href?: string;
}

interface TestimonialVideo {
  id: string;
  thumbnail: string;
  title: string;
  subtitle: string;
}

interface PDPHeroProps {
  // Product images
  mainImage: string;
  mainImageAlt: string;
  thumbnails: Thumbnail[];

  // Product info
  title: string;
  rating: number;
  reviewCount: number;
  description: string;
  price: string;

  // Awards
  awards?: AwardBadge[];

  // Features
  featureQuestions?: FeatureQuestion[];

  // Sizing
  sizes?: SizeOption[];
  sizeGuideHref?: string;
  subscriptionNote?: string;

  // Testimonials
  testimonials?: TestimonialVideo[];
  testimonialsTitle?: string;
}

const defaultAwards: AwardBadge[] = [
  {
    id: 'babylist',
    type: 'purple',
    topText: 'BEST OF',
    mainText: 'babylist',
    icon: 'heart',
  },
  {
    id: 'parents',
    type: 'yellow',
    topText: 'Parents',
    mainText: "KIDS' SLEEP",
    bottomText: 'AWARDS 2024',
  },
  {
    id: 'bump',
    type: 'blue',
    topText: 'Best of',
    mainText: 'the BUMP',
    bottomText: 'Awards 2025 winners',
    icon: 'star',
  },
];

export default function PDPHero({
  mainImage,
  mainImageAlt,
  thumbnails = [],
  title = 'The Diaper',
  rating = 4.8,
  reviewCount = 8955,
  description = 'A fast wicking, highly absorbent diaper with clean ingredients',
  price = '$95/month',
  awards = defaultAwards,
  sizes = DISPLAY_SIZES,
  sizeGuideHref = '#',
  subscriptionNote = 'A shipment typically lasts one month',
}: PDPHeroProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const currentImage = thumbnails[selectedImageIndex] || {
    src: mainImage,
    alt: mainImageAlt,
  };

  const getAwardBadgeStyles = (type: AwardBadge['type']) => {
    switch (type) {
      case 'purple':
        return 'bg-[#6B4C93] text-white';
      case 'yellow':
        return 'bg-[#FFD700] text-black';
      case 'blue':
        return 'bg-[#1E3A8A] text-white';
      default:
        return 'bg-gray-800 text-white';
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Main Product Image - Full Width on Mobile */}
      <div className="lg:hidden relative w-full aspect-square bg-white overflow-hidden">
        <Image
          src={currentImage.src}
          alt={currentImage.alt}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />

        {/* Award Badges Overlay */}
        <div className="absolute top-4 left-4 flex flex-col gap-3 z-10">
          {awards.map((award, index) => (
            <div
              key={award.id}
              className={`${getAwardBadgeStyles(
                award.type
              )} px-3 py-2 text-xs leading-tight max-w-[180px] ${
                award.type === 'yellow' ? 'rounded-full' : 'rounded-lg'
              }`}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {award.topText && (
                <div className="text-[10px] font-semibold uppercase mb-0.5">
                  {award.topText}
                </div>
              )}
              <div className="font-bold text-sm leading-tight flex items-center gap-1">
                {award.icon === 'heart' && (
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {award.icon === 'star' && (
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                )}
                <span>{award.mainText}</span>
              </div>
              {award.bottomText && (
                <div className="text-[10px] mt-0.5">{award.bottomText}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Thumbnail Strip */}
      {thumbnails.length > 0 && (
        <div className="lg:hidden px-4 py-3 bg-white">
          <div className="flex gap-2 justify-center">
            {thumbnails.slice(0, 6).map((thumbnail, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                  selectedImageIndex === index
                    ? 'border-[#0000C9]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Image
                  src={thumbnail.src}
                  alt={thumbnail.alt}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
                {thumbnail.isVideo && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left Sidebar - Thumbnails (Desktop only) */}
          <div className="hidden lg:flex flex-col gap-3 w-24 flex-shrink-0">
            {thumbnails.map((thumbnail, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImageIndex === index
                    ? 'border-[#0000C9]'
                    : 'border-transparent hover:border-gray-300'
                }`}
              >
                <Image
                  src={thumbnail.src}
                  alt={thumbnail.alt}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
                {thumbnail.isVideo && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Center - Main Product Image (Desktop) */}
          <div className="hidden lg:block flex-1 relative">
            <div className="relative aspect-auto h-[600px] bg-white rounded-lg overflow-hidden">
              <Image
                src={currentImage.src}
                alt={currentImage.alt}
                fill
                className="object-contain"
                sizes="50vw"
              />

              {/* Award Badges Overlay */}
              <div className="absolute top-4 left-4 flex flex-col gap-3 z-10">
                {awards.map((award, index) => (
                  <div
                    key={award.id}
                    className={`${getAwardBadgeStyles(
                      award.type
                    )} px-3 py-2 text-xs leading-tight max-w-[180px] ${
                      award.type === 'yellow' ? 'rounded-full' : 'rounded-lg'
                    }`}
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    {award.topText && (
                      <div className="text-[10px] font-semibold uppercase mb-0.5">
                        {award.topText}
                      </div>
                    )}
                    <div className="font-bold text-sm leading-tight flex items-center gap-1">
                      {award.icon === 'heart' && (
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      {award.icon === 'star' && (
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      )}
                      <span>{award.mainText}</span>
                    </div>
                    {award.bottomText && (
                      <div className="text-[10px] mt-0.5">
                        {award.bottomText}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="flex-1 lg:max-w-md">
            <div className="space-y-6">
              {/* Title */}
              <h1 className="text-[30px] text-black leading-tight">{title}</h1>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFull = star <= Math.floor(rating);
                    const isPartial =
                      !isFull && star === Math.ceil(rating) && rating % 1 !== 0;
                    const fillPercentage = isPartial ? (rating % 1) * 100 : 0;

                    return (
                      <span
                        key={star}
                        className={`relative inline-block ${
                          isFull ? 'text-black' : 'text-gray-300'
                        }`}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {isPartial && (
                          <span
                            className="absolute inset-0 overflow-hidden"
                            style={{ width: `${fillPercentage}%` }}
                          >
                            <svg
                              className="w-5 h-5 text-black"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </span>
                        )}
                      </span>
                    );
                  })}
                </div>
                <span className="text-sm text-gray-700">
                  {rating}/5 based on {reviewCount.toLocaleString()} reviews
                </span>
              </div>

              {/* Description */}
              <p className="text-base text-gray-700 leading-relaxed">
                {description}
              </p>

              {/* Pricing */}
              <p className="text-lg font-semibold text-black">
                Starting at {price}
              </p>

              {/* Size Selection */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-black">
                    Pick your size
                  </h2>
                  <a
                    href={sizeGuideHref}
                    className="text-sm text-[#0000C9] hover:underline flex items-center gap-1"
                  >
                    Size + Fit Guide
                    <svg
                      className="w-4 h-4 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16"
                      />
                    </svg>
                  </a>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {sizes.map((size) => (
                    <PianoKey
                      size={size}
                      key={size.id}
                      isSelected={selectedSize === size.id}
                      onSelect={() => setSelectedSize(size.id)}
                    />
                  ))}
                </div>

                {/* Subscription Note */}
                {subscriptionNote && (
                  <p className="text-sm text-gray-600">{subscriptionNote}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
