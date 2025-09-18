### PRD: Admin Dashboard v1 (Users Management + RBAC Foundation)

#### Overview

- **Goal**: Introduce role-based access control and an admin dashboard. Start with Users management; expand to catalog later.
- **Audience**: Portfolio project; prioritize clarity and correctness over production-level hardening.

#### Scope v1

- **In scope (Users)**
  - List users with filters and pagination.
  - Deactivate/Reactivate users.
  - Hard delete users (ADMIN only).
- **Out of scope**
  - Audit logs beyond `createdAt`/`updatedAt`.
  - Bulk import/export.
  - MFA/IP allowlisting.
  - Role promotion UI (seed + manual DB only in v1).

#### Roles and Permissions

- **Roles**: `USER` (default), `MODERATOR`, `ADMIN`.
- **Permissions**
  - **USER**: No dashboard access.
  - **MODERATOR**: Can access Dashboard but does not see Users module at all.
  - **ADMIN**: Full dashboard access; can deactivate/reactivate/delete users.
- **Bootstrap**: Seed a single `ADMIN` user (known username, temp password).
- **Deactivated users**: Cannot log in; backend returns “Account is deactivated”.

#### Data Model Changes

- **Prisma**
  - Add `enum Role { USER, MODERATOR, ADMIN }`.
  - Add `User.role Role @default(USER)`.
- **Notes**
  - User rows are tiny; prefer deactivate as default, allow hard delete for cleanup.
  - Existing cascade on `UserBuild` acceptable for hard delete.
  - Mods must belong to a `ModCategory` (maintain this rule for later modules).

#### Authentication and Authorization

- **Access token**: Include `sub`, `userName`, `role`, `jti`; ~15m TTL.
- **Refresh token**: Rotating, httpOnly cookie (already implemented).
- **Backend enforcement (authoritative)**
  - All admin endpoints require Bearer token; verify access token and role.
  - Trust JWT role for portfolio simplicity. When deactivating or changing role, revoke all refresh tokens for that user to force re-login.
- **Frontend gating (UX only)**
  - Hide Dashboard link unless role ∈ {MODERATOR, ADMIN}.
  - Hide Users module entirely for MODERATOR.
- **Route guard (server)**
  - Middleware for `/dashboard/*`: allow only MODERATOR/ADMIN; redirect others to `/`.

#### API Design (Users Admin)

- Base path: `/api/admin/*`
- **GET `/api/admin/users`**
  - Query: `query` (userName contains), `role` (Role), `isActive` (boolean), `page` (default 1), `pageSize` (default 20).
  - Response: `{ data: UserListItem[], page, pageSize, total }`.
  - `UserListItem`: `{ id, userName, role, isActive, lastLoginAt, createdAt, updatedAt }`.
  - Authorization: ADMIN only for Users module.
- **PATCH `/api/admin/users/:id/status`**
  - Body: `{ isActive: boolean }`.
  - Behavior: if `false`, revoke all refresh tokens for target user.
  - Authorization: ADMIN only; prevent self-deactivate.
- **DELETE `/api/admin/users/:id`**
  - Behavior: hard delete; cascade removes builds.
  - Authorization: ADMIN only; prevent self-delete.
- **Error model**
  - 401: missing/invalid token
  - 403: insufficient role
  - 404: not found
  - 409: conflict (e.g., deleting already deleted)
  - 422: invalid body
  - 500: server error
- **Logging**
  - Log admin actions: `{actorUserId, action, targetUserId, payload, timestamp}` to server logs.

#### Frontend UX (Users)

- **NavBar**
  - Show “Dashboard” link only if role ∈ {MODERATOR, ADMIN}.
- **Dashboard shell**
  - Location: `src/app/(app)/dashboard`.
  - Landing page with tiles for modules; “Users” tile visible only to ADMIN.
