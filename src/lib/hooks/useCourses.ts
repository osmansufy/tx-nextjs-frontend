"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { coursesService } from "@/lib/services/courses";
import { queryKeys } from "@/lib/utils/query-keys";
import type { CourseListFilters } from "@/types/course";

export function useCourses(filters: CourseListFilters = {}) {
  return useQuery({
    queryKey: queryKeys.courses.list(filters),
    queryFn: () => coursesService.list(filters),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}

export function useCourse(slugOrId: string | number, opts?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.courses.detail(slugOrId),
    queryFn: () => coursesService.detail(slugOrId),
    enabled: (opts?.enabled ?? true) && Boolean(slugOrId),
  });
}

export function useCourseCurriculum(idOrSlug: string | number, opts?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.courses.curriculum(idOrSlug),
    queryFn: () => coursesService.curriculum(idOrSlug),
    enabled: (opts?.enabled ?? true) && Boolean(idOrSlug),
  });
}

export function useCourseCategories() {
  return useQuery({
    queryKey: queryKeys.courses.categories,
    queryFn: () => coursesService.categories(),
    staleTime: 5 * 60_000,
  });
}
