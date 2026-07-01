'use client';

import { ReviewListCard } from './review-list-card';
import { useUserReviews } from '../../review.hooks';

interface Props {
  userId: number;
}

export const UserReviewCard = ({ userId }: Props) => {
  const { data: rawReviews } = useUserReviews(userId);
  // TODO: 백엔드 api에 projectStatus 추가 후 r.projectStatus === undefined 조건 제거
  const reviews = rawReviews.filter(
    (r) => r.projectStatus === undefined || r.projectStatus === 'COMPLETED' || r.projectStatus === 'ARCHIVED',
  );

  return <ReviewListCard reviews={reviews} showProjectName showSort />;
};
