export const profileKeys = {
  all: ['profile'] as const,
  my: ['myProfile'] as const,
  detail: (userId: number) => [...profileKeys.all, userId] as const,
};
