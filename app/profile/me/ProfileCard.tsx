'use client';

import type { Profile } from '@/shared/api/types/profile';

interface Props {
  profile: Profile;
}

const ProfileCard = ({ profile }: Props) => {
  return (
    <section className="mb-6 border-b border-gray-200 pb-4">
      <h2 className="text-2xl font-semibold text-gray-900">{profile.nickname}</h2>
      <p className="mt-1 text-sm text-gray-500">후기 {profile.reviews.length}개</p>
    </section>
  );
};

export { ProfileCard };
