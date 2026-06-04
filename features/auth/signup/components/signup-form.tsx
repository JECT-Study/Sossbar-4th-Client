'use client';

import type { ChangeEvent } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';

import { ProfileAvatar } from '@/features/profile';
import { CameraIcon } from '@/shared/assets/icons';
import { Button } from '@/shared/components/button';
import { InformationDialog } from '@/shared/components/dialog/information-dialog';
import { TextField } from '@/shared/components/text-field';
import { TextareaField } from '@/shared/components/textarea-field';

import { BIO_MAX_LENGTH, PROFILE_IMAGE_ACCEPT } from '../signup-constants';
import { SignupAgreement } from './signup-agreement';
import { useSignupForm } from '../hooks/use-signup-form';

export const SignupForm = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { isSignupCompleted, canSubmit, form, onSubmit, previewImageUrl, setProfileImage } = useSignupForm();

  const {
    formState: { errors },
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    watch,
  } = form;

  const watchedName = watch('name');
  const goToProfile = () => router.push('/');

  const handleClickImageButton = () => fileInputRef.current?.click();

  const handleChangeProfileImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setProfileImage(file);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 w-full max-w-[460px]">
      <div className="flex flex-col items-center">
        <div className="relative">
          <ProfileAvatar username={watchedName.trim() || '이름'} profileImageUrl={previewImageUrl} />
          <input
            ref={fileInputRef}
            type="file"
            accept={PROFILE_IMAGE_ACCEPT}
            className="sr-only"
            onChange={handleChangeProfileImage}
          />
          <button
            type="button"
            className="border-icon-gray-fill absolute top-14.5 left-16.75 flex size-10.5 cursor-pointer items-center justify-center rounded-full border bg-white"
            aria-label="프로필 이미지 선택"
            onClick={handleClickImageButton}
          >
            <CameraIcon className="text-icon-gray-fill size-6" />
          </button>
        </div>
        {errors.profileImage ? (
          <p className="text-body-sm text-text-error mt-2">{errors.profileImage.message}</p>
        ) : null}
      </div>

      <TextField
        label="이름"
        placeholder="입력해주세요."
        errorMessage={errors.name?.message}
        required
        clearable
        maxLength={20}
        className="mt-8"
        {...register('name')}
      />

      <TextareaField
        label="한 줄 소개"
        placeholder="내용을 입력해 주세요. (기본상태)"
        maxLength={BIO_MAX_LENGTH}
        errorMessage={errors.bio?.message}
        required
        className="mt-10"
        {...register('bio')}
      />

      <SignupAgreement control={control} setValue={setValue} />

      {!canSubmit && errors.agreements?.message ? (
        <p className="text-body-sm text-text-error mt-3">{errors.agreements.message}</p>
      ) : null}

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
