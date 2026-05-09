import type { Course } from "./course";

export type EnrollmentStatus = "active" | "completed" | "cancelled" | "pending";

export interface Enrollment {
  id: number;
  courseId: number;
  course?: Course;
  status: EnrollmentStatus;
  progress?: number;
  completedLessons?: number;
  totalLessons?: number;
  enrolledAt: string;
  completedAt?: string | null;
  lastAccessedLessonId?: number | null;
}

export interface CourseProgress {
  courseId: number;
  completedLessons: number;
  totalLessons: number;
  percent: number;
  completedLessonIds: number[];
  lastLessonId?: number | null;
}
