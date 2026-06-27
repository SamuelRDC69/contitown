# Contitown — Architecture Overview

> **Last updated:** 2026-06-27
> **Status:** MVP / Sprint 1 — core UI built, auth and DB integration pending

---

## 1. Project Summary

Contitown is a multi-town civic engagement platform. Each town gets its own hub where constituents can read local news, participate in polls, join discussions, attend politician AMAs, browse a marketplace, and discover local businesses.

The platform is built as a **monorepo** with a Next.js 16 web app, a shared component library, an auth package, a database client, and a shared config package. Data currently lives in static TypeScript files (mock data) with a Supabase PostgreSQL database schema ready for migration.

**Launch town:** Alcudia, Mallorca, Spain

---

## 2. Tech Stack

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| Framework | Next.js (App Router) | 16.2.9 | React Server Components, `generateStaticParams` |
| UI | React | 19.2.4 | Client components for interactivity |
| Styling | Tailwind CSS | v4 | PostCSS-based, `@tailwindcss/postcss` |
| Fonts | Geist Sans + Geist Mono | — | Loaded via `next/font/google` |
| ORM | Prisma | ^6.0.0 | Schema not yet generated (planned) |
| Database | Supabase (PostgreSQL) | 15.8.1 | Local dev via Docker Compose |
| Auth | NextAuth.js (Auth.js) | v5 beta | Stub implementation, not wired |
| Monorepo | npm workspaces + Turborepo | — | `apps/*` + `packages/*` |
| CI | GitHub Actions | — | Lint + typecheck + build on PR |
| Language | TypeScript | ^5 | Strict mode, bundler module resolution |
| Linting | ESLint + eslint-config-next | ^9 / v16 | Core Web Vitals + TypeScript rules |

---

## 3. Repository Structure

```
contitown/
├── apps/
│   └── web/                      # Next.js 16 application (the only app)
│       ├── src/
│       │   ├── app/              # App Router pages and layouts
│       │   │   ├── layout.tsx    # Root layout (Geist fonts, metadata)
│       │   │   ├── page.tsx      # Homepage (town directory + hero)
│       │   │   ├── globals.css   # Tailwind imports + global styles
│       │   │   └── [townSlug]/   # Dynamic town hub route
│       │   │       ├── page.tsx       # Server component (data fetching)
│       │   │       └── TownClient.tsx # Client component (tabs + UI)
│       │   ├── components/       # (Reserved for future shared components)
│       │   ├── data/             # Static/mock data (pre-DB)
│       │   │   ├── towns.ts      # Town definitions + types
│       │   │   └── content.ts    # News, discussions, votes, AMAs, marketplace, businesses
│       │   └── lib/              # (Reserved for utility functions)
│       ├── public/               # Static assets (SVGs)
│       ├── next.config.ts        # Next.js configuration (currently empty)
│       └── package.json
│
├── packages/
│   ├── ui/                       # Shared UI component library
│   │   └── src/
│   │       ├── index.ts          # Re-exports Button, Card, Badge
│   │       ├── button.tsx        # Button component
│   │       ├── card.tsx          # Card, CardHeader, CardBody, CardFooter
│   │       └── badge.tsx         # Badge component
│   │
│   ├── auth/                     # Authentication (NextAuth v5)
│   │   └── src/
│   │       ├── index.ts          # Auth config (JWT strategy, stub handlers)
│   │       └── react.tsx         # AuthProvider, useAuth hook
│   │
│   ├── db/                       # Database client (Prisma)
│   │   └── src/
│   │       ├── index.ts          # Re-exports PrismaClient
│   │       └── client.ts         # Singleton PrismaClient with dev hot-reload
│   │
│   └── config/                   # Shared configuration
│       └── src/
│           └── index.ts          # SITE_NAME, DATABASE_URL, SUPABASE_URL, etc.
│
├── supabase/
│   └── migrations/
│       └── 0001_initial_schema.sql  # Full DB schema (towns, users, memberships, posts, polls, etc.)
│
├── docker-compose.yml            # Local Supabase (Postgres + Studio)
├── .github/workflows/ci.yml      # CI pipeline
├── package.json                  # Root workspace config + scripts
├── tsconfig.json                 # Root TypeScript config
├── turbo.json                    # Turborepo task configuration
├── pnpm-workspace.yaml           # (Present but project uses npm workspaces)
├── sprint-1-stories.md           # Sprint 1 user stories & acceptance criteria
└── eslint.config.mjs             # Root ESLint config
```

---

## 4. Data Flow

### Current State (Mock Data)

```
Browser (Client)
    │
    ▼
Next.js Server Component (page.tsx)
    │  imports from @/data/towns and @/data/content
    │  filters by townSlug
    ▼
TownClient (Client Component)
    │  renders tabs: News, Vote, Discuss, AMAs, Marketplace, Businesses
    ▼
User interacts (tab switching, vote buttons — local state only)
```

Data is entirely static at this stage. No API calls, no database reads. The `page.tsx` server component imports mock arrays and passes them as props.

### Target State (Post-Sprint 1)

