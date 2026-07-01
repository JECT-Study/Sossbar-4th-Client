export const tagKeys = {
  all: ['tag'] as const,
  received: (userLink: string, projectId?: number) => [...tagKeys.all, 'received', userLink, projectId] as const,
};
