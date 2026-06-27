# Database

> Schema overview, Row Level Security policies, and migration guide for Contitown.

---

## 1. Overview

Contitown uses **Supabase** (PostgreSQL 15) as its database, accessed via **Prisma** ORM. The schema is defined in raw SQL in `supabase/migrations/0001_initial_schema.sql` and is applied automatically when starting the local database via Docker Compose.

**Status:** Schema defined, not yet applied to a live database. Prisma client not yet generated.

| Property | Value |
|----------|-------|
| Database | PostgreSQL 15.8.1 |
| ORM | Prisma ^6.0.0 |
| Local Dev | Docker Compose (Supabase Postgres + Studio) |
| Production | Supabase Cloud |
| Port (DB) | 54322 |
| Port (Studio) | 54323 |

---

## 2. Connection

### Local Development

```bash
npm run db:start     # Starts Postgres + Studio containers
npm run db:stop      # Stops containers
npm run db:reset     # Wipes data and restarts
```

The Docker Compose setup mounts `supabase/migrations/` into the container's `/docker-entrypoint-initdb.d` directory, so the initial schema runs automatically on first startup.

### Connection String

```
postgresql://postgres:postgres@localhost:54322/postgres
```

Set in `.env` as `DATABASE_URL`.

### Prisma

```bash
npm run db:generate   # Generate Prisma client from schema
npm run db:migrate    # Apply migrations
npm run db:seed       # Run seed script
```

The Prisma schema lives at `packages/db/prisma/schema.prisma` (not yet created — needs to be written to match the SQL schema).

---

## 3. Schema

### Entity Relationship Diagram

```
┌──────────┐     ┌──────────────┐     ┌──────────┐
│  towns   │────<│ memberships  │>────│  users   │
└────┬─────┘     └──────────────┘     └────┬─────┘
     │                                      │
     │  ┌──────────┐  ┌─────────┐  ┌───────┴────────┐
     ├─<│  posts    │  │ polls   │>─│ poll_options   │
     │  └──────────┘  └────┬────┘  └───────┬────────┘
     │                      │               │
     │  ┌──────────────┐   │          ┌────┴────┐
     ├─<│ discussions  │   │          │  votes  │
     │  └──────┬───────┘   │          └─────────┘
     │         │           │
     │  ┌──────┴───────┐   │
     ├─<│   comments   │<──┘
     │  └──────────────┘
     │
     │  ┌──────────────┐  ┌──────────────┐
     ├─<│  listings    │  │  businesses  │
     │  └──────────────┘  └──────────────┘
     │
     │  ┌──────────────────┐  ┌──────────────┐
     └─<│  notifications   │  │   reports    │
        └──────────────────┘  └──────────────┘
```

### Tables

#### Core Tables

**towns** — Town profiles (one per community)

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | TEXT | PK | Unique identifier |
| slug | TEXT | UNIQUE | URL-friendly identifier (e.g., "alcudia") |
| name | TEXT | NOT NULL | Display name |
| state | TEXT | NOT NULL | State/region |
| population | INTEGER | DEFAULT 0 | Population count |
| description | TEXT | DEFAULT '' | Town description |
| heroImage | TEXT | DEFAULT '' | Hero image path |
| createdAt | TIMESTAMP | DEFAULT now() | Creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL | Last update |

**users** — User accounts

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | TEXT | PK | Unique identifier |
| email | TEXT | UNIQUE, NOT NULL | Login email |
| displayName | TEXT | NOT NULL | Display name |
| avatarUrl | TEXT | nullable | Profile picture URL |
| createdAt | TIMESTAMP | DEFAULT now() | Creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL | Last update |

**memberships** — User-town join table (many-to-many)

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | TEXT | PK | Unique identifier |
| userId | TEXT | FK → users.id, CASCADE | User reference |
| townId | TEXT | FK → towns.id, CASCADE | Town reference |
| role | MembershipRole | DEFAULT 'resident' | resident / business_owner / moderator / admin |
| createdAt | TIMESTAMP | DEFAULT now() | Join date |

Unique constraint on (userId, townId) — one membership per user per town.

#### Content Tables

**posts** — News articles and announcements

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | TEXT | PK | Unique identifier |
| townId | TEXT | FK → towns.id, CASCADE | Owning town |
| authorId | TEXT | FK → users.id, CASCADE | Author |
| title | TEXT | NOT NULL | Article title |
| body | TEXT | NOT NULL | Full article content |
| excerpt | TEXT | DEFAULT '' | Short summary |
| category | TEXT | DEFAULT 'community' | Article category |
| status | PostStatus | DEFAULT 'published' | draft / published / archived |
| createdAt | TIMESTAMP | DEFAULT now() | Publish date |
| updatedAt | TIMESTAMP | NOT NULL | Last edit |

