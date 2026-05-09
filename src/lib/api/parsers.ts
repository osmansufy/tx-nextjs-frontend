import type { AxiosResponse } from "axios";
import type { PaginatedResponse } from "@/types/api";

/**
 * Builds a PaginatedResponse<T> out of an Axios response. WP REST APIs
 * traditionally surface pagination via the `X-WP-Total` and `X-WP-TotalPages`
 * response headers, but custom LMS endpoints sometimes return an envelope
 * `{ items, total, total_pages }` instead. We tolerate both.
 */
export function paginate<T>(
  res: AxiosResponse<T[] | { items?: T[]; data?: T[]; total?: number; total_pages?: number }>,
  fallbackPage = 1,
  fallbackPerPage = 12,
): PaginatedResponse<T> {
  const data = res.data as
    | T[]
    | { items?: T[]; data?: T[]; total?: number; total_pages?: number };

  let items: T[] = [];
  let total: number | undefined;
  let totalPages: number | undefined;

  if (Array.isArray(data)) {
    items = data;
  } else {
    items = (data.items ?? data.data ?? []) as T[];
    total = data.total;
    totalPages = data.total_pages;
  }

  const headerTotal = Number(res.headers["x-wp-total"]);
  const headerTotalPages = Number(res.headers["x-wp-totalpages"]);

  return {
    items,
    total: total ?? (Number.isFinite(headerTotal) ? headerTotal : items.length),
    totalPages:
      totalPages ?? (Number.isFinite(headerTotalPages) ? headerTotalPages : 1),
    page: fallbackPage,
    perPage: fallbackPerPage,
  };
}

/** Decode common HTML entities returned by WP rendered fields. */
export function decodeEntities(s: string | undefined | null): string {
  if (!s) return "";
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#8217;/g, "\u2019")
    .replace(/&#8216;/g, "\u2018")
    .replace(/&#8230;/g, "\u2026")
    .replace(/&hellip;/g, "\u2026")
    .replace(/&nbsp;/g, " ");
}
