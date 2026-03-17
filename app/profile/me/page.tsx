'use client';

import { useEffect } from 'react';

import { useProfileStore } from '@/shared/stores/profileStore';

import { ProfileCard } from './ProfileCard';
import { ReviewCard } from './ReviewCard';

const ProfileMePage = () => {
  const { profile, loading, error, fetchProfile, toggleReaction } = useProfileStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (loading && !profile) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-label="로딩 중">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (!profile) {
    return <div aria-hidden />;
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <ProfileCard profile={profile} />
      {error ? (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800" role="alert">
          {error}
        </div>
      ) : null}
      <ul className="flex flex-col gap-4" aria-label="후기 목록">
        {profile.reviews.map((review) => (
          <li key={review.id}>
            <ReviewCard review={review} onToggleReaction={toggleReaction} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProfileMePage;
