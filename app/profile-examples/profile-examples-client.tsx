'use client';

import { ProfileDetailView } from '../profile/[userId]/_components/profile-detail-view';

interface Props {
  userId: number;
}

export const ProfileExamplesClient = ({ userId }: Props) => {
  return <ProfileDetailView userId={userId} />;
};
