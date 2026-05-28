import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

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

export const useSignupForm = () => {
  const [isSignupCompleted, completeSignup] = useBooleanState();
  const { mutateAsync: signup, isPending } = useSignup();

  const form = useForm({
    defaultValues,
    mode: 'onTouched',
    reValidateMode: 'onChange',
    resolver: zodResolver(SignupFormSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      await signup({
        name: data.name,
        bio: data.bio,
      });
      completeSignup();
    } catch (error) {
      form.setError('root', {
        message: error instanceof ApiError ? error.message : '서버 오류가 발생했어요. 잠시 후 다시 시도해주세요.',
      });
    }
  };

  const canSubmit = form.formState.isValid && !isPending;

  return {
    canSubmit,
    onSubmit,
    form,
    isSignupCompleted,
  };
};
