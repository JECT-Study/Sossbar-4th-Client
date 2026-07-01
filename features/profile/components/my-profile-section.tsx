'use client';

import { useMyProfile } from '../profile.hooks';
import { MyProfileShareSection } from './my-profile-share-section';

export const MyProfileSection = () => {
  const { data: profile } = useMyProfile();

  if (!profile) {
    return null;
  }

  return <MyProfileShareSection profile={profile} />;
};
