import Link from "next/link";
import {
  Utensils,
  ShieldCheck,
  Baby,
  FlaskConical,
  GraduationCap,
  Layers,
  Flame,
  Brain,
  Heart,
  Briefcase,
  Award,
  ChevronRight,
} from "lucide-react";
import { coursesService } from "@/lib/services/courses";
import type { CourseCategory } from "@/types/course";

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "food-hygiene": Utensils,
  "health-and-safety": ShieldCheck,
  "health-safety": ShieldCheck,
  safeguarding: Baby,
  haccp: FlaskConical,
  education: GraduationCap,
  "asbestos-awareness": Layers,
  asbestos: Layers,
  "fire-safety": Flame,
  "mental-health": Brain,
  "health-and-social-care": Heart,
  "health-social-care": Heart,
  "business-essentials": Briefcase,
  business: Briefcase,
  "city-guilds": Award,
};

function getCategoryIcon(slug: string): React.ComponentType<{ className?: string }> {
  const match = Object.keys(CATEGORY_ICONS).find(
    (k) => slug.includes(k) || k.includes(slug.split("-")[0]),
  );
  return match ? CATEGORY_ICONS[match] : GraduationCap;
}

async function getCategories(): Promise<CourseCategory[]> {
  try {
    return await coursesService.categories();
  } catch {
    return [];
  }
}

export async function CategoriesGrid() {
  const categories = await getCategories();

  if (!categories.length) return null;

  const displayed = categories.slice(0, 11);

  return (
    <div className="mt-10">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-suse text-2xl font-bold text-neutral-900">
          Explore courses by category
        </h3>
        <Link
          href="/courses"
          className="flex items-center gap-1 font-open-sans text-sm font-semibold text-secondary-500 transition-colors hover:text-secondary-600"
        >
          View all <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
        {displayed.map((cat) => {
          const Icon = getCategoryIcon(cat.slug);
          return (
            <Link
              key={cat.id}
              href={`/courses?category=${cat.slug}`}
              className="group flex flex-col items-center gap-3 rounded-lg border border-neutral-30 bg-white p-4 text-center transition-all hover:border-secondary-200 hover:bg-secondary-50 hover:shadow-sm"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 transition-colors group-hover:bg-secondary-100">
                <Icon className="h-7 w-7 text-neutral-900 transition-colors group-hover:text-secondary-500" />
              </div>
              <span className="font-open-sans text-sm font-medium leading-tight text-neutral-900">
                {cat.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
