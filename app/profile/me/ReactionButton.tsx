'use client';

import type { ProfileReview } from '@/shared/api/types/profile';

type ReactionButtonProps = {
  review: ProfileReview;
  onReact: (reviewId: string) => void;
  disabled?: boolean;
};

const ReactionButton = ({ review, onReact, disabled = false }: ReactionButtonProps) => {
  return (
    <button
      type="button"
      onClick={() => onReact(review.id)}
      disabled={disabled}
      className="inline-flex items-center gap-1 rounded border border-gray-200 bg-white px-2 py-1 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      aria-label={`공감 ${review.reactionCount}개`}
    >
      <span className={review.reacted ? 'text-red-500' : 'text-gray-400'} aria-hidden>
        ♥
      </span>
      <span>{review.reactionCount}</span>
    </button>
  );
};

export { ReactionButton };
