# PR Implementation Guide - E-Commerce Marketplace

## Overview

This document breaks down the marketplace feature into 7 PRs, ordered by dependencies.

---

## PR #1: Cart Backend APIs

**Branch**: `feat/cart-backend`  
**Time Estimate**: 5-6 hours  
**Dependencies**: None

### Tasks

- [ ] Create DTOs in `src/types/DTO/CartDTO.ts`
  - `CartDTO`, `CartItemDTO`, `AddCartItemDTO`, `UpdateCartItemDTO`
- [ ] Create `/api/cart/route.ts`
  - `GET /api/cart` - Fetch user cart with items
  - `DELETE /api/cart` - Clear entire cart
- [ ] Create `/api/cart/items/route.ts`
  - `POST /api/cart/items` - Add item to cart (create or increment)
  - `PATCH /api/cart/items` - Update item quantity
  - `DELETE /api/cart/items` - Remove item by ID
- [ ] Create `/api/cart/sync/route.ts`
  - `POST /api/cart/sync` - Sync guest cart to DB (merge logic)
- [ ] Add Zod validation schemas in `src/lib/validations.ts`
- [ ] Write integration tests in `tests/integration/cart.integration.test.ts`

### API Requirements

- All endpoints require authentication
- Cart operations use Prisma transactions
- Sync endpoint: merge guest cart → DB (sum quantities if duplicate)

---

## PR #2: Cart Frontend Store & Components

**Branch**: `feat/cart-frontend`  
**Time Estimate**: 5-6 hours  
**Dependencies**: PR #1

### Tasks

- [ ] Create `src/stores/cartStore.ts`
  - State: `guestCart`, `dbCart`, `itemCount`, `subtotal`
  - Actions: `addItem`, `updateQuantity`, `removeItem`, `clearCart`, `syncGuestCart`, `fetchCart`
  - Use Zustand persist middleware for `guestCart` in localStorage
- [ ] Create `/app/(app)/cart/page.tsx`
- [ ] Create `src/components/cart/CartItem.tsx`
  - Display product info, quantity selector, remove button
- [ ] Create `src/components/cart/CartSummary.tsx`
  - Show subtotal, total, "Proceed to Checkout" button
- [ ] Create `src/components/cart/EmptyCart.tsx`
- [ ] Update `src/components/NavBar.tsx`
  - Add cart icon with item count badge (top-right)
- [ ] Call `syncGuestCart()` in `AuthInitializer` on login

### State Logic

- Guest users: cart in localStorage only
- Authenticated users: cart from DB API
- On login: auto-sync guest cart to DB, then clear localStorage

---

## PR #3: Product Detail Page

**Branch**: `feat/product-detail-page`  
**Time Estimate**: 4-5 hours  
**Dependencies**: PR #2

### Tasks

- [ ] Create `/app/(app)/product/[id]/page.tsx`
- [ ] Create `src/components/marketplace/ProductDetail.tsx`
  - Product images (carousel or single)
  - Name, price, description
  - Compatibility info (make, model, badge, year range)
  - Performance gains (HP, torque, handling, 0-100)
  - Quantity selector
  - "Add to Cart" button
- [ ] Create `src/components/marketplace/QuantitySelector.tsx`
  - Input with +/- buttons, min 1, max 99
- [ ] Update marketplace gallery page
  - Make product cards clickable → `/product/[id]`

### Integration

- "Add to Cart" calls `cartStore.addItem(productId, quantity)`
- Show success toast on add
- Update cart badge in navbar immediately

---

## PR #4: Checkout Backend & Stripe Integration

**Branch**: `feat/checkout-backend`  
**Time Estimate**: 6-7 hours  
**Dependencies**: PR #1

### Tasks

