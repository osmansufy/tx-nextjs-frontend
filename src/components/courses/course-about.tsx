interface CourseAboutProps {
  heading?: string | null;
  html: string;
}

export function CourseAbout({ heading, html }: CourseAboutProps) {
  return (
    <section className="rounded-lg border border-[#ebedf1] bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-bold text-neutral-900">
        {heading ?? "About This Course"}
      </h2>
      <div
        className="prose prose-neutral max-w-none text-sm leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </section>
  );
}
