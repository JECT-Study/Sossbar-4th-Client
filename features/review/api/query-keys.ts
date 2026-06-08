export const reviewKeys = {
  all: ['review'] as const,
  reviews: (userId: number) => [...reviewKeys.all, 'reviews', userId] as const,
  formData: () => [...reviewKeys.all, 'formData'] as const,
  projectReviews: (userId: number, projectId: number) => [...reviewKeys.all, 'reviews', userId, projectId] as const,
  validate: (projectId: number, revieweeId: number) => [...reviewKeys.all, 'validate', projectId, revieweeId] as const,
};
