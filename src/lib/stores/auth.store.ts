"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AuthUser } from "@/types/user";

const COOKIE_NAME = "lms_token";
const COOKIE_MAX_AGE_DAYS = 7;

function setCookie(token: string) {
  if (typeof document === "undefined") return;
  const maxAge = 60 * 60 * 24 * COOKIE_MAX_AGE_DAYS;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(token)}; Max-Age=${maxAge}; Path=/; SameSite=Lax${secure}`;
}

function clearCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_NAME}=; Max-Age=0; Path=/; SameSite=Lax`;
}

interface AuthSession {
  token: string;
  user: AuthUser;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  hasHydrated: boolean;
  setSession: (session: AuthSession) => void;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
  setHasHydrated: (b: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      hasHydrated: false,
      setSession: ({ token, user }) => {
        setCookie(token);
        set({ token, user });
      },
      setUser: (user) => set({ user }),
      logout: () => {
        clearCookie();
        set({ token: null, user: null });
      },
      setHasHydrated: (b) => set({ hasHydrated: b }),
    }),
    {
      name: "lms-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ token: state.token, user: state.user }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
        if (state?.token) setCookie(state.token);
      },
    },
  ),
);

export const selectIsAuthed = (s: AuthState) => Boolean(s.token);
export const selectUser = (s: AuthState) => s.user;
