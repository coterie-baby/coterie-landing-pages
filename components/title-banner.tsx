'use client';
import Link from 'next/link';
import { Button } from './ui/button';
import { sendGTMEvent } from '@next/third-parties/google';

interface TitleBannerProps {
  headline: string;
  subheader: string;
  fullHeight?: boolean;
  backgroundImage?: string;
  backgroundColor?: string;
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

  return (
    <section
      className={`flex flex-col justify-center px-4 md:px-20 ${
        fullHeight ? 'h-screen' : 'h-[64vh] md:h-[80vh]'
      }`}
      style={backgroundStyle}
    >
      <div className="flex flex-col gap-4 text-center text-white max-w-[846px] md:mx-auto">
        <h2 className="md:text-[112px]! md:leading-[100%]! md:tracking-[-2.24px]!">
          {headline}
        </h2>
        <p className="text-sm leading-[140%] md:max-w-[670px] md:mx-auto md:text-[17px] md:leading-[140%]">
          {subheader}
        </p>
      </div>
      {button && (
        <div className="w-full flex justify-center mt-10">
          <Link href={href}>
            <Button
              onClick={() =>
                sendGTMEvent({ event: 'buttonClicked', value: 'xyz' })
              }
            >
              {label}
            </Button>
          </Link>
        </div>
      )}
    </section>
  );
}
