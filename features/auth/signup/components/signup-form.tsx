'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Button } from '@/shared/components/button';
import { InformationDialog } from '@/shared/components/dialog/information-dialog';
import { TextField } from '@/shared/components/text-field';
import { TextareaField } from '@/shared/components/textarea-field';

import { BIO_MAX_LENGTH } from '../signup-constants';
import { SignupAgreement } from './signup-agreement';
import { useSignupForm } from '../hooks/use-signup-form';

export const SignupForm = () => {
  const router = useRouter();
  const { isSignupCompleted, canSubmit, form, onSubmit } = useSignupForm();

  const {
    formState: { errors },
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
  } = form;

  const goToProjects = () => router.push('/projects');

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

      <TextareaField
        label="한 줄 소개"
        placeholder="내용을 입력해 주세요. (기본상태)"
        maxLength={BIO_MAX_LENGTH}
        errorMessage={errors.bio?.message}
        className="mt-10"
        {...register('bio')}
      />

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
          description="프로젝트 페이지에서 협업을 시작해보세요!"
          confirmText="프로젝트 관리로 가기"
          open={isSignupCompleted}
          icon={<Image src="/signup_image.svg" alt="" width={120} height={120} className="h-full w-full" />}
          onOpenChange={goToProjects}
          onConfirm={goToProjects}
        />
      ) : null}
    </form>
  );
};
