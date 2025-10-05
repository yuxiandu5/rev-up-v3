# Product Requirements Document (PRD)

## 📋 Document Information

- **Feature**: E-Commerce Marketplace
- **Version**: 1.0
- **Date**: October 4, 2025
- **Author**: Business Analyst
- **Status**: APPROVED
- **Timeline**: 1-2 weeks (grinding mode)

---

## 🎯 Executive Summary

RevUp is adding a full-featured e-commerce marketplace to allow users to browse automotive modification products, add them to cart, and complete purchases via Stripe (test mode). This is a portfolio project designed to demonstrate end-to-end e-commerce platform development experience.

**Primary Goal**: Enable users to browse mods, build a shopping cart, and complete mock purchases with Stripe integration.

---

## 🏆 Goals & Objectives

### Business Goals

1. **Portfolio Demonstration**: Showcase full-stack e-commerce capabilities
2. **User Experience**: Create a professional, "legit-looking" marketplace experience
3. **Learning**: Gain hands-on experience with payment integration and cart management

### User Goals

1. Browse available automotive modification products
2. View detailed product information with compatibility data
3. Add products to shopping cart and manage quantities
4. Complete purchases through Stripe checkout (test mode)
5. View order history and track order status

### Admin Goals

1. View all orders in the system
2. Update order status (PENDING → PAID → CANCELLED)

---

## 📊 Scope

### ✅ In Scope

#### Phase 1: Product Browsing & Cart (Week 1)

- **Product Display**
  - Product detail page with full information
  - Product images, name, description, price
  - Compatibility information (make, model, badge, year range)
  - Performance gains display (HP, torque, handling, 0-100)
  - Add to cart functionality with quantity selector

- **Shopping Cart**
  - Guest cart stored in localStorage
  - Cart syncing on user login (merge localStorage → DB)
  - Add/remove/update quantity operations
  - Cart persistence across sessions
  - Real-time price calculations
  - Clear cart functionality
  - Cart icon in navbar with item count badge

#### Phase 2: Checkout & Orders (Week 1-2)

- **Checkout Flow**
  - Dedicated checkout page (`/checkout`)
  - Order summary review (items, quantities, subtotal, total)
  - "Pay with Stripe" button
  - Integration with Stripe Checkout (test mode)
  - Redirect to Stripe hosted checkout page
  - Success/cancel redirect URLs

- **Payment Integration**
  - Stripe test mode integration
  - Create Stripe checkout session API
  - Handle Stripe webhook for payment confirmation
  - Order status updates via webhook

- **Order Management**
  - Order confirmation page after successful payment
  - Order history page (`/profile/orders` or `/orders`)
  - Order detail view with items and status
  - Order status tracking (PENDING, PAID, FAILED, CANCELLED)

#### Phase 3: Admin Dashboard (Week 2)

- **Admin Orders Management**
  - `/admin/orders` page with DataTable
  - View all orders with filters (status, date, user)
  - Update order status
  - View order details including customer info and items

### ❌ Out of Scope (Future Enhancements)

- Product reviews and ratings
- Wishlist functionality
- Coupon/discount codes
- Refunds and returns processing
- Shipping address collection
- Shipping cost calculations
- Real payment processing (only test mode)
- Email notifications
- Stock/inventory management
- Multi-currency support (AUD only)
- Guest checkout completion (must login to checkout)

---

## 👥 User Stories

### Guest User Stories

```
As a guest user,
- I can browse all available products
- I can view product details
- I can add products to cart (stored in localStorage)
- I can view my cart contents
- I can update cart quantities
- I can remove items from cart
- I MUST login/register to complete checkout
```

### Authenticated User Stories

```
As an authenticated user,
- I can do everything a guest can do
- My cart syncs from localStorage to database on login
- I can proceed to checkout
- I can complete purchases via Stripe
- I can view my order history
- I can see order details and status
```

### Admin User Stories

```
As an admin,
- I can view all orders in the system
- I can filter orders by status, date, user
- I can update order status
- I can view full order details including customer and items
```

---

## 🛠️ Technical Requirements

### Architecture Decisions

#### 1. Cart Management Strategy

**Decision**: Guest Cart in localStorage + DB Cart for authenticated users

**Implementation**:

