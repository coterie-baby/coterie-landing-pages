'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Award {
  id: string;
  heroText: string;
  subText: string;
  backgroundImage: string;
  backgroundAlt: string;
}

export interface AwardSlideshowProps {
  awards: Award[];
  autoPlayInterval?: number;
  eyebrowText?: string;
  awardIcons?: string[];
}

const AwardSlideshow: React.FC<AwardSlideshowProps> = ({
  awards,
  autoPlayInterval = 5000,
  eyebrowText = 'Award-winning diapering solutions',
  awardIcons = [],
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-play functionality
  useEffect(() => {
    if (awards.length <= 1) return;

    const interval = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [awards.length, autoPlayInterval]);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % awards.length);
      setIsAnimating(false);
    }, 300);
  };

  if (!awards.length) return null;

  const currentAward = awards[currentSlide];

  return (
    <div className="relative w-full h-[80vh] overflow-hidden bg-gray-100 md:h-[90vh]">
      {/* Background Images */}
      <div className="absolute inset-0">
        {awards.map((award, index) => (
          <div
            key={award.id}
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={award.backgroundImage}
              alt={award.backgroundAlt}
              fill
              className="object-cover"
              priority={index === 0}
              quality={90}
              sizes="100vw"
            />
          </div>
        ))}
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col justify-end h-full py-10 px-4 md:p-20">
        {/* Fixed Eyebrow Text */}
        <div className="text-center mb-4">
          <p className="text-sm md:text-[17px] uppercase leading-[140%]">
            {eyebrowText}
          </p>
        </div>

        {/* Animated Content */}
        <div className="flex items-center justify-center text-center mb-16 md:mb-32">
          <div className="max-w-4xl">
            <div
              className={`transition-all duration-500 ease-in-out transform ${
                isAnimating
                  ? 'opacity-0 translate-y-4'
                  : 'opacity-100 translate-y-0'
              }`}
            >
              <h3 className="mb-4 lg:mb-6">{currentAward.heroText}</h3>
              <p className="text-sm font-[400] md:text-[24px] leading-[140%]">
                {currentAward.subText}
              </p>
            </div>
          </div>
        </div>

        {/* Fixed Award Icons */}
        <div className="flex justify-center items-center space-x-4 lg:space-x-6">
          {awardIcons.map((icon, index) => (
            <div
              key={index}
              className="w-12 h-12 lg:w-16 lg:h-16 rounded-full flex items-center justify-center md:w-16 md:h-16"
            >
              <Image
                src={icon}
                alt={`Award ${index + 1}`}
                width={64}
                height={64}
                className={`w-12 h-12 md:w-16 md:h-16 transition-opacity duration-300 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-75'
                }`}
                quality={90}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AwardSlideshow;
