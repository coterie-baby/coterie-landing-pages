import Link from 'next/link';
import { Button } from './ui/button';

interface CTABannerProps {
  headline?: string;
  question?: string;
  questionLines?: string[];
  button?: {
    label: string;
    href: string;
  };
  buttonText?: string;
  buttonHref?: string;
  backgroundColor?: string;
  textColor?: string;
  buttonBackgroundColor?: string;
  buttonBorderColor?: string;
}

export default function CTABanner({
  headline,
  question,
  questionLines = [
    'Want to join the 10% of',
    'people who are',
    'nutrient sufficient?',
  ],
  button,
  buttonText = 'Shop Now',
  buttonHref = '#',
  backgroundColor = '#D1E3FB', // Coterie light blue
  textColor = '#0000C9', // Coterie brand blue
}: CTABannerProps) {
  // Use headline if provided, otherwise fall back to question/questionLines
  const displayHeadline = headline || question || questionLines.join(' ');
  const buttonLabel = button?.label || buttonText;
  const buttonUrl = button?.href || buttonHref;

  return (
    <section
      className="py-12 px-4 flex flex-col items-center justify-center text-center"
      style={{ backgroundColor }}
    >
      {/* Headline Text */}
      <div className="mb-8">
        <h4
          className="text-3xl md:text-4xl font-bold leading-tight"
          style={{ color: textColor }}
        >
          {headline || question ? (
            displayHeadline
          ) : (
            questionLines.map((line, index) => (
              <span key={index}>
                {line}
                {index < questionLines.length - 1 && <br />}
              </span>
            ))
          )}
        </h4>
      </div>

      {/* CTA Button */}
      <Link href={buttonUrl}>
        <Button>{buttonLabel}</Button>
      </Link>
    </section>
  );
}
