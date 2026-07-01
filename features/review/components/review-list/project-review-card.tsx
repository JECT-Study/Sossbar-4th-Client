'use client';

import { ReviewListCard } from './review-list-card';
import { useProjectReviews } from '../../review.hooks';

interface Props {
  userId: number;
  projectId: number;
}

export const ProjectReviewCard = ({ userId, projectId }: Props) => {
  const { data: reviews = [], isError } = useProjectReviews(userId, projectId);

  if (isError) {
    return <p className="text-body-base text-text-subtle">후기를 불러오지 못했습니다.</p>;
  }

  return <ReviewListCard reviews={reviews} showProjectName={false} showSort showReportMenu />;
};
