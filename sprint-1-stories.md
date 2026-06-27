# Sprint 1 — User Stories & Acceptance Criteria

**Sprint Duration:** Weeks 1-2  
**Goal:** Deliver core user-facing infrastructure — authentication, town onboarding, routing, posts/news, and basic profiles.  
**Reference:** ARCHITECTURE.md Section 7.1 (MVP Checklist)

---

## Epic 1: Authentication

### US-1.1 — Email Sign Up

**As a** new visitor,  
**I want** to create an account using my email and password,  
**So that** I can access personalized features and participate in my town.

**Priority:** P0  
**Complexity:** M

**Acceptance Criteria:**
- [ ] User can access a `/signup` page from the homepage CTA and navigation
- [ ] Form requires: display name, email, password, confirm password
- [ ] Email must be valid format (RFC 5322 basic check)
- [ ] Password must be at least 8 characters with one number
- [ ] On success: account created, user auto-logged in, redirected to home
- [ ] On duplicate email: show clear error "An account with this email already exists"
- [ ] On validation error: show inline field-level error messages
- [ ] Password is never stored in plaintext (bcrypt/argon2 hashed)

---

### US-1.2 — Email Login

**As a** registered user,  
**I want** to log in with my email and password,  
**So that** I can access my account and town memberships.

**Priority:** P0  
**Complexity:** S

**Acceptance Criteria:**
- [ ] User can access a `/login` page from navigation or redirect
- [ ] Form requires: email, password
- [ ] On success: session created, redirect to intended page or home
- [ ] On invalid credentials: show generic error "Invalid email or password" (no enumeration)
- [ ] "Remember me" checkbox extends session duration
- [ ] Logged-in state persists across page refreshes

---

### US-1.3 — Google OAuth Login

**As a** visitor,  
**I want** to sign up or log in using my Google account,  
**So that** I can get started quickly without creating a new password.

**Priority:** P0  
**Complexity:** M

**Acceptance Criteria:**
- [ ] "Continue with Google" button visible on both `/login` and `/signup` pages
- [ ] Clicking triggers Google OAuth 2.0 flow (redirect or popup)
- [ ] On first login: new account auto-created with email + avatar from Google
- [ ] On return: existing account matched by email, user logged in
- [ ] OAuth failures show user-friendly error (e.g., "Google sign-in failed, try again")
- [ ] Account linking: if Google email matches existing email account, offer to link on next email login

---

### US-1.4 — Password Reset

**As a** registered user,  
**I want** to reset my password if I forget it,  
**So that** I can regain access to my account.

**Priority:** P1  
**Complexity:** S

**Acceptance Criteria:**
- [ ] "Forgot password?" link on `/login` page
- [ ] User enters email; if account exists, send reset link (show success regardless to prevent enumeration)
- [ ] Reset link is single-use, expires after 1 hour
- [ ] Reset page allows new password (same rules as signup)
- [ ] On success: user can log in with new password
- [ ] Old sessions are invalidated after password change

---

### US-1.5 — Session Management

**As a** logged-in user,  
**I want** to stay logged in securely and log out when done,  
**So that** my account is protected and convenient to use.

**Priority:** P0  
**Complexity:** S

**Acceptance Criteria:**
- [ ] Logged-in state shows avatar/display name in navigation bar
- [ ] "Log out" option in user menu clears session and redirects to home
- [ ] Session expires after 7 days (or 30 with "remember me")
- [ ] CSRF protection on all auth forms
- [ ] Logging out of one tab/browser does not affect other tabs (independent sessions)

---

## Epic 2: Town Onboarding

### US-2.1 — Create a Town (First User = Owner)

**As a** logged-in user in a town not yet on Contitown,  
**I want** to create a new town hub and automatically become its owner,  
**So that** I can bring my community onto the platform.

**Priority:** P0  
**Complexity:** L

**Acceptance Criteria:**
- [ ] "Create a town" option visible in user dashboard when user has no town
- [ ] Form requires: town name, state/region, population (optional), description
- [ ] System generates URL slug from town name (lowercase, hyphens, unique)
- [ ] On creation: town record created with this user as `owner`
- [ ] User is redirected to their new town hub at `/[slug]`
- [ ] Town appears in the towns directory on homepage
- [ ] Duplicate town names in same region show warning "A town with this name already exists — request access instead?"

---

### US-2.2 — Invite Members to a Town

