import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { env, getServerWpJsonBase } from "@/lib/env";

type ProxyOptions = {
  method?: string;
  body?: unknown;
  requiresAuth?: boolean;
};

function wpJsonUrl(path: string): string {
  const base = getServerWpJsonBase();
  if (!base) throw new Error("WP API URL is not configured (NEXT_PUBLIC_WP_API_URL or WP_API_URL)");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}/${env.LMS_NAMESPACE}${p}`.replace(/([^:]\/)\/+/g, "$1");
}

async function tryRefresh(): Promise<string | null> {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;
  if (!refreshToken) return null;

  const res = await fetch(wpJsonUrl("/auth/refresh"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!res.ok) {
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");
    cookieStore.delete("user_logged_in");
    return null;
  }

  const json = (await res.json()) as {
    success?: boolean;
    data?: { access_token?: string; refresh_token?: string; expires_in?: number };
  };
  if (!json.success || !json.data?.access_token) return null;

  const { access_token, refresh_token, expires_in } = json.data;
  const secure = process.env.NODE_ENV === "production";

  cookieStore.set("access_token", access_token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    maxAge: expires_in ?? 86400,
    path: "/",
  });
  if (refresh_token) {
    cookieStore.set("refresh_token", refresh_token, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });
  }

  return access_token;
}

export async function proxyToWP(wpPath: string, options: ProxyOptions = {}): Promise<NextResponse> {
  const { method = "GET", body, requiresAuth = true } = options;
  const cookieStore = cookies();

  const accessFromCookie = cookieStore.get("access_token")?.value;

  if (requiresAuth && !accessFromCookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (accessFromCookie) headers.Authorization = `Bearer ${accessFromCookie}`;

  const url = wpJsonUrl(wpPath.startsWith("/") ? wpPath : `/${wpPath}`);

  let res = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && requiresAuth) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      headers.Authorization = `Bearer ${refreshed}`;
      res = await fetch(url, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
    }
  }

  const text = await res.text();
  let json: unknown;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    return NextResponse.json({ error: "Invalid response from WordPress" }, { status: 502 });
  }

  const envelope = json as {
    success?: boolean;
    data?: unknown;
    message?: string;
    code?: string;
    error?: { message?: string; code?: string };
  };

  if (envelope.success === true) {
    return NextResponse.json(envelope.data ?? null, { status: res.status });
  }

  if (envelope.success === false) {
    const msg = envelope.message ?? envelope.error?.message ?? "Request failed";
    const code = envelope.code ?? envelope.error?.code ?? "error";
    return NextResponse.json({ error: msg, code }, { status: res.status });
  }

  return NextResponse.json(json, { status: res.status });
}