**polls** — Community voting polls

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | TEXT | PK | Unique identifier |
| townId | TEXT | FK → towns.id, CASCADE | Owning town |
| question | TEXT | NOT NULL | Poll question |
| description | TEXT | DEFAULT '' | Additional context |
| category | TEXT | DEFAULT 'General' | Poll category |
| status | PollStatus | DEFAULT 'open' | open / closed / upcoming |
| closesAt | TIMESTAMP | nullable | Auto-close timestamp |
| createdAt | TIMESTAMP | DEFAULT now() | Creation date |
| updatedAt | TIMESTAMP | NOT NULL | Last update |

**poll_options** — Answer choices for polls

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | TEXT | PK | Unique identifier |
| pollId | TEXT | FK → polls.id, CASCADE | Parent poll |
| label | TEXT | NOT NULL | Option text |
| sortOrder | INTEGER | DEFAULT 0 | Display order |
| createdById | TEXT | FK → users.id, SET NULL | Creator |
| createdAt | TIMESTAMP | DEFAULT now() | Creation date |

**votes** — Individual votes on poll options

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | TEXT | PK | Unique identifier |
| pollOptionId | TEXT | FK → poll_options.id, CASCADE | Chosen option |
| userId | TEXT | FK → users.id, CASCADE | Voter |
| createdAt | TIMESTAMP | DEFAULT now() | Vote timestamp |

Unique constraint on (pollOptionId, userId) — one vote per user per option.

**discussions** — Threaded forum discussions

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | TEXT | PK | Unique identifier |
| townId | TEXT | FK → towns.id, CASCADE | Owning town |
| authorId | TEXT | FK → users.id, CASCADE | Author |
| title | TEXT | NOT NULL | Discussion title |
| body | TEXT | NOT NULL | Initial post content |
| tags | TEXT[] | DEFAULT '{}' | Array of tags |
| createdAt | TIMESTAMP | DEFAULT now() | Creation date |
| updatedAt | TIMESTAMP | NOT NULL | Last update |

**comments** — Replies on posts or discussions (supports threading)

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | TEXT | PK | Unique identifier |
| body | TEXT | NOT NULL | Comment text |
| authorId | TEXT | FK → users.id, CASCADE | Author |
| postId | TEXT | FK → posts.id, CASCADE, nullable | Parent post (if reply to post) |
| discussionId | TEXT | FK → discussions.id, CASCADE, nullable | Parent discussion (if reply to discussion) |
| parentId | TEXT | FK → comments.id, CASCADE, nullable | Parent comment (for threading) |
| createdAt | TIMESTAMP | DEFAULT now() | Creation date |
| updatedAt | TIMESTAMP | NOT NULL | Last edit |

A comment must have at least one of: postId, discussionId, or parentId.

**listings** — Marketplace items

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | TEXT | PK | Unique identifier |
| townId | TEXT | FK → towns.id, CASCADE | Owning town |
| sellerId | TEXT | FK → users.id, CASCADE | Seller |
| title | TEXT | NOT NULL | Item title |
| description | TEXT | DEFAULT '' | Item description |
| price | INTEGER | DEFAULT 0 | Price in cents |
| category | ListingCategory | NOT NULL | goods / services / housing / jobs |
| postedAt | TIMESTAMP | DEFAULT now() | Listing date |
| updatedAt | TIMESTAMP | NOT NULL | Last update |

**businesses** — Local business directory

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | TEXT | PK | Unique identifier |
| townId | TEXT | FK → towns.id, CASCADE | Owning town |
| ownerId | TEXT | FK → users.id, SET NULL, nullable | Business owner |
| name | TEXT | NOT NULL | Business name |
| category | TEXT | NOT NULL | Business category |
| description | TEXT | DEFAULT '' | Description |
| phone | TEXT | DEFAULT '' | Contact phone |
| website | TEXT | DEFAULT '' | Website URL |
| featured | BOOLEAN | DEFAULT false | Featured listing flag |
| createdAt | TIMESTAMP | DEFAULT now() | Creation date |
| updatedAt | TIMESTAMP | NOT NULL | Last update |

#### Supporting Tables

**notifications** — User notification feed

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | TEXT | PK | Unique identifier |
| userId | TEXT | FK → users.id, CASCADE | Recipient |
| type | NotificationType | NOT NULL | mention / reply / vote_result / new_post / new_poll / new_listing / system |
| title | TEXT | NOT NULL | Notification title |
| body | TEXT | DEFAULT '' | Notification content |
| read | BOOLEAN | DEFAULT false | Read status |
| linkUrl | TEXT | nullable | Deep link URL |
| createdAt | TIMESTAMP | DEFAULT now() | Creation date |

