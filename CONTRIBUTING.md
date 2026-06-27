# Contributing to Contitown

> Development workflow, conventions, and processes for the Contitown monorepo.

---

## 1. Getting Started

### Prerequisites

- Node.js >= 20
- npm >= 10 (project uses npm workspaces)
- Docker (for local Supabase database)

### Setup

```bash
# Clone the repository
git clone <repo-url>
cd contitown

# Install dependencies
npm install

# Start local database
npm run db:start

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`.
Supabase Studio will be at `http://localhost:54323`.

---

## 2. Branch Naming

Use the following format:

```
<type>/<short-description>
```

Types:
- `feat/` — new feature
- `fix/` — bug fix
- `docs/` — documentation
- `refactor/` — code restructuring
- `chore/` — maintenance, dependencies
- `test/` — adding or fixing tests

Examples:
- `feat/auth-google-oauth`
- `fix/news-pagination`
- `docs/architecture-update`

---

## 3. Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Examples:
```
feat(auth): add Google OAuth provider
fix(town): resolve static params generation for new towns
docs(api): document server action endpoints
```

---

## 4. Pull Request Process

1. **Create a feature branch** from `main`
2. **Make your changes** with clear, focused commits
3. **Run checks locally** before pushing:
   ```bash
   npm run lint
   npm run typecheck
   npm run build
   ```
4. **Open a PR** against `main` using the PR template (see below)
5. **CI must pass** — lint, typecheck, and build jobs run automatically
6. **Code review** — at least one approval required
7. **Merge** — squash merge preferred for clean history

### PR Template

```markdown
## Summary
<!-- What does this PR do? -->

## Changes
<!-- List the key changes -->

## Testing
<!-- How did you test this? -->

## Screenshots (if UI)
<!-- Before/after screenshots -->

## Checklist
- [ ] Lint passes
- [ ] Type check passes
- [ ] Build succeeds
- [ ] No console errors
- [ ] Responsive (mobile + desktop)
- [ ] Accessibility: labels, alt text, keyboard nav
```

---

## 5. Code Review Process

### As an Author

- Keep PRs focused — one feature or fix per PR
- Self-review before requesting review
- Respond to feedback within 24 hours
- Resolve conversations after pushing fixes

### As a Reviewer

- Review within 24 hours of assignment
- Use conventional comments:
  - **Nit:** — minor preference, non-blocking
  - **Suggestion:** — optional improvement
  - **Question:** — needs clarification
  - **Blocking:** — must be addressed before merge
- Approve when all blocking comments are resolved
- Check for: correctness, performance, security, accessibility, test coverage

---

## 6. Project Structure Conventions

### Apps

- `apps/web/` — the only Next.js application
- All pages use the App Router (`src/app/`)
- Server components by default; add `"use client"` only when needed
- Route groups use parentheses: `(auth)/`, `(api)/`

### Packages

- `packages/ui/` — presentational components only (no business logic)
- `packages/auth/` — auth configuration and React context
- `packages/db/` — Prisma client and database utilities
- `packages/config/` — shared constants and environment variables

### Import Aliases

- `@/` maps to the app's `src/` directory (e.g., `@/data/towns`)
- Cross-package imports use workspace protocol: `@contitown/ui`, `@contitown/db`

---

## 7. Coding Standards

### TypeScript

- Strict mode is enabled — no `any` without justification
- Define interfaces for all data types (see `packages/db` for shared types)
- Use `type` for unions/interfaces, `interface` for object shapes that may be extended

### React / Next.js

- Server Components by default — only use `"use client"` for:
  - `useState`, `useEffect`, event handlers
  - Browser APIs (localStorage, window)
  - Third-party client-side libraries
- Use `generateStaticParams` for dynamic routes when possible
- Always `await` params in Next.js 16 (params is a Promise)

### Styling

- Tailwind CSS utility classes — no custom CSS unless necessary
- Dark theme: `bg-slate-950` background, `text-white` primary text
- Accent color: `emerald-*` for primary actions and highlights
- Follow existing patterns for cards, badges, and buttons

### Naming

- Files: `kebab-case.tsx` for components, `camelCase.ts` for utilities
- Components: `PascalCase` (e.g., `TownClient`, `NewsTab`)
- Functions/variables: `camelCase` (e.g., `getTown`, `townSlug`)
- Constants: `SCREAMING_SNAKE_CASE` for true constants, `camelCase` for config exports

---

## 8. Testing (Planned)

Testing infrastructure is not yet configured. When added:

- **Unit tests:** Vitest for utility functions and hooks
- **Component tests:** React Testing Library for UI components
- **E2E tests:** Playwright for critical user flows
- **API tests:** Supertest for server actions and routes

---

## 9. Database Migrations

```bash
# Create a new migration
npm run db:migrate

# Reset the database
npm run db:reset

# Generate Prisma client
npm run db:generate

# Open Prisma Studio (visual DB editor)
cd packages/db && npx prisma studio
```

Always review the generated SQL before applying migrations to production.

---

## 10. Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:54322/postgres"
NEXT_PUBLIC_SUPABASE_URL="http://localhost:54321"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<your-anon-key>"
NEXTAUTH_SECRET="<generate-with-openssl-rand-base64-32>"
NEXTAUTH_URL="http://localhost:3000"
```

Never commit `.env.local` or production secrets.

---

## 11. Release Process

1. All changes merge to `main` via PR
2. CI runs lint, typecheck, and build
3. Vercel auto-deploys `main` to production
4. Tag releases: `git tag v0.x.0 && git push --tags`
5. Update `CHANGELOG.md` (when created)

---

## 12. Communication

- **Issues:** File bugs and feature requests in Paperclip
- **Discussions:** Use GitHub Discussions for design proposals
- **Urgent:** Tag `@contitown/maintainers` in the PR
