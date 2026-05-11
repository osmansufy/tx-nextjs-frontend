/**
 * Server-only fetcher for React Server Components.
 *
 * Rules:
 *  - Never import this in Client Components (no "use client" at the top of files that use it).
 *  - Uses native `fetch` — NOT axios — so Next.js caching works.
 *  - Always tag fetches so on-demand revalidation via /api/revalidate is precise.
 *  - Throws `ServerFetchError` on non-2xx so RSC can call `notFound()` or `error.tsx`.
 */

import "server-only";
import { getServerWpJsonBase, env } from "@/lib/env";

const lms = `/${env.LMS_NAMESPACE}`;

export class ServerFetchError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = "ServerFetchError";
  }
}

export interface FetchOptions {
  /** ISR revalidation interval in seconds. Pass `0` for force-dynamic, `false` for no-store. */
  revalidate?: number | false;
  /** Cache tags for on-demand revalidation via `revalidateTag()`. */
  tags?: string[];
  /** Extra request headers. */
  headers?: Record<string, string>;
}

/** Resolve a WP REST path (starting with /) to a full URL using the server-side WP base. */
function resolveUrl(path: string): string {
  const base = getServerWpJsonBase();
  if (!base) throw new ServerFetchError(0, "misconfigured", "NEXT_PUBLIC_WP_API_URL is not set.");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

function buildNextCache(opts: FetchOptions): RequestInit["next"] {
  const next: Record<string, unknown> = {};
  if (typeof opts.revalidate === "number") next.revalidate = opts.revalidate;
  if (opts.revalidate === false) next.revalidate = 0; // next.js force-dynamic
  if (opts.tags?.length) next.tags = opts.tags;
  return next as RequestInit["next"];
}

/** Unwrap `{ success, data }` envelope if present; otherwise return body as-is. */
function unwrapEnvelope<T>(body: unknown): T {
  if (body && typeof body === "object" && "success" in body) {
    const env = body as { success?: boolean; data?: unknown; message?: string; code?: string };
    if (env.success === false) {
      throw new ServerFetchError(
        422,
        env.code ?? "api_error",
        env.message ?? "Request failed",
      );
    }
    return (env.data ?? null) as T;
  }
  return body as T;
}

/**
 * GET a public WordPress REST endpoint.
 * Suitable for courses, categories, blog posts, settings, reviews, etc.
 */
export async function serverFetch<T>(path: string, opts: FetchOptions = {}): Promise<T> {
  const url = resolveUrl(path);
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(opts.headers ?? {}),
    },
    next: buildNextCache(opts),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const err = body as { message?: string; code?: string };
    throw new ServerFetchError(
      res.status,
      err.code ?? "fetch_error",
      err.message ?? `HTTP ${res.status} from WordPress`,
    );
  }

  const body = await res.json();
  return unwrapEnvelope<T>(body);
}

/**
 * Convenience wrappers.
 */
function qs(params?: Record<string, string | number>): string {
  if (!params) return "";
  return `?${new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString()}`;
}

export const serverApi = {
  courses: {
    list: (params?: Record<string, string | number>) =>
      serverFetch<unknown>(`${lms}/courses${qs(params)}`, {
        revalidate: 300,
        tags: ["courses:list"],
      }),
    detail: (slug: string) =>
      serverFetch<unknown>(`${lms}/courses/${encodeURIComponent(slug)}`, {
        revalidate: 600,
        tags: [`course:${slug}`, "courses:list"],
      }),
    curriculum: (slug: string) =>
      serverFetch<unknown>(`${lms}/courses/${encodeURIComponent(slug)}/curriculum`, {
        revalidate: 600,
        tags: [`course:${slug}:curriculum`],
      }),
    featured: () =>
      serverFetch<unknown>(`${lms}/courses/featured`, {
        revalidate: 300,
        tags: ["courses:featured"],
      }),
    popular: () =>
      serverFetch<unknown>(`${lms}/courses/popular`, {
        revalidate: 300,
        tags: ["courses:popular"],
      }),
  },

  taxonomy: {
    categories: () =>
      serverFetch<unknown>(`${lms}/course-categories`, {
        revalidate: 600,
        tags: ["taxonomy:categories"],
      }),
  },

  blog: {
    posts: (params?: Record<string, string | number>) =>
      serverFetch<unknown>(`/wp/v2/posts${qs(params)}`, {
        revalidate: 300,
        tags: ["blog:posts"],
      }),
    post: (slug: string) =>
      serverFetch<unknown>(`/wp/v2/posts?slug=${encodeURIComponent(slug)}`, {
        revalidate: 300,
        tags: [`blog:${slug}`],
      }),
  },

  settings: {
    get: () =>
      serverFetch<unknown>(`${lms}/settings`, {
        revalidate: 3600,
        tags: ["settings"],
      }),
  },

  reviews: {
    forCourse: (courseId: string | number) =>
      serverFetch<unknown>(`${lms}/courses/${courseId}/reviews`, {
        revalidate: 300,
        tags: [`course:${courseId}:reviews`],
      }),
  },

  partners: () =>
    serverFetch<unknown>("/wp/v2/partner_logo", { revalidate: 3600, tags: ["partners"] }),

  testimonials: () =>
    serverFetch<unknown>("/wp/v2/testimonial", { revalidate: 3600, tags: ["testimonials"] }),
};
