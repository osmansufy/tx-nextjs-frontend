"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useCourseCurriculum } from "@/lib/hooks/useCourses";
import { useCompleteUnit, useCourseProgress, useUnit } from "@/lib/hooks/useUnits";
import { cn } from "@/lib/utils/cn";
import { formatDuration, pluralize } from "@/lib/utils/format";

interface UnitPlayerProps {
  courseId: number;
  unitId: number;
}

export function UnitPlayer({ courseId, unitId }: UnitPlayerProps) {
  const router = useRouter();
  const { data: unit, isLoading: isUnitLoading } = useUnit(unitId);
  const { data: curriculum, isLoading: isCurrLoading } = useCourseCurriculum(courseId);
  const { data: progress } = useCourseProgress(courseId);
  const complete = useCompleteUnit(courseId);

  const flatUnits = (curriculum?.sections ?? []).flatMap((s) =>
    s.units.map((u) => ({ ...u, sectionTitle: s.title })),
  );
  const currentIdx = flatUnits.findIndex((u) => u.id === unitId);
  const prev = currentIdx > 0 ? flatUnits[currentIdx - 1] : null;
  const next = currentIdx >= 0 && currentIdx < flatUnits.length - 1 ? flatUnits[currentIdx + 1] : null;

  const handleComplete = () => {
    complete.mutate(unitId, {
      onSuccess: () => {
        if (next) router.push(`/learn/${courseId}/${next.id}`);
      },
    });
  };

  return (
    <div className="grid min-h-svh grid-cols-1 lg:grid-cols-[320px_1fr]">
      <aside className="hidden border-r bg-muted/30 lg:flex lg:flex-col">
        <div className="border-b p-4">
          <Link
            href={`/courses/${courseId}`}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3 w-3" /> Back to course
          </Link>
          <h2 className="mt-2 line-clamp-2 text-sm font-semibold">Course content</h2>
          {progress ? (
            <div className="mt-3 space-y-1">
              <Progress value={progress.percent} />
              <p className="text-xs text-muted-foreground">
                {progress.completedUnits}/{progress.totalUnits}{" "}
                {pluralize(progress.totalUnits ?? 0, "unit")} \u2022 {progress.percent}%
              </p>
            </div>
          ) : null}
        </div>

        <nav className="flex-1 overflow-y-auto p-2">
          {isCurrLoading ? (
            <div className="space-y-2 p-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            (curriculum?.sections ?? []).map((section) => (
              <section key={section.id} className="mb-3">
                <h3 className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {section.title}
                </h3>
                <ul>
                  {section.units.map((u) => {
                    const isActive = u.id === unitId;
                    const done =
                      u.isCompleted || progress?.completedUnitIds?.includes(u.id) || false;
                    return (
                      <li key={u.id}>
                        <Link
                          href={`/learn/${courseId}/${u.id}`}
                          className={cn(
                            "flex items-start gap-2 rounded-md px-2 py-2 text-sm transition-colors hover:bg-accent",
                            isActive && "bg-accent font-medium",
                          )}
                        >
                          {done ? (
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                          ) : (
                            <PlayCircle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                          )}
                          <span className="flex-1">{u.title}</span>
                          {u.durationSeconds ? (
                            <span className="text-xs text-muted-foreground">
                              {formatDuration(u.durationSeconds)}
                            </span>
                          ) : null}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))
          )}
        </nav>
      </aside>

      <section className="flex min-h-svh flex-col">
        <div className="border-b p-4 lg:hidden">
          <Link
            href={`/courses/${courseId}`}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3 w-3" /> Back to course
          </Link>
          {progress ? (
            <div className="mt-2">
              <Progress value={progress.percent} />
              <p className="mt-1 text-xs text-muted-foreground">
                {progress.completedUnits}/{progress.totalUnits} \u2022 {progress.percent}%
              </p>
            </div>
          ) : null}
        </div>

        <div className="container max-w-4xl flex-1 py-8">
          {isUnitLoading || !unit ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="aspect-video w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : (
            <article className="space-y-6">
              <header className="space-y-2">
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{unit.title}</h1>
                {unit.durationSeconds ? (
                  <p className="text-sm text-muted-foreground">
                    {formatDuration(unit.durationSeconds)}
                  </p>
                ) : null}
              </header>

              {unit.videoUrl ? (
                <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
                  <video key={unit.videoUrl} src={unit.videoUrl} controls className="h-full w-full" />
                </div>
              ) : null}

              {unit.content ? (
                <div className="prose-wp" dangerouslySetInnerHTML={{ __html: unit.content }} />
              ) : null}

              {unit.attachments?.length ? (
                <section className="rounded-md border p-4">
                  <h2 className="mb-2 text-sm font-semibold">Attachments</h2>
                  <ul className="space-y-1 text-sm">
                    {unit.attachments.map((a, i) => (
                      <li key={i}>
                        <a
                          href={a.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary hover:underline"
                        >
                          {a.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </article>
          )}
        </div>

        <footer className="border-t bg-background p-4">
          <div className="container flex max-w-4xl items-center justify-between gap-3">
            <Button variant="outline" disabled={!prev} asChild={!!prev}>
              {prev ? (
                <Link href={`/learn/${courseId}/${prev.id}`}>
                  <ArrowLeft /> Previous
                </Link>
              ) : (
                <span>
                  <ArrowLeft /> Previous
                </span>
              )}
            </Button>

            <Button onClick={handleComplete} disabled={complete.isPending || unit?.isCompleted}>
              {complete.isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <CheckCircle2 />
              )}
              {unit?.isCompleted ? "Completed" : next ? "Complete & next" : "Complete"}
            </Button>

            <Button variant="outline" disabled={!next} asChild={!!next}>
              {next ? (
                <Link href={`/learn/${courseId}/${next.id}`}>
                  Next <ArrowRight />
                </Link>
              ) : (
                <span>
                  Next <ArrowRight />
                </span>
              )}
            </Button>
          </div>
        </footer>
      </section>
    </div>
  );
}
