"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AuthUser } from "@/types/user";

interface AuthState {
  user: AuthUser | null;
  hasHydrated: boolean;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
  setHasHydrated: (b: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      hasHydrated: false,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
      setHasHydrated: (b) => set({ hasHydrated: b }),
    }),
    {
      name: "lms-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

export const selectUser = (s: AuthState) => s.user;
