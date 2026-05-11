import { ApiError } from "@/lib/api/error";

export async function bffJson<T>(path: string, init?: RequestInit): Promise<T> {
  const extraHeaders = (init?.headers ?? {}) as Record<string, string>;
  const headers: Record<string, string> = { ...extraHeaders };
  if (init?.body !== undefined && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(path, {
    ...init,
    credentials: "include",
    headers,
  });
  const text = await res.text();
  let data: Record<string, unknown> = {};
  if (text) {
    try {
      data = JSON.parse(text) as Record<string, unknown>;
    } catch {
      data = {};
    }
  }
  if (!res.ok) {
    const message =
      (typeof data.error === "string" ? data.error : null) ??
      (typeof data.message === "string" ? data.message : null) ??
      "Request failed";
    const code = typeof data.code === "string" ? data.code : "request_failed";
    throw new ApiError({ status: res.status, code, message, raw: data });
  }
  return data as T;
}

export function hasUserLoggedInCookie(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split("; ").some((c) => c.startsWith("user_logged_in=1"));
}
