'use client';
import Link from 'next/link';
import { Button } from './ui/button';

interface TitleBannerProps {
  headline?: string;
  subheader?: string;
  fullHeight?: boolean;
  backgroundImage?: string;
  backgroundColor?: string;
  overlay?: 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90;
  position?: 'top' | 'middle' | 'bottom';
  textColor?: string;
  button?: {
    label: string;
    href: string;
  };
}

export default function TitleBanner({
  headline,
  subheader,
  fullHeight = false,
  backgroundImage,
  backgroundColor,
  overlay,
  position = 'middle',
  textColor = 'white',
  button,
}: TitleBannerProps) {
  const label = button?.label || 'Read the safety standards';
  const href = button?.href || 'https://www.coterie.com/safety-reports';
  const backgroundStyle = backgroundImage
    ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : backgroundColor
      ? { backgroundColor }
      : {};

  const getJustifyClass = () => {
    switch (position) {
      case 'top':
        return 'justify-start pt-20';
      case 'bottom':
        return 'justify-end pb-20';
      default:
        return 'justify-center';
    }
  };

  return (
    <section
      className={`relative ${fullHeight ? 'h-screen' : 'h-[64vh] md:h-[80vh]'}`}
    >
      {/* Background layer */}
      <div className="absolute inset-0" style={backgroundStyle} />

      {/* Overlay layer */}
      {overlay && (
        <div
          className="absolute inset-0 bg-black pointer-events-none"
          style={{ opacity: overlay / 100 }}
        />
      )}

      {/* Content layer */}
      <div
        className={`relative z-10 h-full flex flex-col ${getJustifyClass()} px-4 md:px-20`}
      >
        <div
          className="flex flex-col gap-4 text-center max-w-[846px] md:mx-auto"
          style={{ color: textColor }}
        >
          <h2 className="md:text-[112px]! md:leading-[100%]! md:tracking-[-2.24px]!">
            {headline}
          </h2>
          <p className="text-sm leading-[140%] md:max-w-[670px] md:mx-auto md:text-[17px] md:leading-[140%]">
            {subheader}
          </p>
        </div>
        {button && (
          <div className="w-full flex justify-center mt-10">
            <Link href={href} target="_blank">
              <Button data-cta-location="Title Banner" data-cta-text={label}>
                {label}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