- Guest users: Cart stored in `localStorage` (persists across sessions)
- Authenticated users: Cart stored in database
- On login: Merge localStorage cart → database cart
  - If item exists in both: sum quantities
  - If item only in localStorage: add to DB cart
  - Clear localStorage cart after merge
- On logout: Keep localStorage cart, delete DB cart remains in DB

#### 2. Authentication Requirement

**Decision**: Guests can add to cart, but MUST login to checkout

**Rationale**: Simplifies the checkout flow, avoids anonymous user complexity, ensures we have user info for orders.

#### 3. Payment Flow

**Decision**: Stripe Checkout (hosted page), not custom payment form

**Rationale**: Faster implementation, Stripe handles PCI compliance, professional UX, perfect for portfolio project.

**Flow**:

1. User clicks "Pay with Stripe" on `/checkout`
2. Backend creates Stripe Checkout Session
3. Redirect to Stripe hosted checkout page
4. User completes payment on Stripe
5. Stripe redirects to success page: `/orders/confirmation?session_id={CHECKOUT_SESSION_ID}`
6. Stripe webhook hits backend to confirm payment
7. Backend creates Order, marks as PAID, clears cart
8. User sees confirmation page

#### 4. Order Creation Timing

**Decision**: Create Order with PENDING status on checkout initiation

**Flow**:

1. User clicks "Pay with Stripe" → Create Order (PENDING)
2. Redirect to Stripe
3. Webhook receives payment → Update Order (PAID)
4. If payment fails → Update Order (FAILED)
5. If user cancels → Update Order (CANCELLED) or delete

---

## 🗄️ Database Schema

### Existing Models (No Changes Needed)

```prisma
✅ User - already exists
✅ Product - already exists
✅ Cart - already exists
✅ CartItem - already exists
✅ Order - already exists
✅ OrderItem - already exists
✅ OrderStatus enum - already exists (PENDING, PAID, FAILED, CANCELLED)
```

**No database migrations required!** Schema is already complete.

---

## 🌐 API Endpoints

### Cart APIs (`/api/cart`)

| Endpoint          | Method | Description                  | Auth     |
| ----------------- | ------ | ---------------------------- | -------- |
| `/api/cart`       | GET    | Get user's cart with items   | Required |
| `/api/cart/items` | POST   | Add item to cart             | Required |
| `/api/cart/items` | PATCH  | Update item quantity         | Required |
| `/api/cart/items` | DELETE | Remove item from cart        | Required |
| `/api/cart`       | DELETE | Clear entire cart            | Required |
| `/api/cart/sync`  | POST   | Sync localStorage cart to DB | Required |

### Checkout APIs (`/api/checkout`)

| Endpoint                       | Method | Description                    | Auth                      |
| ------------------------------ | ------ | ------------------------------ | ------------------------- |
| `/api/checkout/create-session` | POST   | Create Stripe checkout session | Required                  |
| `/api/checkout/webhook`        | POST   | Stripe webhook handler         | Public (Stripe signature) |

### Order APIs (`/api/orders`)

| Endpoint                   | Method | Description                    | Auth     |
| -------------------------- | ------ | ------------------------------ | -------- |
| `/api/orders`              | GET    | Get user's orders (paginated)  | Required |
| `/api/orders/[id]`         | GET    | Get order details by ID        | Required |
| `/api/orders/confirmation` | GET    | Get order by Stripe session ID | Required |

### Admin Order APIs (`/api/admin/orders`)

| Endpoint                 | Method | Description                            | Auth  |
| ------------------------ | ------ | -------------------------------------- | ----- |
| `/api/admin/orders`      | GET    | Get all orders (paginated, filterable) | Admin |
| `/api/admin/orders/[id]` | PATCH  | Update order status                    | Admin |

### Existing APIs (Already Implemented)

- ✅ `GET /api/market-place` - Get all products (paginated, filterable)
- ✅ `GET /api/market-place/[id]` - Get product details

---

## 🎨 Frontend Pages & Components

### New Pages

| Route                          | Component               | Description                                       |
| ------------------------------ | ----------------------- | ------------------------------------------------- |
| `/product/[id]`                | `ProductDetailPage`     | Full product information, add to cart             |
| `/cart`                        | `CartPage`              | View cart, update quantities, proceed to checkout |
| `/checkout`                    | `CheckoutPage`          | Order summary, pay with Stripe                    |
| `/orders/confirmation`         | `OrderConfirmationPage` | Post-payment success page                         |
| `/orders` or `/profile/orders` | `OrderHistoryPage`      | User's past orders                                |
| `/admin/orders`                | `AdminOrdersPage`       | Admin view all orders                             |

