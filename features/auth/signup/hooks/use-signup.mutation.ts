import { useMutation } from '@tanstack/react-query';

import { setSessionUser } from '@/shared/lib/session-user';

import { createSignup } from '../create-signup.api';

export const useSignup = () => {
  return useMutation({
    mutationFn: createSignup,
    onSuccess: (user) => {
      setSessionUser({
        userId: user.userId,
        nickname: user.nickname ?? user.username,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
      });
    },
  });
};
