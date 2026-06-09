'use client';

import { useMyProfile } from '@/features/profile/hooks/use-my-profile.query';
import { Button } from '@/shared/components/button/button';
import { ProtectedLink } from '@/shared/components/protected-link';
import { ROUTES } from '@/shared/constants/routes';

export const HomeProfileButton = () => {
  const { data: profile } = useMyProfile();
  return (
    <Button asChild variant="tertiary" size="large">
      <ProtectedLink href={ROUTES.PROFILE(profile?.userId ?? '')}>내 프로필 보기</ProtectedLink>
    </Button>
  );
};
