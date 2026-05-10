import { useMutation } from '@tanstack/react-query';

import { createOnboarding } from './fetchers';

export const useOnboarding = () =>
  useMutation({
    mutationFn: createOnboarding,
  });
