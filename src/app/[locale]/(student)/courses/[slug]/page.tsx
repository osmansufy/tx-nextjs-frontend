import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Clock, GraduationCap, Star, Users } from "lucide-react";
import { coursesService } from "@/lib/services/courses";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Curriculum } from "@/components/courses/curriculum";
import { EnrollButton } from "@/components/courses/enroll-button";
import { formatDuration, pluralize, stripHtml, truncate } from "@/lib/utils/format";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const course = await coursesService.detail(params.slug);
    return {
      title: course.title,
      description: truncate(stripHtml(course.excerpt ?? course.content), 160),
      openGraph: {
        title: course.title,
        description: truncate(stripHtml(course.excerpt ?? course.content), 160),
        images: course.featuredImage ? [course.featuredImage] : undefined,
      },
    };
  } catch {
    return { title: "Course" };
  }
}

export default async function CourseDetailPage({ params }: PageProps) {
  let course;
  try {
    course = await coursesService.detail(params.slug);
  } catch {
    notFound();
  }
  if (!course) notFound();

  return (
    <article className="container py-10">
      <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <header className="space-y-3">
            {course.categories?.[0] ? (
              <Badge variant="secondary">{course.categories[0].name}</Badge>
            ) : null}
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{course.title}</h1>
            {course.excerpt ? (
              <p className="text-lg text-muted-foreground">{stripHtml(course.excerpt)}</p>
            ) : null}

            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              {(course.unitsCount ?? course.lessonsCount) ? (
                <span className="inline-flex items-center gap-1.5">
                  <GraduationCap className="h-4 w-4" />
                  {course.unitsCount ?? course.lessonsCount}{" "}
                  {pluralize(course.unitsCount ?? course.lessonsCount ?? 0, "unit")}
                </span>
              ) : null}
              {course.durationSeconds ? (
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {formatDuration(course.durationSeconds)}
                </span>
              ) : null}
              {course.studentsCount ? (
                <span className="inline-flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  {course.studentsCount.toLocaleString()} students
                </span>
              ) : null}
              {course.rating ? (
                <span className="inline-flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  {course.rating.toFixed(1)}
                  {course.ratingCount ? ` (${course.ratingCount})` : ""}
                </span>
              ) : null}
            </div>
          </header>

          {course.content ? (
            <section className="space-y-3">
              <h2 className="text-xl font-semibold">About this course</h2>
              <div
                className="prose-wp"
                dangerouslySetInnerHTML={{ __html: course.content }}
              />
            </section>
          ) : null}

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Curriculum</h2>
            <Curriculum courseId={course.id} />
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card>
            {course.featuredImage ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
                <Image
                  src={course.featuredImage}
                  alt={course.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover"
                  priority
                />
              </div>
            ) : null}
            <CardContent className="space-y-4 p-6">
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold">
                  {course.isFree ? "Free" : course.price ? `$${course.price}` : "Free"}
                </span>
                {course.level ? (
                  <Badge variant="outline" className="capitalize">
                    {course.level}
                  </Badge>
                ) : null}
              </div>
              <EnrollButton
                courseId={course.id}
                isFree={course.isFree}
                price={course.price}
              />
              {course.instructor ? (
                <div className="border-t pt-4 text-sm">
                  <span className="text-muted-foreground">Instructor</span>
                  <p className="mt-1 font-medium">{course.instructor.name}</p>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </aside>
      </div>
    </article>
  );
}
