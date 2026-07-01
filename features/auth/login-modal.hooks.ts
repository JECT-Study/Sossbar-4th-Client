'use client';

import { useCallback, useEffect } from 'react';

import { useQueryParam } from '@/shared/hooks/use-query-param';

import { LOGIN_MODAL_QUERY_KEY, LOGIN_MODAL_QUERY_VALUE } from './auth.constants';

interface UseLoginGateParams {
  isAuthenticated?: boolean;
}

export const useLoginGate = ({ isAuthenticated = false }: UseLoginGateParams = {}) => {
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

  const openLogin = useCallback(() => {
    if (!isAuthenticated) {
      updateQueryParam(LOGIN_MODAL_QUERY_VALUE);
    }
  }, [isAuthenticated, updateQueryParam]);

  return { isOpen, onOpenChange, openLogin };
};
