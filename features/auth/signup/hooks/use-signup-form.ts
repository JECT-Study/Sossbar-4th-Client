import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';

import { useBooleanState } from '@/shared/hooks/use-boolean-state';
import { ApiError } from '@/shared/lib/api';

import type { SignupFormData } from '../types';

import { useSignup } from './use-signup.mutation';
import { SignupFormSchema } from '../signup-form.schema';

const defaultValues: SignupFormData = {
  name: '',
  bio: '',
  agreements: {
    age: false,
    terms: false,
    privacy: false,
    marketing: false,
  },
};

const hasRequiredAgreements = (agreements: SignupFormData['agreements'] | undefined) =>
  agreements?.age === true && agreements?.terms === true && agreements?.privacy === true;

export const useSignupForm = () => {
  const [isSignupCompleted, completeSignup] = useBooleanState();
  const { mutateAsync: signup, isPending } = useSignup();

  const form = useForm({
    defaultValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: zodResolver(SignupFormSchema),
  });

  const watchedName = useWatch({ control: form.control, name: 'name' });
  const watchedBio = useWatch({ control: form.control, name: 'bio' });
  const watchedAgreements = useWatch({ control: form.control, name: 'agreements' });

  const onSubmit = async (data: Pick<SignupFormData, 'name' | 'bio'>) => {
    try {
      await signup(data);
      completeSignup();
    } catch (error) {
      let message = '서버 오류가 발생했어요. 잠시 후 다시 시도해 주세요.';

      if (error instanceof ApiError) {
        message =
          error.status >= 500 ? '가입 처리 중 서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' : error.message;
      }

      form.setError('root', { message });
    }
  };

  const canSubmit =
    (watchedName?.trim().length ?? 0) >= 2 &&
    (watchedBio?.trim().length ?? 0) >= 1 &&
    hasRequiredAgreements(watchedAgreements) &&
    !isPending;

  return {
    canSubmit,
    onSubmit,
    form,
    isSignupCompleted,
  };
};
