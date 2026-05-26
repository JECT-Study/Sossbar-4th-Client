const STORAGE_KEY = 'sossbar-completed-reviews';

const toKey = (projectId: number, revieweeId: number) => `${projectId}-${revieweeId}`;

export const markReviewCompleted = (projectId: number, revieweeId: number): void => {
  if (typeof window === 'undefined') {
    return;
  }

  const completed = getCompletedReviews();
  completed[toKey(projectId, revieweeId)] = true;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
};

export const getCompletedReviews = (): Record<string, boolean> => {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }
    const parsed: unknown = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? (parsed as Record<string, boolean>) : {};
  } catch {
    return {};
  }
};

export const isReviewCompleted = (projectId: number, revieweeId: number): boolean => {
  return getCompletedReviews()[toKey(projectId, revieweeId)] === true;
};
