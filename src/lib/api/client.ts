import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { WP_REST_BASE } from "@/lib/env";
import { toApiError } from "./error";

const isBrowser = typeof window !== "undefined";

export const api = axios.create({
  baseURL: WP_REST_BASE || "/wp-json",
  headers: { "Content-Type": "application/json" },
  timeout: 20000,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (!isBrowser) return config;
    try {
      const raw = window.localStorage.getItem("lms-auth");
      if (raw) {
        const parsed = JSON.parse(raw) as { state?: { token?: string | null } };
        const token = parsed?.state?.token;
        if (token) {
          config.headers.set("Authorization", `Bearer ${token}`);
        }
      }
    } catch {
      // ignore localStorage parse errors
    }
    return config;
  },
  (error) => Promise.reject(toApiError(error)),
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const apiErr = toApiError(error);

    if (isBrowser && (apiErr.status === 401 || apiErr.status === 403)) {
      const onAuthRoute = /^\/(login|register|forgot-password)/.test(window.location.pathname);
      if (!onAuthRoute) {
        try {
          window.localStorage.removeItem("lms-auth");
          document.cookie = "lms_token=; Max-Age=0; path=/; SameSite=Lax";
        } catch {
          // ignore
        }
        const next = encodeURIComponent(window.location.pathname + window.location.search);
        window.location.assign(`/login?next=${next}&reason=session`);
      }
    }

    return Promise.reject(apiErr);
  },
);

export type Api = typeof api;
