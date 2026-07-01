'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { ApiError } from '@/shared/lib/api';

import type { SignupStepId } from './auth.constants';
import type { AccountDeletionFormData, DeleteAccountPayload, SignupFormData } from './auth.types';
import type { Control, UseFormSetValue } from 'react-hook-form';

import { createSignup, deleteAccount } from './auth.api';
import { AGREEMENTS, WITHDRAW_REASON_ENUM_MAP } from './auth.constants';
import { AccountDeletionFormSchema, SignupFormSchema } from './auth.schemas';

export const useSignupMutation = () => {
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
  const { mutateAsync: signup, isPending } = useSignupMutation();

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

  return { form, onSubmit, isPending };
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

const STEP_BASIC_FIELDS = [
  'name',
  'bio',
  'profileImage',
  'agreements',
] as const satisfies readonly (keyof SignupFormData)[];

export const useSignupFlow = () => {
  const { form, onSubmit, isPending } = useSignupForm();
  const [currentStep, setCurrentStep] = useState<SignupStepId>('basic');

  const goNext = async () => {
    if (currentStep === 'basic') {
      if (await form.trigger([...STEP_BASIC_FIELDS])) {
        setCurrentStep('career');
      }
      return;
    }
    if (currentStep === 'career') {
      await form.handleSubmit(async (data) => {
        try {
          await onSubmit(data);
          setCurrentStep('complete');
        } catch {}
      })();
    }
  };

  const goPrev = () => {
    if (currentStep === 'career') {
      setCurrentStep('basic');
    }
  };

  return { form, currentStep, goNext, goPrev, isPending };
};

const toDeleteAccountPayload = (data: AccountDeletionFormData): DeleteAccountPayload => {
  const detail = data.reason === 'other' ? data.detail?.trim() : undefined;

  return {
    userDeleteReasonEnum: WITHDRAW_REASON_ENUM_MAP[data.reason],
    ...(detail ? { detail } : {}),
  };
};

interface UseAccountDeletionFormParams {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const useAccountDeletionForm = ({ open, onOpenChange }: UseAccountDeletionFormParams) => {
  const form = useForm<AccountDeletionFormData>({
    resolver: zodResolver(AccountDeletionFormSchema),
    defaultValues: { detail: '' },
    mode: 'onChange',
  });

  const { mutateAsync: submitDeleteAccount, isPending: isSubmitting } = useMutation({
    mutationFn: deleteAccount,
  });

  const [isCompleteModalOpen, setCompleteModalOpen] = useState(false);

  const reason = useWatch({ control: form.control, name: 'reason' });
  const isDetailEnabled = reason === 'other';

  const { clearErrors, reset, setValue } = form;

  useEffect(() => {
    if (isDetailEnabled) {
      return;
    }
    clearErrors('detail');
    setValue('detail', '', { shouldDirty: false, shouldTouch: false, shouldValidate: false });
  }, [clearErrors, isDetailEnabled, setValue]);

  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

  const handleFormSubmit = form.handleSubmit(async (data) => {
    try {
      await submitDeleteAccount(toDeleteAccountPayload(data));
      onOpenChange(false);
      setCompleteModalOpen(true);
    } catch {
      form.setError('root', { message: '오류가 발생했습니다. 잠시 후 다시 시도해주세요.' });
    }
  });

  const closeCompleteModal = useCallback(() => setCompleteModalOpen(false), []);

  const canSubmit = form.formState.isValid && !form.formState.isSubmitting && !isSubmitting;

  return {
    form,
    isDetailEnabled,
    canSubmit,
    isCompleteModalOpen,
    closeCompleteModal,
    handleFormSubmit,
  };
};
