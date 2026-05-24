export const profileKeys = {
  all: ['profile'] as const,
  detail: (userId: number) => [...profileKeys.all, userId] as const,
};
