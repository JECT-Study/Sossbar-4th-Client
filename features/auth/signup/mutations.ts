import { useMutation } from '@tanstack/react-query';

import { createSignup } from './fetchers';

export const useSignup = () => {
  return useMutation({
    mutationFn: createSignup,
  });
};
