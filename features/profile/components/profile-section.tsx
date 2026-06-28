'use client';

import { ProfileAvatar } from './profile-avatar';
import { ProfileEditForm } from './profile-edit-form';
import { ProfileOwnerActions } from './profile-owner-actions';
import { useIsMyProfile } from '../hooks/use-is-my-profile';
import { useProfileById } from '../hooks/use-profile-by-id.query';
import { useProfileEditing } from '../hooks/use-profile-editing';
import { useProfileShare } from '../hooks/use-profile-share';

interface Props {
  userId: number;
  isMyProfile?: boolean;
}

export const ProfileSection = ({ userId, isMyProfile: isMyProfileProp }: Props) => {
  const isMyProfileFromQuery = useIsMyProfile(userId);
  const isMyProfile = isMyProfileProp ?? isMyProfileFromQuery;
  const { data: profile } = useProfileById(userId);
  const { isEditing, isUpdatingProfile, startEditing, stopEditing, submitProfile } = useProfileEditing();
  const { isShareTooltipOpen, shareTooltipMessage, closeShareTooltip, shareProfile } = useProfileShare({
    userId,
    userName: profile?.username,
  });

  if (isMyProfile && isEditing) {
    return (
      <ProfileEditForm
        profile={profile}
        isSubmitting={isUpdatingProfile}
        onCancel={stopEditing}
        onSubmitProfile={submitProfile}
      />
    );
  }

  return (
    <section className="mb-10 flex w-full flex-row justify-between pt-8">
      <div className="flex flex-row gap-6">
        <ProfileAvatar username={profile.username} profileImageUrl={profile.profileImageUrl} />
        <div className="flex flex-1 flex-col gap-4 py-1">
          <div className="flex items-center gap-2">
            <h2 className="text-heading-lg text-text-basic font-bold">{profile.username}</h2>
            {/* 직무 배지: API 미제공 — 데이터 추가 시 노출 */}
          </div>
          {profile.bio ? (
            <div className="flex flex-col gap-1">
              <p className="text-heading-xs text-text-basic font-medium">한 줄 소개</p>
              <p className="text-body-base text-text-subtle font-normal">{profile.bio}</p>
            </div>
          ) : null}
          {/* 하드 스킬: API 미제공 — 링크 데이터 추가 시 노출 */}
        </div>
      </div>
      {isMyProfile ? (
        <ProfileOwnerActions
          isShareTooltipOpen={isShareTooltipOpen}
          shareTooltipMessage={shareTooltipMessage}
          onCloseShareTooltip={closeShareTooltip}
          onEditProfile={startEditing}
          onShareProfile={() => void shareProfile()}
        />
      ) : null}
    </section>
  );
};
