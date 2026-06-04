'use client';

import { ReviewListCard } from './review-list-card';
import { useProjectReviews } from '../../api/queries';

interface ProjectReviewContainerProps {
  userId: number;
  projectId: number;
  isMyProfile: boolean;
}

export const ProjectReviewContainer = ({ userId, projectId, isMyProfile }: ProjectReviewContainerProps) => {
  const { data: reviews = [], isError } = useProjectReviews(userId, projectId);

  if (isError) {
    return <p className="text-body-base text-text-subtle">후기를 불러오지 못했습니다.</p>;
  }

  return <ReviewListCard isMyProfile={isMyProfile} reviews={reviews} showThumbnail={false} showTitle={false} />;
};
