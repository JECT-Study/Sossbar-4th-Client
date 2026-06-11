import { useCallback, useEffect } from 'react';

import { useQueryParam } from './use-query-param';

const LOGIN_MODAL_VALUE = 'login';

interface Params {
  isAuthenticated?: boolean;
}

export const useLoginModal = ({ isAuthenticated = false }: Params = {}) => {
  const { queryParamValue, updateQueryParam, removeQueryParam } = useQueryParam('modal');

  const hasLoginParam = queryParamValue === LOGIN_MODAL_VALUE;
  const isOpen = hasLoginParam && !isAuthenticated;

  useEffect(() => {
    if (hasLoginParam && isAuthenticated) {
      removeQueryParam();
    }
  }, [hasLoginParam, isAuthenticated, removeQueryParam]);

  const onOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) {
        updateQueryParam(LOGIN_MODAL_VALUE);
      } else {
        removeQueryParam();
      }
    },
    [removeQueryParam, updateQueryParam],
  );

  const openLoginModal = useCallback(() => {
    if (!isAuthenticated) {
      updateQueryParam(LOGIN_MODAL_VALUE);
    }
  }, [isAuthenticated, updateQueryParam]);

  return { isOpen, onOpenChange, openLoginModal };
};
