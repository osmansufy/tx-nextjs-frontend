"use client";

import { useCourses } from "@/lib/hooks/useCourses";
import { CourseCard, CourseCardSkeleton } from "@/components/courses/course-card";
import { EmptyState } from "@/components/ui/empty-state";
import { GraduationCap } from "lucide-react";

interface FeaturedCoursesProps {
  limit?: number;
}

export function FeaturedCourses({ limit = 6 }: FeaturedCoursesProps) {
  const { data, isLoading, isError } = useCourses({
    perPage: limit,
    orderBy: "popularity",
    order: "desc",
  });

  if (isError) {
    return (
      <EmptyState
        icon={<GraduationCap className="h-10 w-10" />}
        title="Couldn't load featured courses"
        description="Verify your WP API URL and that the LMS plugin is active."
      />
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: limit }).map((_, i) => (
          <CourseCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!data?.items.length) return null;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {data.items.map((c) => (
        <CourseCard key={c.id} course={c} />
      ))}
    </div>
  );
}
