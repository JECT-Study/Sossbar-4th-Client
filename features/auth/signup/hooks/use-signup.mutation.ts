import { useMutation } from '@tanstack/react-query';

import { createSignup } from '../api/create-signup.api';

export const useSignup = () => {
  return useMutation({
    mutationFn: createSignup,
  });
};