**As a** town owner or admin,  
**I want** to invite other users to join my town,  
**So that** my community can participate.

**Priority:** P0  
**Complexity:** M

**Acceptance Criteria:**
- [ ] Town settings page has "Invite members" section
- [ ] Owner can enter email address; system sends invitation email with unique link
- [ ] Invitation link leads to signup/pre-login then auto-joins town
- [ ] Owner can set role on invite: `member` (default) or `admin`
- [ ] Owner can view pending invitations and revoke them
- [ ] Invitations expire after 7 days
- [ ] Existing users can be invited directly (no signup needed)

---

### US-2.3 — Join a Town via Invitation Link

**As a** registered user with an invitation link,  
**I want** to accept the invitation and join the town,  
**So that** I can participate in my local community.

**Priority:** P0  
**Complexity:** S

**Acceptance Criteria:**
- [ ] Clicking invitation link while logged in: immediately added to town
- [ ] Clicking invitation link while not logged in: redirect to login/signup, then auto-join after auth
- [ ] Expired invitation shows "This invitation has expired" with option to request access
- [ ] Already-member shows "You're already a member of [Town Name]"

---

### US-2.4 — Town Member Dashboard

**As a** town member,  
**I want** to see a personalized dashboard when I visit my town,  
**So that** I can quickly see relevant local activity.

**Priority:** P1  
**Complexity:** M

**Acceptance Criteria:**
- [ ] Logged-in members see personalized header: "Welcome back, [Name]"
- [ ] Dashboard shows: recent news (3 items), active votes (2 items), latest discussion
- [ ] Quick-action buttons: "Post News", "Start Discussion", "View Marketplace"
- [ ] Non-members see generic town view (existing public page)

---

## Epic 3: Town Resolution (Subdomain Routing)

### US-3.1 — Subdomain-Based Town Routing

**As a** user,  
**I want** to access my town via `townname.contitown.app`,  
**So that** the experience feels local and branded to my community.

**Priority:** P0  
**Complexity:** L

**Acceptance Criteria:**
- [ ] Request to `[townSlug].contitown.app` resolves to the correct town hub
- [ ] System loads town metadata (name, state, description) from database by slug
- [ ] Non-existent subdomain shows a friendly 404: "This town doesn't exist yet — create it!"
- [ ] `contitown.app` (root) shows the homepage with town directory
- [ ] Path-based routing `/[townSlug]` continues to work as fallback
- [ ] Town context is available to all child components (React context or middleware)

---

### US-3.2 — Tenant Context Middleware

**As a** developer/system,  
**I want** a middleware that identifies the town from the request and loads its context,  
**So that** all route handlers and components have access to town data.

**Priority:** P0  
**Complexity:** M

**Acceptance Criteria:**
- [ ] Middleware runs on all routes matching `/:townSlug/*` or subdomain
- [ ] Town context includes: slug, name, state, owner, member count
- [ ] If user is logged in, context includes their membership status + role
- [ ] Missing town returns 404 before rendering page content
- [ ] Middleware does not block public read access to town content

---

### US-3.3 — Town Landing Page

**As a** visitor,  
**I want** to see a compelling landing page when I visit a town hub,  
**So that** I understand what Contitown offers for my community.

**Priority:** P1  
**Complexity:** M

**Acceptance Criteria:**
- [ ] Town hub at `/[slug]` or subdomain shows: town name, state, population, description
- [ ] Hero section with town imagery (placeholder if none uploaded)
- [ ] Feature cards: News, Discussions, Votes, Marketplace, AMAs, Business Directory
- [ ] "Join this town" CTA for non-members (logged-out or not yet invited)
- [ ] Member count displayed: "X members in this community"
- [ ] Responsive layout works on mobile and desktop

---

## Epic 4: Posts / News

### US-4.1 — Create a News Post

**As a** town owner or admin,  
**I want** to create a news post in my town's feed,  
**So that** I can share important updates with the community.

**Priority:** P0  
**Complexity:** M

**Acceptance Criteria:**
- [ ] "Post News" button visible to owner/admin on town hub
- [ ] Form requires: title, body, category (government/community/safety/events/infrastructure)
- [ ] Optional: pinned post toggle (owner/admin only)
- [ ] On publish: post appears at top of news feed (pinned items first)
- [ ] Post shows: title, excerpt, author name, timestamp, category badge
- [ ] Author can edit or delete their own post within 1 hour of publishing
- [ ] Owner/admin can delete any post

