import { StarRating } from './reviews/star-rating';

interface FlexAnnouncementBarProps {
  announcement?: string;
  showStars?: boolean;
  rating?: number;
}

export default function FlexAnnouncementBar({
  announcement = 'Default announcement text',
  showStars = false,
  rating = 5,
}: FlexAnnouncementBarProps) {
  return (
    <div className="p-3 bg-[#D1E3FB] text-center">
      <div className="flex items-center justify-center gap-1">
        {showStars && <StarRating rating={rating} />}
        <p className="font-medium text-[15px]">{announcement}</p>
      </div>
    </div>
  );
}