### New Components

| Component          | Location                  | Description                            |
| ------------------ | ------------------------- | -------------------------------------- |
| `ProductCard`      | `components/marketplace/` | Clickable product card for gallery     |
| `ProductDetail`    | `components/marketplace/` | Product detail layout                  |
| `CartItem`         | `components/cart/`        | Single cart item row with qty selector |
| `CartSummary`      | `components/cart/`        | Price breakdown (subtotal, total)      |
| `CheckoutSummary`  | `components/checkout/`    | Read-only order summary                |
| `OrderCard`        | `components/orders/`      | Single order in history list           |
| `OrderDetail`      | `components/orders/`      | Full order details view                |
| `OrderStatusBadge` | `components/orders/`      | Status badge (pending/paid/etc)        |

### Updated Components

| Component | Changes                             |
| --------- | ----------------------------------- |
| `NavBar`  | Add cart icon with item count badge |

### State Management (Zustand)

**New Store**: `cartStore.ts`

```typescript
interface CartState {
  // Guest cart (localStorage)
  guestCart: CartItem[];

  // DB cart (authenticated)
  dbCart: CartItem[] | null;

  // Computed
  itemCount: number;
  subtotal: number;

  // Actions
  addItem: (productId: string, quantity: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  syncGuestCart: () => Promise<void>; // Called on login
  fetchCart: () => Promise<void>;
}
```

**Storage Strategy**:

- Use Zustand persist middleware
- Store `guestCart` in localStorage
- Fetch `dbCart` from API when authenticated
- Provide unified `cart` getter that returns appropriate cart

---

## ✅ Task Breakdown with Time Estimates

### 🔧 Backend Tasks (Total: ~22-29 hours)

#### Cart API Implementation (4-5 hours)

- [ ] **Task 1.1**: Create cart DTOs and types (30 min)
- [ ] **Task 1.2**: `GET /api/cart` - Fetch user cart (45 min)
- [ ] **Task 1.3**: `POST /api/cart/items` - Add item to cart (1 hour)
- [ ] **Task 1.4**: `PATCH /api/cart/items` - Update quantity (45 min)
- [ ] **Task 1.5**: `DELETE /api/cart/items` - Remove item (30 min)
- [ ] **Task 1.6**: `DELETE /api/cart` - Clear cart (30 min)
- [ ] **Task 1.7**: `POST /api/cart/sync` - Sync guest cart (1 hour)

#### Checkout & Order API (5-6 hours)

- [ ] **Task 2.1**: Setup Stripe SDK and environment variables (30 min)
- [ ] **Task 2.2**: `POST /api/checkout/create-session` endpoint (2 hours)
  - Create Stripe checkout session
  - Create Order with PENDING status
  - Return session URL
- [ ] **Task 2.3**: `POST /api/checkout/webhook` - Stripe webhook handler (2-3 hours)
  - Verify Stripe signature
  - Handle `checkout.session.completed` event
  - Update Order status to PAID
  - Create OrderItems from cart
  - Clear user's cart
- [ ] **Task 2.4**: Handle payment failure/cancellation (1 hour)

#### Order API (3-4 hours)

- [ ] **Task 3.1**: Create order DTOs and types (30 min)
- [ ] **Task 3.2**: `GET /api/orders` - User orders with pagination (1.5 hours)
- [ ] **Task 3.3**: `GET /api/orders/[id]` - Order details (1 hour)
- [ ] **Task 3.4**: `GET /api/orders/confirmation` - Get order by session ID (1 hour)

#### Admin Order API (3-4 hours)

- [ ] **Task 4.1**: `GET /api/admin/orders` - All orders with filters (2 hours)
- [ ] **Task 4.2**: `PATCH /api/admin/orders/[id]` - Update order status (1-2 hours)

#### Validation & Error Handling (2-3 hours)

- [ ] **Task 5.1**: Add Zod schemas for all new endpoints (1 hour)
- [ ] **Task 5.2**: Error handling for cart operations (1 hour)
- [ ] **Task 5.3**: Add proper logging (30 min)

#### Integration Tests (5-7 hours)

