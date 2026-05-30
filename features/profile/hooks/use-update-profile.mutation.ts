import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateProfile } from '../api/update-profile';
import { profileKeys } from '../query-keys';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (profile) => {
      queryClient.setQueryData(profileKeys.detail(profile.userId), profile);
    },
  });
};
