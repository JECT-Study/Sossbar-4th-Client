'use client';

import { useMyProfile } from '@/features/profile/hooks/use-my-profile.query';
import { Button } from '@/shared/components/button/button';
import { ProtectedLink } from '@/shared/components/protected-link';
import { ROUTES } from '@/shared/constants/routes';

export const HomeRenewalProfileButton = () => {
  const { data: profile } = useMyProfile();

  return (
    <Button
      asChild
      variant="tertiary"
      size="large"
      className="text-text-basic-inverse text-body-xl h-14 px-7 shadow-[0px_4px_2px_rgba(0,0,0,0.25)]"
    >
      <ProtectedLink href={ROUTES.PROFILE(profile?.userId ?? '')}>내 프로필 보기</ProtectedLink>
    </Button>
  );
};
