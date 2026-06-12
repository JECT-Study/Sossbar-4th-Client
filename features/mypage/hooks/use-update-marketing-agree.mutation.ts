import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateMarketingAgree } from '../apis/update-marketing-agree.api';
import { mypageKeys } from '../mypage.query-key';

export const useUpdateMarketingAgree = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMarketingAgree,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mypageKeys.all });
    },
  });
};
