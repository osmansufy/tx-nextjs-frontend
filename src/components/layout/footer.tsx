import Link from "next/link";
import { GraduationCap } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container flex flex-col items-center justify-between gap-4 py-8 text-sm text-muted-foreground sm:flex-row">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-primary" />
          <span>&copy; {new Date().getFullYear()} Headless LMS. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/courses" className="hover:text-foreground">
            Courses
          </Link>
          <Link href="/login" className="hover:text-foreground">
            Sign in
          </Link>
          <Link href="/register" className="hover:text-foreground">
            Register
          </Link>
        </div>
      </div>
    </footer>
  );
}
