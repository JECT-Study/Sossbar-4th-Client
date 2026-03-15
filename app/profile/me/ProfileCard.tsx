'use client';

import type { Profile } from '@/shared/api/types/profile';

type ProfileCardProps = {
  profile: Profile;
};

const ProfileCard = ({ profile }: ProfileCardProps) => {
  return (
    <header className="mb-6 border-b border-gray-200 pb-4">
      <h1 className="text-2xl font-semibold text-gray-900">{profile.nickname}</h1>
      <p className="mt-1 text-sm text-gray-500">후기 {profile.reviews.length}개</p>
    </header>
  );
};

export { ProfileCard };
