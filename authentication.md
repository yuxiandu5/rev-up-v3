# Authentication System

Production‑ready authentication for a Next.js + Prisma + PostgreSQL stack. Designed to be secure, testable, and resume‑worthy without boiling the ocean.

---

## Goals

- Argon2id password hashing
- Short‑lived **access JWT** (stateless)
- **Rotating, hashed refresh tokens** with anti‑replay detection
- Email verification and password reset via **hashed one‑time tokens**
- HTTP‑only, Secure cookies for refresh token
- Input validation, rate limiting, audit‑friendly logs

---

## Tech Stack

- **Runtime**: Next.js (App Router) / Node 18+
- **DB**: PostgreSQL + Prisma
- **Crypto**: `argon2` (Argon2id) or `@node-rs/argon2`, `jose` for JWT, `crypto` for SHA‑256
- **Validation**: `zod`
- **Email**: any SMTP (e.g., Resend/SendGrid/Postmark)

---

## Data Model (Prisma)

> Access JWTs are short‑lived and not stored in the DB.

```prisma
// schema.prisma

datasource db { provider = "postgresql" url = env("DATABASE_URL") }

generator client { provider = "prisma-client-js" }

model User {
  id              String    @id @default(cuid())
  email           String    @unique
  passwordHash    String
  emailVerifiedAt DateTime?
  isActive        Boolean   @default(true)
  lastLoginAt     DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  refreshTokens   RefreshToken[]
  oneTimeTokens   OneTimeToken[]
}

// Rotating, single‑use refresh tokens. Store **hashes** only.
model RefreshToken {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  tokenHash     String   @unique        // sha256(plaintext)
  prevTokenHash String?  @unique        // anti‑replay chain

  userAgent     String?
  ipAddress     String?

  createdAt     DateTime @default(now())
  expiresAt     DateTime
  consumedAt    DateTime?              // set when rotated/used
  revokedAt     DateTime?

  @@index([userId, expiresAt])
}

// Hashed one‑time tokens for email verify & password reset
model OneTimeToken {
  id         String    @id @default(cuid())
  userId     String
  user       User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  type       TokenType
  tokenHash  String    @unique          // sha256(plaintext token)
  createdAt  DateTime  @default(now())
  expiresAt  DateTime
  consumedAt DateTime?
  userAgent  String?
  ipAddress  String?

  @@index([userId, type, expiresAt])
}

enum TokenType {
  EMAIL_VERIFY
  PASSWORD_RESET
}
```

---

## Token Strategy

- **Access JWT**: expires in 10–15 minutes, includes `sub` (user id), `email`, optional `role`, `jti`.
- **Refresh token**: long random (256‑bit). Plaintext only in cookie; DB stores `sha256(token)`.
- **Rotation**: on each refresh, mark the old token `consumedAt`, create a new token with `prevTokenHash` pointing at the old one. Any reuse of an already‑consumed token triggers **replay detection** and the chain is revoked.

### Cookie Settings (refresh token)

- `httpOnly`, `Secure`, `SameSite=Lax`
- `path=/api/auth/refresh` (narrow scope)
- `Max‑Age` equals refresh TTL (7–14 days typical)

---

## API Endpoints

### POST `/api/auth/register`

- Input: `{ email, password }`
- Flow: create user → send email verify link (OneTimeToken: EMAIL_VERIFY)
- Output: 201

### POST `/api/auth/login`

- Input: `{ email, password }`
- Flow: verify password → issue access JWT + refresh token (set cookie) → update `lastLoginAt`
- Output: `{ accessToken }`

### POST `/api/auth/refresh`

- Input: refresh cookie only
- Flow: validate & rotate refresh token → issue new access JWT + set new refresh cookie
- Output: `{ accessToken }`

### POST `/api/auth/logout`

- Input: refresh cookie
- Flow: revoke current refresh token (set `revokedAt`) and clear cookie
- Output: 204

### POST `/api/auth/verify-email`

- Input: `{ token }` (plaintext from link)
- Flow: `sha256(token)` → find OneTimeToken where type=EMAIL_VERIFY, not consumed/expired → set `emailVerifiedAt` and mark token consumed
- Output: 204

### POST `/api/auth/request-password-reset`

- Input: `{ email }`
- Flow: create OneTimeToken: PASSWORD_RESET → email link
- Output: 204

