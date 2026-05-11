# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # dev server (localhost:3000)
npm run build        # production build
npm run lint         # ESLint check
npm run lint:fix     # ESLint auto-fix
npm run format       # Prettier write
npm run format:check # Prettier check
npm run typecheck    # tsc --noEmit (no emit, type-check only)
```

No tests are configured yet. Pre-commit hook runs lint-staged (lint + format on staged files).

## Environment

Copy `.env.example` to `.env.local`. Required:
- `NEXT_PUBLIC_WP_API_URL` — WordPress base URL, no trailing slash, no `/wp-json`
- `NEXT_PUBLIC_SITE_URL` — this app's public URL

Optional:
- `NEXT_PUBLIC_LMS_NAMESPACE` — defaults to `lms/v1` in code **but must be `lms-backend/v1`** for the real backend (see P0 gap below)

## Key conventions

- **Path alias:** `@/` maps to `src/`. Use it for all internal imports.
- **Class merging:** `cn(...classes)` from `src/lib/utils/cn.ts` — wraps `clsx` + `tailwind-merge`. Use for all conditional Tailwind class composition.
- **`next/image` hosts:** `next.config.mjs` auto-adds `NEXT_PUBLIC_WP_API_URL`'s hostname to `remotePatterns`, plus `secure.gravatar.com` and `*.wp.com`. Any other image host (CDN, etc.) must be added there manually.

## Architecture

### Route groups

| Group | Path | Notes |
|---|---|---|
| `(marketing)` | `/` | Public landing, SSR |
| `(auth)` | `/login`, `/register`, `/forgot-password` | Redirects to `/dashboard` if already authed |
| `(student)` | `/courses`, `/dashboard`, `/profile` | Protected, uses `SiteShell` layout |
| `(learn)` | `/learn/[courseId]/[lessonId]` | Full-screen player, no shell |

Middleware (`src/middleware.ts`) guards `/dashboard`, `/learn`, `/profile` by checking the `lms_token` cookie. Authenticated users hitting `/login` or `/register` are bounced to `/dashboard`.

### Data flow

```
UI (page/component)
  → hooks/ (TanStack Query useQuery/useMutation)
    → services/ (typed async functions)
      → src/lib/api/client.ts (Axios singleton, injects Bearer token from localStorage)
        → WordPress REST API
```

**All endpoint URLs live in one file:** `src/lib/api/endpoints.ts`. Swap routes there, not in services.

**Services** (`src/lib/services/`) are the only translation layer between WP-shaped data and domain types in `src/types/`. Each service owns its own `normalize*` functions.

**Parsers** (`src/lib/api/parsers.ts`) provide two utilities:
- `paginate()` — tolerates both `X-WP-Total`/`X-WP-TotalPages` headers (native WP endpoints) and envelope `{ items, total, total_pages }` (custom LMS endpoints). Use for all list responses.
- `decodeEntities()` — WP returns HTML entities in rendered title/excerpt fields (`&amp;`, `&#8217;`, etc.). Call this on any string field coming from a WP rendered object before displaying.

**Query keys** are centralized in `src/lib/utils/query-keys.ts`. Always use these constants — do not inline strings in `useQuery`/`useMutation` calls.

**Error handling** — all Axios errors are converted to `ApiError` (from `src/lib/api/error.ts`) by the response interceptor. Catch as `ApiError` in components; check `.code` for WP error codes (e.g. `lms_auth_failed`, `lms_already_enrolled`) and `.status` for HTTP status.

### Auth state

`useAuthStore` (Zustand + `persist`) stores `{ token, user }` in `localStorage` under key `lms-auth`. On `setSession`, it also writes a 7-day `lms_token` cookie (non-httpOnly, `SameSite=Lax`) so `middleware.ts` can read it server-side.

The Axios request interceptor reads the token from `localStorage` directly and sets `Authorization: Bearer`. The response interceptor clears auth state and redirects to `/login` on `401`/`403`.

### Providers

`src/app/providers.tsx` mounts a per-request `QueryClient` + `ThemeProvider` + `Toaster`. TanStack Query DevTools are included (development only).

## Critical gap: current code vs. real backend

The scaffold was wired to a different LMS plugin. **These mismatches will produce 404s against the real backend** (`lms-backend-rest-api`):

| What the code does | What the real backend expects |
|---|---|
| Namespace `lms/v1` (env default) | `lms-backend/v1` |
| Auth via `POST /jwt-auth/v1/token` | `POST /lms-backend/v1/auth/login` → returns `{ access_token, refresh_token, expires_in, user }` |
| `POST /wp/v2/users/register` | `POST /lms-backend/v1/auth/register` |
| `GET /wp/v2/users/me` | `GET /lms-backend/v1/users/me` |
| Lessons at `/lms/v1/lessons/{id}` | Units at `/lms-backend/v1/units/{id}` |
| Flat `data` array assumed | Envelope `{ success, data: { items, total, … } }` on all responses |

**P0 work needed before any feature work:**
1. Fix `src/lib/env.ts` default namespace to `lms-backend/v1`
2. Rebuild `src/lib/api/endpoints.ts` against real auth + unit routes (see `PROJECT_PLAN.md §4.2`)
3. Add response-unwrap interceptor to `src/lib/api/client.ts` for `{ success, data }` envelope
4. Rename `lessons` → `units` across services/hooks/components/routes

## Planned BFF pattern (not yet implemented)

`PROJECT_PLAN.md` specifies migrating to a BFF proxy where Next.js API routes (`src/app/api/`) set **httpOnly cookies** for tokens, eliminating client-side token exposure. Until that lands, tokens live in `localStorage` + non-httpOnly cookie. Do not remove the cookie-mirroring in `auth.store.ts` — `middleware.ts` depends on it.

When implementing BFF routes: `proxyToWP()` utility reads the httpOnly `access_token` cookie, calls WP with `Authorization: Bearer`, auto-refreshes on 401, and unwraps the `{ success, data }` envelope before returning to the client. See `PROJECT_PLAN.md §4.4` for the full token flow and cookie naming contract.

## API reference

`API_REFERENCE.md` is the authoritative, verified contract for the `lms-backend/v1` backend plugin. Use it when wiring new endpoints — `PROJECT_PLAN.md §4.2` has the full endpoint map.

Backend plugin repo: `https://github.com/Codezen-technology/wp-lms-backend-rest-api`
Live reference site: `https://trainingexcellence.org.uk`