- [ ] **Task 6.1**: Cart operation tests (2 hours)
- [ ] **Task 6.2**: Checkout flow tests (2 hours)
- [ ] **Task 6.3**: Order creation tests (1 hour)
- [ ] **Task 6.4**: Mock Stripe webhook tests (2 hours)

---

### 🎨 Frontend Tasks (Total: ~24-31 hours)

#### Cart Store & State Management (3-4 hours)

- [ ] **Task 7.1**: Create `cartStore.ts` with Zustand (2 hours)
- [ ] **Task 7.2**: Implement localStorage persistence (1 hour)
- [ ] **Task 7.3**: Add cart sync logic on login (1 hour)

#### Product Detail Page (3-4 hours)

- [ ] **Task 8.1**: Create `/product/[id]` route and page (1 hour)
- [ ] **Task 8.2**: `ProductDetail` component layout (1.5 hours)
- [ ] **Task 8.3**: Add to cart functionality (1 hour)
- [ ] **Task 8.4**: Quantity selector component (30 min)

#### Shopping Cart Page (4-5 hours)

- [ ] **Task 9.1**: Create `/cart` route and page (1 hour)
- [ ] **Task 9.2**: `CartItem` component with quantity controls (1.5 hours)
- [ ] **Task 9.3**: `CartSummary` component (1 hour)
- [ ] **Task 9.4**: Empty cart state (30 min)
- [ ] **Task 9.5**: "Proceed to Checkout" button logic (30 min)

#### Checkout Page (3-4 hours)

- [ ] **Task 10.1**: Create `/checkout` route and page (1 hour)
- [ ] **Task 10.2**: `CheckoutSummary` component (1.5 hours)
- [ ] **Task 10.3**: Stripe integration - redirect to checkout (1-1.5 hours)
- [ ] **Task 10.4**: Loading states and error handling (30 min)

#### Order Confirmation & History (4-5 hours)

- [ ] **Task 11.1**: Create `/orders/confirmation` page (1.5 hours)
- [ ] **Task 11.2**: Create `/orders` (or `/profile/orders`) page (1 hour)
- [ ] **Task 11.3**: `OrderCard` component (1 hour)
- [ ] **Task 11.4**: `OrderDetail` component (1.5 hours)
- [ ] **Task 11.5**: `OrderStatusBadge` component (30 min)

#### Admin Orders Page (4-5 hours)

- [ ] **Task 12.1**: Create `/admin/orders` page (1 hour)
- [ ] **Task 12.2**: Orders DataTable with columns (2 hours)
- [ ] **Task 12.3**: Order status update functionality (1-2 hours)
- [ ] **Task 12.4**: Filters (status, date range) (1 hour)

#### Navigation & UI Updates (2-3 hours)

- [ ] **Task 13.1**: Add cart icon to NavBar with count badge (1 hour)
- [ ] **Task 13.2**: Update marketplace gallery cards to link to detail page (1 hour)
- [ ] **Task 13.3**: UI polish and responsive design (1 hour)

#### Frontend Testing (3-4 hours)

- [ ] **Task 14.1**: Cart store tests (1 hour)
- [ ] **Task 14.2**: Component rendering tests (1 hour)
- [ ] **Task 14.3**: User flow tests (Playwright/Cypress) (2 hours)

---

### 🎨 Design & Polish (4-6 hours)

- [ ] **Task 15.1**: Design consistency across all pages (2 hours)
- [ ] **Task 15.2**: Loading states and skeletons (1 hour)
- [ ] **Task 15.3**: Error states and toast notifications (1 hour)
- [ ] **Task 15.4**: Mobile responsiveness (2 hours)

---

## 📊 Total Time Estimate

| Category                | Hours           |
| ----------------------- | --------------- |
| Backend Implementation  | 22-29 hours     |
| Frontend Implementation | 24-31 hours     |
| Design & Polish         | 4-6 hours       |
| **TOTAL**               | **50-66 hours** |

**Timeline**: 6-8 full working days (grinding mode)

---

## 🧪 Testing Strategy

### Integration Tests (Backend)

- Cart CRUD operations
- Cart syncing on login
- Checkout session creation
- Stripe webhook processing
- Order creation and status updates
- Admin order management

### E2E Tests (Frontend)

