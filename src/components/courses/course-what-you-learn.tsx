import { Check } from "lucide-react";

interface CourseWhatYouLearnProps {
  items: string[];
}

export function CourseWhatYouLearn({ items }: CourseWhatYouLearnProps) {
  if (!items.length) return null;

  return (
    <section className="rounded-lg border border-[#ebedf1] bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-bold text-neutral-900">What You&apos;ll Learn</h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary-100">
              <Check className="h-3 w-3 text-secondary-600" />
            </span>
            <span className="text-sm text-neutral-700">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
