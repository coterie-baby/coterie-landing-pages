'use client';

interface AnnouncementBarProps {
  announcement?: string;
}

export default function AnnouncementBar({
  announcement = '10% off every Auto Renew order. Free shipping when you bundle.',
}: AnnouncementBarProps) {
  // Duplicate the announcement multiple times for seamless scrolling
  // We duplicate it enough times to ensure smooth scrolling on large screens
  const announcements = Array(10).fill(announcement);

  return (
    <div className="h-8 flex items-center bg-[#0000C9] text-white overflow-hidden relative">
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
