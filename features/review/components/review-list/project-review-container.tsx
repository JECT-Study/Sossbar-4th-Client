'use client';

import { ReviewListCard } from './review-list-card';
import { useProjectReviews } from '../../api/queries';

type ProjectReviewContainerProps = {
  userId: number;
  projectId: number;
  isMyProfile: boolean;
};

export const ProjectReviewContainer = ({ userId, projectId, isMyProfile }: ProjectReviewContainerProps) => {
  const { data: reviews = [], isError } = useProjectReviews(userId, projectId);

  if (isError) {
    return <ReviewListEmpty title="후기를 불러오지 못했습니다." />;
  }

  return <ReviewListCard isMyProfile={isMyProfile} reviews={reviews} showThumbnail={false} />;
};
