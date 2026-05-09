'use client';

import { Button } from '@/shared/components/button';
import { Input } from '@/shared/components/input';
import { Textarea } from '@/shared/components/textarea';

import { BIO_MAX_LENGTH } from '../constants';
import { useSignupForm } from '../use-signup-form';
import { FormField } from './form-field';
import { SignupAgreement } from './signup-agreement';

export const SignupForm = () => {
  const { canSubmit, errors, control, register, handleSubmit, onSubmit, watch, setValue } = useSignupForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 w-full max-w-[460px]">
      <FormField label="이름" htmlFor="name">
        <Input
          type="text"
          id="name"
          placeholder="입력해주세요."
          className="max-w-none"
          inputClassName="text-[16px]"
          variant={errors.name ? 'error' : 'default'}
          errorMessage={errors.name?.message}
          {...register('name')}
        />
      </FormField>

      <FormField label="한 줄 소개" htmlFor="bio" className="mt-10">
        <Textarea
          variant={errors.bio ? 'error' : 'default'}
          id="bio"
          placeholder="내용을 입력해 주세요. (기본상태)"
          rows={4}
          currentCount={watch('bio').length}
          totalCount={BIO_MAX_LENGTH}
          className="max-w-none"
          textareaClassName="text-[16px] rounded-xl"
          errorMessage={errors.bio?.message}
          {...register('bio')}
        />
      </FormField>

      <SignupAgreement control={control} setValue={setValue} />

      <Button disabled={!canSubmit} size="large" className="mt-10 w-full rounded-xl py-4 text-[18px] font-semibold">
        가입완료
      </Button>
    </form>
  );
};
