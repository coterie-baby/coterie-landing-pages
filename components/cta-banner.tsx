import { Button } from './ui/button';

interface CTABannerProps {
  question?: string;
  questionLines?: string[];
  buttonText?: string;
  buttonHref?: string;
  backgroundColor?: string;
  textColor?: string;
  buttonBackgroundColor?: string;
  buttonBorderColor?: string;
}

export default function CTABanner({
  question,
  questionLines = [
    'Want to join the 10% of',
    'people who are',
    'nutrient sufficient?',
  ],
  buttonText = 'Shop Now',
  backgroundColor = '#D1E3FB', // Coterie light blue
  textColor = '#0000C9', // Coterie brand blue
}: CTABannerProps) {
  const displayQuestion = question || questionLines.join(' ');

  return (
    <section
      className="py-12 px-4 flex flex-col items-center justify-center text-center"
      style={{ backgroundColor }}
    >
      {/* Question Text */}
      <div className="mb-8">
        {question ? (
          <h4
            className="text-3xl md:text-4xl font-bold leading-tight"
            style={{ color: textColor }}
          >
            {displayQuestion}
          </h4>
        ) : (
          <h4
            className="text-3xl md:text-4xl font-bold leading-tight"
            style={{ color: textColor }}
          >
            {questionLines.map((line, index) => (
              <span key={index}>
                {line}
                {index < questionLines.length - 1 && <br />}
              </span>
            ))}
          </h4>
        )}
      </div>

      {/* CTA Button */}
      <Button>{buttonText}</Button>
    </section>
  );
}
