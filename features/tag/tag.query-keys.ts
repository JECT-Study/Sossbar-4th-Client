export const tagKeys = {
  all: ['tag'] as const,
  received: (userId: number, projectId?: number) => [...tagKeys.all, 'received', userId, projectId] as const,
};
