'use client';

import type { ChangeEvent } from 'react';

import { useRef } from 'react';
import { Controller, useWatch } from 'react-hook-form';

import { PlusIcon } from '@/shared/assets/icons';
import { Button } from '@/shared/components/button';
import { TextField } from '@/shared/components/text-field';
import { Textarea } from '@/shared/components/textarea';

import type { Profile, UpdateProfilePayload } from '../types';

import { PROFILE_BIO_MAX_LENGTH, PROFILE_IMAGE_ACCEPT, PROFILE_NICKNAME_MAX_LENGTH } from '../constants';
import { useProfileEditForm } from '../use-profile-edit-form';
import { ProfileAvatar } from './profile-avatar';

type ProfileEditFormProps = {
  profile: Profile;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmitProfile: (payload: UpdateProfilePayload) => Promise<void>;
};

export const ProfileEditForm = ({ profile, isSubmitting, onCancel, onSubmitProfile }: ProfileEditFormProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { form, onSubmit, previewImageUrl, setProfileImage } = useProfileEditForm({ profile, onSubmitProfile });
  const {
    formState: { errors },
    handleSubmit,
    control,
  } = form;

  const bio = useWatch({ control, name: 'bio' });
  const nickname = useWatch({ control, name: 'nickname' });
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
            <ProfileAvatar nickname={nickname.trim() || profile.nickname} profileImageUrl={previewSrc} />
            <input
              ref={fileInputRef}
              type="file"
              accept={PROFILE_IMAGE_ACCEPT}
              className="sr-only"
              onChange={handleChangeProfileImage}
            />
            <button
              type="button"
              className="absolute top-18.5 left-18.5 h-fit w-fit rounded-full"
              aria-label="프로필 이미지 변경"
              onClick={handleClickImageButton}
              disabled={isSubmitting}
            >
              <PlusIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="flex w-full max-w-120 flex-1 flex-col gap-2">
            <Controller
              control={control}
              name="nickname"
              render={({ field }) => (
                <TextField
                  label="닉네임"
                  required
                  placeholder="내용을 입력하세요"
                  maxLength={PROFILE_NICKNAME_MAX_LENGTH}
                  errorMessage={errors.nickname?.message}
                  disabled={isSubmitting}
                  {...field}
                />
              )}
            />
            <Controller
              control={control}
              name="bio"
              render={({ field }) => (
                <Textarea
                  className="max-w-full"
                  label="한 줄 소개"
                  placeholder="협업을 즐기는 프론트엔드 개발자입니다."
                  maxLength={PROFILE_BIO_MAX_LENGTH}
                  variant={errors.bio ? 'error' : 'default'}
                  errorMessage={errors.bio?.message}
                  disabled={isSubmitting}
                  currentCount={bio.length}
                  totalCount={PROFILE_BIO_MAX_LENGTH}
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
