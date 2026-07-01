'use client';

import { useIsMyProfile, useProfileById } from '../profile.hooks';
import { MyProfileShareSection } from './my-profile-share-section';
import { ProfileSummary } from './profile-summary';

interface Props {
  userLink: string;
  isMyProfile?: boolean;
}

export const ProfileByIdSection = ({ userLink, isMyProfile: isMyProfileProp }: Props) => {
  const isMyProfileFromQuery = useIsMyProfile(userLink);
  const isMyProfile = isMyProfileProp ?? isMyProfileFromQuery;
  const { data: profile } = useProfileById(userLink);

  return isMyProfile ? <MyProfileShareSection profile={profile} /> : <ProfileSummary profile={profile} />;
};
