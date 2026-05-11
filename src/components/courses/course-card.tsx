import Image from "next/image";
import Link from "next/link";
import { Clock, GraduationCap, Star, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDuration, pluralize, stripHtml, truncate } from "@/lib/utils/format";
import type { Course } from "@/types/course";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const excerpt = truncate(stripHtml(course.excerpt), 120);
  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-md">
      <Link href={`/courses/${course.slug}`} className="block">
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          {course.featuredImage ? (
            <Image
              src={course.featuredImage}
              alt={course.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <GraduationCap className="h-10 w-10" />
            </div>
          )}
          {course.isFree ? (
            <Badge variant="success" className="absolute left-3 top-3">
              Free
            </Badge>
          ) : null}
        </div>
      </Link>

      <CardHeader className="space-y-2 pb-2">
        {course.categories && course.categories[0] ? (
          <Badge variant="secondary" className="w-fit">
            {course.categories[0].name}
          </Badge>
        ) : null}
        <CardTitle className="line-clamp-2 text-base">
          <Link
            href={`/courses/${course.slug}`}
            className="transition-colors hover:text-primary"
          >
            {course.title}
          </Link>
        </CardTitle>
        {excerpt ? (
          <p className="line-clamp-2 text-sm text-muted-foreground">{excerpt}</p>
        ) : null}
      </CardHeader>

      <CardContent className="flex-1 pb-4">
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {(course.unitsCount ?? course.lessonsCount) ? (
            <span className="inline-flex items-center gap-1">
              <GraduationCap className="h-3 w-3" />
              {course.unitsCount ?? course.lessonsCount}{" "}
              {pluralize(course.unitsCount ?? course.lessonsCount ?? 0, "unit")}
            </span>
          ) : null}
          {course.durationSeconds ? (
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDuration(course.durationSeconds)}
            </span>
          ) : null}
          {course.studentsCount ? (
            <span className="inline-flex items-center gap-1">
              <Users className="h-3 w-3" />
              {course.studentsCount.toLocaleString()}
            </span>
          ) : null}
          {course.rating ? (
            <span className="inline-flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {course.rating.toFixed(1)}
            </span>
          ) : null}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t pt-4 text-sm">
        <span className="text-muted-foreground">{course.instructor?.name ?? "Instructor"}</span>
        <span className="font-semibold">
          {course.isFree ? "Free" : course.price ? `$${course.price}` : ""}
        </span>
      </CardFooter>
    </Card>
  );
}

export function CourseCardSkeleton() {
  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <div className="aspect-video w-full animate-pulse bg-muted" />
      <CardHeader className="space-y-2">
        <div className="h-3 w-16 animate-pulse rounded bg-muted" />
        <div className="h-5 w-full animate-pulse rounded bg-muted" />
        <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
      </CardHeader>
      <CardContent>
        <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
      </CardFooter>
    </Card>
  );
}
