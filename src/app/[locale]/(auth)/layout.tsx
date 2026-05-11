import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col bg-muted/30">
      <header className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <GraduationCap className="h-5 w-5 text-primary" />
          <span>LMS</span>
        </Link>
      </header>

      <main className="container flex flex-1 items-center justify-center pb-16">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
