# API Reference

> Server actions, API routes, and middleware behavior for Contitown.

---

## 1. Overview

Contitown uses **Next.js 16 App Router** with React Server Components. The current implementation uses static mock data with no server actions or API routes. This document describes the planned API architecture.

**Status:** Sprint 1 — server actions and API routes are planned but not yet implemented.

---

## 2. Routing Architecture

### Path-Based Routing

All town pages use path-based routing: `/[townSlug]`

| Route | Type | Auth Required | Description |
|-------|------|---------------|-------------|
| `/` | Server Component | No | Homepage with town directory |
| `/[townSlug]` | Server Component | No | Town hub (news, polls, discussions, etc.) |
| `/login` | Client Component | No | Sign-in page (planned) |
| `/signup` | Client Component | No | Registration page (planned) |
| `/profile` | Server Component | Yes | User profile dashboard (planned) |
| `/users/[userId]` | Server Component | No | Public user profile (planned) |

### Subdomain Routing (Planned)

In production, towns will be accessible via subdomain: `[townSlug].contitown.app`

The middleware will resolve the subdomain to a town slug and rewrite the request internally.

### Static Generation

All town pages are pre-rendered at build time via `generateStaticParams`:

```typescript
export function generateStaticParams() {
  return towns.map((t) => ({ townSlug: t.slug }));
});
```

This produces static HTML for all 5 towns at build time. When the database is integrated, this will use ISR (Incremental Static Regeneration) with `revalidate`.

---

## 3. Middleware

### Current State

The file `apps/web/src/proxy.ts` contains middleware logic but is **not wired** as the active middleware. There is no `src/middleware.ts` file.

The proxy middleware:
1. Skips system routes (`/create-town`, `/invite`, `/join`, `/profile`, `/login`, `/signup`)
2. Skips static assets and API routes
3. Sets `x-town-slug` header for town path resolution

### Planned Middleware (`src/middleware.ts`)

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SYSTEM_ROUTES = ["create-town", "invite", "join", "profile", "login", "signup"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip system routes
  const firstSegment = pathname.split("/").filter(Boolean)[0] || "";
  if (SYSTEM_ROUTES.includes(firstSegment)) {
    return NextResponse.next();
  }

  // 2. Skip static assets and API
  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".")) {
    return NextResponse.next();
  }

  // 3. Resolve town from subdomain (production) or path (dev)
  const hostname = request.headers.get("host") || "";
  const townSlug = resolveTownSlug(hostname, firstSegment);

  // 4. Attach town context to request headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-town-slug", townSlug);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

