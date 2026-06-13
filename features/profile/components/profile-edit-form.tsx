'use client';

import type { ChangeEvent } from 'react';

import { useRef } from 'react';
import { Controller, useWatch } from 'react-hook-form';

import { CameraIcon } from '@/shared/assets/icons';
import { Button } from '@/shared/components/button';
import { TextField } from '@/shared/components/text-field';
import { TextareaField } from '@/shared/components/textarea-field';

import type { Profile, UpdateProfilePayload } from '../profile.types';

import { PROFILE_BIO_MAX_LENGTH, PROFILE_NICKNAME_MAX_LENGTH } from '../profile.constants';
import { ProfileAvatar } from './profile-avatar';
import { useProfileEditForm } from '../hooks/use-profile-edit-form';

/** 프로필 이미지 file input accept 속성 */
const PROFILE_IMAGE_ACCEPT = 'image/png,image/jpeg,image/webp';

interface Props {
  profile: Profile;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmitProfile: (payload: UpdateProfilePayload) => Promise<void>;
}

export const ProfileEditForm = ({ profile, isSubmitting, onCancel, onSubmitProfile }: Props) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { form, onSubmit, previewImageUrl, setProfileImage } = useProfileEditForm({ profile, onSubmitProfile });
  const {
    formState: { errors },
    handleSubmit,
    control,
  } = form;

  const username = useWatch({ control, name: 'username' });
  const previewSrc = previewImageUrl ?? profile.profileImageUrl;

  const handleClickImageButton = () => {
    fileInputRef.current?.click();
  };

  const handleChangeProfileImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    setProfileImage(file);
  };

  return (
    <section className="mt-15.5 mb-8">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-start justify-between">
          <h2 className="text-heading-lg text-text-basic font-bold">프로필 수정</h2>
          <div className="flex gap-2">
            <Button type="button" variant="tertiary" size="medium" onClick={onCancel} disabled={isSubmitting}>
              취소
            </Button>
            <Button type="submit" variant="secondary" size="medium" disabled={isSubmitting}>
              저장
            </Button>
          </div>
        </div>
        <div className="mt-6 flex gap-6">
          <div className="relative shrink-0">
            <ProfileAvatar username={username.trim() || profile.username} profileImageUrl={previewSrc} />
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
              aria-label="프로필 이미지 변경"
              onClick={handleClickImageButton}
              disabled={isSubmitting}
            >
              <CameraIcon className="text-icon-gray-fill size-6" />
            </button>
          </div>
          <div className="flex w-full max-w-120 flex-1 flex-col gap-2">
            <Controller
              control={control}
              name="username"
              render={({ field }) => (
                <TextField
                  label="닉네임"
                  required
                  placeholder="내용을 입력하세요"
                  maxLength={PROFILE_NICKNAME_MAX_LENGTH}
                  errorMessage={errors.username?.message}
                  {...field}
                  disabled={isSubmitting}
                />
              )}
            />
            <Controller
              control={control}
              name="bio"
              render={({ field }) => (
                <TextareaField
                  className="max-w-full"
                  label="한 줄 소개"
                  placeholder="협업을 즐기는 프론트엔드 개발자입니다."
                  maxLength={PROFILE_BIO_MAX_LENGTH}
                  errorMessage={errors.bio?.message}
                  disabled={isSubmitting}
                  {...field}
                />
              )}
            />
            {errors.root ? <p className="text-body-sm text-text-error mt-1">{errors.root.message}</p> : null}
          </div>
        </div>
      </form>
    </section>
  );
};
