import type { Course } from "./course";

export type EnrollmentStatus = "active" | "completed" | "cancelled" | "pending";

export interface Enrollment {
  id: number;
  courseId: number;
  course?: Course;
  status: EnrollmentStatus;
  progress?: number;
  completedUnits?: number;
  totalUnits?: number;
  enrolledAt: string;
  completedAt?: string | null;
  lastAccessedUnitId?: number | null;
}

export interface CourseProgress {
  courseId: number;
  completedUnits: number;
  totalUnits: number;
  percent: number;
  completedUnitIds: number[];
  lastUnitId?: number | null;
}