function resolveTownSlug(hostname: string, pathSegment: string): string {
  // Production: alcudia.contitown.app → "alcudia"
  if (hostname.endsWith(".contitown.app")) {
    return hostname.split(".")[0];
  }
  // Dev: localhost:3000/alcudia → "alcudia"
  return pathSegment;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
```

### Auth Middleware (Planned)

Will protect routes that require authentication:

```typescript
import { auth } from "@contitown/auth";

export const config = {
  matcher: ["/profile/:path*", "/api/protected/:path*"],
};

export default auth((req) => {
  if (!req.auth) {
    const url = new URL("/login", req.nextUrl.origin);
    return Response.redirect(url);
  }
});
```

---

## 4. Server Actions

Server actions handle mutations from client components. They run on the server and can access the database directly.

### Location

`apps/web/src/app/actions.ts` (planned)

### Actions

#### Content Actions

**createPost** — Create a news article or announcement

```typescript
"use server";
import { prisma } from "@contitown/db";
import { auth } from "@contitown/auth";
import { revalidatePath } from "next/cache";

export async function createPost(data: {
  townId: string;
  title: string;
  body: string;
  excerpt?: string;
  category?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const post = await prisma.post.create({
    data: {
      townId: data.townId,
      authorId: session.user.id,
      title: data.title,
      body: data.body,
      excerpt: data.excerpt || "",
      category: data.category || "community",
      status: "published",
    },
  });

  revalidatePath(`/${data.townId}`);
  return post;
}
```

**castVote** — Cast a vote on a poll option

```typescript
"use server";
import { prisma } from "@contitown/db";
import { auth } from "@contitown/auth";

export async function castVote(pollOptionId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Check if user already voted on this poll
  const option = await prisma.pollOption.findUnique({
    where: { id: pollOptionId },
    include: { poll: true },
  });

  if (!option) throw new Error("Poll option not found");

  const existingVote = await prisma.vote.findUnique({
    where: {
      pollOptionId_userId: {
        pollOptionId,
        userId: session.user.id,
      },
    },
  });

  if (existingVote) {
    // Remove vote (toggle behavior)
    await prisma.vote.delete({ where: { id: existingVote.id } });
    return { action: "removed" };
  }

  // Cast vote
  const vote = await prisma.vote.create({
    data: {
      pollOptionId,
      userId: session.user.id,
    },
  });

  return { action: "created", vote };
}
```

**createDiscussion** — Start a new discussion thread

```typescript
"use server";
import { prisma } from "@contitown/db";
import { auth } from "@contitown/auth";
import { revalidatePath } from "next/cache";

export async function createDiscussion(data: {
  townId: string;
  title: string;
  body: string;
  tags?: string[];
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const discussion = await prisma.discussion.create({
    data: {
      townId: data.townId,
      authorId: session.user.id,
      title: data.title,
      body: data.body,
      tags: data.tags || [],
    },
  });

  revalidatePath(`/${data.townId}`);
  return discussion;
}
```

**addComment** — Reply to a post, discussion, or another comment

```typescript
"use server";
import { prisma } from "@contitown/db";
import { auth } from "@contitown/auth";
import { revalidatePath } from "next/cache";

export async function addComment(data: {
  body: string;
  postId?: string;
  discussionId?: string;
  parentId?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const comment = await prisma.comment.create({
    data: {
      body: data.body,
      authorId: session.user.id,
      postId: data.postId,
      discussionId: data.discussionId,
      parentId: data.parentId,
    },
  });

  // Create notification for content author
  await createNotificationForReply(comment);

  revalidatePath(`/[townSlug]`);
  return comment;
}
```

**createListing** — Post a marketplace listing

```typescript
"use server";
import { prisma } from "@contitown/db";
import { auth } from "@contitown/auth";
import { revalidatePath } from "next/cache";

export async function createListing(data: {
  townId: string;
  title: string;
  description: string;
  price: number;
  category: "goods" | "services" | "housing" | "jobs";
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const listing = await prisma.listing.create({
    data: {
      townId: data.townId,
      sellerId: session.user.id,
      title: data.title,
      description: data.description,
      price: data.price,
      category: data.category,
    },
  });

  revalidatePath(`/${data.townSlug}`);
  return listing;
}
```

#### Auth Actions

**signUp** — Register a new user

```typescript
"use server";
import { prisma } from "@contitown/db";
import { signIn } from "@contitown/auth";

export async function signUp(data: {
  email: string;
  password: string;
  displayName: string;
  townSlug: string;
}) {
  // 1. Create user in database
  const user = await prisma.user.create({
    data: {
      email: data.email,
      displayName: data.displayName,
    },
  });

  // 2. Create membership
  const town = await prisma.town.findUnique({ where: { slug: data.townSlug } });
  if (town) {
    await prisma.membership.create({
      data: {
        userId: user.id,
        townId: town.id,
        role: "resident",
      },
    });
  }

  // 3. Sign in
  await signIn("credentials", {
    email: data.email,
    password: data.password,
    redirectTo: `/${data.townSlug}`,
  });

  return user;
}
```

#### Moderation Actions

**reportContent** — Report inappropriate content

```typescript
"use server";
import { prisma } from "@contitown/db";
import { auth } from "@contitown/auth";

export async function reportContent(data: {
  townId: string;
  targetType: string;
  targetId: string;
  reason: "spam" | "harassment" | "misinformation" | "inappropriate" | "other";
  description?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  return prisma.report.create({
    data: {
      reporterId: session.user.id,
      townId: data.townId,
      targetType: data.targetType,
      targetId: data.targetId,
      reason: data.reason,
      description: data.description || "",
      status: "open",
    },
  });
}
```

---

## 5. API Routes

### Auth Routes (NextAuth v5)

NextAuth v5 automatically creates these routes when handlers are wired:

| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth/signin` | GET | Sign-in page |
| `/api/auth/signin/[provider]` | POST | OAuth sign-in |
| `/api/auth/signout` | POST | Sign out |
| `/api/auth/callback/[provider]` | GET | OAuth callback |
| `/api/auth/session` | GET | Current session |
| `/api/auth/csrf` | GET | CSRF token |
| `/api/auth/providers` | GET | Available providers |

### Custom API Routes (Planned)

| Route | Method | Auth | Description |
|-------|--------|------|-------------|
| `/api/towns` | GET | No | List all towns |
| `/api/towns/[slug]` | GET | No | Get town details |
| `/api/towns/[slug]/feed` | GET | No | Aggregated town feed |
| `/api/notifications` | GET | Yes | User notifications |
| `/api/notifications/[id]/read` | PATCH | Yes | Mark notification read |
| `/api/search` | GET | No | Search across content |

### Example: Town Feed API

```typescript
// apps/web/src/app/api/towns/[slug]/feed/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@contitown/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const town = await prisma.town.findUnique({ where: { slug } });

  if (!town) {
    return NextResponse.json({ error: "Town not found" }, { status: 404 });
  }

  const [posts, polls, discussions] = await Promise.all([
    prisma.post.findMany({
      where: { townId: town.id, status: "published" },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.poll.findMany({
      where: { townId: town.id, status: "open" },
      orderBy: { createdAt: "desc" },
    }),
    prisma.discussion.findMany({
      where: { townId: town.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  return NextResponse.json({ town, posts, polls, discussions });
}
```

---

## 6. Data Fetching Pattern

### Server Components (Default)

```typescript
// apps/web/src/app/[townSlug]/page.tsx
import { prisma } from "@contitown/db";

export default async function TownPage({
  params,
}: {
  params: Promise<{ townSlug: string }>;
}) {
  const { townSlug } = await params;
  const town = await prisma.town.findUnique({
    where: { slug: townSlug },
    include: {
      posts: { where: { status: "published" }, orderBy: { createdAt: "desc" } },
      polls: { where: { status: "open" } },
      discussions: { orderBy: { createdAt: "desc" } },
      listings: { orderBy: { postedAt: "desc" } },
      businesses: { where: { featured: true } },
    },
  });

  if (!town) notFound();

  return <TownClient town={town} />;
}
```

### Client Components (with Server Actions)

```typescript
"use client";
import { castVote } from "@/app/actions";

export function VoteButton({ pollOptionId }: { pollOptionId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => castVote(pollOptionId))}
      disabled={pending}
    >
      {pending ? "Voting..." : "Vote"}
    </button>
  );
}
```

### Revalidation

After mutations, revalidate cached pages:

```typescript
import { revalidatePath } from "next/cache";

// Revalidate a specific path
revalidatePath("/alcudia");

// Revalidate all town pages
revalidatePath("/[townSlug]", "layout");

// Tag-based revalidation (ISR)
import { revalidateTag } from "next/cache";
revalidateTag("town-feed");
```

---

## 7. Error Handling

### Not Found

```typescript
import { notFound } from "next/navigation";

const town = await prisma.town.findUnique({ where: { slug } });
if (!town) notFound(); // Renders not-found.tsx
```

### Error Boundaries

```typescript
// apps/web/src/app/error.tsx
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

### API Error Responses

```typescript
// Standard error format
return NextResponse.json(
  { error: "Unauthorized", message: "You must be logged in" },
  { status: 401 }
);
```

---

## 8. Rate Limiting (Planned)

API routes will use rate limiting to prevent abuse:

| Endpoint | Limit |
|----------|-------|
| `/api/auth/*` | 10 req/min |
| `/api/towns/*/feed` | 60 req/min |
| Server actions (mutations) | 30 req/min |
| `/api/search` | 20 req/min |

Implementation: In-memory rate limiter (development) or Upstash Redis (production).
