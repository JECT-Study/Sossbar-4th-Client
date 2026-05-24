export const reviewKeys = {
  all: ['review'] as const,
  reviews: (userId: number) => [...reviewKeys.all, 'reviews', userId] as const,
  formData: () => [...reviewKeys.all, 'formData'] as const,
  receivedTags: (userId: number) => [...reviewKeys.all, 'tags', userId] as const,
  receivedTagsByProject: (userId: number, projectId: number) => [...reviewKeys.all, 'tags', userId, projectId] as const,
  spectrumStats: (userId: number) => [...reviewKeys.all, 'spectrums', userId] as const,
  spectrumStatsByProject: (userId: number, projectId: number) =>
    [...reviewKeys.all, 'spectrums', userId, projectId] as const,
};
