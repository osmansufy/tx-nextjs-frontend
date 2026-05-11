import { SiteShell } from "@/components/layout/site-shell";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}
