function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={filled ? '0' : '1'}
      className="w-[13px] h-[13px]"
      aria-hidden="true"
    >
      <path d="M6.5 0L8.02 4.68H13L8.99 7.57L10.51 12.25L6.5 9.36L2.49 12.25L4.01 7.57L0 4.68H4.98L6.5 0Z" />
    </svg>
  );
}

export function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex justify-start items-center gap-1" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={star <= rating ? 'text-black' : 'text-gray-300'}
        >
          <StarIcon filled={star <= rating} />
        </span>
      ))}
    </div>
  );
}
