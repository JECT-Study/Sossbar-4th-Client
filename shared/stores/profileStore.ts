import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { Profile, ProfileReview, PostReviewReactionResponse } from '@/shared/api/types/profile';

type ProfileState = {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  toggleReaction: (reviewId: string) => Promise<void>;
};

const getProfile = async (): Promise<Profile> => {
  const res = await fetch('/api/profiles/me');
  if (!res.ok) {
    throw new Error('프로필 조회 실패');
  }
  return (await res.json()) as Profile;
};

const postReaction = async (reviewId: string): Promise<PostReviewReactionResponse> => {
  const res = await fetch(`/api/reviews/${reviewId}/reaction`, { method: 'POST' });
  if (!res.ok) {
    throw new Error('공감 요청 실패');
  }
  return (await res.json()) as PostReviewReactionResponse;
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profile: null,
      loading: false,
      error: null,
      fetchProfile: async () => {
        set({ loading: true, error: null });
        try {
          const profile = await getProfile();
          set({ profile, loading: false, error: null });
        } catch (err) {
          set({ loading: false, error: err instanceof Error ? err.message : '오류' });
        }
      },
      toggleReaction: async (reviewId: string) => {
        const { profile } = get();
        if (!profile) {
          return;
        }
        try {
          const { reactionCount } = await postReaction(reviewId);
          const reviews: ProfileReview[] = profile.reviews.map((r) =>
            r.id === reviewId ? { ...r, reactionCount, reacted: true } : r,
          );
          set({ profile: { ...profile, reviews } });
        } catch {
          set((s) => ({ ...s, error: '공감 반영 실패' }));
        }
      },
    }),
    { name: 'profile-storage', partialize: (s) => ({ profile: s.profile }) },
  ),
);
