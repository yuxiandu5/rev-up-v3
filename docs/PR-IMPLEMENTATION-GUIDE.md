## Pull Request Implementation Guide — Marketplace E‑Commerce

### Context

- Source: `docs/PRD-MARKETPLACE.md` (Version 1.0, Approved)
- Goal: Deliver the Marketplace feature end‑to‑end via a clear sequence of focused PRs.
- Database: No migrations required (per PRD) — reuse existing `User`, `Product`, `Cart`, `CartItem`, `Order`, `OrderItem`, `OrderStatus`.

### Conventions

- Branch naming: `feat/<feature>`, `chore/<topic>`, `fix/<issue>`.
- One logical feature per PR. Keep PRs reviewable (≤ ~500 LOC net where feasible).
- All backend routes live under `src/app/api/...` (Next.js App Router).
- Use existing libs: `src/lib/errors`, `src/lib/validations`, `src/lib/dto-mappers`, `src/lib/prisma`.
- Validation: Zod schemas. Return consistent API responses via `src/lib/apiResponse.ts`.
- State: Zustand for cart (`src/stores/cartStore.ts`). Persist guest cart to `localStorage`.
- Testing: Vitest integration tests in `tests/integration`, helpers in `tests/utils`.

### Acceptance Check (each PR)

- [ ] Code builds locally and tests pass
- [ ] Type-safe (no new TypeScript errors)
- [ ] Endpoint/request/response shapes validated (Zod)
- [ ] API error handling uses `AppError` and standard response helpers
- [ ] Docs updated in this file and/or inline JSDoc where needed

---

## PR0 — Stripe Setup & Project Plumbing

- **Branch**: `chore/stripe-setup`
- **Summary**: Prepare Stripe integration for later PRs.
- **Changes**:
  - Add dependencies: `stripe`, `@stripe/stripe-js`.
  - Add `.env.example` entries: `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_APP_URL`.
  - Add minimal README note for Stripe CLI usage for local webhooks.
- **Files**:
  - `package.json`
  - `.env.example` (new)
  - `README.md` (update Dependencies section)
- **No codepaths or endpoints yet.**
- **Estimate**: 0.5–1 hour
- **Depends on**: none

---

## PR1 — Cart API (Backend)

- **Branch**: `feat/cart-api`
- **Summary**: Implement Cart endpoints for authenticated users; localStorage guest cart sync endpoint.
- **Endpoints** (`/api/cart`):
  - `GET /api/cart` — Fetch user cart with items
  - `POST /api/cart/items` — Add item to cart
  - `PATCH /api/cart/items` — Update quantity
  - `DELETE /api/cart/items` — Remove item
  - `DELETE /api/cart` — Clear entire cart
  - `POST /api/cart/sync` — Merge guest cart → DB cart on login
- **Changes**:
  - Create route handlers under `src/app/api/cart/...`
  - Zod schemas for payloads (productId, quantity, itemId)
  - Use transactions for merge to prevent race conditions
  - Map Prisma entities → DTOs via `dto-mappers`
  - Standardize errors/responses via `apiResponse`
- **Files**:
  - `src/app/api/cart/route.ts` (GET, DELETE)
  - `src/app/api/cart/items/route.ts` (POST, PATCH, DELETE)
  - `src/app/api/cart/sync/route.ts` (POST)
  - `src/lib/validations.ts` (Zod schemas)
  - `src/lib/dto-mappers.ts` (DTO mappers)
  - `src/lib/errors/AppError.ts` (if new error types needed)
- **Tests**:
  - `tests/integration/cart.integration.test.ts` — CRUD + sync
- **Acceptance**:
  - [ ] All endpoints implemented, validated, and tested
  - [ ] Merge logic sums quantities and clears guest input after success
- **Estimate**: 4–6 hours
- **Depends on**: PR0

---

## PR2 — Cart Store (Frontend) + Nav Badge

- **Branch**: `feat/cart-store`
- **Summary**: Implement Zustand store with persistence, API wiring for authenticated users, and navbar cart badge.
- **Changes**:
  - New `src/stores/cartStore.ts` with actions: `addItem`, `updateQuantity`, `removeItem`, `clearCart`, `syncGuestCart`, `fetchCart`
  - Persist guest cart in `localStorage`
  - If authenticated, operate on DB cart via Cart API
  - Update `src/components/NavBar.tsx` to show cart icon + count badge
- **Files**:
  - `src/stores/cartStore.ts` (new)
  - `src/components/NavBar.tsx` (update)
  - `src/hooks/useApiClient.ts` (reuse)
- **Tests**:
  - `tests/market-place.test.ts` or new store tests covering reducers and persistence
