import { api } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import { paginate, decodeEntities } from "@/lib/api/parsers";
import type {
  Course,
  CourseCategory,
  CourseCurriculum,
  CourseDetail,
  CourseListFilters,
  CourseSection,
} from "@/types/course";
import type { UnitSummary } from "@/types/unit";
import type { PaginatedResponse, WpRendered } from "@/types/api";

interface RawCourse {
  id: number;
  slug?: string;
  name?: string;
  title?: string | WpRendered;
  excerpt?: string | WpRendered;
  description?: string;
  content?: string | WpRendered;
  image?: string;
  thumbnail?: string;
  featured_image?: string;
  featured_media_url?: string;
  price?: number | string;
  is_free?: boolean;
  free?: boolean;
  level?: string;
  duration?: number;
  duration_seconds?: number;
  total_duration?: number;
  lessons_count?: number;
  units_count?: number;
  total_lessons?: number;
  total_units?: number;
  students_count?: number;
  total_students?: number;
  rating?: number;
  rating_count?: number;
  categories?: CourseCategory[] | { id: number; name: string; slug: string }[];
  instructor?: {
    id: number;
    name?: string;
    display_name?: string;
    avatar?: string;
    avatar_url?: string;
    bio?: string;
  };
  date?: string;
  date_gmt?: string;
  modified?: string;
  modified_gmt?: string;
}

const renderedOrString = (v: unknown): string => {
  if (!v) return "";
  if (typeof v === "string") return decodeEntities(v);
  if (typeof v === "object" && v !== null && "rendered" in v) {
    return decodeEntities((v as WpRendered).rendered);
  }
  return "";
};

function normalizeUnitSummaryFromCurriculum(raw: Record<string, unknown>): UnitSummary {
  const id = Number(raw.id);
  const title = renderedOrString(raw.title) || "Unit";
  return {
    id: Number.isFinite(id) ? id : 0,
    slug: typeof raw.slug === "string" ? raw.slug : undefined,
    title,
    type: raw.type as UnitSummary["type"],
    durationSeconds:
      (raw.duration_seconds as number | undefined) ?? (raw.duration as number | undefined),
    isCompleted: raw.is_completed as boolean | undefined,
    isFreePreview: (raw.is_free_preview as boolean | undefined) ?? (raw.free_preview as boolean),
    order: raw.order as number | undefined,
  };
}

export function normalizeCourse(raw: RawCourse): Course {
  const price =
    typeof raw.price === "string" ? Number(raw.price) || undefined : (raw.price as number | undefined);
  return {
    id: raw.id,
    slug: raw.slug ?? String(raw.id),
    title: renderedOrString(raw.title) || raw.name || "Untitled",
    excerpt: renderedOrString(raw.excerpt) || raw.description,
    content: renderedOrString(raw.content),
    featuredImage:
      raw.featured_image ?? raw.featured_media_url ?? raw.image ?? raw.thumbnail ?? undefined,
    price,
    isFree: raw.is_free ?? raw.free ?? (price !== undefined ? price === 0 : undefined),
    level: (raw.level as Course["level"]) ?? undefined,
    durationSeconds: raw.duration_seconds ?? raw.duration ?? raw.total_duration,
    unitsCount: raw.units_count ?? raw.lessons_count ?? raw.total_units ?? raw.total_lessons,
    lessonsCount: raw.lessons_count ?? raw.total_lessons ?? raw.units_count ?? raw.total_units,
    studentsCount: raw.students_count ?? raw.total_students,
    rating: raw.rating,
    ratingCount: raw.rating_count,
    categories: raw.categories as CourseCategory[] | undefined,
    instructor: raw.instructor
      ? {
          id: raw.instructor.id,
          name: raw.instructor.display_name ?? raw.instructor.name ?? "Instructor",
          avatar: raw.instructor.avatar_url ?? raw.instructor.avatar,
          bio: raw.instructor.bio,
        }
      : undefined,
    createdAt: raw.date_gmt ?? raw.date,
    updatedAt: raw.modified_gmt ?? raw.modified,
  };
}

export const coursesService = {
  async list(filters: CourseListFilters = {}): Promise<PaginatedResponse<Course>> {
    const page = filters.page ?? 1;
    const perPage = filters.perPage ?? 12;
    const params: Record<string, string | number> = { page, per_page: perPage };
    if (filters.search) params.search = filters.search;
    if (filters.category) params.category = filters.category;
    if (filters.level) params.level = filters.level;
    if (filters.orderBy) params.orderby = filters.orderBy;
    if (filters.order) params.order = filters.order;

    const res = await api.get<RawCourse[] | { items?: RawCourse[]; data?: RawCourse[] }>(
      endpoints.courses.list,
      { params },
    );
    const parsed = paginate<RawCourse>(res, page, perPage);
    return {
      ...parsed,
      items: parsed.items.map(normalizeCourse),
    };
  },

  async detail(idOrSlug: string | number): Promise<CourseDetail> {
    const { data } = await api.get<RawCourse>(endpoints.courses.detail(idOrSlug));
    return normalizeCourse(data);
  },

  async curriculum(idOrSlug: string | number): Promise<CourseCurriculum> {
    const { data } = await api.get<{
      sections?: Array<{
        id: number | string;
        title: string;
        lessons?: Record<string, unknown>[];
        units?: Record<string, unknown>[];
      }>;
      data?: Array<{
        id: number | string;
        title: string;
        lessons?: Record<string, unknown>[];
        units?: Record<string, unknown>[];
      }>;
      total_lessons?: number;
      total_units?: number;
      course_id?: number;
    }>(endpoints.courses.curriculum(idOrSlug));

    const rawSections = data.sections ?? data.data ?? [];
    const sections: CourseSection[] = rawSections.map((sec) => {
      const items = (sec.units ?? sec.lessons ?? []) as Record<string, unknown>[];
      return {
        id: sec.id,
        title: sec.title,
        units: items.map(normalizeUnitSummaryFromCurriculum),
      };
    });

    const totalUnits =
      data.total_units ??
      data.total_lessons ??
      sections.reduce((acc, s) => acc + s.units.length, 0);

    return {
      courseId: data.course_id ?? (Number(idOrSlug) || 0),
      sections,
      totalUnits,
    };
  },

  async categories(): Promise<CourseCategory[]> {
    const { data } = await api.get<CourseCategory[]>(endpoints.taxonomy.courseCategories);
    return data;
  },
};
