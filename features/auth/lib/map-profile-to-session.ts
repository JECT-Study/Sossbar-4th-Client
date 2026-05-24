import type { UserInfoResDto } from '@/features/auth/types';
import type { SessionUser } from '@/shared/lib/session-user';

export const mapProfileToSessionUser = (profile: UserInfoResDto): SessionUser => {
  const email = profile.email.trim();
  const nickname = profile.username?.trim() || email.split('@')[0]?.trim() || '회원';

  return {
    userId: profile.userId,
    nickname,
    email,
    profileImageUrl: profile.profileImageUrl?.trim() || null,
  };
};
