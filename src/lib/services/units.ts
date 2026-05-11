import { bffJson } from "@/lib/api/bff-client";
import { decodeEntities } from "@/lib/api/parsers";
import type { Unit } from "@/types/unit";
import type { WpRendered } from "@/types/api";

interface RawUnit {
  id?: number;
  slug?: string;
  title?: string | WpRendered;
  content?: string | WpRendered;
  course_id?: number;
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
  prev_unit_id?: number | null;
  next_unit_id?: number | null;
  prev_lesson_id?: number | null;
  next_lesson_id?: number | null;
  html?: string;
}

const renderedOrString = (v: unknown): string => {
  if (!v) return "";
  if (typeof v === "string") return decodeEntities(v);
  if (typeof v === "object" && v !== null && "rendered" in v) {
    return decodeEntities((v as WpRendered).rendered);
  }
  return "";
};

export function normalizeUnit(raw: RawUnit, fallbackId: number): Unit {
  const id = typeof raw.id === "number" ? raw.id : fallbackId;
  const content =
    renderedOrString(raw.content) || (typeof raw.html === "string" ? decodeEntities(raw.html) : "");

  return {
    id,
    slug: raw.slug,
    title: renderedOrString(raw.title) || "Unit",
    content,
    courseId: raw.course_id ?? 0,
    type: (raw.type as Unit["type"]) ?? "text",
    durationSeconds: raw.duration_seconds ?? raw.duration,
    videoUrl: raw.video_url ?? raw.video,
    attachments: raw.attachments,
    isCompleted: raw.is_completed,
    isFreePreview: raw.is_free_preview ?? raw.free_preview,
    order: raw.order,
    sectionId: raw.section_id,
    prevUnitId: raw.prev_unit_id ?? raw.prev_lesson_id ?? null,
    nextUnitId: raw.next_unit_id ?? raw.next_lesson_id ?? null,
  };
}

export const unitsService = {
  async detail(id: number): Promise<Unit> {
    const data = await bffJson<RawUnit | string>(`/api/units/${id}/content`, { method: "GET" });
    if (typeof data === "string") {
      return normalizeUnit({ html: data, id }, id);
    }
    return normalizeUnit(data, id);
  },

  async complete(id: number): Promise<void> {
    await bffJson<unknown>(`/api/units/${id}/complete`, { method: "POST" });
  },
};
