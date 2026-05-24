import type { UserInfoResDto } from '@/features/auth/types';
import type { SessionUser } from '@/shared/lib/session-user';

export const mapProfileToSessionUser = (profile: UserInfoResDto): SessionUser => {
  const nickname = profile.username?.trim() || profile.email.split('@')[0] || '회원';

  return {
    userId: profile.userId,
    nickname,
    email: profile.email.trim(),
    profileImageUrl: profile.profileImageUrl?.trim() || null,
  };
};
