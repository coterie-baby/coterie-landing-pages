interface AnnouncementBarProps {
  announcement?: string;
}

export default function AnnouncementBar({
  announcement = '10% off every Auto Renew order. Free shipping when you bundle.',
}: AnnouncementBarProps) {
  return (
    <div className="px-3 h-8 flex items-center justify-center bg-[#0000C9] text-white text-center">
      <p className="mono text-[11px] md:text-xs">{announcement}</p>
    </div>
  );
}
