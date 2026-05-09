import type { Metadata } from "next";
import { LessonPlayer } from "@/components/lessons/lesson-player";

export const metadata: Metadata = {
  title: "Learning",
  robots: { index: false, follow: false },
};

interface PageProps {
  params: { courseId: string; lessonId: string };
}

export default function LearnLessonPage({ params }: PageProps) {
  const courseId = Number(params.courseId);
  const lessonId = Number(params.lessonId);

  if (!Number.isFinite(courseId) || !Number.isFinite(lessonId)) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-semibold">Invalid lesson</h1>
      </div>
    );
  }

  return <LessonPlayer courseId={courseId} lessonId={lessonId} />;
}
