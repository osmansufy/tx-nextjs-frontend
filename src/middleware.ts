import { NextResponse, type NextRequest } from "next/server";

const PROTECTED = [/^\/dashboard/, /^\/learn/, /^\/profile/];
const AUTH_ROUTES = [/^\/login/, /^\/register/];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("lms_token")?.value;

  if (token && AUTH_ROUTES.some((r) => r.test(pathname))) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (!PROTECTED.some((r) => r.test(pathname))) {
    return NextResponse.next();
  }

  if (token) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("next", pathname + (req.nextUrl.search || ""));
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/learn/:path*",
    "/profile/:path*",
    "/login",
    "/register",
  ],
};
