import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateProfile } from './fetchers';
import { profileKeys } from './queries';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: profileKeys.all });
    },
  });
};
