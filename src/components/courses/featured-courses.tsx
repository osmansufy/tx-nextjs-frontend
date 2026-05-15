import { serverApi } from "@/lib/api/server";
import { normalizeCourse } from "@/lib/services/courses";
import { CourseCard } from "@/components/courses/course-card";

interface FeaturedCoursesProps {
  limit?: number;
}

export async function FeaturedCourses({ limit = 8 }: FeaturedCoursesProps) {
  let data: Awaited<ReturnType<typeof serverApi.courses.featured>> | null = null;
  try {
    data = await serverApi.courses.featured(limit);
  } catch {
    return null;
  }

  if (!data?.items?.length) return null;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {data.items.map((raw) => {
        const course = normalizeCourse(raw as Parameters<typeof normalizeCourse>[0]);
        return <CourseCard key={course.id} course={course} />;
      })}
    </div>
  );
}