- **Acceptance**:
  - [ ] Cart count updates in real time
  - [ ] Guest add/update/remove persists across refresh
  - [ ] On login, `syncGuestCart` merges into DB cart
- **Estimate**: 3–4 hours
- **Depends on**: PR1

---

## PR3 — Product Detail Page

- **Branch**: `feat/product-detail-page`
- **Summary**: Product detail route using existing marketplace product API; add-to-cart with quantity selector.
- **Changes**:
  - Route: `src/app/product/[id]/page.tsx`
  - Components under `src/components/marketplace/`:
    - `ProductDetail` (new)
    - Quantity selector (new or reuse UI primitives)
  - Use `GET /api/market-place/[id]` for product data
  - Wire `addItem` to cart store
- **Files**:
  - `src/app/product/[id]/page.tsx` (new)
  - `src/components/marketplace/ProductDetail.tsx` (new)
- **Acceptance**:
  - [ ] Detail page shows images, name, description, price, compatibility, performance gains
  - [ ] Add to cart adds correct product/quantity
- **Estimate**: 3–4 hours
- **Depends on**: PR2

---

## PR4 — Cart Page (Frontend)

- **Branch**: `feat/cart-page`
- **Summary**: Cart UI for viewing/updating items and proceeding to checkout.
- **Changes**:
  - Route: `src/app/cart/page.tsx`
  - Components under `src/components/cart/`:
    - `CartItem` (row with quantity controls)
    - `CartSummary` (subtotal, total)
  - Empty state and clear cart control
  - Guard: Checkout button prompts login if unauthenticated
- **Files**:
  - `src/app/cart/page.tsx` (new)
  - `src/components/cart/CartItem.tsx` (new)
  - `src/components/cart/CartSummary.tsx` (new)
- **Acceptance**:
  - [ ] Quantities update totals instantly
  - [ ] Remove item and clear cart work for guest and authed flows
  - [ ] Proceed button respects auth guard
- **Estimate**: 4–5 hours
- **Depends on**: PR2, PR3

---

## PR5 — Checkout Backend (Stripe Session + Webhook)

- **Branch**: `feat/checkout-backend`
- **Summary**: Stripe Checkout session creation, Order creation (PENDING), webhook to mark PAID/FAILED/CANCELLED and create `OrderItem`s, then clear cart.
- **Endpoints** (`/api/checkout`):
  - `POST /api/checkout/create-session` — create Stripe Checkout Session; create PENDING Order; return `url`
  - `POST /api/checkout/webhook` — verify signature; on `checkout.session.completed`: mark Order PAID, copy Cart → OrderItems, clear Cart
  - Handle failure/cancel events to update Order status appropriately
- **Changes**:
  - Use `stripe` SDK with `STRIPE_SECRET_KEY`
  - Use `NEXT_PUBLIC_APP_URL` for success/cancel URLs
  - Idempotency keys on session creation
  - Secure webhook with `STRIPE_WEBHOOK_SECRET`
- **Files**:
  - `src/app/api/checkout/create-session/route.ts` (new)
  - `src/app/api/checkout/webhook/route.ts` (new)
  - `src/lib/validations.ts` (session payload if any)
  - `src/lib/dto-mappers.ts` (order mappers as needed)
- **Tests**:
  - `tests/integration/checkout.integration.test.ts` — session creation (mock Stripe)
  - `tests/integration/webhook.integration.test.ts` — webhook event handling
- **Acceptance**:
  - [ ] Order created PENDING on session init
  - [ ] On webhook complete, Order → PAID, OrderItems created, Cart cleared
- **Estimate**: 5–7 hours
- **Depends on**: PR1, PR2, PR4

---

## PR6 — Checkout Page (Frontend)

- **Branch**: `feat/checkout-frontend`
- **Summary**: Read-only order summary and Stripe redirect.
- **Changes**:
  - Route: `src/app/checkout/page.tsx`
  - Component: `src/components/checkout/CheckoutSummary.tsx`
  - Button: Calls `POST /api/checkout/create-session` and redirects to `session.url`
  - Loading and error states
- **Files**:
  - `src/app/checkout/page.tsx` (new)
  - `src/components/checkout/CheckoutSummary.tsx` (new)
- **Acceptance**:
  - [ ] Displays items, quantities, subtotal, total from effective cart
  - [ ] Clicking Pay redirects to Stripe Checkout
- **Estimate**: 3–4 hours
- **Depends on**: PR4, PR5

---

## PR7 — Orders API (User)

- **Branch**: `feat/orders-api`
- **Summary**: Users can list orders, get details, and fetch by Stripe session id (confirmation).
- **Endpoints** (`/api/orders`):
  - `GET /api/orders` — paginated list for current user
  - `GET /api/orders/[id]` — order detail (auth own order)
  - `GET /api/orders/confirmation` — by `session_id`
