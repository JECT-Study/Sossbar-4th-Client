import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { AuthUser } from '@/shared/api/types/auth';

type AuthState = {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    { name: 'auth-storage', partialize: (s) => ({ user: s.user }) },
  ),
);
