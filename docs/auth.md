# Authentication

> Auth flow, session strategy, and provider configuration for Contitown.

---

## 1. Overview

Contitown uses **NextAuth.js v5** (Auth.js) for authentication. The current implementation is a **stub** — the configuration and React context are in place but not wired to actual providers or pages.

**Status:** Sprint 1 — implementation in progress

---

## 2. Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                               │
│                                                             │
│  ┌─────────────┐    ┌──────────────┐    ┌───────────────┐  │
│  │ Login Page   │    │ Signup Page  │    │ OAuth Popup   │  │
│  │ /login       │    │ /signup      │    │ Google        │  │
│  └──────┬───────┘    └──────┬───────┘    └──────┬────────┘  │
│         │                   │                   │           │
│         └───────────────────┼───────────────────┘           │
│                             │                               │
│                    POST /api/auth/*                          │
└─────────────────────────────┼───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    NextAuth.js v5                            │
│                                                             │
│  ┌─────────────┐    ┌──────────────┐    ┌───────────────┐  │
│  │ Credentials  │    │ Google OAuth │    │ JWT Session   │  │
│  │ Provider     │    │ Provider     │    │ Strategy      │  │
│  └──────┬───────┘    └──────┬───────┘    └──────┬────────┘  │
│         │                   │                   │           │
│         └───────────────────┼───────────────────┘           │
│                             │                               │
│                    bcrypt password verify                    │
│                    create/update user in DB                  │
│                             │                               │
│                    sign JWT → httpOnly cookie                │
└─────────────────────────────┼───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Middleware                                │
│                                                             │
│  1. Read session cookie                                     │
│  2. Resolve town from subdomain or path                      │
│  3. Load user membership for this town                       │
│  4. Attach town + user context to request headers            │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Server Components                         │
│                                                             │
│  - auth() returns session or null                           │
│  - Conditional rendering based on auth state                │
│  - Server actions verify session before mutations           │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Session Strategy

**JWT-based sessions** stored in an httpOnly cookie.

```typescript
// packages/auth/src/index.ts
session: { strategy: "jwt" }
```

### Session Payload

```typescript
{
  sub: "user-uuid",          // User ID (from DB)
  email: "user@example.com",
  name: "Display Name",
  picture: "https://...",    // Avatar URL
  iat: 1719000000,
  exp: 1719600000            // 7 days (or 30 with "remember me")
}
```

### Session Duration

| Scenario | Duration |
|----------|----------|
| Default | 7 days |
| "Remember me" checked | 30 days |
| After password change | All sessions invalidated |

---

## 4. Providers

### Email/Password (Credentials)

- User submits email + password on `/login` or `/signup`
- Server verifies against `users` table (bcrypt hash comparison)
- On success: creates session, redirects to intended page
- On failure: generic error "Invalid email or password" (no enumeration)

### Google OAuth 2.0

- "Continue with Google" button on `/login` and `/signup`
- First login: auto-creates account with email + avatar from Google
- Returning user: matched by email, logged in
- Account linking: if Google email matches existing email account, offer to link

---

## 5. Auth Flows

### Sign Up

```
1. User visits /signup
2. Fills: display name, email, password, confirm password
3. Client validation: email format, password strength (8+ chars, 1 number)
4. POST to server action: createUser({ displayName, email, password })
5. Server: hash password (bcrypt, cost 12), insert into users table
6. Auto-login: create session, set cookie
7. Redirect to / (homepage) or intended destination
```

### Login

```
1. User visits /login
2. Fills: email, password (+ optional "remember me")
3. POST to server action: authenticateUser({ email, password })
4. Server: look up user, verify bcrypt hash
5. On success: create JWT session, set httpOnly cookie
6. On failure: return generic error (prevent user enumeration)
7. Redirect to intended page or home
```

### Password Reset

```
1. User clicks "Forgot password?" on /login
2. Enters email
3. Server: if user exists, generate reset token (single-use, 1-hour expiry)
4. Send email via Resend with reset link: /reset-password?token=...
5. User clicks link, enters new password
6. Server: verify token, hash new password, update user, invalidate all sessions
7. Redirect to /login with success message
```

### Logout

```
1. User clicks "Log out" in navigation menu
2. Server action: signOut() — destroys session, clears cookie
3. Redirect to / (homepage)
```

---

## 6. Protected Routes

| Route | Access |
|-------|--------|
| `/` | Public |
| `/[townSlug]` | Public (read), Authenticated (write: create post, vote) |
| `/login`, `/signup` | Guest only (redirect to / if logged in) |
| `/profile` | Authenticated only |
| `/profile/edit` | Authenticated (own profile only) |
| `/[townSlug]/settings` | Town owner/admin only |
| Server actions (mutations) | Authenticated + authorized |

---

## 7. Implementation Status

| Component | Location | Status |
|-----------|----------|--------|
| Auth config | `packages/auth/src/index.ts` | Stub (providers: [], null handlers) |
| Auth context | `packages/auth/src/react.tsx` | Implemented (not wired) |
| Login page | `apps/web/src/app/login/page.tsx` | Not created |
| Signup page | `apps/web/src/app/signup/page.tsx` | Not created |
| Password reset | `apps/web/src/app/reset-password/page.tsx` | Not created |
| Middleware | `apps/web/src/middleware.ts` | Not created |
| Server actions | `apps/web/src/lib/actions/` | Not created |
| Email templates | — | Not created |
| RLS policies | `supabase/migrations/` | Basic (public read only) |

---

## 8. Next Steps (Sprint 1 Stories)

1. **US-1.1** — Implement email signup page + server action
2. **US-1.2** — Implement email login page + server action
3. **US-1.3** — Add Google OAuth provider
4. **US-1.4** — Implement password reset flow with Resend emails
5. **US-1.5** — Wire AuthProvider, add session management to navigation
6. Create middleware for town context + auth resolution
7. Add write-policies to RLS (authenticated users can create content)
