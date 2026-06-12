import { apiRequest } from '@/shared/lib/api';

import type { Profile } from '../types/mypage.types';

interface UpdateMarketingAgreePayload {
  username: string;
  bio: string;
  marketingAgree: boolean;
}

export const updateMarketingAgree = ({
  username,
  bio,
  marketingAgree,
}: UpdateMarketingAgreePayload): Promise<Profile> => {
  const formData = new FormData();

  formData.append('info', new Blob([JSON.stringify({ username, bio, marketingAgree })], { type: 'application/json' }));

  return apiRequest<Profile>('/users/profile', { method: 'PATCH', body: formData });
};
