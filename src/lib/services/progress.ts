import { api } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { CourseProgress } from "@/types/enrollment";

interface RawProgress {
  course_id: number;
  completed_lessons?: number;
  total_lessons?: number;
  percent?: number;
  progress?: number;
  completed_lesson_ids?: number[];
  last_lesson_id?: number | null;
}

export const progressService = {
  async forCourse(courseId: number): Promise<CourseProgress> {
    const { data } = await api.get<RawProgress>(endpoints.courses.progress(courseId));
    const completed = data.completed_lessons ?? (data.completed_lesson_ids?.length ?? 0);
    const total = data.total_lessons ?? 0;
    const percent =
      data.percent ?? data.progress ?? (total > 0 ? Math.round((completed / total) * 100) : 0);
    return {
      courseId: data.course_id ?? courseId,
      completedLessons: completed,
      totalLessons: total,
      percent,
      completedLessonIds: data.completed_lesson_ids ?? [],
      lastLessonId: data.last_lesson_id ?? null,
    };
  },
};
