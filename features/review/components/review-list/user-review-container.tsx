'use client';

import { useIsMyProfile } from '@/features/profile';

import { ReviewListCard } from './review-list-card';
import { useUserReviews } from '../../api/queries';

type UserReviewContainerProps = {
  userId: number;
};

export const UserReviewContainer = ({ userId }: UserReviewContainerProps) => {
  const isMyProfile = useIsMyProfile(userId);
  const { data: rawReviews } = useUserReviews(userId);
  // TODO: 백엔드 api에 projectStatus 추가 후 r.projectStatus === undefined 조건 제거
  const reviews = rawReviews.filter(
    (r) => r.projectStatus === undefined || r.projectStatus === 'COMPLETED' || r.projectStatus === 'ARCHIVED',
  );

  return <ReviewListCard isMyProfile={isMyProfile} reviews={reviews} showThumbnail showTitle />;
};
