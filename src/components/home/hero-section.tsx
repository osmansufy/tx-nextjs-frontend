import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroCarousel } from "./hero-carousel";
import { CourseCard } from "@/components/courses/course-card";
import { coursesService } from "@/lib/services/courses";
import type { Course } from "@/types/course";

const POPULAR_CATEGORIES = [
  "Discount courses",
  "Online courses",
  "On Demand courses",
  "Accounting courses",
  "IT courses",
];

async function getPopularCourses(): Promise<Course[]> {
  try {
    const res = await coursesService.list({ perPage: 4, orderBy: "popularity", order: "desc" });
    return res.items;
  } catch {
    return [];
  }
}

export async function HeroSection() {
  const courses = await getPopularCourses();

  return (
    <section className="relative overflow-hidden bg-primary-50">
      <div className="container flex flex-col items-start gap-12 py-16 lg:flex-row lg:items-center lg:py-20">
        {/* Left panel */}
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <div className="flex flex-col gap-4">
            <h1 className="font-suse text-4xl font-bold leading-tight text-neutral-900 md:text-5xl lg:text-[56px] lg:leading-[1.2]">
              UK&apos;s Leading eLearning Hub for Growth
            </h1>
            <p className="font-open-sans text-base leading-relaxed text-neutral-500 lg:max-w-[560px]">
              Join thousands of professionals and businesses across the UK. Be industry-ready with
              expert-led, accredited online training and earn recognised certifications. Stay
              compliant, upskill, and advance with quality courses, anywhere, anytime.
            </p>
          </div>

          {/* Accreditation logos */}
          <div className="flex items-center gap-4">
            <div className="flex h-[72px] w-[90px] items-center justify-center rounded-lg border border-neutral-30 bg-white px-2 py-2">
              <span className="text-center text-xs font-semibold leading-tight text-neutral-900">
                CPD<br />Certified
              </span>
            </div>
            <div className="flex h-[72px] w-[90px] items-center justify-center rounded-lg border border-neutral-30 bg-white px-2 py-2">
              <span className="text-center text-xs font-semibold leading-tight text-neutral-900">
                UKRLP<br />Registered
              </span>
            </div>
          </div>

          {/* Search box */}
          <div className="overflow-hidden rounded-sm bg-neutral-900/40 backdrop-blur-sm">
            <div className="flex items-center gap-4 p-4">
              <form
                action="/courses"
                method="get"
                className="flex flex-1 items-center gap-3"
              >
                <input
                  name="search"
                  type="text"
                  placeholder="Subject or qualification, e.g. IT Course"
                  className="flex-1 rounded-sm px-4 py-3 font-open-sans text-sm text-neutral-500 outline-none placeholder:text-neutral-200"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-sm bg-secondary-500 px-6 py-3 font-open-sans text-sm font-medium text-white transition-colors hover:bg-secondary-600"
                >
                  Search Courses
                </button>
              </form>
            </div>
            {/* Popular category scrollers */}
            <div className="flex items-center gap-2 px-4 pb-3 text-sm text-white">
              <ArrowRight className="h-4 w-4 shrink-0" />
              <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide">
                {POPULAR_CATEGORIES.map((cat, i) => (
                  <span key={cat} className="flex items-center gap-0 whitespace-nowrap">
                    <Link
                      href={`/courses?search=${encodeURIComponent(cat)}`}
                      className="px-2 text-white/90 transition-colors hover:text-white"
                    >
                      {cat}
                    </Link>
                    {i < POPULAR_CATEGORIES.length - 1 && (
                      <span className="text-white/40">|</span>
                    )}
                  </span>
                ))}
              </div>
              <ArrowRight className="h-4 w-4 shrink-0" />
            </div>
          </div>
        </div>

        {/* Right panel — carousel (desktop) / single card (mobile) */}
        {courses.length > 0 ? (
          <>
            <HeroCarousel courses={courses} />
            {/* Mobile: single card */}
            <div className="w-full lg:hidden">
              <CourseCard course={courses[0]} />
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
