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

interface RawInstructor {
  id: number;
  name?: string;
  display_name?: string;
  avatar?: string;
  avatar_url?: string;
  bio?: string;
}

interface RawCourse {
  id: number;
  slug?: string;
  name?: string;
  title?: string | WpRendered;
  excerpt?: string | WpRendered;
  description?: string;
  content?: string | WpRendered;
  // Real API: { full: string } object; legacy: plain string
  featured_image?: string | { full?: string; thumbnail?: string; medium?: string } | null;
  image?: string;
  thumbnail?: string;
  featured_media_url?: string;
  price?: number | string | null;
  original_price?: number | string | null;
  regular_price?: number | string | null;
  compare_at_price?: number | string | null;
  price_display?: string | null;
  is_free?: boolean;
  free?: boolean;
  level?: string;
  // Real API: seconds number; may be null
  duration?: number | null;
  duration_seconds?: number | null;
  total_duration?: number | null;
  lessons_count?: number;
  units_count?: number;
  total_lessons?: number;
  total_units?: number;
  // Real API field name
  total_students?: number;
  students_count?: number;
  // Real API uses average_rating
  average_rating?: number;
  rating?: number;
  rating_count?: number;
  categories?: CourseCategory[] | { id: number; name: string; slug: string }[];
  levels?: { id: number; name: string; slug: string }[];
  tags?: { id: number; name: string; slug: string }[];
  // Real API: array of instructors
  instructors?: RawInstructor[];
  // Real API: single primary instructor
  primary_instructor?: RawInstructor;
  // Legacy single instructor field
  instructor?: RawInstructor;
  author?: RawInstructor;
  // Real API: Unix timestamps (numbers); legacy: ISO strings
  date_created?: string | number;
  date_modified?: string | number;
  date?: string;
  date_gmt?: string;
  modified?: string;
  modified_gmt?: string;
  status?: string;
  menu_order?: number;
  seats?: number | null;
  start_date?: string | number | null;
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

function featuredImageUrl(raw: RawCourse): string | undefined {
  const fi = raw.featured_image;
  if (!fi) return raw.featured_media_url ?? raw.image ?? raw.thumbnail ?? undefined;
  if (typeof fi === "string") return fi || undefined;
  // Real API: { full, medium, thumbnail }
  return fi.full ?? fi.medium ?? fi.thumbnail ?? undefined;
}

function toPrice(v: number | string | null | undefined): number | undefined {
  if (v === null || v === undefined) return undefined;
  const n = typeof v === "string" ? Number(v) : v;
  return Number.isFinite(n) ? n : undefined;
}

function toUnixIso(v: string | number | null | undefined): string | undefined {
  if (v === null || v === undefined) return undefined;
  if (typeof v === "number") return new Date(v * 1000).toISOString();
  return v || undefined;
}

function normalizeInstructor(raw: RawInstructor) {
  return {
    id: raw.id,
    name: raw.display_name ?? raw.name ?? "Instructor",
    avatar: raw.avatar_url ?? raw.avatar,
    bio: raw.bio,
  };
}

export function normalizeCourse(raw: RawCourse): Course {
  const price = toPrice(raw.price);
  const originalPrice = toPrice(raw.original_price) ?? toPrice(raw.regular_price) ?? toPrice(raw.compare_at_price);

  // Instructor: real API uses instructors[] + primary_instructor; legacy uses instructor
  const instructorRaw = raw.primary_instructor ?? raw.instructors?.[0] ?? raw.instructor ?? raw.author;

  return {
    id: raw.id,
    slug: raw.slug ?? String(raw.id),
    title: renderedOrString(raw.title) || raw.name || "Untitled",
    excerpt: renderedOrString(raw.excerpt) || raw.description,
    content: renderedOrString(raw.content),
    featuredImage: featuredImageUrl(raw),
    price,
    originalPrice: originalPrice !== undefined && originalPrice !== price ? originalPrice : undefined,
    isFree: raw.is_free ?? raw.free ?? (price !== undefined ? price === 0 : undefined),
    level: (raw.level as Course["level"]) ?? undefined,
    // Real API: duration in seconds (may be null)
    durationSeconds: raw.duration_seconds ?? (raw.duration ?? raw.total_duration) ?? undefined,
    unitsCount: raw.units_count ?? raw.lessons_count ?? raw.total_units ?? raw.total_lessons,
    lessonsCount: raw.lessons_count ?? raw.total_lessons ?? raw.units_count ?? raw.total_units,
    // Real API field is total_students
    studentsCount: raw.total_students ?? raw.students_count,
    // Real API field is average_rating
    rating: raw.average_rating ?? raw.rating,
    ratingCount: raw.rating_count,
    categories: raw.categories as CourseCategory[] | undefined,
    instructor: instructorRaw ? normalizeInstructor(instructorRaw) : undefined,
    // Real API: Unix timestamps; legacy: ISO strings
    createdAt: toUnixIso(raw.date_created) ?? toUnixIso(raw.date_gmt) ?? toUnixIso(raw.date),
    updatedAt: toUnixIso(raw.date_modified) ?? toUnixIso(raw.modified_gmt) ?? toUnixIso(raw.modified),
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

    const res = await api.get<RawCourse[] | { items?: RawCourse[]; data?: RawCourse[]; total?: number; total_pages?: number }>(
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

  async featured(perPage = 8): Promise<PaginatedResponse<Course>> {
    const params = { per_page: perPage, page: 1 };
    const res = await api.get<RawCourse[] | { items?: RawCourse[]; total?: number }>(
      endpoints.courses.featured,
      { params },
    );
    const parsed = paginate<RawCourse>(res, 1, perPage);
    return { ...parsed, items: parsed.items.map(normalizeCourse) };
  },

  async categories(): Promise<CourseCategory[]> {
    const res = await api.get<{ items: CourseCategory[] } | CourseCategory[]>(
      endpoints.taxonomy.courseCategories,
    );
    const body = res.data;
    // After unwrapLmsEnvelope the body is { items, total, ... } from paginated_success.
    if (body && !Array.isArray(body) && "items" in body) {
      return (body as { items: CourseCategory[] }).items ?? [];
    }
    return (body as CourseCategory[]) ?? [];
  },
};
