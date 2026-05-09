import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

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
  const {
    control,
    watch,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    defaultValues,
    mode: 'onTouched',
    reValidateMode: 'onChange',
    resolver: zodResolver(SignupFormSchema),
  });

  const onSubmit = (data: SignupFormData) => {
    // eslint-disable-next-line no-console
    console.log(data);
  };

  const canSubmit = isValid;

  return {
    canSubmit,
    errors,
    control,
    watch,
    register,
    handleSubmit,
    onSubmit,
    setValue,
  };
};
