'use client';

import { ReviewListCard } from './review-list-card';
import { useUserReviews } from '../../api/queries';

type UserReviewContainerProps = {
  userId: number;
  isMyProfile: boolean;
};

export const UserReviewContainer = ({ userId, isMyProfile }: UserReviewContainerProps) => {
  const { data: rawReviews = [] } = useUserReviews(userId);
  // projectStatus가 응답에 포함된 경우 COMPLETED 프로젝트 후기만 표시
  const reviews = rawReviews.filter((r) => r.projectStatus === undefined || r.projectStatus === 'COMPLETED');

  return <ReviewListCard isMyProfile={isMyProfile} reviews={reviews} showThumbnail />;
};
