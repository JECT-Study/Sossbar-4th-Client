'use client';

import { Button } from '@/shared/components/button/button';
import { ProtectedLink } from '@/shared/components/protected-link';
import { ROUTES } from '@/shared/constants/routes';

type HomeProfileButtonProps = {
  className?: string;
};

export const HomeProfileButton = ({ className }: HomeProfileButtonProps) => (
  <Button asChild variant="tertiary" size="large" className={className}>
    <ProtectedLink href={ROUTES.MY_SOSS}>내 프로필 보기</ProtectedLink>
  </Button>
);
