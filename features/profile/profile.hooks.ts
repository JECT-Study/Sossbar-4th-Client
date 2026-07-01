'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useBooleanState } from '@/shared/hooks/use-boolean-state';
import { useCopyLinkFeedback } from '@/shared/hooks/use-copy-link-feedback';
import { ApiError } from '@/shared/lib/api';

import type {
  ProfileEditFormData,
  UpdateProfilePayload,
  UseProfileEditFormParams,
  UseProfileShareParams,
} from './profile.types';

import { fetchMyProfileOptional, fetchProfileById, updateProfile } from './profile.api';
import { buildProfileShareClipboardText } from './profile.lib';
import { profileKeys } from './profile.query-keys';
import { ProfileEditFormSchema } from './profile.schemas';

export const useMyProfile = () => {
  return useSuspenseQuery({
    queryKey: profileKeys.my,
    queryFn: () => fetchMyProfileOptional(),
  });
};

export const useProfileById = (userLink: string) =>
  useSuspenseQuery({
    queryKey: profileKeys.detail(userLink),
    queryFn: () => fetchProfileById(userLink),
  });

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (profile) => {
      queryClient.setQueryData(profileKeys.detail(profile.userLink), profile);
      queryClient.setQueryData(profileKeys.my, profile);
    },
  });
};

/**
 * 조회 중인 프로필이 현재 로그인한 사용자의 프로필인지 확인한다.
 *
 * @param userLink - 비교할 프로필 사용자 링크
 * @returns 현재 로그인한 사용자의 프로필이면 `true`, 아니면 `false`
 */
export const useIsMyProfile = (userLink: string) => {
  const { data: myProfile } = useMyProfile();
  return myProfile?.userLink === userLink;
};

export const useProfileEditForm = ({ profile, onSubmitProfile }: UseProfileEditFormParams) => {
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const previewImageUrlRef = useRef<string | null>(null);

  const form = useForm<ProfileEditFormData>({
    defaultValues: {
      username: profile.username,
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
          username: data.username.trim(),
          bio: data.bio.trim(),
          marketingAgree: profile.marketingAgree,
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

export const useProfileEditing = () => {
  const [isEditing, startEditing, stopEditing] = useBooleanState(false);
  const { mutateAsync: submitUpdateProfile, isPending: isUpdatingProfile } = useUpdateProfile();

  const submitProfile = useCallback(
    async (payload: UpdateProfilePayload) => {
      await submitUpdateProfile(payload);
      stopEditing();
    },
    [stopEditing, submitUpdateProfile],
  );

  return {
    isEditing,
    isUpdatingProfile,
    startEditing,
    stopEditing,
    submitProfile,
  };
};

export const useProfileShare = ({ userLink, userName }: UseProfileShareParams) => {
  const {
    open: isShareTooltipOpen,
    message: shareTooltipMessage,
    close: closeShareTooltip,
    copyLink,
  } = useCopyLinkFeedback();

  const shareProfile = useCallback(async () => {
    await copyLink(buildProfileShareClipboardText(userLink, userName));
  }, [copyLink, userLink, userName]);

  return {
    isShareTooltipOpen,
    shareTooltipMessage,
    closeShareTooltip,
    shareProfile,
  };
};
