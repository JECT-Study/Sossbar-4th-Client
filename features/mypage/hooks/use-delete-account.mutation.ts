import { useMutation } from '@tanstack/react-query';

import { deleteAccount } from '../apis/delete-account.api';

export const useDeleteAccountMutation = () => {
  return useMutation({
    mutationFn: deleteAccount,
  });
};
