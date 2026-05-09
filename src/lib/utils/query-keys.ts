import type { CourseListFilters } from "@/types/course";

export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  courses: {
    all: ["courses"] as const,
    list: (filters: CourseListFilters = {}) => ["courses", "list", filters] as const,
    detail: (slugOrId: string | number) => ["courses", "detail", slugOrId] as const,
    curriculum: (id: number | string) => ["courses", "curriculum", id] as const,
    progress: (id: number) => ["courses", "progress", id] as const,
    categories: ["courses", "categories"] as const,
  },
  lessons: {
    detail: (id: number) => ["lessons", "detail", id] as const,
  },
  enrollments: {
    me: ["enrollments", "me"] as const,
    detail: (id: number) => ["enrollments", "detail", id] as const,
  },
  user: {
    me: ["user", "me"] as const,
  },
} as const;
