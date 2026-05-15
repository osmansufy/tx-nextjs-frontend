"use client";

import type { ApiCategory } from "@/lib/api/server";

interface CourseCategoryFilterProps {
  categories: ApiCategory[];
  selected: string[];
  onChange: (slug: string) => void;
  onClear: () => void;
}

export function CourseCategoryFilter({
  categories,
  selected,
  onChange,
  onClear,
}: CourseCategoryFilterProps) {
  return (
    <div className="rounded-[4px] border border-[#ebedf1] bg-white p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-suse text-[20px] font-bold leading-[1.2] text-neutral-900">
          Course Categories
        </h2>
        {selected.length > 0 && (
          <button
            onClick={onClear}
            className="font-open-sans text-[14px] leading-[1.5] text-secondary-500 underline underline-offset-2 hover:text-secondary-600"
          >
            Clear all
          </button>
        )}
      </div>

      <ul className="flex flex-col gap-5">
        {categories.map((cat) => (
          <li key={cat.id} className="flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-[9px]">
              <input
                type="checkbox"
                checked={selected.includes(cat.slug)}
                onChange={() => onChange(cat.slug)}
                className="h-4 w-4 rounded border-neutral-50 text-secondary-500 focus:ring-secondary-500"
              />
              <span className="font-open-sans text-[16px] leading-[1.5] text-neutral-500">
                {cat.name}
              </span>
            </label>
            <span className="font-open-sans text-[16px] leading-[1.5] text-neutral-500">
              ({cat.count})
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
