'use client';

import type { ChangeEvent } from 'react';

import { useEffect, useRef, useState } from 'react';

import { ProfileAvatar } from '@/features/profile';
import { CameraIcon } from '@/shared/assets/icons';
import { Button } from '@/shared/components/button';
import { TextField } from '@/shared/components/text-field';
import { TextareaField } from '@/shared/components/textarea-field';

import { BIO_MAX_LENGTH, NAME_MAX_LENGTH, PROFILE_IMAGE_ACCEPT } from '../signup-constants';

interface Props {
  onNext: () => void;
}

export const SignupStepBasic = ({ onNext }: Props) => {
  // Phase A: local state stub. Phase B에서 useFormContext()로 교체 예정.
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewImageUrl) {
        URL.revokeObjectURL(previewImageUrl);
      }
    };
  }, [previewImageUrl]);

  const handleClickImageButton = () => fileInputRef.current?.click();

  const handleChangeProfileImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (previewImageUrl) {
      URL.revokeObjectURL(previewImageUrl);
    }
    setPreviewImageUrl(file ? URL.createObjectURL(file) : null);
  };

  return (
    <div className="mt-8 flex w-full max-w-[460px] flex-col">
      <div className="flex flex-col items-center">
        <div className="relative">
          <ProfileAvatar username={name.trim() || '이름'} profileImageUrl={previewImageUrl} />
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
      </div>

      <TextField
        name="name"
        label="이름"
        placeholder="실명을 입력해주세요"
        required
        clearable
        maxLength={NAME_MAX_LENGTH}
        className="mt-8"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />

      <TextareaField
        name="bio"
        label="한 줄 소개"
        placeholder="본인을 간단히 소개해주세요"
        maxLength={BIO_MAX_LENGTH}
        required
        className="mt-10"
        value={bio}
        onChange={(event) => setBio(event.target.value)}
      />

      <Button type="button" size="medium" onClick={onNext} className="w-full">
        다음
      </Button>
    </div>
  );
};
