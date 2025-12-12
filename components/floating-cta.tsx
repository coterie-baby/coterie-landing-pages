import Link from 'next/link';
export function FloatingCTA() {
  return (
    <Link href="https://www.coterie.com/products/the-diaper">
      <button className="fixed bottom-6 right-6 bg-[#0000C9] text-white px-6 py-4 rounded-full font-semibold text-sm shadow-lg hover:bg-[#0000AA] transition-colors z-50 flex items-center gap-2">
        Try Coterie →
      </button>
    </Link>
  );
}
