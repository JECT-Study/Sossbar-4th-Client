import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { ApiError } from '@/shared/lib/api';

import type { Profile, UpdateProfilePayload } from './types';
import type { z } from 'zod';

import { ProfileEditFormSchema } from './schemas';

export type ProfileEditFormData = z.infer<typeof ProfileEditFormSchema>;

type UseProfileEditFormParams = {
  profile: Profile;
  onSubmitProfile: (payload: UpdateProfilePayload) => Promise<void>;
};

export const useProfileEditForm = ({ profile, onSubmitProfile }: UseProfileEditFormParams) => {
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const previewImageUrlRef = useRef<string | null>(null);

  const form = useForm<ProfileEditFormData>({
    defaultValues: {
      nickname: profile.nickname,
      bio: profile.bio ?? '',
      profileImage: null,
    },
    mode: 'onTouched',
    reValidateMode: 'onChange',
    resolver: zodResolver(ProfileEditFormSchema),
  });

  const revokePreviewImageUrl = useCallback(() => {
    if (previewImageUrlRef.current) {
      URL.revokeObjectURL(previewImageUrlRef.current);
      previewImageUrlRef.current = null;
    }
  }, []);

  useEffect(() => {
    return revokePreviewImageUrl;
  }, [revokePreviewImageUrl]);

  const setProfileImage = useCallback(
    (file: File | null) => {
      revokePreviewImageUrl();

      const objectUrl = file ? URL.createObjectURL(file) : null;
      previewImageUrlRef.current = objectUrl;
      setPreviewImageUrl(objectUrl);
      form.setValue('profileImage', file, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    },
    [form, revokePreviewImageUrl],
  );

  const onSubmit = async (data: ProfileEditFormData) => {
    try {
      await onSubmitProfile({
        info: {
          username: data.nickname.trim(),
          bio: data.bio.trim(),
        },
        profileImage: data.profileImage,
      });
    } catch (error) {
      form.setError('root', {
        message:
          error instanceof ApiError ? error.message : '프로필 저장 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.',
      });
    }
  };

  return {
    form,
    onSubmit,
    previewImageUrl,
    setProfileImage,
  };
};
