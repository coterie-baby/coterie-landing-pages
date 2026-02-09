import { StarRating } from './star-rating';
import { Review } from '.';

function decodeHtmlEntities(text: string): string {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

export function ReviewCard({
  review,
  onVote,
}: {
  review: Review;
  onVote: (reviewId: number, voteType: 'up' | 'down') => void;
}) {
  // const sizeField = Object.values(review.custom_fields || {}).find(
  //   (field) => field.title === 'Size'
  // );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  return (
    <div className="bg-white flex flex-col gap-6 py-6 border-b border-[#E0E0E0]">
      <div className="flex flex-col gap-1">
        <div className="text-sm">{review.user.display_name}</div>
        <StarRating rating={review.score} />
        <div className="text-sm text-[#525252]">
          {formatDate(review.created_at)}
        </div>
        {/* {sizeField?.value && (
          <div className="text-sm text-[#525252]">Size {sizeField.value}</div>
        )} */}
      </div>

      <p className="text-sm">{decodeHtmlEntities(review.content)}</p>

      <div className="flex items-center justify-between text-sm">
        <span>Was this review helpful?</span>
        <div className="flex items-center gap-4 text-[#525252]">
          <button
            className="flex items-center gap-1 hover:text-green-600 transition-colors"
            onClick={() => onVote(review.id, 'up')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <path
                d="M1.4 14L10.7149 14C10.9997 13.999 11.2775 13.907 11.5117 13.7363C11.7458 13.5655 11.9251 13.324 12.026 13.0436L13.9559 7.62705C13.9852 7.54432 14.0001 7.45672 14 7.36842L14 5.89474C14 5.082 13.3721 4.42105 12.6 4.42105L8.6716 4.42105L9.457 1.94011C9.52702 1.71858 9.54615 1.48274 9.51281 1.25193C9.47947 1.02112 9.39461 0.801919 9.2652 0.612316C9.002 0.229158 8.5778 4.7965e-07 8.1284 4.40363e-07L7 3.41715e-07C6.7921 3.2354e-07 6.5954 0.0972646 6.4617 0.265264L3.1717 4.42105L1.4 4.42105C0.627898 4.42105 -1.12771e-06 5.082 -1.19876e-06 5.89474L-1.77852e-06 12.5263C-1.84957e-06 13.3391 0.627897 14 1.4 14ZM7.3283 1.47368L8.1298 1.47368L7.0364 4.92505C7.00137 5.03577 6.99182 5.15365 7.00854 5.26901C7.02525 5.38437 7.06776 5.4939 7.13256 5.58858C7.19735 5.68326 7.28258 5.76039 7.38124 5.81362C7.47989 5.86685 7.58914 5.89465 7.7 5.89474L12.6 5.89474L12.6 7.23505L10.7149 12.5263L4.2 12.5263L4.2 5.42463L7.3283 1.47368ZM2.8 5.89474L2.8 12.5263L1.4 12.5263L1.3993 5.89474L2.8 5.89474Z"
                fill="currentColor"
              />
            </svg>
            {review.votes_up}
          </button>
          <button
            className="flex items-center gap-1 hover:text-red-600 transition-colors"
            onClick={() => onVote(review.id, 'down')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <path
                d="M12.6 0H3.2851C3.00028 0.0009954 2.72245 0.092959 2.48835 0.263732C2.25424 0.434506 2.07489 0.676047 1.974 0.956421L0.0441009 6.37295C0.0147986 6.45568 -0.00013885 6.54328 9.72576e-07 6.63158V8.10526C9.72576e-07 8.918 0.627901 9.57895 1.4 9.57895H5.3284L4.543 12.0599C4.47298 12.2814 4.45385 12.5173 4.48719 12.7481C4.52053 12.9789 4.60539 13.1981 4.7348 13.3877C4.998 13.7708 5.4222 14 5.8716 14H7C7.2079 14 7.4046 13.9027 7.5383 13.7347L10.8283 9.57895H12.6C13.3721 9.57895 14 8.918 14 8.10526V1.47368C14 0.660947 13.3721 0 12.6 0ZM6.6717 12.5263H5.8702L6.9636 9.07495C6.99863 8.96423 7.00818 8.84635 6.99146 8.73099C6.97475 8.61563 6.93224 8.5061 6.86744 8.41142C6.80265 8.31674 6.71742 8.23961 6.61876 8.18638C6.52011 8.13315 6.41086 8.10535 6.3 8.10526H1.4V6.76495L3.2851 1.47368H9.8V8.57537L6.6717 12.5263ZM11.2 8.10526V1.47368H12.6L12.6007 8.10526H11.2Z"
                fill="currentColor"
              />
            </svg>
            {review.votes_down}
          </button>
        </div>
      </div>
    </div>
  );
}
