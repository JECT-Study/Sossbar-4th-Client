'use client';

import dynamic from 'next/dynamic';

import { ProfileSectionBoundary } from '@/features/profile';
import { ProfileSectionSkeleton } from '@/features/profile/components/profile-section-skeleton';

const ProfileDetailView = dynamic(
  () =>
    import('@/app/(protected)/profile/_components/profile-detail-view').then((mod) => ({
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
  return (
    <>
      <ProfileSectionBoundary userId={userId} />
      <ProfileDetailView userId={userId} />
    </>
  );
};