---

### US-4.2 — News Feed with Pagination

**As a** town member or visitor,  
**I want** to browse a paginated news feed for my town,  
**So that** I can stay informed about local happenings.

**Priority:** P0  
**Complexity:** M

**Acceptance Criteria:**
- [ ] News feed displays on town hub page
- [ ] Posts sorted by: pinned first, then by published date (newest first)
- [ ] Pagination: 10 posts per page with "Load more" or numbered pages
- [ ] Each post card shows: title, excerpt (150 chars), author, date, category
- [ ] Clicking a post opens full article view at `/[slug]/news/[postId]`
- [ ] Empty state: "No news yet — be the first to post!" (visible to authorized users)

---

### US-4.3 — Pinned Posts

**As a** town owner or admin,  
**I want** to pin important posts to the top of the feed,  
**So that** critical announcements are always visible.

**Priority:** P1  
**Complexity:** S

**Acceptance Criteria:**
- [ ] Pinned posts appear above all non-pinned posts with a "📌 Pinned" badge
- [ ] Maximum 3 pinned posts at any time
- [ ] Pin/unpin action available in post edit menu (owner/admin only)
- [ ] Pinned posts still display their original publish date

---

### US-4.4 — Post Categories & Filtering

**As a** reader,  
**I want** to filter news by category,  
**So that** I can find the content most relevant to me.

**Priority:** P2  
**Complexity:** S

**Acceptance Criteria:**
- [ ] Category filter tabs above news feed: All, Government, Community, Safety, Events, Infrastructure
- [ ] Clicking a tab filters the feed to that category
- [ ] URL reflects filter: `/[slug]?category=events`
- [ ] Pinned posts remain visible across all category filters
- [ ] Empty category shows: "No posts in this category yet"

---

## Epic 5: Basic Profile

### US-5.1 — View Own Profile

**As a** logged-in user,  
**I want** to view my profile page,  
**So that** I can see my account information and town memberships.

**Priority:** P0  
**Complexity:** S

**Acceptance Criteria:**
- [ ] Profile accessible at `/profile` or via avatar click in navigation
- [ ] Displays: display name, email, avatar, join date
- [ ] Shows list of towns the user is a member of (with role badges)
- [ ] "Edit profile" button visible to the profile owner
- [ ] Non-logged-in users visiting `/profile` are redirected to `/login`

---

### US-5.2 — Edit Profile (Display Name & Avatar)

**As a** logged-in user,  
**I want** to update my display name and avatar,  
**So that** my identity on the platform is current.

**Priority:** P0  
**Complexity:** S

**Acceptance Criteria:**
- [ ] Edit form pre-populated with current display name
- [ ] Avatar: upload image (JPG/PNG, max 5MB) or enter URL
- [ ] On save: changes reflected immediately across the app (nav, posts, comments)
- [ ] Display name validation: 2-30 characters, no profanity filter (basic)
- [ ] Avatar upload resizes to 200x200px thumbnail
- [ ] Success toast: "Profile updated"

---

### US-5.3 — View Public Profile of Other Users

**As a** town member,  
**I want** to see a public profile of other users in my town,  
**So that** I can know who I'm interacting with in the community.

**Priority:** P1  
**Complexity:** S

**Acceptance Criteria:**
- [ ] Clicking a username/avatar on a post or discussion shows their public profile
- [ ] Public profile shows: display name, avatar, town memberships, join date
- [ ] Email is NEVER shown on public profiles
- [ ] Posts and discussions by this user are listed on their profile
- [ ] Profile URL: `/users/[userId]`

---

## Definition of Done (Sprint 1)

- [ ] All P0 stories implemented and tested
- [ ] All acceptance criteria met for each story
- [ ] Responsive design (mobile + desktop)
- [ ] No console errors in production build
- [ ] Basic accessibility: form labels, alt text, keyboard navigation
- [ ] Database migrations applied (if applicable)
- [ ] Manual smoke test: sign up, login, create town, post news, view profile

---

## Technical Notes

- **Auth:** Use NextAuth.js (Auth.js v5) with credentials + Google provider
- **Database:** PostgreSQL with Prisma ORM (or SQLite for dev)
- **Sessions:** JWT-based with httpOnly cookies
- **Routing:** Next.js middleware for subdomain resolution
- **File Storage:** Local dev; S3-compatible for production avatars
- **Email:** Resend or SendGrid for transactional emails (invites, password reset)
