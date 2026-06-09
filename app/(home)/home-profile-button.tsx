'use client';

import { useMyProfile } from '@/features/profile/hooks/use-my-profile.query';
import { AuthGateLink } from '@/shared/components/auth-gate-link';
import { Button } from '@/shared/components/button/button';
import { ROUTES } from '@/shared/constants/routes';

export const HomeProfileButton = () => {
  const { data: profile } = useMyProfile();
  return (
    <Button asChild variant="tertiary" size="large">
      <AuthGateLink href={ROUTES.PROFILE(profile?.userId ?? '')}>내 프로필 보기</AuthGateLink>
    </Button>
  );
};
