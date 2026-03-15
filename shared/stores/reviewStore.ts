import { create } from 'zustand';

import type { ProfileReview } from '@/shared/api/types/profile';

type ReviewState = {
  reviews: ProfileReview[];
  loading: boolean;
  fetchReviews: () => Promise<void>;
};

export const useReviewStore = create<ReviewState>()((set) => ({
  reviews: [],
  loading: false,
  fetchReviews: async () => {
    set({ loading: true });
    try {
      const res = await fetch('/api/profiles/me');
      if (!res.ok) {
        throw new Error('후기 조회 실패');
      }
      const data = (await res.json()) as { reviews: ProfileReview[] };
      set({ reviews: data.reviews, loading: false });
    } catch {
      set({ loading: false });
    }
  },
}));
