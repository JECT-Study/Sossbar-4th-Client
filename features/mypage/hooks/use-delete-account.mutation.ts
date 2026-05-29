import { useMutation } from '@tanstack/react-query';

import { clearAuthToken } from '@/shared/lib/auth-token';
import { clearSessionUser } from '@/shared/lib/session-user';

import { deleteAccount } from '../apis/delete-account.api';

export const useDeleteAccountMutation = () => {
  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      clearSessionUser();
      clearAuthToken();
    },
  });
};
