'use client';
import Link from 'next/link';
import posthog from 'posthog-js';

export function FloatingCTA() {
  const handleClick = () => {
    posthog.capture('floating_cta_clicked', {
      cta_text: 'Try Coterie',
      cta_url: 'https://www.coterie.com/products/the-diaper',
    });
  };

  return (
    <Link href="https://www.coterie.com/products/the-diaper" onClick={handleClick}>
      <button className="fixed bottom-6 right-6 bg-[#0000C9] text-white px-6 py-4 rounded-full font-medium text-sm shadow-lg hover:bg-[#0000AA] transition-colors z-50 flex items-center gap-2">
        Try Coterie →
      </button>
    </Link>
  );
}
