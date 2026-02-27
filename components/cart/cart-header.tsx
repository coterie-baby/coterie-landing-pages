'use client';

interface CartHeaderProps {
  itemCount: number;
  onClose: () => void;
}

export default function CartHeader({ itemCount, onClose }: CartHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
      <p className="text-sm flex gap-2">
        Cart{' '}
        {itemCount > 0 && (
          <span className="flex justify-center border border-[#E7E7E7] min-w-[22px] min-h-[22px] rounded-full">
            {itemCount}
          </span>
        )}
      </p>
      <button
        onClick={onClose}
        className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
        aria-label="Close cart"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
