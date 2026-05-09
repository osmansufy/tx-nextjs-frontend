/** @type {import('next').NextConfig} */

const wpUrl = process.env.NEXT_PUBLIC_WP_API_URL;

let wpHost;
try {
  wpHost = wpUrl ? new URL(wpUrl).hostname : undefined;
} catch {
  wpHost = undefined;
}

const remotePatterns = [];
if (wpHost) {
  remotePatterns.push({ protocol: "https", hostname: wpHost });
  remotePatterns.push({ protocol: "http", hostname: wpHost });
}
remotePatterns.push({ protocol: "https", hostname: "secure.gravatar.com" });
remotePatterns.push({ protocol: "https", hostname: "*.wp.com" });

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns,
  },
};

export default nextConfig;
