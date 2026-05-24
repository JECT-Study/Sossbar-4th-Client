'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Button } from '@/shared/components/button';
import { InformationDialog } from '@/shared/components/dialog/information-dialog';
import { TextField } from '@/shared/components/text-field';
import { TextareaLegacy } from '@/shared/components/textarea-legacy';

import { useSignupForm } from '../use-signup-form';
import { FormField } from './form-field';
import { SignupAgreement } from './signup-agreement';
import { BIO_MAX_LENGTH } from '../constants';

export const SignupForm = () => {
  const router = useRouter();
  const { isSignupCompleted, canSubmit, form, onSubmit } = useSignupForm();

  const {
    formState: { errors },
    watch,
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
  } = form;

  const goToProfile = () => router.push('/');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 w-full max-w-[460px]">
      <TextField
        label="이름"
        placeholder="입력해주세요."
        errorMessage={errors.name?.message}
        required
        clearable
        maxLength={20}
        {...register('name')}
      />

      <FormField label="한 줄 소개" htmlFor="bio" className="mt-10">
        <TextareaLegacy
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

      {errors.root ? <p className="text-body-sm text-text-error mt-3">{errors.root.message}</p> : null}

      <Button disabled={!canSubmit} size="large" className="mt-4 w-full rounded-xl py-4 text-[18px] font-semibold">
        가입완료
      </Button>

      {isSignupCompleted ? (
        <InformationDialog
          title={
            <>
              <span className="text-text-primary">{getValues('name')}님</span>
              <br />
              가입이 완료되었습니다!
            </>
          }
          description="협업 프로필을 공유해보세요!"
          confirmText="프로필 공유하러 가기"
          open={isSignupCompleted}
          icon={<Image src="/signup_image.svg" alt="" width={120} height={120} className="h-full w-full" />}
          onOpenChange={goToProfile}
          onConfirm={goToProfile}
        />
      ) : null}
    </form>
  );
};