```
Browser (Client)
    │
    ▼
Next.js Middleware
    │  resolves town from subdomain or path
    │  attaches town context to request headers
    ▼
Server Component (page.tsx)
    │  calls Supabase via Prisma or server actions
    │  fetches town data + content by slug
    ▼
TownClient (Client Component)
    │  renders with real data
    ▼
Server Actions (future)
    │  handle mutations: create post, cast vote, submit comment
    ▼
Supabase (PostgreSQL + RLS)
```

---

## 5. Routing

| Route | Type | Description |
|-------|------|-------------|
| `/` | Server Component | Homepage with town directory, hero, feature grid |
| `/[townSlug]` | Dynamic | Town hub page (server fetches data, client renders tabs) |
| `/[townSlug]` | `generateStaticParams` | Pre-renders all 5 towns at build time |
| `/login` | (Planned) | NextAuth sign-in page |
| `/signup` | (Planned) | Registration page |
| `/profile` | (Planned) | User profile dashboard |
| `/users/[userId]` | (Planned) | Public user profile |

**Subdomain routing** (planned): `[townSlug].contitown.app` will resolve via middleware to the same `[townSlug]` route.

---

## 6. Authentication

Currently a **stub**. The `packages/auth` package defines:

- `authConfig` — JWT session strategy, `/login` as sign-in page
- `handlers`, `auth`, `signIn`, `signOut` — all return null stubs
- `AuthProvider` / `useAuth` — React context for client components

**Planned flow:**
1. User signs up via email/password or Google OAuth
2. NextAuth creates JWT session stored in httpOnly cookie
3. Middleware resolves town context + user membership
4. Server components use `auth()` to get session and conditionally render

See [docs/auth.md](./docs/auth.md) for full details.

---

## 7. Database

### Schema (from `supabase/migrations/0001_initial_schema.sql`)

**Core tables:**
- `towns` — town profiles (slug, name, state, population, description)
- `users` — user accounts (email, display_name, avatar_url, role)
- `memberships` — user-town join table (role: member/admin/owner)

**Content tables:**
- `posts` — news articles (town_id, author_id, title, body, category)
- `polls` / `poll_options` / `votes` — community voting
- `discussions` / `comments` — threaded discussions
- `listings` — marketplace items
- `businesses` — local business directory

**Supporting tables:**
- `notifications` — user notification feed
- `reports` — content moderation queue

**Indexes:** Foreign key indexes on all `town_id`, `user_id`, and `discussion_id` columns.

**Row Level Security:** Enabled on all tables. Current policies allow public reads; write policies need to be added before Sprint 1 auth integration.

See [docs/database.md](./docs/database.md) for full details.

---

## 8. Deployment

| Environment | Platform | Details |
|-------------|----------|---------|
| Production | Vercel | Next.js 16, automatic deployments from `main` |
| Database | Supabase Cloud | PostgreSQL with RLS, migrations applied via `prisma migrate deploy` |
| Local Dev | Docker Compose | `docker compose up -d` starts Postgres (port 54322) + Studio (port 54323) |
| CI | GitHub Actions | Lint, typecheck, and build on every PR to `main` |

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes (prod) | PostgreSQL connection string |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous key |
| `NEXTAUTH_SECRET` | Yes (auth) | JWT signing secret |
| `NEXTAUTH_URL` | Yes (auth) | Canonical app URL |
| `GOOGLE_CLIENT_ID` | OAuth | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | OAuth | Google OAuth client secret |
| `RESEND_API_KEY` | Email | Transactional email API key |

---

## 9. Design Decisions

### Why Next.js 16?
Latest App Router with React Server Components. `generateStaticParams` allows pre-rendering all town pages at build time for performance.

### Why a monorepo?
Separation of concerns: UI components, auth logic, database client, and config are isolated packages that can be tested and versioned independently. Future apps (mobile, admin) can reuse these packages.

### Why Supabase over raw PostgreSQL?
Built-in auth integration, real-time subscriptions, row-level security, and a managed Studio UI. The local Docker setup mirrors production.

### Why mock data first?
The UI and routing were built and validated before the database was ready. Sprint 1 stories will replace mock data with real Supabase queries.

### Why Tailwind v4?
CSS-first configuration, no `tailwind.config.js` needed. PostCSS plugin integrates cleanly with Next.js 16.

---

## 10. Current Limitations

- **No real authentication** — auth package is a stub, no login/signup pages exist yet
- **No database integration** — all data is static TypeScript, Prisma schema not yet generated
- **No server actions** — mutations (create post, vote, comment) are not implemented
- **No middleware** — town resolution happens in page params, not middleware
- **No tests** — no unit, integration, or E2E tests configured
- **No email** — transactional emails (invites, password reset) not configured
- **No file storage** — avatar uploads and business images not implemented
- **No real-time** — no WebSocket or Supabase Realtime subscriptions

---

## 11. Future Roadmap

| Phase | Focus |
|-------|-------|
| Sprint 1 | Auth (email + Google), town onboarding, subdomain routing, posts/news, basic profiles |
| Sprint 2 | Discussions, comments, notifications, file uploads |
| Sprint 3 | Marketplace, business directory, search |
| Sprint 4 | Mobile app (React Native), push notifications, real-time updates |
| Phase 2 | Multi-language, AI-powered content moderation, analytics dashboard |
