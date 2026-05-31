'use client';

import dynamic from 'next/dynamic';

import { ProfileSectionSkeleton } from '@/features/profile/components/profile-section-skeleton';

const ProfileDetailView = dynamic(
  () =>
    import('../profile/[userId]/_components/profile-detail-view').then((mod) => ({
      default: mod.ProfileDetailView,
    })),
  {
    ssr: false,
    loading: () => <ProfileSectionSkeleton />,
  },
);

interface Props {
  userId: number;
}

export const ProfileExamplesClient = ({ userId }: Props) => {
  return <ProfileDetailView userId={userId} />;
};
