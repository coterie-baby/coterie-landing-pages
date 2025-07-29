'use client';
import Link from 'next/link';
import { Button } from './ui/button';

interface ContentBannerProps {
  headline?: string;
  subheader?: string;
  backgroundImage?: string;
  backgroundColor?: string;
  overlay?: 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90;
  position?: 'top' | 'middle' | 'bottom';
  button?: {
    label: string;
    href: string;
  };
}

export default function ContentBanner({
  headline,
  subheader,
  backgroundImage,
  backgroundColor,
  overlay,
  position = 'middle',
  button,
}: ContentBannerProps) {
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
        return 'justify-start';
      case 'bottom':
        return 'justify-end';
      default:
        return 'justify-center';
    }
  };

  return (
    <section
      className={`flex flex-col ${getJustifyClass()} md:justify-center px-4 md:px-20 h-[56vh] relative`}
      style={backgroundStyle}
    >
      {overlay && (
        <div
          className="absolute inset-0 bg-black pointer-events-none"
          style={{ opacity: overlay / 100 }}
        />
      )}
      <div className="flex flex-col gap-4 text-center text-white max-w-[846px] md:mx-auto relative z-10">
        <h3 className="md:text-[72px]! md:leading-[100%]! md:tracking-[-2.24px]!">
          {headline}
        </h3>
        <p className="text-sm leading-[140%] md:max-w-[670px] md:mx-auto md:text-[17px] md:leading-[140%]">
          {subheader}
        </p>
      </div>
      {button && (
        <div className="w-full flex justify-center mt-10 relative z-10">
          <Link href={href} target="_blank">
            <Button data-cta-location="Title Banner" data-cta-text={label}>
              {label}
            </Button>
          </Link>
        </div>
      )}
    </section>
  );
}