### POST `/api/auth/reset-password`

- Input: `{ token, newPassword }`
- Flow: verify token → set new `passwordHash` → revoke all user refresh tokens → mark token consumed
- Output: 204

---

## Validation (Zod)

```ts
import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(8).max(128),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(20),
  newPassword: z.string().min(8).max(128),
});
```

---

## Crypto & Security Settings

- **Password hashing** (Argon2id suggested defaults; tune for your server):
  - memory: 64–128 MB, iterations: 3, parallelism: 1–2

- **JWT**: sign with `HS256` using a long random secret, or `RS256` with key rotation plan
- **Token generation**: `crypto.randomBytes(32)` → base64url
- **Hashing** refresh/one‑time tokens: `sha256(base64url)` with Node `crypto`
- **Rate limiting**: login/refresh/reset endpoints (e.g., sliding window with Redis)
- **CORS/CSRF**: if using cookies cross‑site, implement CSRF double‑submit token on state‑changing routes

---

## Flows

### Registration

1. Validate input → create `User` with `passwordHash = argon2id(password)`
2. Create `OneTimeToken(EMAIL_VERIFY)` with `tokenHash`
3. Email link: `/verify-email?token=<plaintext>`

### Login

1. Validate input → find user by email
2. `argon2.verify(user.passwordHash, password)`
3. Create refresh token row; set cookie
4. Issue access JWT
5. Update `lastLoginAt`

### Refresh (rotation)

1. Read refresh cookie → hash → find token
2. Check not expired/revoked/consumed
3. Mark current `consumedAt = now`
4. Create new refresh token with `prevTokenHash = current.tokenHash`
5. Set new cookie → issue new access JWT

### Password Reset

1. Request: create OneTimeToken(PASSWORD_RESET), email link
2. Reset: verify token → update `passwordHash` → revoke all user refresh tokens

---

## Pseudocode: Refresh Rotation

```ts
const presented = readCookie("refreshToken");
const hash = sha256(presented);
const tok = await prisma.refreshToken.findUnique({ where: { tokenHash: hash } });

if (!tok || tok.revokedAt || tok.consumedAt || tok.expiresAt < new Date()) {
  throw unauthorized();
}

const newPlain = randomToken();
await prisma.$transaction([
  prisma.refreshToken.update({ where: { id: tok.id }, data: { consumedAt: new Date() } }),
  prisma.refreshToken.create({
    data: {
      userId: tok.userId,
      tokenHash: sha256(newPlain),
      prevTokenHash: tok.tokenHash,
      userAgent: req.headers["user-agent"] ?? null,
      ipAddress: req.ip ?? null,
      expiresAt: addDays(new Date(), 14),
    },
  }),
]);

setRefreshCookie(newPlain);
return issueAccessJwt({ sub: tok.userId });
```

---

## Environment Variables

```
DATABASE_URL=
AUTH_JWT_SECRET= or AUTH_JWT_PRIVATE_KEY= / AUTH_JWT_PUBLIC_KEY=
ARGON2_MEMORY=65536
ARGON2_ITERATIONS=3
ARGON2_PARALLELISM=1
REFRESH_TTL_DAYS=14
ACCESS_TTL_MIN=15
APP_BASE_URL=
EMAIL_FROM=
SMTP_HOST=
SMTP_USER=
SMTP_PASS=
```

---

## Testing Checklist

- Register → email verify → login → refresh → logout
- Reuse of consumed refresh token triggers replay handling
- Expired refresh token is rejected
- Password reset invalidates all refresh tokens
- Invalid/forged tokens are rejected (signature, exp, sub)
- Rate limit kicks in after N failed logins

---

## Observability (nice to have)

- Log security events (login success/failure, token refresh, resets)
- Metrics: login success rate, refresh errors, replay detections

---

## Future Enhancements

- Device/session management UI (per‑device revoke)
- TOTP MFA, optional WebAuthn passkeys
- JWT key rotation and KMS‑backed secrets
- Anomalous session detection (geo‑velocity, device change alerts)

---

## Notes

- Never store plaintext refresh or reset tokens. Always store hashes.
- Keep access tokens short‑lived; treat the refresh cookie like a password.
- On password change, revoke all refresh tokens for the user.
