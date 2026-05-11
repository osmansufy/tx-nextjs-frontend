import { env } from "@/lib/env";
import type { SiteSettings, SiteFeatures } from "@/types/settings";

/** Default fallback settings — all pulled from env vars. */
export function getEnvFallbackSettings(): SiteSettings {
  return {
    site_name: env.SITE_NAME || "Training Excellence",
    logo_url: env.LOGO_URL || undefined,
    logo_dark_url: env.LOGO_DARK_URL || undefined,
    primary_color: env.PRIMARY_COLOR || undefined,
    accent_color: env.ACCENT_COLOR || undefined,
    currency: env.CURRENCY || "GBP",
    locale: env.LOCALE || "en-GB",
    features: {
      memberships: env.FEATURE_MEMBERSHIPS,
      bundles: env.FEATURE_BUNDLES,
      certificates: env.FEATURE_CERTIFICATES,
      badges: env.FEATURE_BADGES,
      reviews: env.FEATURE_REVIEWS,
      blog: env.FEATURE_BLOG,
    },
  };
}

/** Merge API settings with env overrides. Env vars win when explicitly set. */
export function mergeSettings(api: Partial<SiteSettings>): SiteSettings {
  const fallback = getEnvFallbackSettings();

  const features: SiteFeatures = {
    ...fallback.features,
    ...(api.features ?? {}),
  };

  return {
    ...fallback,
    ...api,
    site_name: env.SITE_NAME || api.site_name || fallback.site_name,
    logo_url: env.LOGO_URL || api.logo_url || fallback.logo_url,
    logo_dark_url: env.LOGO_DARK_URL || api.logo_dark_url || fallback.logo_dark_url,
    primary_color: env.PRIMARY_COLOR || api.primary_color || fallback.primary_color,
    accent_color: env.ACCENT_COLOR || api.accent_color || fallback.accent_color,
    currency: env.CURRENCY || api.currency || fallback.currency,
    locale: env.LOCALE || api.locale || fallback.locale,
    features,
  };
}

