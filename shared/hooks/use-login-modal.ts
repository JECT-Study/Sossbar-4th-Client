import { useCallback, useEffect } from 'react';

import { LOGIN_MODAL_QUERY_KEY, LOGIN_MODAL_QUERY_VALUE } from '@/shared/constants/login-modal-query';

import { useQueryParam } from './use-query-param';

interface Params {
  isAuthenticated?: boolean;
}

export const useLoginModal = ({ isAuthenticated = false }: Params = {}) => {
  const { queryParamValue, updateQueryParam, removeQueryParam } = useQueryParam(LOGIN_MODAL_QUERY_KEY);

  const hasLoginParam = queryParamValue === LOGIN_MODAL_QUERY_VALUE;
  const isOpen = hasLoginParam && !isAuthenticated;

  useEffect(() => {
    if (hasLoginParam && isAuthenticated) {
      removeQueryParam();
    }
  }, [hasLoginParam, isAuthenticated, removeQueryParam]);

  const onOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) {
        updateQueryParam(LOGIN_MODAL_QUERY_VALUE);
      } else {
        removeQueryParam();
      }
    },
    [removeQueryParam, updateQueryParam],
  );

  const openLoginModal = useCallback(() => {
    if (!isAuthenticated) {
      updateQueryParam(LOGIN_MODAL_QUERY_VALUE);
    }
  }, [isAuthenticated, updateQueryParam]);

  return { isOpen, onOpenChange, openLoginModal };
};
