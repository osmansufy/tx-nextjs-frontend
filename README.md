# Headless LMS - Next.js Frontend

A production-grade headless Learning Management System frontend, wired to a WordPress REST API backend (LMS plugin + JWT auth). Student-facing MVP: browse and search courses, enroll, take lessons, track progress, and manage your profile.

## Stack

- **Next.js 14** (App Router) + **TypeScript** (strict)
- **Tailwind CSS** + shadcn/ui-style primitives (`Button`, `Input`, `Card`, `Dialog`, `Skeleton`, `Badge`, `Progress`)
- **TanStack Query v5** for server state, caching, optimistic updates, and SSR hydration
- **Zustand v4** (with `persist`) for auth state, mirrored to a cookie for middleware route guards
- **Axios** singleton with request/response interceptors (Bearer JWT injection, 401/403 logout)
- **React Hook Form** + **Zod** for forms and validation
- **next-themes** for light/dark mode, **sonner** for toasts, **lucide-react** for icons
- **Prettier** (with `prettier-plugin-tailwindcss`), **ESLint** (Next preset), **Husky** + **lint-staged** for pre-commit

## Prerequisites

- Node.js **>= 18.18** (Next.js 14 requirement)
- npm 10+ (or your package manager of choice)
- A WordPress instance with the following plugins active:
  - The custom LMS plugin (e.g. `wp-lms-backend-rest-api`) exposing routes under `/wp-json/lms/v1`
  - **JWT Authentication for WP REST API** (e.g. [`jwt-authentication-for-wp-rest-api`](https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/)) configured with `JWT_AUTH_SECRET_KEY` and CORS enabled

## Quick start

```bash
git clone <your-repo-url>
cd tx-headless-frontend
cp .env.example .env.local      # then edit values
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_WP_API_URL` | Yes | Base URL of your WordPress install. **No trailing slash, no `/wp-json` suffix.** Example: `https://lms.example.com` |
| `NEXT_PUBLIC_SITE_URL` | Yes | Public URL of this Next app, used for canonical/OG metadata. Example: `http://localhost:3000` |
| `NEXT_PUBLIC_LMS_NAMESPACE` | No | Override the LMS REST namespace (defaults to `lms/v1`). |

The `NEXT_PUBLIC_WP_API_URL` host is also automatically added to `next.config.mjs` `images.remotePatterns` so `next/image` can render WP-hosted media.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server on port 3000 |
| `npm run build` | Production build |
| `npm start` | Run the production build |
| `npm run lint` / `lint:fix` | ESLint check / auto-fix |
| `npm run format` / `format:check` | Prettier write / check |
| `npm run typecheck` | `tsc --noEmit` |

## Routes

| Path | Auth | Notes |
| --- | --- | --- |
| `/` | Public | Marketing landing with SSR-prefetched featured courses |
| `/courses` | Public | Search + paginated grid of all courses |
| `/courses/[slug]` | Public | Course detail, curriculum, and Enroll CTA |
| `/login`, `/register`, `/forgot-password` | Public | Auth flows (forgot-password redirects to WP) |
| `/dashboard` | Protected | My enrolled courses + per-course progress |
| `/profile` | Protected | View + edit profile via `wp/v2/users/me` |
| `/learn/[courseId]/start` | Protected | Smart redirect to last-viewed or first lesson |
| `/learn/[courseId]/[lessonId]` | Protected | Full-screen lesson player with sidebar nav |

Route protection is enforced by [`src/middleware.ts`](src/middleware.ts), which checks the `lms_token` cookie set by the auth store. Authenticated users hitting `/login` or `/register` are bounced to `/dashboard`.

## Architecture

```
src/
├── app/
│   ├── (auth)/             login, register, forgot-password
│   ├── (marketing)/        public landing
│   ├── (student)/          courses, dashboard, profile (uses SiteShell)
│   ├── (learn)/            full-screen lesson player (no shell)
│   ├── providers.tsx       per-request QueryClient + ThemeProvider + Toaster
│   ├── layout.tsx          root layout, metadata, fonts
│   ├── error.tsx           top-level error boundary
│   └── not-found.tsx       404
├── components/
│   ├── ui/                 shadcn-style primitives
│   ├── auth/               login/register forms
│   ├── courses/            cards, grid, curriculum, enroll button, featured
│   ├── lessons/            lesson-player
│   ├── dashboard/          enrolled-course-card
│   └── layout/             header, footer, theme-toggle, site-shell
├── lib/
│   ├── api/
│   │   ├── client.ts       Axios singleton + interceptors
│   │   ├── endpoints.ts    Centralized URL map  <-- swap routes here
│   │   ├── error.ts        ApiError class + toApiError(...)
│   │   └── parsers.ts      pagination + WP entity decoding helpers
│   ├── services/           auth, courses, lessons, enrollment, progress, user
│   ├── hooks/              useAuth, useCourses, useEnrollments, useLessons, useDebounce
│   ├── stores/             auth.store.ts (Zustand + persist + cookie sync)
│   ├── schemas/            zod schemas
│   └── utils/              cn, format, query-keys
├── types/                  Course, Lesson, User, Enrollment, api
└── middleware.ts           route guard
```

