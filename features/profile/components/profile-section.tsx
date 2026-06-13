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
    <section className="mt-15.5 mb-8 flex w-full flex-row">
      <div className="flex h-[104px] w-[540px] flex-row gap-6">
        <ProfileAvatar username={profile.username} profileImageUrl={profile.profileImageUrl} />
        <div className="flex flex-1 flex-col">
          <h2 className="text-heading-lg text-text-basic pb-2 font-bold">{profile.username}</h2>
          <p className="text-heading-xs text-text-subtle font-normal">{profile.bio}</p>
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
