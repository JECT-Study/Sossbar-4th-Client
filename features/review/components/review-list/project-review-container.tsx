'use client';

import { ReviewListCard } from './review-list-card';
import { useProjectReviews } from '../../api/queries';

type ProjectReviewContainerProps = {
  userId: number;
  projectId: number;
  isMyProfile: boolean;
};

export const ProjectReviewContainer = ({ userId, projectId, isMyProfile }: ProjectReviewContainerProps) => {
  const { data: reviews = [] } = useProjectReviews(userId, projectId);

  return <ReviewListCard isMyProfile={isMyProfile} reviews={reviews} showThumbnail={false} showTitle={false} />;
};
