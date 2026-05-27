export const projectKeys = {
  all: ['project'] as const,
  detail: (projectId: number) => [...projectKeys.all, 'detail', projectId] as const,
  byUser: (userId: number) => [...projectKeys.all, 'byUser', userId] as const,
};
