export const profileKeys = {
  all: ['profile'] as const,
  my: ['myProfile'] as const,
  detail: (userLink: string) => [...profileKeys.all, userLink] as const,
};
