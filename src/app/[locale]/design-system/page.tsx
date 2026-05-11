import { NeutralSwatches, PrimarySwatches, SecondarySwatches } from "@/components/design-system";

export const metadata = {
  title: "Design System — Colours",
};

export default function DesignSystemPage() {
  return (
    <main className="min-h-screen bg-neutral-20 py-12">
      <div className="mx-auto max-w-6xl px-4">
        <h1 className="mb-2 text-4xl font-bold text-neutral-900">
          Training Excellence — Design System
        </h1>
        <p className="mb-10 text-base text-neutral-400">
          Colour palette sourced directly from Figma. Use these tokens via Tailwind utilities
          (e.g. <code className="rounded bg-neutral-30 px-1 py-0.5 text-sm font-mono text-neutral-700">bg-primary-500</code>,{" "}
          <code className="rounded bg-neutral-30 px-1 py-0.5 text-sm font-mono text-neutral-700">text-secondary-700</code>,{" "}
          <code className="rounded bg-neutral-30 px-1 py-0.5 text-sm font-mono text-neutral-700">border-neutral-40</code>).
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <PrimarySwatches />
          <SecondarySwatches />
          <NeutralSwatches />
        </div>
      </div>
    </main>
  );
}
