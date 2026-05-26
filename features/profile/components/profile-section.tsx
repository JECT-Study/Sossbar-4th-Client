'use client';

import { useState } from 'react';

import { buildProfileShareClipboardText } from '@/features/profile/lib/build-profile-share-clipboard-text';
import { EditIcon, ShareIcon } from '@/shared/assets/icons';
import { Button } from '@/shared/components/button';
import { CopyFeedbackTooltip } from '@/shared/components/copy-feedback-tooltip';
import { cn } from '@/shared/lib/cn';

import type { UpdateProfilePayload } from '../types';

import { useUpdateProfile } from '../mutations';
import { useProfile } from '../queries';
import { ProfileAvatar } from './profile-avatar';
import { ProfileEditForm } from './profile-edit-form';

type ProfileSectionProps = {
  userId: number;
  isMyProfile: boolean;
};

export const ProfileSection = ({ userId, isMyProfile }: ProfileSectionProps) => {
  const isValidUserId = Number.isFinite(userId) && userId > 0;
  const { data: profile, isPending, isError, refetch } = useProfile(userId);
  const { mutateAsync: updateProfile, isPending: isUpdatingProfile } = useUpdateProfile();
  const [isEditing, setIsEditing] = useState(false);

  const handleShareProfile = async () => {
    if (!Number.isFinite(userId) || userId <= 0) {
      return;
    }

    await copyLink(buildProfileShareClipboardText(userId));
  };

  const handleStartEditing = () => {
    setIsEditing(true);
  };

  const handleSubmitProfile = async (payload: UpdateProfilePayload) => {
    await updateProfile(payload);
    setIsEditing(false);
  };

  if (!isValidUserId) {
    return (
      <section className="mt-15.5 mb-8 flex min-h-[104px] w-full items-center">
        <p className="text-body-base text-text-basic">올바르지 않은 프로필 주소입니다.</p>
      </section>
    );
  }

  if (isPending) {
    return (
      <section className="mt-15.5 mb-8 flex min-h-[104px] w-full items-center">
        <p className="text-body-base text-text-subtle">프로필을 불러오는 중…</p>
      </section>
    );
  }

  if (isError || !profile) {
    return (
      <section className="mt-15.5 mb-8 flex min-h-[104px] w-full items-center justify-between gap-4">
        <p className="text-body-base text-text-basic">프로필 정보를 불러오지 못했습니다.</p>
        <Button type="button" variant="secondary" size="medium" onClick={() => void refetch()}>
          다시 시도
        </Button>
      </section>
    );
  }

  if (isMyProfile && isEditing) {
    return (
      <ProfileEditForm
        profile={profile}
        isSubmitting={isUpdatingProfile}
        onCancel={() => setIsEditing(false)}
        onSubmitProfile={handleSubmitProfile}
      />
    );
  }

  return (
    <section className="mt-15.5 mb-8 flex w-full flex-row">
      <div className="flex h-[104px] w-[540px] flex-row gap-6">
        <ProfileAvatar username={profile.username} profileImageUrl={profile.profileImageUrl} />
        <div className="flex flex-1 flex-col">
          <h2 className="text-heading-lg text-text-basic pb-2 font-bold">{profile.username}</h2>
          <p className="text-heading-xs text-text-subtle font-normal">{profile.bio}</p>
        </div>
      </div>
      {isMyProfile ? (
        <div className="ml-auto">
          <Button variant="secondary" size="medium" leftIcon={<EditIcon />} onClick={handleStartEditing}>
            프로필 수정
          </Button>
          <div className="relative ml-2 inline-flex">
            <Button
              type="button"
              variant="primary"
              size="medium"
              leftIcon={<ShareIcon aria-hidden />}
              className={cn(
                isShareTooltipOpen &&
                  'bg-button-primary-fill-pressed hover:bg-button-primary-fill-pressed focus:bg-button-primary-fill-pressed active:bg-button-primary-fill-pressed',
              )}
              onClick={() => void handleShareProfile()}
            >
              내 프로필 공유하기
            </Button>
            <CopyFeedbackTooltip open={isShareTooltipOpen} onClose={closeShareTooltip} message={shareTooltipMessage} />
          </div>
        </div>
      ) : null}
    </section>
  );
};
