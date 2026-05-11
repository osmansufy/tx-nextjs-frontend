import Link from "next/link";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { ArrowRight, BookOpen, Clock, GraduationCap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { coursesService } from "@/lib/services/courses";
import { queryKeys } from "@/lib/utils/query-keys";
import { FeaturedCourses } from "@/components/courses/featured-courses";
import type { CourseListFilters } from "@/types/course";

const FEATURED_FILTERS: CourseListFilters = {
  perPage: 6,
  orderBy: "popularity",
  order: "desc",
};

export const revalidate = 300;

export default async function HomePage() {
  const qc = new QueryClient();
  try {
    await qc.prefetchQuery({
      queryKey: queryKeys.courses.list(FEATURED_FILTERS),
      queryFn: () => coursesService.list(FEATURED_FILTERS),
    });
  } catch {
    // Best-effort SSR prefetch; client will retry/fall through gracefully.
  }

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      {/* Hero */}
      <section className="border-b bg-gradient-to-b from-primary/5 to-background">
        <div className="container py-20 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-wider text-primary">
              Headless Learning Platform
            </p>
            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Learn the skills that matter, at your own pace.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-muted-foreground">
              A modern learning experience powered by WordPress on the back, Next.js on the front.
              Browse courses, enroll instantly, and pick up where you left off.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/courses">
                  Browse courses <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/register">Create free account</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="container py-16">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              icon: <BookOpen className="h-6 w-6 text-primary" />,
              title: "Curated courses",
              desc: "Hand-picked content from instructors with real-world experience.",
            },
            {
              icon: <Clock className="h-6 w-6 text-primary" />,
              title: "Learn on your time",
              desc: "Lifetime access. Pause and resume any lesson, on any device.",
            },
            {
              icon: <Users className="h-6 w-6 text-primary" />,
              title: "Track your progress",
              desc: "Keep your streak. We remember every completed lesson.",
            },
          ].map((p) => (
            <Card key={p.title}>
              <CardContent className="space-y-3 p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                  {p.icon}
                </div>
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <p className="text-sm text-muted-foreground">{p.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured courses */}
      <section className="container pb-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Featured courses
            </h2>
            <p className="mt-1 text-muted-foreground">Popular picks to get you started.</p>
          </div>
          <Button asChild variant="ghost">
            <Link href="/courses">
              View all <ArrowRight />
            </Link>
          </Button>
        </div>

        <FeaturedCourses limit={6} />
      </section>

      {/* CTA */}
      <section className="border-t bg-muted/40">
        <div className="container py-16 text-center">
          <GraduationCap className="mx-auto mb-4 h-10 w-10 text-primary" />
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Ready to start learning?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
            Create a free account to enroll and track progress across all your devices.
          </p>
          <Button asChild size="lg" className="mt-6">
            <Link href="/register">Get started for free</Link>
          </Button>
        </div>
      </section>
    </HydrationBoundary>
  );
}
