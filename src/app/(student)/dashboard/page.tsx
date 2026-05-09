"use client";

import Link from "next/link";
import { GraduationCap, Search } from "lucide-react";
import { useMyEnrollments } from "@/lib/hooks/useEnrollments";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { EnrolledCourseCard } from "@/components/dashboard/enrolled-course-card";

export default function DashboardPage() {
  const { user } = useAuth();
  const { data, isLoading, isError } = useMyEnrollments();

  return (
    <div className="container py-10">
      <header className="mb-8 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-muted-foreground">Welcome back</p>
          <h1 className="text-3xl font-semibold tracking-tight">
            {user?.displayName ?? "Learner"}
          </h1>
        </div>
        <Button asChild variant="outline">
          <Link href="/courses">
            <Search /> Browse more courses
          </Link>
        </Button>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">My courses</h2>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-72 w-full" />
            ))}
          </div>
        ) : isError ? (
          <EmptyState
            icon={<GraduationCap className="h-10 w-10" />}
            title="Couldn't load your enrollments"
            description="The LMS API is unreachable right now. Please try again."
          />
        ) : data && data.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {data.map((e) => (
              <EnrolledCourseCard key={e.id} enrollment={e} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<GraduationCap className="h-10 w-10" />}
            title="You're not enrolled in any course yet"
            description="Pick a course and start learning today."
            action={
              <Button asChild>
                <Link href="/courses">Browse courses</Link>
              </Button>
            }
          />
        )}
      </section>
    </div>
  );
}
