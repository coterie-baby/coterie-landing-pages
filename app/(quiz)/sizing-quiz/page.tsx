'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Header from '@/components/global/header';

export default function SizingQuizLanding() {
  return (
    <div className="flex flex-col h-full overflow-hidden bg-white">
      <Header />
      {/* Hero Image Section */}
      <div className="relative w-full h-[300px] flex-shrink-0 min-h-0">
        <Image
          src="https://cdn.sanity.io/images/e4q6bkl9/production/4a078422f76dfdda4483b4c621917c725061e9a8-2919x4355.jpg"
          alt="Baby crawling on cushions wearing a diaper"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-6 min-h-0">
        <div className="max-w-md text-center">
          <h1 className="text-[24px] leading-[110%] tracking-[-0.64px] mb-4">
            A personalized shopping experience
          </h1>
          <p className="text-sm leading-[150%] text-[#525252]">
            Diapers or pants? Size Newborn or 1? The right fit is important, so
            we&apos;ve put together some questions to help you find it.
          </p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex-shrink-0 bg-white border-t border-[#E7E7E7] px-6 py-4">
        <div className="flex flex-col justify-center items-center gap-4">
          <Link href="/sizing-quiz/baby">
            <Button
              className="py-4 px-12 text-xs"
              data-cta-text="Get started"
              data-cta-location="sizing_quiz_landing"
            >
              Get started
            </Button>
          </Link>
          <Link
            href="https://www.coterie.com/legal/consumer-health-policy"
            className="text-[13px] text-[#141414] underline underline-offset-2"
          >
            Health Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
