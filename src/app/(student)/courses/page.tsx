import type { Metadata } from "next";
import { CoursesGrid } from "@/components/courses/courses-grid";

export const metadata: Metadata = {
  title: "All courses",
  description: "Browse all courses on the platform.",
};

export default function CoursesPage() {
  return (
    <div className="container py-10">
      <header className="mb-8 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">All courses</h1>
        <p className="max-w-2xl text-muted-foreground">
          Find a course, enroll in seconds, and learn at your own pace. Use search to narrow it
          down.
        </p>
      </header>

      <CoursesGrid />
    </div>
  );
}
