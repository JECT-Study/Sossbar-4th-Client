import { useEffect } from 'react';

import { useSessionUser } from '@/shared/lib/session-user';

import { useQueryParam } from './use-query-param';

const LOGIN_MODAL_VALUE = 'login';

export const useLoginModal = () => {
  const { queryParamValue, updateQueryParam, removeQueryParam } = useQueryParam('modal');
  const sessionUser = useSessionUser();

  const hasLoginParam = queryParamValue === LOGIN_MODAL_VALUE;
  const isOpen = hasLoginParam && !sessionUser;

  useEffect(() => {
    if (hasLoginParam && sessionUser) {
      removeQueryParam();
    }
  }, [hasLoginParam, sessionUser, removeQueryParam]);

  const onOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      updateQueryParam(LOGIN_MODAL_VALUE);
    } else {
      removeQueryParam();
    }
  };

  return { isOpen, onOpenChange, openLoginModal: () => onOpenChange(true) };
};
