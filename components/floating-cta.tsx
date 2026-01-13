'use client';
import amplitude from '@/amplitude';
import { track } from '@vercel/analytics';
import { Button } from './ui/button';
import Link from 'next/link';

const CTA_URL = 'https://www.coterie.com/products/the-diaper';

export function FloatingCTA() {
  const handleClick = () => {
    amplitude.setTransport('beacon');
    amplitude.track('floating_cta_clicked', {
      cta_text: 'Try Coterie',
      cta_url: CTA_URL,
    });
    amplitude.flush();

    track('floating_cta_clicked', {
      cta_text: 'Try Coterie',
      cta_url: CTA_URL,
    });
  };

  return (
    <Link href={CTA_URL} onClick={handleClick}>
      <Button className="fixed bottom-6 right-6 bg-[#0000C9] text-white px-6 py-4 rounded-full font-medium text-sm shadow-lg hover:bg-[#0000AA] transition-colors z-50 flex items-center gap-2">
        Try Coterie →
      </Button>
    </Link>
  );
}
