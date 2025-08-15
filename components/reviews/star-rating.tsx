import Image from 'next/image';

function StarIcon() {
  return (
    <Image
      src="/star.svg"
      alt="Star rating"
      width={13}
      height={13}
      className="w-[13px] h-[13px]"
    />
  );
}

export function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex justify-start items-center md:gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-lg ${
            star <= rating ? 'text-black' : 'text-gray-300'
          }`}
        >
          <StarIcon />
        </span>
      ))}
    </div>
  );
}
