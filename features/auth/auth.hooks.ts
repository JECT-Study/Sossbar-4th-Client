'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { useQueryParam } from '@/shared/hooks/use-query-param';
import { ApiError } from '@/shared/lib/api';

import type { SignupFormData } from './auth.types';
import type { Control, UseFormSetValue } from 'react-hook-form';

import { createSignup } from './auth.api';
import { AGREEMENTS, LOGIN_MODAL_QUERY_KEY, LOGIN_MODAL_QUERY_VALUE } from './auth.constants';
import { SignupFormSchema } from './auth.schemas';

export const useSignup = () => {
  return useMutation({
    mutationFn: createSignup,
  });
};

const defaultValues: SignupFormData = {
  name: '',
  bio: '',
  profileImage: null,
  agreements: {
    age: false,
    terms: false,
    privacy: false,
  },
  positions: [],
  links: [{ userLinkType: 'LINK', userLink: '' }],
};

export const useSignupForm = () => {
  const { mutateAsync: signup, isPending } = useSignup();

  const form = useForm({
    defaultValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: zodResolver(SignupFormSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      const sanitizedLinks = data.links
        .filter((link) => link.userLink.trim().length > 0)
        .map((link) => ({ userLinkType: link.userLinkType, userLink: link.userLink }));

      await signup({
        name: data.name,
        bio: data.bio,
        requiredAgree: data.agreements.age && data.agreements.terms && data.agreements.privacy,
        profileImage: data.profileImage ?? null,
        positions: data.positions,
        links: sanitizedLinks,
      });
    } catch (error) {
      let message = '서버 오류가 발생했어요. 잠시 후 다시 시도해 주세요.';

      if (error instanceof ApiError) {
        message =
          error.status >= 500 ? '가입 처리 중 서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' : error.message;
      }

      form.setError('root', { message });
      throw error;
    }
  };

  return {
    form,
    onSubmit,
    isPending,
  };
};

const defaultAgreements: SignupFormData['agreements'] = {
  age: false,
  terms: false,
  privacy: false,
};

export const useAgreements = (control: Control<SignupFormData>, setValue: UseFormSetValue<SignupFormData>) => {
  const agreements = useWatch({ control, name: 'agreements' }) ?? defaultAgreements;
  const agreeAll = AGREEMENTS.every(({ key }) => agreements[key] === true);

  const handleAgreeAll = (checked: boolean | 'indeterminate') => {
    if (checked !== true && checked !== false) {
      return;
    }
    AGREEMENTS.forEach(({ key }) =>
      setValue(`agreements.${key}`, checked, { shouldValidate: true, shouldTouch: true, shouldDirty: true }),
    );
  };

  return { agreeAll, handleAgreeAll };
};

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
