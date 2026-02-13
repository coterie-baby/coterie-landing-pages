'use client';

const FREE_SHIPPING_THRESHOLD = 110;

interface CartShippingBarProps {
  subtotal: number;
  hasFreeShipping: boolean;
}

export default function CartShippingBar({
  subtotal,
  hasFreeShipping,
}: CartShippingBarProps) {
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div className="py-3">
      {hasFreeShipping ? (
        <p className="text-xs text-[#0000C9]">
          Congratulations! You&apos;re getting free shipping!
        </p>
      ) : (
        <p className="text-xs text-[#0000C9]">
          You are <span className="font-medium">${remaining.toFixed(2)}</span>{' '}
          away from free shipping
        </p>
      )}
      <div className="mt-1.5 h-0.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${progress}%`,
            backgroundColor: '#0000C9',
          }}
        />
      </div>
    </div>
  );
}