- [ ] Install `stripe` package: `npm install stripe`
- [ ] Add env vars to `.env.local`:
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`
  - `NEXT_PUBLIC_APP_URL`
- [ ] Create `src/lib/stripe.ts` - Initialize Stripe client
- [ ] Create DTOs in `src/types/DTO/OrderDTO.ts`
  - `OrderDTO`, `OrderItemDTO`, `CreateCheckoutSessionDTO`
- [ ] Create `/api/checkout/create-session/route.ts`
  - Validate cart is not empty
  - Create Order with status `PENDING`
  - Create Stripe checkout session
  - Return `{ sessionId, url }`
- [ ] Create `/api/checkout/webhook/route.ts`
  - Verify Stripe signature
  - Handle `checkout.session.completed` event
  - Update Order status to `PAID`
  - Create OrderItems from cart
  - Clear user's cart
  - Handle `checkout.session.expired` → mark `CANCELLED`
- [ ] Add Zod schemas for checkout endpoints
- [ ] Write tests in `tests/integration/checkout.integration.test.ts`

### Stripe Flow

1. POST `/api/checkout/create-session` → returns Stripe URL
2. Redirect user to Stripe hosted checkout
3. Stripe calls webhook on payment success
4. Webhook updates order to PAID, clears cart

---

## PR #5: Checkout Frontend & Order Confirmation

**Branch**: `feat/checkout-frontend`  
**Time Estimate**: 5-6 hours  
**Dependencies**: PR #4

### Tasks

- [ ] Install `@stripe/stripe-js`: `npm install @stripe/stripe-js`
- [ ] Add `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` to `.env.local`
- [ ] Create `/app/(app)/checkout/page.tsx`
  - Auth guard: redirect to login if not authenticated
  - Redirect to cart if cart is empty
- [ ] Create `src/components/checkout/CheckoutSummary.tsx`
  - Read-only list of cart items
  - Subtotal, total
  - "Pay with Stripe" button
- [ ] Implement checkout flow:
  - Click "Pay with Stripe" → POST `/api/checkout/create-session`
  - Redirect to Stripe URL from response
- [ ] Create `/app/(app)/orders/confirmation/page.tsx`
  - Get `session_id` from URL params
  - Fetch order details via API
  - Display order number, status, items, total
  - "View Order History" button

### Success/Cancel URLs

- Success: `/orders/confirmation?session_id={CHECKOUT_SESSION_ID}`
- Cancel: `/cart`

---

## PR #6: Order History (User View)

**Branch**: `feat/order-history`  
**Time Estimate**: 4-5 hours  
**Dependencies**: PR #4

### Tasks

- [ ] Create `/api/orders/route.ts`
  - `GET /api/orders` - User's orders (paginated, sorted by date desc)
- [ ] Create `/api/orders/[id]/route.ts`
  - `GET /api/orders/[id]` - Order details (verify user owns order)
- [ ] Create `/api/orders/confirmation/route.ts`
  - `GET /api/orders/confirmation?session_id=xxx` - Get order by Stripe session
- [ ] Create `/app/(app)/orders/page.tsx`
- [ ] Create `src/components/orders/OrderCard.tsx`
  - Order number, date, total, status badge
  - Clickable → order detail page
- [ ] Create `src/components/orders/OrderDetail.tsx`
  - Order info, items list, status
- [ ] Create `src/components/orders/OrderStatusBadge.tsx`
  - Color-coded badges: PENDING (yellow), PAID (green), FAILED (red), CANCELLED (gray)
- [ ] Update NavBar: add "Orders" link to user dropdown

### Pagination

- Show 10 orders per page
- Add "Load More" button or pagination controls

---

## PR #7: Admin Orders Dashboard

**Branch**: `feat/admin-orders`  
**Time Estimate**: 5-6 hours  
**Dependencies**: PR #6

### Tasks

- [ ] Create `/api/admin/orders/route.ts`
  - `GET /api/admin/orders` - All orders (paginated, filterable by status)
- [ ] Create `/api/admin/orders/[id]/route.ts`
  - `PATCH /api/admin/orders/[id]` - Update order status
  - Body: `{ status: "PAID" | "CANCELLED" | "FAILED" }`
- [ ] Create `/app/(app)/admin/orders/page.tsx`
- [ ] Create `/app/(app)/admin/orders/columns.tsx`
  - Columns: Order #, User, Date, Total, Status, Actions
- [ ] Create `/app/(app)/admin/orders/OrderTable.tsx`
  - Use existing DataTable component
  - Status filter dropdown
  - Date range filter (optional)
- [ ] Create `/app/(app)/admin/orders/OrderStatusDialog.tsx`
  - Dialog to update order status
- [ ] Add "Orders" link to admin sidebar

### Features

- View all orders with user info
- Filter by status (all, pending, paid, cancelled, failed)
- Click row to view order details
- Update status via dialog

---

## Deployment Checklist

### Environment Variables (Production)

```env
STRIPE_SECRET_KEY=sk_live_... (use test key for staging)
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_... (from Stripe webhook settings)
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Stripe Setup

1. Create Stripe account (test mode)
2. Get API keys from Dashboard
3. Create webhook endpoint in Stripe Dashboard
   - URL: `https://your-domain.com/api/checkout/webhook`
   - Events: `checkout.session.completed`, `checkout.session.expired`
4. Copy webhook signing secret

### Local Development

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/checkout/webhook
```

---

## Testing Strategy

### Per PR Testing

- PR #1: Integration tests for all cart API endpoints
- PR #2: Manual test cart UI flows, Zustand store tests
- PR #3: Manual test product detail page, add to cart
- PR #4: Mock Stripe webhook tests, checkout session creation
- PR #5: Manual test full checkout flow with Stripe test card
- PR #6: Manual test order history, order detail views
- PR #7: Manual test admin orders, status updates

### Final E2E Test (After All PRs)

1. Browse products → product detail
2. Add to cart as guest
3. Update quantities
4. Login (cart syncs)
5. Proceed to checkout
6. Complete payment with Stripe test card: `4242 4242 4242 4242`
7. View order confirmation
8. Check order history
9. Admin: view order, update status

---

## Time Summary

| PR #      | Feature             | Hours           |
| --------- | ------------------- | --------------- |
| 1         | Cart Backend        | 5-6             |
| 2         | Cart Frontend       | 5-6             |
| 3         | Product Detail Page | 4-5             |
| 4         | Checkout Backend    | 6-7             |
| 5         | Checkout Frontend   | 5-6             |
| 6         | Order History       | 4-5             |
| 7         | Admin Orders        | 5-6             |
| **TOTAL** |                     | **34-41 hours** |

**Estimated Timeline**: 5-6 working days (grinding mode)

---

## Notes

- Each PR should be fully tested before merging
- PRs can be worked on in parallel after dependencies are met
- Keep PRs focused - no scope creep
- Use existing UI components where possible (Button, DataTable, Dialog, etc.)
- Follow existing code patterns in the project

---

**Ready to start? Begin with PR #1: Cart Backend APIs**
