"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface FaqItem {
  question: string;
  answer: string;
}

interface CourseFaqProps {
  heading?: string | null;
  items: FaqItem[];
}

export function CourseFaq({ heading, items }: CourseFaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!items.length) {
    return <p className="text-sm text-muted-foreground">No FAQs available.</p>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-neutral-900">
        {heading ?? "Frequently Asked Questions"}
      </h3>
      <div className="divide-y rounded-lg border border-[#ebedf1] bg-white shadow-sm">
        {items.map((faq, i) => (
          <div key={i}>
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              aria-expanded={openIndex === i}
            >
              <span className="font-medium text-neutral-900 text-sm">{faq.question}</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 text-neutral-500 transition-transform duration-200",
                  openIndex === i && "rotate-180",
                )}
              />
            </button>
            {openIndex === i ? (
              <div
                className="px-5 pb-5 prose prose-sm prose-neutral max-w-none text-neutral-700"
                dangerouslySetInnerHTML={{ __html: faq.answer }}
              />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