### Data flow

```
UI (page/component)
  -> hooks (TanStack Query useQuery/useMutation)
    -> services (typed async functions)
      -> Axios client (interceptors inject JWT)
        -> WordPress REST API
```

`useAuthStore` is the only place auth state lives; the Axios request interceptor reads the persisted token directly from `localStorage` so it works in any module load order, and the response interceptor clears state + redirects on `401/403`.

## Adapting to your real LMS plugin

Because the public repo for `wp-lms-backend-rest-api` was unavailable, the LMS routes use the conventional namespace `lms/v1`. **All endpoint URLs live in one file** so you can rename them in seconds:

[`src/lib/api/endpoints.ts`](src/lib/api/endpoints.ts)

```ts
export const endpoints = {
  courses: {
    list: `${lms}/courses`,
    detail: (idOrSlug) => `${lms}/courses/${idOrSlug}`,
    curriculum: (idOrSlug) => `${lms}/courses/${idOrSlug}/curriculum`,
    progress: (id) => `${lms}/courses/${id}/progress`,
    // ...
  },
  enrollments: { create: `${lms}/enrollments`, me: `${lms}/enrollments/me`, ... },
  lessons: { detail: (id) => `${lms}/lessons/${id}`, complete: (id) => `${lms}/lessons/${id}/complete`, ... },
  // ...
};
```

If your plugin returns a different payload shape, adjust the `Raw*` interfaces and `normalize*` functions inside the matching `src/lib/services/*.ts` file. Each service is the only translation layer between WP-shaped data and the typed app domain models in `src/types/`.

If the namespace differs, set `NEXT_PUBLIC_LMS_NAMESPACE` (e.g. `mylms/v2`) instead of editing code.

## Auth flow

1. User submits the login form -> `useLogin` calls `POST /wp-json/jwt-auth/v1/token`.
2. On success, `useAuthStore.setSession` persists `{ token, user }` to `localStorage` (key `lms-auth`) and writes a 7-day `lms_token` cookie (`SameSite=Lax`).
3. Axios request interceptor reads the token from `localStorage` and adds `Authorization: Bearer <token>` to every request.
4. `middleware.ts` reads the `lms_token` cookie to guard `/dashboard`, `/learn`, `/profile`. Unauthenticated visitors are redirected to `/login?next=<path>`.
5. On any `401` or `403` from the API, the response interceptor clears auth state and bounces the user to `/login?reason=session`.

### Known trade-off: token storage

The JWT plugin returns the access token to the browser, so we store it in `localStorage` + a non-`HttpOnly` cookie. Pros: zero backend code in this repo, works with any WP host. Cons: the token is reachable by client-side JS (XSS exposure).

**Hardening path** (when you need it): add a thin BFF in this Next app under `src/app/api/auth/`. Have it call the JWT plugin server-side and set the token in an `HttpOnly`, `Secure`, `SameSite=Strict` cookie. Replace the Axios `request` interceptor with a server-only HTTP wrapper or proxy, and remove `localStorage` persistence. The hooks/services API surface won't change.

## What's implemented (MVP)

- Public marketing landing with SSR prefetch + client hydration of featured courses
- Course browse: search (debounced), pagination, skeletons, empty/error states
- Course detail: hero, curriculum, sticky enroll card with auth-aware CTA
- Enrollment with optimistic mutation and toast feedback
- Full-screen lesson player: sidebar nav, video/HTML content, mark-complete, prev/next, progress bar
- Auth: login, register (auto-login after register), logout, forgot-password (delegates to WP), middleware route guards
- Dashboard: enrolled courses with per-course progress
- Profile: view + edit name/email/bio/website via `wp/v2/users/me`
- Light/dark theme, toasts, error and 404 boundaries

## Out of scope for MVP (planned)

- Quizzes, assignments, certificates
- Instructor and admin dashboards
- Payments / checkout (Stripe / WooCommerce / WC Subscriptions)
- i18n via `next-intl`, PWA, push notifications
- Account deletion, password change, 2FA flows
- HttpOnly-cookie auth via Next Route Handlers (see hardening path above)

## License

Proprietary. Internal use.
# tx-nextjs-frontend
