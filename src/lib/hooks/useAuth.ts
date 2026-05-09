"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { authService } from "@/lib/services/auth";
import { useAuthStore } from "@/lib/stores/auth.store";
import { queryKeys } from "@/lib/utils/query-keys";
import type { LoginInput, RegisterInput } from "@/lib/schemas/auth";
import type { ApiError } from "@/lib/api/error";

export function useAuth() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  return {
    token,
    user,
    isAuthenticated: Boolean(token),
    hasHydrated,
  };
}

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);
  const router = useRouter();
  const search = useSearchParams();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: LoginInput) => authService.login(input),
    onSuccess: ({ token, user }) => {
      setSession({ token, user });
      qc.invalidateQueries({ queryKey: queryKeys.user.me });
      qc.invalidateQueries({ queryKey: queryKeys.enrollments.me });
      toast.success(`Welcome back, ${user.displayName}`);
      const next = search.get("next");
      router.replace(next && next.startsWith("/") ? next : "/dashboard");
    },
    onError: (err: ApiError) => {
      toast.error(err.message || "Invalid credentials");
    },
  });
}

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (input: RegisterInput) => {
      const created = await authService.register({
        username: input.username,
        email: input.email,
        password: input.password,
      });
      const session = await authService.login({
        username: input.username,
        password: input.password,
      });
      return { created, session };
    },
    onSuccess: ({ session }) => {
      useAuthStore.getState().setSession(session);
      toast.success("Account created. Welcome to the platform!");
      router.replace("/dashboard");
    },
    onError: (err: ApiError) => {
      toast.error(err.message || "Could not register. Try a different username or email.");
    },
  });
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();
  const qc = useQueryClient();
  return () => {
    logout();
    qc.clear();
    toast.success("Signed out");
    router.replace("/");
  };
}

export function useMe(enabled = true) {
  const isAuthed = useAuthStore((s) => Boolean(s.token));
  return useQuery({
    queryKey: queryKeys.user.me,
    queryFn: () => authService.me(),
    enabled: enabled && isAuthed,
    staleTime: 60_000,
  });
}
