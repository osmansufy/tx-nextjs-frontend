import type { Unit, UnitSummary } from "./unit";

export interface CourseCategory {
  id: number;
  name: string;
  slug: string;
}

export interface CourseInstructor {
  id: number;
  name: string;
  avatar?: string;
  bio?: string;
}

export type CourseLevel = "beginner" | "intermediate" | "advanced" | "all";

export interface Course {
  id: number;
  slug: string;
  title: string;
  excerpt?: string;
  content?: string;
  featuredImage?: string;
  price?: number;
  isFree?: boolean;
  level?: CourseLevel;
  durationSeconds?: number;
  /** Curriculum item count (API may still call these "lessons"). */
  unitsCount?: number;
  lessonsCount?: number;
  studentsCount?: number;
  rating?: number;
  ratingCount?: number;
  categories?: CourseCategory[];
  instructor?: CourseInstructor;
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseSection {
  id: number | string;
  title: string;
  units: UnitSummary[];
}

export interface CourseCurriculum {
  courseId: number;
  sections: CourseSection[];
  totalUnits: number;
}

export interface CourseDetail extends Course {
  curriculum?: CourseSection[];
  firstUnit?: Unit | UnitSummary;
}

export interface CourseListFilters {
  search?: string;
  category?: string | number;
  level?: CourseLevel;
  page?: number;
  perPage?: number;
  orderBy?: "date" | "title" | "popularity" | "rating";
  order?: "asc" | "desc";
}
