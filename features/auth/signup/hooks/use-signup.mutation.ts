import { useMutation, useQueryClient } from '@tanstack/react-query';

import { profileKeys } from '@/features/profile/profile.query-keys';

import { createSignup } from '../create-signup.api';

export const useSignup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSignup,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: profileKeys.my });
    },
  });
};
