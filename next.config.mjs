import createNextIntlPlugin from "next-intl/plugin";
import { withSentryConfig } from "@sentry/nextjs";

// Allow self-signed / untrusted certs in local dev for Next.js image optimizer.
// Scoped to non-production only; does not affect browser requests.
if (process.env.NODE_ENV !== "production") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const wpUrl = process.env.NEXT_PUBLIC_WP_API_URL;
const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL;

function parseHostname(url) {
  if (!url) return undefined;
  try {
    return new URL(url).hostname;
  } catch {
    return undefined;
  }
}

const wpHost = parseHostname(wpUrl);
const cdnHost = parseHostname(cdnUrl);

const remotePatterns = [];
if (wpHost) {
  remotePatterns.push({ protocol: "https", hostname: wpHost });
  remotePatterns.push({ protocol: "http", hostname: wpHost });
}
if (cdnHost && cdnHost !== wpHost) {
  remotePatterns.push({ protocol: "https", hostname: cdnHost });
}
remotePatterns.push({ protocol: "https", hostname: "secure.gravatar.com" });
remotePatterns.push({ protocol: "https", hostname: "*.wp.com" });

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { remotePatterns },
  // Enable instrumentation.ts (Sentry, OpenTelemetry, etc.)
  experimental: { instrumentationHook: true },
};

const sentryConfig = {
  // Only upload source maps when DSN is configured (skips local dev)
  silent: !process.env.SENTRY_DSN,
  // Disable auto-instrumentation of Pages Router (_document, _app) —
  // we use App Router + instrumentation.ts instead
  autoInstrumentServerFunctions: false,
  autoInstrumentMiddleware: false,
  // Don't tunnel — keep sentry requests direct
  disableLogger: true,
  // Suppress the Sentry build-time banner
  hideSourceMaps: false,
};

export default withSentryConfig(withNextIntl(nextConfig), sentryConfig);
