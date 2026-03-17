'use client';

import type { ProfileReview } from '@/shared/api/types/profile';

import { ReactionButton } from './ReactionButton';

interface Props {
  review: ProfileReview;
  onToggleReaction: (reviewId: string) => void;
}

const ReviewCard = ({ review, onToggleReaction }: Props) => {
  return (
    <article className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <p className="mb-2 text-gray-800">{review.content}</p>
      <div className="mb-2 flex flex-wrap gap-1">
        {review.tags.map((tag) => (
          <span key={tag} className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
            {tag}
          </span>
        ))}
      </div>
      <ReactionButton review={review} onToggleReaction={onToggleReaction} />
    </article>
  );
};

export { ReviewCard };
