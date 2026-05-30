'use client';

import { ReviewListCard } from './review-list-card';
import { useUserReviews } from '../../api/queries';

type UserReviewContainerProps = {
  userId: number;
  isMyProfile: boolean;
};

export const UserReviewContainer = ({ userId, isMyProfile }: UserReviewContainerProps) => {
  const { data: rawReviews = [] } = useUserReviews(userId);
  // projectStatus가 응답에 포함된 경우 COMPLETED·ARCHIVED 프로젝트 후기만 표시
  // TODO: 백엔드 api에 projectStatus 추가 후 r.projectStatus === undefined 조건 제거
  const reviews = rawReviews.filter(
    (r) => r.projectStatus === undefined || r.projectStatus === 'COMPLETED' || r.projectStatus === 'ARCHIVED',
  );

  return <ReviewListCard isMyProfile={isMyProfile} reviews={reviews} showThumbnail />;
};
