import { useMutation } from '@tanstack/react-query';

import { setSessionUser } from '@/shared/lib/session-user';

import { createSignup } from './fetchers';

export const useSignup = () => {
  return useMutation({
    mutationFn: createSignup,
    onSuccess: (user) => {
      setSessionUser({
        userId: user.userId,
        nickname: user.nickname,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
      });
    },
  });
};
