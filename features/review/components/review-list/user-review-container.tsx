'use client';

import { ReviewListCard } from './review-list-card';
import { useUserReviews } from '../../api/queries';

type UserReviewContainerProps = {
  userId: number;
  isMyProfile: boolean;
};

export const UserReviewContainer = ({ userId, isMyProfile }: UserReviewContainerProps) => {
  const { data: reviews = [] } = useUserReviews(userId);

  return <ReviewListCard isMyProfile={isMyProfile} reviews={reviews} showThumbnail showTitle />;
};