**reports** — Content moderation queue

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | TEXT | PK | Unique identifier |
| reporterId | TEXT | FK → users.id, CASCADE | Reporting user |
| townId | TEXT | FK → towns.id, CASCADE | Related town |
| reason | ReportReason | NOT NULL | spam / harassment / misinformation / inappropriate / other |
| description | TEXT | DEFAULT '' | Report details |
| status | ReportStatus | DEFAULT 'open' | open / reviewing / resolved / dismissed |
| targetType | TEXT | NOT NULL | Type of reported content (post, comment, etc.) |
| targetId | TEXT | NOT NULL | ID of reported content |
| createdAt | TIMESTAMP | DEFAULT now() | Report date |
| updatedAt | TIMESTAMP | NOT NULL | Last update |

---

## 4. Enums

| Enum | Values |
|------|--------|
| MembershipRole | resident, business_owner, moderator, admin |
| PostStatus | draft, published, archived |
| PollStatus | open, closed, upcoming |
| ListingCategory | goods, services, housing, jobs |
| ReportStatus | open, reviewing, resolved, dismissed |
| ReportReason | spam, harassment, misinformation, inappropriate, other |
| NotificationType | mention, reply, vote_result, new_post, new_poll, new_listing, system |

---

## 5. Indexes

| Table | Index | Type |
|-------|-------|------|
| towns | slug | UNIQUE |
| users | email | UNIQUE |
| memberships | (userId, townId) | UNIQUE |
| memberships | townId | INDEX |
| posts | (townId, status) | INDEX |
| polls | (townId, status) | INDEX |
| poll_options | pollId | INDEX |
| votes | (pollOptionId, userId) | UNIQUE |
| discussions | townId | INDEX |
| comments | postId | INDEX |
| comments | discussionId | INDEX |
| listings | (townId, category) | INDEX |
| businesses | townId | INDEX |
| notifications | (userId, read) | INDEX |
| reports | (townId, status) | INDEX |

---

## 6. Row Level Security (RLS)

RLS is **enabled** on all tables. Current policies:

- **Public reads** — All tables allow SELECT for anon/authenticated roles
- **Write policies** — NOT YET DEFINED. Must be added before Sprint 1 auth integration

### Planned Policies (Sprint 1)

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| towns | public | admin | admin | none |
| users | public | self (signup) | self | none |
| memberships | public | self | admin | admin |
| posts | public | authenticated | author | author/admin |
| polls | public | authenticated | author | author/admin |
| poll_options | public | authenticated | author | author |
| votes | public | self (one per user) | none | self |
| discussions | public | authenticated | author | author/admin |
| comments | public | authenticated | author | author/admin |
| listings | public | authenticated | seller | seller/admin |
| businesses | public | authenticated | owner/admin | admin |
| notifications | owner only | system | owner (mark read) | owner |
| reports | reporter + admin | authenticated | admin | admin |

---

## 7. Migration Guide

### Creating a New Migration

1. Update `supabase/migrations/0001_initial_schema.sql` (or add a new numbered file)
2. For local dev: `npm run db:reset` to restart with fresh schema
3. For production: Use Supabase Dashboard or `prisma migrate deploy`

### Prisma Workflow

```bash
# 1. Write/update the Prisma schema at packages/db/prisma/schema.prisma
# 2. Generate the client
npm run db:generate

# 3. Create and apply migration
npm run db:migrate

# 4. (Optional) Seed the database
npm run db:seed
```

### Seed Data

The seed script (`packages/db/src/seed.ts`) should populate:
- 5 towns (matching `apps/web/src/data/towns.ts`)
- Sample users with memberships
- Sample posts, polls, discussions, listings, businesses
- Sample comments and votes

---

## 8. Data Access Pattern

### Current (Mock Data)

Data is read from static TypeScript files in `apps/web/src/data/`:
- `towns.ts` — Town definitions and types
- `content.ts` — News, discussions, votes, AMAs, marketplace, businesses

### Target (Post-Sprint 1)

```typescript
// Server Component
import { prisma } from "@contitown/db";

export default async function TownPage({ params }) {
  const town = await prisma.town.findUnique({
    where: { slug: params.townSlug },
    include: {
      posts: { where: { status: "published" } },
      polls: { where: { status: "open" } },
      // ...
    },
  });
  // ...
}
```

### Client-Side Mutations (Future)

Will use Next.js Server Actions:
```typescript
// apps/web/src/app/actions.ts
"use server";
import { prisma } from "@contitown/db";
import { auth } from "@contitown/auth";

export async function castVote(pollOptionId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return prisma.vote.create({
    data: { pollOptionId, userId: session.user.id },
  });
}
```
