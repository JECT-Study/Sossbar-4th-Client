import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { ApiError } from '@/shared/lib/api';

import type { SignupFormData } from '../types';

import { useSignup } from './use-signup.mutation';
import { SignupFormSchema } from '../signup.schemas';

const defaultValues: SignupFormData = {
  name: '',
  bio: '',
  profileImage: null,
  agreements: {
    age: false,
    terms: false,
    privacy: false,
  },
  fields: [],
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
        fields: data.fields,
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