- **Files**:
  - `src/app/api/orders/route.ts` (GET list)
  - `src/app/api/orders/[id]/route.ts` (GET detail)
  - `src/app/api/orders/confirmation/route.ts` (GET by session id)
  - `src/lib/validations.ts` (query schemas)
- **Tests**:
  - `tests/integration/orders.integration.test.ts`
- **Acceptance**:
  - [ ] Only owner can access their orders
  - [ ] Proper pagination and shapes per DTO
- **Estimate**: 3–4 hours
- **Depends on**: PR5

---

## PR8 — Orders UI (User)

- **Branch**: `feat/orders-frontend`
- **Summary**: Confirmation page, order history list, and order detail UI.
- **Changes**:
  - Routes:
    - `src/app/orders/confirmation/page.tsx`
    - `src/app/orders/page.tsx` or `src/app/profile/orders/page.tsx`
  - Components `src/components/orders/`:
    - `OrderCard`, `OrderDetail`, `OrderStatusBadge`
- **Acceptance**:
  - [ ] Confirmation page loads order via session id and renders status/items
  - [ ] Orders page lists past orders with pagination
  - [ ] Detail page shows items and status
- **Estimate**: 4–5 hours
- **Depends on**: PR7

---

## PR9 — Admin Orders API

- **Branch**: `feat/admin-orders-api`
- **Summary**: Admin can list all orders and update status.
- **Endpoints** (`/api/admin/orders`):
  - `GET /api/admin/orders` — paginated, filterable (status, date, user)
  - `PATCH /api/admin/orders/[id]` — update `OrderStatus`
- **Files**:
  - `src/app/api/admin/orders/route.ts`
  - `src/app/api/admin/orders/[id]/route.ts`
  - `src/lib/validations.ts` (filters + status update schema)
- **Tests**:
  - `tests/integration/admin.orders.integration.test.ts`
- **Acceptance**:
  - [ ] Admin guard enforced
  - [ ] Filters work and responses are stable
- **Estimate**: 3–4 hours
- **Depends on**: PR7

---

## PR10 — Admin Orders UI

- **Branch**: `feat/admin-orders-ui`
- **Summary**: Admin dashboard orders page with DataTable and status updates.
- **Changes**:
  - Route: `src/app/(app)/admin/orders/page.tsx`
  - Table with columns: id, user, total, status, createdAt; filters on status/date/user
  - Row action to update status (PATCH)
- **Files**:
  - `src/app/(app)/admin/orders/page.tsx` (new)
  - `src/components/admin/orders/*` (optional helper components)
- **Acceptance**:
  - [ ] Table lists and filters orders
  - [ ] Status changes persist via API
- **Estimate**: 4–5 hours
- **Depends on**: PR9

---

## PR11 — Tests, UX Polish, and Hardening

- **Branch**: `chore/tests-and-polish`
- **Summary**: Integration test coverage across flows, loading/skeletons, error toasts, mobile polish.
- **Changes**:
  - Add/expand integration tests:
    - Cart CRUD + sync
    - Checkout session creation
    - Webhook processing to PAID
    - Orders listing/detail
    - Admin list/update
  - Add skeleton/loading states and error handling across pages
  - Responsive/touch targets polish
- **Files**:
  - `tests/integration/*.test.ts`
  - `src/components/ui/*` updates for skeletons/toasts if needed
- **Acceptance**:
  - [ ] Tests pass and cover MVP flows
  - [ ] Core pages have loading and error UI
- **Estimate**: 6–8 hours
- **Depends on**: PR1–PR10

---

## Timeline Summary (Estimates)

- PR0: 0.5–1 h
- PR1: 4–6 h
- PR2: 3–4 h
- PR3: 3–4 h
- PR4: 4–5 h
- PR5: 5–7 h
- PR6: 3–4 h
- PR7: 3–4 h
- PR8: 4–5 h
- PR9: 3–4 h
- PR10: 4–5 h
- PR11: 6–8 h

Total: ~43.5–57.5 h (aligns with PRD 50–66 h when accounting for review/overhead).

---

## Manual Test Checklist per PR

- Auth vs Guest behaviors verified where applicable
- Error boundaries and toasts visible for failure cases
- Redirects and guards behave as expected
- API returns match DTOs and frontend assumptions
- Mobile: basic layout sanity (≤ 375px width)

---

## Notes

- Use Stripe CLI to forward webhooks locally (`STRIPE_WEBHOOK_SECRET`).
- Keep PR descriptions short with a checklist of acceptance bullets above.
- If scope creeps, split into an additional PR to keep reviews fast.
