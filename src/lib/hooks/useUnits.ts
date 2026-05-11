"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { unitsService } from "@/lib/services/units";
import { progressService } from "@/lib/services/progress";
import { queryKeys } from "@/lib/utils/query-keys";
import type { ApiError } from "@/lib/api/error";
import type { Unit } from "@/types/unit";

export function useUnit(id: number | null | undefined) {
  return useQuery({
    queryKey: queryKeys.units.detail(id ?? 0),
    queryFn: () => unitsService.detail(id as number),
    enabled: Boolean(id),
  });
}

export function useCompleteUnit(courseId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (unitId: number) => unitsService.complete(unitId),
    onMutate: async (unitId) => {
      await qc.cancelQueries({ queryKey: queryKeys.units.detail(unitId) });
      const prevUnit = qc.getQueryData<Unit>(queryKeys.units.detail(unitId));
      if (prevUnit) {
        qc.setQueryData<Unit>(queryKeys.units.detail(unitId), {
          ...prevUnit,
          isCompleted: true,
        });
      }
      return { prevUnit };
    },
    onError: (err: ApiError, unitId, ctx) => {
      if (ctx?.prevUnit) qc.setQueryData(queryKeys.units.detail(unitId), ctx.prevUnit);
      toast.error(err.message || "Could not mark unit complete");
    },
    onSuccess: () => toast.success("Unit completed"),
    onSettled: async () => {
      await qc.invalidateQueries({ queryKey: queryKeys.progress.course(courseId) });
    },
  });
}

export function useCourseProgress(courseId: number | null | undefined) {
  return useQuery({
    queryKey: queryKeys.progress.course(courseId ?? 0),
    queryFn: () => progressService.forCourse(courseId as number),
    enabled: Boolean(courseId),
  });
}
