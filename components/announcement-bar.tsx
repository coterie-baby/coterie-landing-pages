'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface AnnouncementBarProps {
  announcement?: string;
  variant?: 'ticker' | 'static';
}

export default function AnnouncementBar({
  announcement = '10% off every Auto Renew order. Free shipping when you bundle.',
  variant = 'ticker',
}: AnnouncementBarProps) {
  const pathname = usePathname();
  const isHomepage = pathname === '/';

  if (variant === 'static') {
    return (
      <div className="h-[30px] flex items-center justify-center bg-[#0000C9] overflow-hidden px-4">
        <p className="mono text-[10px] text-white text-center tracking-[-0.06em] leading-[1.6] whitespace-nowrap">
          {announcement}
        </p>
      </div>
    );
  }

  const announcements = Array(10).fill(announcement);

  return (
    <div className={cn(
      'h-8 flex items-center bg-[#0000C9] text-white overflow-hidden relative',
      isHomepage && 'fixed top-0 left-0 right-0 z-[60]'
    )}>
      <div className="absolute inset-0 flex items-center">
        <div
          className="flex whitespace-nowrap"
          style={{
            animation: 'ticker-scroll 30s linear infinite',
          }}
        >
          {announcements.map((text, index) => (
            <span
              key={index}
              className="mono text-[11px] md:text-xs px-4 mr-20"
            >
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
