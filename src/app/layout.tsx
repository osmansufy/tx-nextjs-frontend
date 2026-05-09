import type { Metadata } from "next";
import localFont from "next/font/local";
import { Providers } from "./providers";
import { env } from "@/lib/env";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: env.SITE_URL ? new URL(env.SITE_URL) : undefined,
  title: {
    default: "Headless LMS",
    template: "%s | Headless LMS",
  },
  description:
    "A modern headless learning platform powered by WordPress and Next.js. Browse courses, enroll, learn at your own pace.",
  openGraph: {
    type: "website",
    siteName: "Headless LMS",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
