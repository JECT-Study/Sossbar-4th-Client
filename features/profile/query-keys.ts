export const profileKeys = {
  all: ['profile'] as const,
  my: ['my-profile'] as const,
  detail: (userId: number) => [...profileKeys.all, userId] as const,
};
