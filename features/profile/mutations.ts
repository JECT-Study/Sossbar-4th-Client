import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateProfile } from './fetchers';
import { profileKeys } from './query-keys';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.all });
    },
  });
};
