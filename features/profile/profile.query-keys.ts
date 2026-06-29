import { authKeys } from '@/features/auth/api/auth.query-keys';

export const profileKeys = {
  all: ['profile'] as const,
  my: authKeys.me,
  detail: (userId: number) => [...profileKeys.all, userId] as const,
};
