const submittedReviewKeys = new Set<string>();

const toKey = (projectId: number, revieweeId: number) => `${projectId}-${revieweeId}`;

export const markMockReviewSubmitted = (projectId: number, revieweeId: number): void => {
  submittedReviewKeys.add(toKey(projectId, revieweeId));
};

export const isMockReviewSubmitted = (projectId: number, revieweeId: number): boolean =>
  submittedReviewKeys.has(toKey(projectId, revieweeId));
