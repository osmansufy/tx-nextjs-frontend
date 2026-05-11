"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { CourseCard } from "@/components/courses/course-card";
import type { Course } from "@/types/course";

interface HeroCarouselProps {
  courses: Course[];
}

const CARD_OFFSETS = [
  { x: 0, y: 0, scale: 1, z: 40, shadow: "drop-shadow-[0px_16px_24px_rgba(0,0,0,0.17)]" },
  { x: 96, y: 18, scale: 0.92, z: 30, shadow: "drop-shadow-[0px_8px_16px_rgba(0,0,0,0.10)]" },
  { x: 180, y: 38, scale: 0.84, z: 20, shadow: "" },
  { x: 252, y: 56, scale: 0.77, z: 10, shadow: "" },
];

export function HeroCarousel({ courses }: HeroCarouselProps) {
  const [active, setActive] = useState(0);
  const total = courses.length;

  const prev = () => setActive((a) => (a - 1 + total) % total);
  const next = () => setActive((a) => (a + 1) % total);

  const ordered = Array.from({ length: total }, (_, i) => courses[(active + i) % total]);

  return (
    <div className="relative hidden lg:block">
      {/* Stacked cards */}
      <div className="relative h-[440px] w-[560px]">
        {ordered.map((course, idx) => {
          const offset = CARD_OFFSETS[idx] ?? CARD_OFFSETS[CARD_OFFSETS.length - 1];
          return (
            <div
              key={course.id}
              className={cn("absolute w-[306px] transition-all duration-500", offset.shadow)}
              style={{
                transform: `translateX(${offset.x}px) translateY(${offset.y}px) scale(${offset.scale})`,
                zIndex: offset.z,
                transformOrigin: "top left",
              }}
            >
              <CourseCard course={course} />
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="mt-6 flex items-center gap-6">
        <button
          onClick={prev}
          aria-label="Previous course"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-50 bg-white text-neutral-500 transition-colors hover:bg-neutral-20"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2">
          {Array.from({ length: total }).map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={cn(
                "h-2 w-2 rounded-full transition-all",
                i === active ? "bg-secondary-500 w-4" : "bg-neutral-50",
              )}
            />
          ))}
        </div>
        <button
          onClick={next}
          aria-label="Next course"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-50 bg-white text-neutral-500 transition-colors hover:bg-neutral-20"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
