import type { Metadata } from "next";
import { serverApi } from "@/lib/api/server";
import { normalizeCourse } from "@/lib/services/courses";
import { AllCoursesHero } from "@/components/courses/all-courses-hero";
import { AllCoursesClient } from "@/components/courses/all-courses-client";

export const metadata: Metadata = {
  title: "Explore Our Courses",
  description:
    "Browse our full range of fully accredited online courses across health & safety, food hygiene, safeguarding, mental health, and more.",
};

export const revalidate = 300;

export default async function AllCoursesPage() {
  const result = await serverApi.taxonomy.categories({ per_page: 100 }).catch(() => null);
  const categories = result?.items?.filter((c) => c.count > 0) ?? [];

  const categoryData = await Promise.all(
    categories.map(async (category) => {
      const res = await serverApi.courses
        .list({ category: category.slug, per_page: 6 })
        .catch(() => null);
      const courses = (res?.items ?? []).map((raw) =>
        normalizeCourse(raw as Parameters<typeof normalizeCourse>[0]),
      );
      return { category, courses };
    }),
  );

  return (
    <>
      <AllCoursesHero />
      <AllCoursesClient categoryData={categoryData.filter((d) => d.courses.length > 0)} />
    </>
  );
}
