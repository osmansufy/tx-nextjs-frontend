import { describe, it, expect } from "vitest";
import type { AxiosResponse } from "axios";
import { paginate } from "@/lib/api/parsers";

function makeRes<T>(data: T, headers: Record<string, string> = {}): AxiosResponse<T> {
  return {
    data,
    status: 200,
    statusText: "OK",
    headers,
    config: {} as never,
  };
}

describe("paginate()", () => {
  it("handles a plain array response", () => {
    const items = [{ id: 1 }, { id: 2 }];
    const result = paginate(makeRes(items));
    expect(result.items).toHaveLength(2);
    expect(result.total).toBe(2);
    expect(result.page).toBe(1);
  });

  it("reads items/total/totalPages from envelope shape", () => {
    const envelope = { items: [{ id: 1 }], total: 50, totalPages: 5, page: 2, per_page: 10 };
    const result = paginate(makeRes(envelope), 2, 10);
    expect(result.items).toHaveLength(1);
    expect(result.total).toBe(50);
    expect(result.totalPages).toBe(5);
    expect(result.page).toBe(2);
    expect(result.perPage).toBe(10);
  });

  it("falls back to x-wp-total header when envelope has no total", () => {
    const data = { items: [{ id: 1 }] };
    const result = paginate(makeRes(data, { "x-wp-total": "100", "x-wp-totalpages": "10" }));
    expect(result.total).toBe(100);
    expect(result.totalPages).toBe(10);
  });
});
