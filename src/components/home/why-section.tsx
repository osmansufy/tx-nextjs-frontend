import Link from "next/link";
import { ArrowRight, BookOpen, ShieldCheck, Video } from "lucide-react";

const PANELS = [
  {
    side: "right" as const,
    title: "Expert Training for Compliance & Growth",
    body: "Training Excellence offers expertly designed courses that cater to your professional growth and ensure your business meets essential safety and compliance standards. With a focus on Health & Safety, Education, Food Hygiene, Safeguarding, and more, our courses are tailored to help you and your team succeed. Whether you're an individual or a business, we are committed to providing top-notch, flexible learning solutions that drive positive outcomes and long-term success.",
    cta: { label: "Start Learning Now", href: "/courses" },
    Icon: BookOpen,
  },
  {
    side: "left" as const,
    title: "Why Choose Training Excellence?",
    bullets: [
      "Flexible online learning, allowing you to study at your own pace and convenience.",
      "Accredited by trusted bodies such as CPD, UKRLP, RoSPA, and AOHT.",
      "Instant certification upon course completion to showcase your achievements.",
      "24/7 tutor support, ensuring you have help whenever you need it.",
      "14-day money-back guarantee for risk-free learning.",
    ],
    cta: { label: "View all Courses", href: "/courses" },
    Icon: ShieldCheck,
  },
  {
    side: "right" as const,
    title: "More Reasons to Choose Us",
    bullets: [
      "Expert-led video lectures for an engaging learning experience.",
      "Unlimited access and retakes to master the content.",
      "Industry-standard courses that boost compliance and employability.",
      "Regular updates to keep your knowledge current.",
    ],
    cta: { label: "Start Journey Now", href: "/courses" },
    Icon: Video,
  },
];

export function WhySection() {
  return (
    <section className="py-16">
      <div className="container flex flex-col gap-20">
        {PANELS.map((panel, idx) => {
          const isImageLeft = panel.side === "left";
          return (
            <div
              key={idx}
              className={`flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16 ${isImageLeft ? "lg:flex-row-reverse" : ""}`}
            >
              {/* Text */}
              <div className="flex flex-1 flex-col gap-4">
                <h2 className="font-suse text-3xl font-bold text-neutral-900">{panel.title}</h2>
                {"body" in panel && panel.body ? (
                  <p className="font-open-sans text-base leading-relaxed text-neutral-500">
                    {panel.body}
                  </p>
                ) : null}
                {"bullets" in panel && panel.bullets ? (
                  <ul className="flex flex-col gap-2">
                    {panel.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex items-start gap-2 font-open-sans text-base text-neutral-500"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary-500" />
                        {b}
                      </li>
                    ))}
                  </ul>
                ) : null}
                <Link
                  href={panel.cta.href}
                  className="inline-flex items-center gap-2 font-open-sans text-base font-medium text-secondary-500 transition-colors hover:text-secondary-600"
                >
                  {panel.cta.label}
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>

              {/* Illustration placeholder */}
              <div className="flex h-72 w-full shrink-0 items-center justify-center rounded-2xl bg-primary-50 lg:h-80 lg:w-80">
                <panel.Icon className="h-24 w-24 text-primary-300" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
