import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteAccount } from '../apis/delete-account.api';
import { mypageKeys } from '../mypage.query-key';

export const useDeleteAccountMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mypageKeys.all });
    },
  });
};
