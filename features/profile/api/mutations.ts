import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createOnboarding, updateProfile } from './fetchers';
import { profileKeys } from './queries';

export const useOnboarding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOnboarding,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: profileKeys.all });
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: profileKeys.all });
    },
  });
};
