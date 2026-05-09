const requireEnv = (key: string, fallback?: string): string => {
  const v = process.env[key] ?? fallback;
  if (!v) {
    if (typeof window === "undefined") {
      console.warn(`[env] ${key} is not set. Falling back to empty string.`);
    }
    return "";
  }
  return v;
};

export const env = {
  WP_API_URL: requireEnv("NEXT_PUBLIC_WP_API_URL", ""),
  SITE_URL: requireEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:3000"),
  LMS_NAMESPACE: process.env.NEXT_PUBLIC_LMS_NAMESPACE ?? "lms/v1",
} as const;

export const WP_REST_BASE = env.WP_API_URL ? `${env.WP_API_URL.replace(/\/$/, "")}/wp-json` : "";
