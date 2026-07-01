'use client';

import { useMyProfile } from '@/features/profile';
import { Button } from '@/shared/components/button/button';
import { ProtectedLink } from '@/shared/components/protected-link';
import { ROUTES } from '@/shared/constants/routes';

export const HomeProfileButton = () => {
  const { data: profile } = useMyProfile();
  const profileHref = profile ? ROUTES.PROFILE(profile.userId) : ROUTES.MY_SOSS;

  return (
    <Button asChild variant="tertiary" size="large">
      <ProtectedLink href={profileHref}>내 프로필 보기</ProtectedLink>
    </Button>
  );
};
