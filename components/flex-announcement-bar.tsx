interface FlexAnnouncementBarProps {
  announcement?: string;
}

export default function FlexAnnouncementBar({
  announcement = 'Default announcement text',
}: FlexAnnouncementBarProps) {
  return (
    <div className="p-3 bg-[#D1E3FB] text-center">
      <p className="font-medium text-[15px]">{announcement}</p>
    </div>
  );
}
