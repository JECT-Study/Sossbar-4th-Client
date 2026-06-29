'use client';

import { useEffect } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { CameraIcon } from '@/shared/assets/icons';
import { Button } from '@/shared/components/button';
import { useFileInput, useImagePreview } from '@/shared/components/file-input';
import { TextField } from '@/shared/components/text-field';
import { TextareaField } from '@/shared/components/textarea-field';

import type { SignupFormData } from '../types';

import { BIO_MAX_LENGTH, NAME_MAX_LENGTH, PROFILE_IMAGE_ACCEPT } from '../signup-constants';
import { SignupBasicStepSchema } from '../signup-form.schema';
import { SignupAgreement } from './signup-agreement';

interface Props {
  onNext: () => void;
}

export const SignupStepBasic = ({ onNext }: Props) => {
  const { control, setValue, formState } = useFormContext<SignupFormData>();
  const { errors } = formState;
  const [name, bio, profileImage, agreements] = useWatch({
    control,
    name: ['name', 'bio', 'profileImage', 'agreements'],
  });
  const { previewUrl, onChange: syncPreview } = useImagePreview();

  useEffect(() => {
    syncPreview(profileImage ?? null);
  }, [profileImage, syncPreview]);

  const canGoNext = SignupBasicStepSchema.safeParse({ name, bio, profileImage, agreements }).success;

  const { inputRef, openPicker, handleFileChange } = useFileInput({
    onChange: (file) => {
      setValue('profileImage', file, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
    },
  });

  return (
    <div className="mt-13 flex w-full max-w-[460px] flex-col">
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="bg-action-gray-light flex size-25 shrink-0 items-center justify-center overflow-hidden rounded-full">
            <img
              src={previewUrl ?? '/default-profile.png'}
              alt="프로필 이미지 미리보기"
              className="h-full w-full object-cover"
            />
          </div>
          <input
            ref={inputRef}
            type="file"
            accept={PROFILE_IMAGE_ACCEPT}
            className="sr-only"
            onChange={handleFileChange}
          />
          <button
            type="button"
            className="border-icon-gray-fill absolute top-14.5 left-16.75 flex size-10.5 cursor-pointer items-center justify-center rounded-full border bg-white"
            aria-label="프로필 이미지 선택"
            onClick={openPicker}
          >
            <CameraIcon className="text-icon-gray-fill size-6" />
          </button>
        </div>
        {errors.profileImage ? (
          <p className="text-body-sm text-text-error mt-2">{errors.profileImage.message}</p>
        ) : null}
      </div>

      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <TextField
            name={field.name}
            label="이름"
            placeholder="실명을 입력해주세요"
            required
            clearable
            maxLength={NAME_MAX_LENGTH}
            className="mt-8"
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            errorMessage={errors.name?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="bio"
        render={({ field }) => (
          <TextareaField
            name="bio"
            label="한 줄 소개"
            placeholder="본인을 간단히 소개해주세요"
            maxLength={BIO_MAX_LENGTH}
            required
            className="mt-10"
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            errorMessage={errors.bio?.message}
          />
        )}
      />

      <SignupAgreement control={control} setValue={setValue} />

      {errors.agreements?.message ? (
        <p className="text-body-sm text-text-error mt-3">{errors.agreements.message}</p>
      ) : null}

      <Button type="button" size="medium" onClick={onNext} disabled={!canGoNext} className="mt-12 w-full">
        다음
      </Button>
    </div>
  );
};
