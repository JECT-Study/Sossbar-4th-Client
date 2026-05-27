type BuildReviewWriteUrlParams = {
  projectId: number;
  revieweeId: number;
  revieweeName: string;
};

export const buildReviewWriteUrl = ({ projectId, revieweeId, revieweeName }: BuildReviewWriteUrlParams): string => {
  const params = new URLSearchParams({
    projectId: String(projectId),
    revieweeId: String(revieweeId),
    reviewee: revieweeName,
  });

  return `/reviews/new?${params.toString()}`;
};
