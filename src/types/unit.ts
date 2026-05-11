export type UnitType = "video" | "text" | "quiz" | "assignment";

export interface UnitSummary {
  id: number;
  slug?: string;
  title: string;
  type?: UnitType;
  durationSeconds?: number;
  isCompleted?: boolean;
  isFreePreview?: boolean;
  order?: number;
}

export interface Unit extends UnitSummary {
  content?: string;
  courseId: number;
  videoUrl?: string;
  attachments?: { name: string; url: string }[];
  sectionId?: number | string;
  prevUnitId?: number | null;
  nextUnitId?: number | null;
}
