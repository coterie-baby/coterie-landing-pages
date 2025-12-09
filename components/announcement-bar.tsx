interface AnnouncementBarProps {
  announcement?: string;
}

export default function AnnouncementBar({
  announcement = 'Default announcement text',
}: AnnouncementBarProps) {
  return (
    <div className="p-3 bg-[#0000C9] text-white text-center">
      <p className="font-medium text-[15px]">{announcement}</p>
    </div>
  );
}
