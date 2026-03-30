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
        <div className="flex items-center justify-between w-full">
          <p style={{ fontFamily: 'SuisseMono', fontSize: '10px', fontStyle: 'normal', fontWeight: 400, lineHeight: '140%', letterSpacing: '-0.6px', color: '#0000C9' }}>Congratulations! You&apos;re getting free shipping!</p>
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="11" viewBox="0 0 15 11" fill="none" className="flex-shrink-0">
            <path d="M4.76851 8.95827L13.5705 0.156267C13.6678 0.0589341 13.7826 0.00701644 13.9148 0.000516443C14.0468 -0.00581689 14.1678 0.0461008 14.278 0.156267C14.3883 0.266601 14.4435 0.385516 14.4435 0.513016C14.4435 0.640683 14.3883 0.7596 14.278 0.869767L5.33401 9.81977C5.17235 9.98127 4.98385 10.062 4.76851 10.062C4.55318 10.062 4.36468 9.98127 4.20301 9.81977L0.153015 5.76977C0.0556812 5.67243 0.00476451 5.55677 0.000264515 5.42277C-0.00423549 5.28877 0.0486809 5.1666 0.159014 5.05627C0.269181 4.9461 0.388015 4.89102 0.515515 4.89102C0.643181 4.89102 0.762098 4.9461 0.872264 5.05627L4.76851 8.95827Z" fill="#0000C9"/>
          </svg>
        </div>
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
