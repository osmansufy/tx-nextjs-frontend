"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { lessonsService } from "@/lib/services/lessons";
import { progressService } from "@/lib/services/progress";
import { queryKeys } from "@/lib/utils/query-keys";
import type { Lesson } from "@/types/lesson";
import type { ApiError } from "@/lib/api/error";

export function useLesson(id: number | null | undefined) {
  return useQuery({
    queryKey: queryKeys.lessons.detail(id ?? 0),
    queryFn: () => lessonsService.detail(id as number),
    enabled: Boolean(id),
  });
}

export function useCourseProgress(courseId: number | null | undefined) {
  return useQuery({
    queryKey: queryKeys.courses.progress(courseId ?? 0),
    queryFn: () => progressService.forCourse(courseId as number),
    enabled: Boolean(courseId),
    staleTime: 15_000,
  });
}

export function useCompleteLesson(courseId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (lessonId: number) => lessonsService.complete(lessonId),
    onMutate: async (lessonId) => {
      await qc.cancelQueries({ queryKey: queryKeys.lessons.detail(lessonId) });
      const prevLesson = qc.getQueryData<Lesson>(queryKeys.lessons.detail(lessonId));
      if (prevLesson) {
        qc.setQueryData<Lesson>(queryKeys.lessons.detail(lessonId), {
          ...prevLesson,
          isCompleted: true,
        });
      }
      return { prevLesson };
    },
    onError: (err: ApiError, lessonId, ctx) => {
      if (ctx?.prevLesson) qc.setQueryData(queryKeys.lessons.detail(lessonId), ctx.prevLesson);
      toast.error(err.message || "Could not mark lesson complete");
    },
    onSuccess: () => toast.success("Lesson completed"),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.courses.progress(courseId) });
      qc.invalidateQueries({ queryKey: queryKeys.courses.curriculum(courseId) });
      qc.invalidateQueries({ queryKey: queryKeys.enrollments.me });
    },
  });
}
