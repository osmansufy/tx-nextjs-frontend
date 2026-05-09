"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, LogOut, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useAuth, useLogout } from "@/lib/hooks/useAuth";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
];

const authedNavItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/courses", label: "Browse" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { isAuthenticated, user, hasHydrated } = useAuth();
  const logout = useLogout();

  const items = isAuthenticated ? authedNavItems : navItems;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2 font-semibold">
            <GraduationCap className="h-5 w-5 text-primary" />
            <span>LMS</span>
          </Link>

          <nav className="hidden items-center gap-1 sm:flex">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                  pathname === item.href && "bg-accent text-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {!hasHydrated ? (
            <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
          ) : isAuthenticated ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/profile" className="gap-2">
                  <UserIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">{user?.displayName ?? "Profile"}</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" onClick={logout} aria-label="Sign out">
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Sign in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Get started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
