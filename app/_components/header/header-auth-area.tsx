import type { Profile } from '@/features/profile/profile.types';
import { KakaoLoginButton } from '@/shared/components/button/kakao-login-button';

import { HeaderAuthAreaClient } from './header-auth-area-client';

interface Props {
  initialProfile: Profile | null;
}

export const HeaderAuthArea = ({ initialProfile }: Props) => {
  if (initialProfile === null) {
    return <KakaoLoginButton />;
  }

  return <HeaderAuthAreaClient initialProfile={initialProfile} />;
};
