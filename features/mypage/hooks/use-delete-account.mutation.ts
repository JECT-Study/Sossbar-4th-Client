import { useMutation } from '@tanstack/react-query';

import { clearSessionUser } from '@/shared/lib/session-user';

import { deleteAccount } from '../apis/delete-account.api';

export const useDeleteAccountMutation = () => {
  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      clearSessionUser();
    },
  });
};
