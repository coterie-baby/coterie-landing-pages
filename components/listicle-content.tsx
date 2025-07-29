import Image from 'next/image';
import { Button } from './ui/button';
import Link from 'next/link';

interface ListicleContentProps {
  reverse?: boolean;
  button?: {
    label: string;
    href: string;
  };
  index?: number;
}

export default function ListicleContent({
  reverse = false,
  button,
  index,
}: ListicleContentProps) {
  const label = button?.label || 'Read the safety standards';
  const href = button?.href || 'https://www.coterie.com/safety-reports';
  console.log(index);
  return (
    <div>
      <div
        className={`flex flex-col  gap-8 items-center max-w-6xl mx-auto ${reverse ? 'md:flex-row-reverse' : ''}`}
      >
        <div className="relative w-full h-[300px] md:flex-shrink-0 md:w-1/2 md:h-[400px]">
          <Image
            src="/bg-placeholder.png"
            alt=""
            fill
            className="w-full h-full object-cover"
          />
        </div>
        <div className="px-4 flex flex-col gap-4">
          <h5>1. No Toxins, Just Diapers</h5>
          <p className="text-sm text-[#525252] leading-[140%]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
        </div>
        <div>
          {button && (
            <Link href={href}>
              <Button>{label}</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
