import { apiRequest } from '@/shared/lib/api';

import type { UpdateProfilePayload, UpdateProfileResponse } from '../profile.types';

const createUpdateProfileFormData = ({ info, profileImage }: UpdateProfilePayload) => {
  const formData = new FormData();

  formData.append('info', new Blob([JSON.stringify(info)], { type: 'application/json' }));
  formData.append('profileImage', profileImage ?? '');

  return formData;
};

export const updateProfile = (payload: UpdateProfilePayload): Promise<UpdateProfileResponse> =>
  apiRequest<UpdateProfileResponse>('/users/profile', {
    method: 'PATCH',
    body: createUpdateProfileFormData(payload),
  });
