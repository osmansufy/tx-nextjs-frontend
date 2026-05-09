"use client";

import Link from "next/link";
import { CheckCircle2, Lock, PlayCircle } from "lucide-react";
import { useCourseCurriculum } from "@/lib/hooks/useCourses";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDuration, pluralize } from "@/lib/utils/format";
import type { CourseSection } from "@/types/course";

interface CurriculumProps {
  courseId: number | string;
  sections?: CourseSection[];
  /** When true, lessons link into the player. */
  enrolled?: boolean;
}

export function Curriculum({ courseId, sections, enrolled = false }: CurriculumProps) {
  const { data, isLoading } = useCourseCurriculum(courseId, { enabled: !sections });
  const list = sections ?? data?.sections ?? [];

  if (isLoading && !sections) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (!list.length) {
    return (
      <p className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
        Curriculum is not available for this course yet.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {list.map((section) => (
        <section key={section.id} className="space-y-2">
          <header className="flex items-center justify-between">
            <h3 className="font-semibold">{section.title}</h3>
            <span className="text-xs text-muted-foreground">
              {section.lessons.length} {pluralize(section.lessons.length, "lesson")}
            </span>
          </header>
          <ul className="divide-y rounded-md border">
            {section.lessons.map((lesson) => {
              const inner = (
                <div className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                  <div className="flex min-w-0 items-center gap-3">
                    {lesson.isCompleted ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                    ) : enrolled || lesson.isFreePreview ? (
                      <PlayCircle className="h-4 w-4 shrink-0 text-primary" />
                    ) : (
                      <Lock className="h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                    <span className="truncate">{lesson.title}</span>
                  </div>
                  <div className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
                    {lesson.isFreePreview && !enrolled ? (
                      <span className="rounded bg-muted px-1.5 py-0.5">Preview</span>
                    ) : null}
                    {lesson.durationSeconds ? (
                      <span>{formatDuration(lesson.durationSeconds)}</span>
                    ) : null}
                  </div>
                </div>
              );

              const canOpen = enrolled || lesson.isFreePreview;
              return (
                <li key={lesson.id}>
                  {canOpen ? (
                    <Link
                      href={`/learn/${courseId}/${lesson.id}`}
                      className="block transition-colors hover:bg-accent/50"
                    >
                      {inner}
                    </Link>
                  ) : (
                    <div className="cursor-not-allowed opacity-70">{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
