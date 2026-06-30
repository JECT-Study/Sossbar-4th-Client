import { useMutation } from '@tanstack/react-query';

import { createSignup } from '../../api/auth.mutations';

export const useSignup = () => {
  return useMutation({
    mutationFn: createSignup,
  });
};
