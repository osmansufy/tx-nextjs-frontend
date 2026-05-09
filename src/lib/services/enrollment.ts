import { api } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { Enrollment } from "@/types/enrollment";
import { normalizeCourse } from "./courses";

interface RawEnrollment {
  id: number;
  course_id: number;
  course?: Parameters<typeof normalizeCourse>[0];
  status: Enrollment["status"];
  progress?: number;
  completed_lessons?: number;
  total_lessons?: number;
  enrolled_at?: string;
  date_created?: string;
  completed_at?: string | null;
  last_accessed_lesson_id?: number | null;
}

function normalizeEnrollment(raw: RawEnrollment): Enrollment {
  return {
    id: raw.id,
    courseId: raw.course_id,
    course: raw.course ? normalizeCourse(raw.course) : undefined,
    status: raw.status ?? "active",
    progress: raw.progress,
    completedLessons: raw.completed_lessons,
    totalLessons: raw.total_lessons,
    enrolledAt: raw.enrolled_at ?? raw.date_created ?? new Date().toISOString(),
    completedAt: raw.completed_at ?? null,
    lastAccessedLessonId: raw.last_accessed_lesson_id ?? null,
  };
}

export const enrollmentService = {
  async create(input: { courseId: number }): Promise<Enrollment> {
    const { data } = await api.post<RawEnrollment>(endpoints.enrollments.create, {
      course_id: input.courseId,
    });
    return normalizeEnrollment(data);
  },

  async listMine(): Promise<Enrollment[]> {
    const { data } = await api.get<RawEnrollment[] | { items?: RawEnrollment[] }>(
      endpoints.enrollments.me,
    );
    const arr = Array.isArray(data) ? data : (data.items ?? []);
    return arr.map(normalizeEnrollment);
  },

  async cancel(id: number): Promise<void> {
    await api.delete(endpoints.enrollments.delete(id));
  },
};
