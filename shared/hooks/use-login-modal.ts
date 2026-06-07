import { useEffect } from 'react';

import { useMyProfile } from '@/features/profile/hooks/use-my-profile.query';

import { useQueryParam } from './use-query-param';

const LOGIN_MODAL_VALUE = 'login';

export const useLoginModal = () => {
  const { queryParamValue, updateQueryParam, removeQueryParam } = useQueryParam('modal');
  const { data: profile, isPending } = useMyProfile();

  const hasLoginParam = queryParamValue === LOGIN_MODAL_VALUE;
  const isOpen = hasLoginParam && !isPending && !profile;

  useEffect(() => {
    if (hasLoginParam && !isPending && profile) {
      removeQueryParam();
    }
  }, [hasLoginParam, isPending, profile, removeQueryParam]);

  const onOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      updateQueryParam(LOGIN_MODAL_VALUE);
    } else {
      removeQueryParam();
    }
  };

  return { isOpen, onOpenChange, openLoginModal: () => onOpenChange(true) };
};
