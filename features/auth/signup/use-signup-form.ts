import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useBooleanState } from '@/shared/hooks/use-boolean-state';

import type { SignupFormData } from './types';

import { SignupFormSchema } from './schemas';

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
  const [isSignupCompleted, handleSignupSuccess] = useBooleanState();

  const form = useForm({
    defaultValues,
    mode: 'onTouched',
    reValidateMode: 'onChange',
    resolver: zodResolver(SignupFormSchema),
  });

  const onSubmit = (data: SignupFormData) => {
    // eslint-disable-next-line no-console
    console.log(data);
    handleSignupSuccess();
  };

  const canSubmit = form.formState.isValid;

  return {
    canSubmit,
    onSubmit,
    form,
    /** 회원가입 성공 여부 **/
    isSignupCompleted,
    handleSignupSuccess,
  };
};