- **Users page (ADMIN only)**
  - Table (shadcn/ui): columns `userName`, `role`, `isActive`, `lastLoginAt`, `createdAt`, `updatedAt`.
  - Controls: search by `userName`, filter by `role`, `isActive`, pagination (pageSize 20).
  - Actions: Activate/Deactivate (confirm), Delete (destructive confirm).
  - Feedback: toasts; empty/loading/error states.

#### Non-Functional Requirements

- **Security**: API-level checks are the source of truth; middleware/UX are assistive. On sensitive updates, read current user state to avoid stale toggles.
- **Performance**: Pagination required on list; add indexes on `userName`, `isActive`, `role`.
- **Validation**: Use zod for request validation; consistent error shapes.
- **Observability**: Basic server logs for admin actions.

#### Edge Cases

- Deactivate already inactive user → idempotent success.
- Delete already deleted user → 404.
- Prevent ADMIN from deactivating or deleting self.
- On future role change: revoke refresh tokens immediately.

### Milestones and PR Breakdown

#### PR 1 — RBAC Schema + Seed Admin

- Purpose: Add roles to the data model and bootstrap an initial admin.
- Changes: Prisma enum/column, seeds create one ADMIN.
- Non-goals: No API/UI changes yet.
- QA: Migration defaults existing users to USER; seeded admin can log in.

#### PR 2 — Auth: Propagate Role in Tokens/Responses

- Purpose: Include `role` in access JWT and auth responses.
- Changes: Login/Refresh attach `role`; client store extended to hold `role`.
- Non-goals: No gating/middleware yet.
- QA: After login/refresh, client receives `role`; deactivated users still blocked.

#### PR 3 — Backend Enforcement: Guards + Dashboard Middleware

- Purpose: Enforce roles server-side regardless of UI.
- Changes: Shared guard to verify token and required role(s); middleware for `/dashboard/*`.
- Non-goals: Users API.
- QA: USER redirected from `/dashboard`; MODERATOR/ADMIN allowed.

#### PR 4 — Users Admin API (ADMIN-only)

- Purpose: CRUD-lite for users.
- Changes: GET list with filters/pagination; PATCH status; DELETE user; self-protection; revoke tokens on deactivate.
- Non-goals: Role promotion API.
- QA: Non-admin 403; admin actions work; cannot affect own account.

#### PR 5 — Dashboard Shell + Navigation Gating

- Purpose: Add dashboard shell and nav visibility rules.
- Changes: `NavBar` shows Dashboard for MODERATOR/ADMIN; Users tile shown only to ADMIN.
- Non-goals: Users table UI.
- QA: USER sees no Dashboard; MODERATOR sees Dashboard without Users tile; ADMIN sees both.

#### PR 6 — Users UI (ADMIN-only)

- Purpose: Provide admin UI for users management.
- Changes: `/dashboard/users` with table, filters, pagination, actions; dialogs and toasts via shadcn/ui.
- Non-goals: Role change UI.
- QA: MODERATOR cannot access; ADMIN actions reflect immediately.

#### PR 7 — Operational Polish (Optional)

- Purpose: Indexes, logs, error shape polish.
- Changes: DB indexes; refine logs/errors; ensure consistent responses.
- Non-goals: New features.
- QA: Lists performant; behavior unchanged.

### Dependencies and Order

- PR 1 → PR 2 → PR 3 → PR 4 → PR 5 → PR 6 → PR 7 (optional)

### Acceptance Criteria

- Non-admins cannot access `/dashboard/*` or `/api/admin/*`.
- MODERATOR cannot access Users module at all (UI hidden, API returns 403).
- ADMIN can list, deactivate/reactivate, and delete users.
- Deactivated users cannot log in; login returns the specified error.
- Role is visible in the client and used to hide/show Dashboard appropriately.
- Pagination works with default pageSize 20.

### Future Work (Post v1)

- Role promotion/demotion API and UI (ADMIN-only) with token revocation on change.
- Catalog modules: Makes/Models/Badges/YearRanges, ModCategories/Mods, Compatibilities, Requirements, Media.
- Optional audit log table for admin actions.
