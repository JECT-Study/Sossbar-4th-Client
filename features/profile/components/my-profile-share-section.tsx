'use client';

import type { Profile } from '../profile.types';

import { useProfileShare } from '../profile.hooks';
import { ProfileShareActions } from './profile-share-actions';
import { ProfileSummary } from './profile-summary';

interface Props {
  profile: Profile;
}

export const MyProfileShareSection = ({ profile }: Props) => {
  const { isShareTooltipOpen, shareTooltipMessage, closeShareTooltip, shareProfile } = useProfileShare({
    userId: profile.userId,
    userName: profile.username,
  });

  return (
    <ProfileSummary
      profile={profile}
      shareActions={
        <ProfileShareActions
          isShareTooltipOpen={isShareTooltipOpen}
          shareTooltipMessage={shareTooltipMessage}
          onCloseShareTooltip={closeShareTooltip}
          onShareProfile={() => void shareProfile()}
        />
      }
    />
  );
};
