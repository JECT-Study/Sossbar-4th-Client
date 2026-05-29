export const reviewKeys = {
  all: ['review'] as const,
  reviews: (userId: number) => [...reviewKeys.all, 'reviews', userId] as const,
  formData: () => [...reviewKeys.all, 'formData'] as const,
  receivedTags: (userId: number, projectId?: number) => [...reviewKeys.all, 'tags', userId, projectId] as const,
  spectrum: (userId: number, projectId?: number) => [...reviewKeys.all, 'spectrums', userId, projectId] as const,
  projectReviews: (userId: number, projectId: number) => [...reviewKeys.all, 'reviews', userId, projectId] as const,
};
