import Image from 'next/image';

interface QuoteProps {
  quote: string;
  authorName?: string;
  authorPosition?: string;
  authorImageUrl?: string;
  authorImageAlt?: string;
}

export default function Quote({
  quote,
  authorName,
  authorPosition,
  authorImageUrl,
  authorImageAlt,
}: QuoteProps) {
  return (
    <section className="bg-white px-6 md:px-16 py-14 text-center">
      <p className="text-[20px] leading-tight mb-6">
        &ldquo;{quote}&rdquo;
      </p>

      <div className="flex flex-col items-center gap-3">
        {authorImageUrl && (
          <div className="relative w-10 h-10 rounded-full overflow-hidden mb-1">
            <Image
              src={authorImageUrl}
              alt={authorImageAlt ?? authorName ?? ''}
              fill
              className="object-cover grayscale"
            />
          </div>
        )}
        <div>
          {authorName && (
          <p className="text-sm text-[#525252]">{authorName}</p>
          )}
          {authorPosition && (
            <p className="text-sm text-[#525252]">{authorPosition}</p>
          )}
        </div>
      </div>
    </section>
  );
}
