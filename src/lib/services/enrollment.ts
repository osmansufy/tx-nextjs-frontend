import { ApiError } from "@/lib/api/error";
import { bffJson } from "@/lib/api/bff-client";
import type { Enrollment } from "@/types/enrollment";
import { normalizeCourse } from "./courses";

interface RawEnrollment {
  id: number;
  course_id: number;
  course?: Parameters<typeof normalizeCourse>[0];
  status: Enrollment["status"];
  progress?: number;
  completed_units?: number;
  completed_lessons?: number;
  total_units?: number;
  total_lessons?: number;
  enrolled_at?: string;
  date_created?: string;
  completed_at?: string | null;
  last_accessed_unit_id?: number | null;
  last_accessed_lesson_id?: number | null;
}

function normalizeEnrollment(raw: RawEnrollment): Enrollment {
  return {
    id: raw.id,
    courseId: raw.course_id,
    course: raw.course ? normalizeCourse(raw.course) : undefined,
    status: raw.status ?? "active",
    progress: raw.progress,
    completedUnits: raw.completed_units ?? raw.completed_lessons,
    totalUnits: raw.total_units ?? raw.total_lessons,
    enrolledAt: raw.enrolled_at ?? raw.date_created ?? new Date().toISOString(),
    completedAt: raw.completed_at ?? null,
    lastAccessedUnitId: raw.last_accessed_unit_id ?? raw.last_accessed_lesson_id ?? null,
  };
}

export const enrollmentService = {
  async create(input: { courseId: number }): Promise<Enrollment> {
    const data = await bffJson<RawEnrollment>(`/api/courses/${input.courseId}/enroll`, {
      method: "POST",
    });
    return normalizeEnrollment(data);
  },

  async listMine(): Promise<Enrollment[]> {
    const data = await bffJson<RawEnrollment[] | { items?: RawEnrollment[] }>(
      "/api/users/me/enrollments",
      { method: "GET" },
    );
    const arr = Array.isArray(data) ? data : (data.items ?? []);
    return arr.map(normalizeEnrollment);
  },

  async cancel(_id: number): Promise<void> {
    throw new ApiError({
      status: 501,
      code: "not_implemented",
      message: "Unenrolling from a course is not supported by the LMS API yet.",
    });
  },
};
