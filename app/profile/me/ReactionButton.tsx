'use client';

import type { ComponentProps } from 'react';

import type { ProfileReview } from '@/shared/api/types/profile';

interface Props extends ComponentProps<'button'> {
  review: ProfileReview;
  onToggleReaction: (reviewId: string) => void;
}

const ReactionButton = ({ review, onToggleReaction, disabled = false, ...rest }: Props) => {
  return (
    <button
      type="button"
      onClick={() => onToggleReaction(review.id)}
      disabled={disabled}
      className="inline-flex items-center gap-1 rounded border border-gray-200 bg-white px-2 py-1 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      aria-label={`공감 ${review.reactionCount}개`}
      {...rest}
    >
      <span className={review.reacted ? 'text-red-500' : 'text-gray-400'} aria-hidden>
        ♥
      </span>
      <span>{review.reactionCount}</span>
    </button>
  );
};

export { ReactionButton };
