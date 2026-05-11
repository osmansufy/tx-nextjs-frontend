import Link from "next/link";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface PlanFeature {
  label: string;
  included: boolean;
}

interface Plan {
  name: string;
  price: string;
  originalPrice?: string;
  badge?: { label: string; variant: "gold" | "navy" };
  features: PlanFeature[];
  ctaHref: string;
  ctaLabel: string;
  highlight?: boolean;
}

const PLANS: Plan[] = [
  {
    name: "Yearly Subscription",
    price: "£49/Year",
    ctaHref: "/register",
    ctaLabel: "Get Started",
    features: [
      { label: "1 Year Access to 3000+ Courses", included: true },
      { label: "Unlimited PDF Certificates", included: false },
      { label: "Unlimited PDF Transcripts", included: false },
      { label: "Free Student ID Card & More", included: false },
    ],
  },
  {
    name: "Lifetime Prime",
    price: "£149",
    originalPrice: "£399",
    badge: { label: "Best Value", variant: "gold" },
    ctaHref: "/register",
    ctaLabel: "Get Lifetime Prime",
    features: [
      { label: "1 Year Access to 3000+ Courses", included: true },
      { label: "Unlimited PDF Certificates", included: false },
      { label: "Unlimited PDF Transcripts", included: false },
      { label: "Free Student ID Card & More", included: false },
    ],
  },
  {
    name: "Lifetime Prime Plus",
    price: "£249",
    originalPrice: "£599",
    badge: { label: "Most Popular", variant: "navy" },
    highlight: true,
    ctaHref: "/register",
    ctaLabel: "Get Prime Plus",
    features: [
      { label: "1 Year Access to 3000+ Courses", included: true },
      { label: "Unlimited PDF Certificates", included: true },
      { label: "Unlimited PDF Transcripts", included: true },
      { label: "Free Student ID Card & More", included: true },
    ],
  },
];

export function PricingSection() {
  return (
    <section className="py-16">
      <div className="container">
        <div className="mb-10 text-center">
          <h2 className="font-suse text-3xl font-bold text-neutral-900 md:text-4xl">
            Choose Your Learning Plan
          </h2>
          <p className="mt-2 font-open-sans text-neutral-500">
            Flexible plans to suit every learner — individuals and businesses alike.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative flex flex-col rounded-lg border p-8",
                plan.highlight
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-[#ebedf1] bg-white",
              )}
            >
              {/* Badge */}
              {plan.badge && (
                <div
                  className={cn(
                    "absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-sm px-4 py-1 text-sm font-semibold",
                    plan.badge.variant === "gold"
                      ? "bg-secondary-500 text-white"
                      : "bg-neutral-900 text-white",
                  )}
                >
                  {plan.badge.label}
                </div>
              )}

              <h3
                className={cn(
                  "font-suse text-xl font-bold",
                  plan.highlight ? "text-white" : "text-neutral-900",
                )}
              >
                {plan.name}
              </h3>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-2">
                <span
                  className={cn(
                    "font-open-sans text-4xl font-bold",
                    plan.highlight ? "text-white" : "text-neutral-900",
                  )}
                >
                  {plan.price}
                </span>
                {plan.originalPrice && (
                  <span className="font-open-sans text-lg text-[#dc3545] line-through">
                    {plan.originalPrice}
                  </span>
                )}
              </div>

              {/* Features */}
              <ul className="mt-8 flex flex-col gap-4">
                {plan.features.map((feat) => (
                  <li key={feat.label} className="flex items-center gap-3">
                    {feat.included ? (
                      <Check
                        className={cn(
                          "h-5 w-5 shrink-0",
                          plan.highlight ? "text-primary-300" : "text-secondary-500",
                        )}
                      />
                    ) : (
                      <X className="h-5 w-5 shrink-0 text-[#dc3545]" />
                    )}
                    <span
                      className={cn(
                        "font-open-sans text-sm",
                        plan.highlight ? "text-white/80" : "text-neutral-500",
                      )}
                    >
                      {feat.label}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={plan.ctaHref}
                className={cn(
                  "mt-8 block rounded-sm py-2.5 text-center font-open-sans text-sm font-semibold transition-colors",
                  plan.highlight
                    ? "bg-secondary-500 text-white hover:bg-secondary-600"
                    : "border border-secondary-500 text-secondary-500 hover:bg-secondary-50",
                )}
              >
                {plan.ctaLabel}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
