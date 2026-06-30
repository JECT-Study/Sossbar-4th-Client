'use client';

import { useCallback, useEffect } from 'react';

import { useQueryParam } from '@/shared/hooks/use-query-param';

import { LOGIN_MODAL_QUERY_KEY, LOGIN_MODAL_QUERY_VALUE } from './auth.constants';

interface UseLoginModalParams {
  isAuthenticated?: boolean;
}

export const useLoginModal = ({ isAuthenticated = false }: UseLoginModalParams = {}) => {
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
