'use client';

import { useIsMyProfile, useProfileById } from '../profile.hooks';
import { MyProfileShareSection } from './my-profile-share-section';
import { ProfileSummary } from './profile-summary';

interface Props {
  userId: number;
  isMyProfile?: boolean;
}

export const ProfileByIdSection = ({ userId, isMyProfile: isMyProfileProp }: Props) => {
  const isMyProfileFromQuery = useIsMyProfile(userId);
  const isMyProfile = isMyProfileProp ?? isMyProfileFromQuery;
  const { data: profile } = useProfileById(userId);

  return isMyProfile ? <MyProfileShareSection profile={profile} /> : <ProfileSummary profile={profile} />;
};
