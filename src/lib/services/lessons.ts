import { api } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import { decodeEntities } from "@/lib/api/parsers";
import type { Lesson } from "@/types/lesson";
import type { WpRendered } from "@/types/api";

interface RawLesson {
  id: number;
  slug?: string;
  title?: string | WpRendered;
  content?: string | WpRendered;
  course_id: number;
  type?: string;
  duration?: number;
  duration_seconds?: number;
  video_url?: string;
  video?: string;
  attachments?: { name: string; url: string }[];
  is_completed?: boolean;
  is_free_preview?: boolean;
  free_preview?: boolean;
  order?: number;
  section_id?: number | string;
  prev_lesson_id?: number | null;
  next_lesson_id?: number | null;
}

const renderedOrString = (v: unknown): string => {
  if (!v) return "";
  if (typeof v === "string") return decodeEntities(v);
  if (typeof v === "object" && v !== null && "rendered" in v) {
    return decodeEntities((v as WpRendered).rendered);
  }
  return "";
};

export function normalizeLesson(raw: RawLesson): Lesson {
  return {
    id: raw.id,
    slug: raw.slug,
    title: renderedOrString(raw.title) || "Lesson",
    content: renderedOrString(raw.content),
    courseId: raw.course_id,
    type: (raw.type as Lesson["type"]) ?? "text",
    durationSeconds: raw.duration_seconds ?? raw.duration,
    videoUrl: raw.video_url ?? raw.video,
    attachments: raw.attachments,
    isCompleted: raw.is_completed,
    isFreePreview: raw.is_free_preview ?? raw.free_preview,
    order: raw.order,
    sectionId: raw.section_id,
    prevLessonId: raw.prev_lesson_id ?? null,
    nextLessonId: raw.next_lesson_id ?? null,
  };
}

export const lessonsService = {
  async detail(id: number): Promise<Lesson> {
    const { data } = await api.get<RawLesson>(endpoints.lessons.detail(id));
    return normalizeLesson(data);
  },

  async complete(id: number): Promise<void> {
    await api.post(endpoints.lessons.complete(id));
  },

  async uncomplete(id: number): Promise<void> {
    await api.post(endpoints.lessons.uncomplete(id));
  },
};
