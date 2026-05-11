import { api } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { BlogPost } from "@/types/blog";

export const blogService = {
  async list(params: { perPage?: number } = {}): Promise<BlogPost[]> {
    const { data } = await api.get<BlogPost[]>(endpoints.blog.posts, {
      params: {
        per_page: params.perPage ?? 4,
        _embed: "wp:featuredmedia",
      },
    });
    return Array.isArray(data) ? data : [];
  },
};
