export type LessonType = "video" | "text" | "quiz" | "assignment";

export interface LessonSummary {
  id: number;
  slug?: string;
  title: string;
  type?: LessonType;
  durationSeconds?: number;
  isFreePreview?: boolean;
  isCompleted?: boolean;
  order?: number;
  sectionId?: number | string;
}

export interface Lesson extends LessonSummary {
  courseId: number;
  content?: string;
  videoUrl?: string;
  attachments?: { name: string; url: string }[];
  prevLessonId?: number | null;
  nextLessonId?: number | null;
}
