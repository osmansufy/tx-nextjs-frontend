import type { MetadataRoute } from "next";
import { env } from "@/lib/env";
import { serverApi } from "@/lib/api/server";

const base = env.SITE_URL.replace(/\/$/, "") || "https://localhost:3000";

async function getCourseSlugs(): Promise<string[]> {
  try {
    const data = (await serverApi.courses.list({ per_page: 500 })) as { items?: { slug: string }[] } | { slug: string }[];
    const items = Array.isArray(data) ? data : ((data as { items?: { slug: string }[] }).items ?? []);
    return items.map((c) => c.slug).filter(Boolean);
  } catch {
    return [];
  }
}

async function getBlogSlugs(): Promise<string[]> {
  try {
    const data = (await serverApi.blog.posts({ per_page: 200 })) as { slug: string }[];
    return (Array.isArray(data) ? data : []).map((p) => p.slug).filter(Boolean);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [courseSlugs, blogSlugs] = await Promise.all([getCourseSlugs(), getBlogSlugs()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/courses`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/pricing`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  const courseRoutes: MetadataRoute.Sitemap = courseSlugs.map((slug) => ({
    url: `${base}/course/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${base}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...courseRoutes, ...blogRoutes];
}