- Complete shopping flow: browse → detail → cart → checkout → confirmation
- Cart management: add/update/remove items
- Order history viewing
- Admin order management

### Manual Testing Checklist

- [ ] Guest cart persistence across browser refresh
- [ ] Cart sync on login (merge with DB cart)
- [ ] Add to cart from product detail page
- [ ] Update quantities in cart
- [ ] Remove items from cart
- [ ] Checkout flow with Stripe test card
- [ ] Order confirmation page displays correctly
- [ ] Order history shows past orders
- [ ] Admin can view and update order status
- [ ] Cart icon badge updates in real-time
- [ ] Mobile responsive on all pages

---

## 🚨 Risks & Mitigation

| Risk                                         | Impact | Mitigation                                  |
| -------------------------------------------- | ------ | ------------------------------------------- |
| Stripe webhook not receiving events locally  | High   | Use Stripe CLI for local webhook forwarding |
| Cart sync conflicts (race conditions)        | Medium | Use database transactions for cart merge    |
| Large cart items causing localStorage limits | Low    | Limit cart to 50 items max                  |
| Session timeout during checkout              | Medium | Clear error messaging, preserve cart        |
| Order status not updating from webhook       | High   | Add retry logic, manual admin override      |

---

## 🚀 Success Criteria

### Must Have (MVP)

- ✅ Users can browse products and view details
- ✅ Users can add products to cart (guest or authenticated)
- ✅ Cart persists across sessions
- ✅ Users can update cart quantities and remove items
- ✅ Authenticated users can checkout via Stripe
- ✅ Orders are created and tracked with status
- ✅ Users can view order history
- ✅ Admins can view and manage all orders
- ✅ All APIs have proper error handling
- ✅ Integration tests cover main flows

### Nice to Have (Stretch Goals)

- 🎯 Order status change triggers (e.g., admin comments)
- 🎯 Export orders to CSV (admin)
- 🎯 Advanced order filtering (date range, amount, etc.)
- 🎯 Cart item recommendations (related products)

---

## 📅 Milestones

### Week 1: Foundation

- ✅ **Days 1-2**: Backend Cart APIs + Tests
- ✅ **Days 3-4**: Frontend Cart Store + Cart Page
- ✅ **Day 5**: Product Detail Page

### Week 2: Checkout & Orders

- ✅ **Days 6-7**: Stripe Integration + Checkout Flow
- ✅ **Day 8**: Order History + Confirmation Page
- ✅ **Day 9**: Admin Orders Dashboard
- ✅ **Day 10**: Testing, Bug Fixes, Polish

---

## 🔗 Dependencies

### External Services

- **Stripe**: Test mode account required
  - Get test API keys from Stripe Dashboard
  - Setup webhook endpoint
  - Use Stripe CLI for local development

### Environment Variables

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### NPM Packages (New)

- `stripe` - Stripe Node.js SDK
- `@stripe/stripe-js` - Stripe.js for frontend

---

## 📝 Notes & Assumptions

1. **Payment Processing**: Only test mode, no real money transactions
2. **Shipping**: Not implemented, products assumed digital/pickup
3. **Tax**: Not calculated, prices are final
4. **Currency**: AUD only, no multi-currency
5. **Stock**: Not tracked, assume unlimited inventory
6. **Emails**: Not sent, order confirmation shown on screen only
7. **Guest Checkout**: Not allowed, users must register/login
8. **Cart Limits**: Maximum 50 items, maximum 99 quantity per item
9. **Order Cancellation**: Admin can cancel, users cannot
10. **Refunds**: Not implemented

---

## ✅ Approval & Sign-off

**Business Analyst**: Approved ✅  
**Senior Engineer**: Approved ✅  
**Product Owner (You)**: _Awaiting your confirmation..._

---

## 🎯 Next Steps

1. **Review this PRD** - Confirm all requirements are accurate
2. **Setup Stripe Account** - Get test API keys
3. **Create Feature Branch** - `feat/marketplace-ecommerce`
4. **Start with Backend** - Cart APIs first (quickest to test)
5. **Build Frontend** - Start with cart store and cart page
6. **Integrate Stripe** - Checkout flow and webhook
7. **Admin Dashboard** - Orders management
8. **Testing** - Full flow testing
9. **Polish & Deploy** - Make it look professional

---

**Questions or Changes?** Let me know and we'll update this PRD before implementation!
