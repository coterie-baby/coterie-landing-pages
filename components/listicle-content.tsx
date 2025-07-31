import Image from 'next/image';
import { Button } from './ui/button';
import Link from 'next/link';

export interface ListicleContentProps {
  headline: string;
  description: string;
  featuredImage: string;
  button?: {
    label: string;
    href: string;
  };
  reverse?: boolean;
  index: number;
}

export default function ListicleContent({
  headline,
  description,
  featuredImage,
  reverse = false,
  button,
  index,
}: ListicleContentProps) {
  const label = button?.label || 'Read the safety standards';
  const href = button?.href || 'https://www.coterie.com/safety-reports';
  const listIndex = index + 1;
  if (listIndex % 2 == 0) {
    reverse = true;
  }
  return (
    <div className="mb-6 md:mb-12">
      <div
        className={`flex flex-col gap-8 max-w-6xl mx-auto md:items-center ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'}`}
      >
        <div className="relative w-full h-[300px] md:flex-shrink-0 md:w-1/2 md:h-[400px]">
          <Image
            src={featuredImage}
            alt=""
            fill
            className="w-full h-full object-cover"
          />
        </div>
        <div className="px-4 flex flex-col gap-4">
          <h5>
            {`${listIndex}. `}
            {headline}
          </h5>
          <p className="text-sm text-[#525252] leading-[140%]">{description}</p>
          <div className="w-full flex justify-start mt-2">
            {button && (
              <Link href={href}>
                <Button>{label}</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
