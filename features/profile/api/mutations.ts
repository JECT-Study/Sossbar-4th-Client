import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createOnboarding, updateProfile } from './fetchers';
import { profileKeys } from './queries';

export const useOnboarding = () =>
  useMutation({
    mutationFn: createOnboarding,
  });

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.all });
    },
  });
};
