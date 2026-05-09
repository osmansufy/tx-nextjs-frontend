import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteShell } from "@/components/layout/site-shell";

export default function NotFound() {
  return (
    <SiteShell>
      <div className="container flex min-h-[60vh] flex-col items-center justify-center text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-primary">404</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Page not found</h1>
        <p className="mt-2 max-w-md text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Button asChild className="mt-6">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </SiteShell>
  );
}
