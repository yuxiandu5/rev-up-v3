# API Documentation

This document provides comprehensive documentation for all API endpoints in the Rev-Up v3 application.

## Base URL

```
https://your-domain.com/api
```

---

## Authentication API

All authentication endpoints are prefixed with `/api/auth/`.

### Overview

The authentication system implements:

- **Argon2id password hashing** for secure password storage
- **Short-lived access JWTs** (15 minutes default)
- **Rotating refresh tokens** with anti-replay detection
- **One-time tokens** for email verification and password reset
- **HTTP-only cookies** for refresh token storage

---

## Endpoints

### 1. User Registration

**POST** `/api/auth/register`

Creates a new user account and sends email verification.

#### Request Body

```json
{
  "email": "user@example.com",
  "password": "secure_password_123"
}
```

#### Validation Rules

- `email`: Valid email format, max 254 characters
- `password`: Minimum 8 characters, maximum 128 characters

#### Response

**Success (201 Created)**

```json
{
  "message": "User created successfully"
}
```

**Error Responses**

- `400 Bad Request`: Invalid input data
- `409 Conflict`: User with this email already exists
- `500 Internal Server Error`: Server error

#### Flow

1. Validates input data
2. Normalizes email to lowercase
3. Hashes password with Argon2id
4. Creates user in database
5. Generates email verification token
6. Sends verification email
7. Returns success response

---

### 2. User Login

**POST** `/api/auth/login`

Authenticates user and returns access token with refresh cookie.

#### Request Body

```json
{
  "email": "user@example.com",
  "password": "secure_password_123"
}
```

#### Response

**Success (200 OK)**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Sets HTTP-only Cookie**

```
refreshToken=<token>; HttpOnly; Secure; SameSite=Lax; Path=/api/auth/refresh; Max-Age=1209600
```

**Error Responses**

- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Invalid email or password
- `403 Forbidden`: Account is deactivated
- `500 Internal Server Error`: Server error

#### Flow

1. Validates credentials
2. Verifies password with Argon2
3. Checks account status
4. Generates refresh token
5. Creates refresh token record
6. Issues access JWT
7. Sets refresh cookie
8. Updates last login timestamp

---

### 3. Token Refresh

**POST** `/api/auth/refresh`

Exchanges refresh token for new access token (token rotation).

#### Request

No request body required. Uses refresh token from HTTP-only cookie.

#### Response

**Success (200 OK)**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Sets New HTTP-only Cookie**

```
refreshToken=<new_token>; HttpOnly; Secure; SameSite=Lax; Path=/api/auth/refresh; Max-Age=1209600
```

**Error Responses**

- `401 Unauthorized`:
  - No refresh token provided
  - Invalid refresh token
  - Token has been revoked
  - Token replay detected (all sessions revoked)
  - Token has expired
- `403 Forbidden`: Account is deactivated
- `500 Internal Server Error`: Server error

#### Security Features

- **Token Rotation**: Old token marked as consumed, new token created
- **Replay Detection**: Reusing consumed tokens triggers chain revocation
- **Chain Tracking**: Tokens linked via `prevTokenHash` for security auditing

---

### 4. User Logout

**POST** `/api/auth/logout`

Revokes refresh token and clears cookie.

#### Request

No request body required. Uses refresh token from HTTP-only cookie.

#### Response

**Success (204 No Content)**
No response body.

**Clears Cookie**

```
refreshToken=; HttpOnly; Secure; SameSite=Lax; Path=/api/auth/refresh; Max-Age=0
```

**Error Responses**

- `500 Internal Server Error`: Server error (cookie still cleared)

#### Flow

1. Extracts refresh token from cookie
2. Marks token as revoked in database
3. Clears refresh cookie
4. Returns success

---

### 5. Email Verification

**POST** `/api/auth/verify-email`

Verifies user email address using one-time token.

#### Request Body

```json
{
  "token": "abc123def456ghi789..."
}
```

#### Validation Rules

- `token`: Minimum 20 characters

#### Response

**Success (204 No Content)**
No response body.

**Error Responses**

- `400 Bad Request`:
  - Invalid token format
  - Invalid or expired verification token
  - Token already used
  - Token expired
  - Email already verified
- `500 Internal Server Error`: Server error

#### Flow

1. Hashes provided token
2. Finds token in database
3. Validates token type and status
4. Marks token as consumed
5. Sets `emailVerifiedAt` on user
6. Returns success

---

### 6. Request Password Reset

**POST** `/api/auth/request-password-reset`

Initiates password reset process by sending reset email.

#### Request Body

```json
{
  "email": "user@example.com"
}
```

#### Response

**Success (204 No Content)**
No response body. Always returns success to prevent email enumeration.

**Error Responses**

- `400 Bad Request`: Invalid input data
- `500 Internal Server Error`: Server error

#### Security Features

- **Email Enumeration Protection**: Always returns success
- **Token Invalidation**: Revokes existing password reset tokens
- **Rate Limiting**: Should be implemented at infrastructure level

#### Flow

1. Normalizes email
2. Finds user (if exists and active)
3. Revokes existing password reset tokens
4. Generates new reset token (1 hour expiry)
5. Sends password reset email
6. Returns success regardless of user existence

---

### 7. Reset Password

**POST** `/api/auth/reset-password`

Resets user password using one-time token.

#### Request Body

```json
{
  "token": "abc123def456ghi789...",
  "newPassword": "new_secure_password_456"
}
```

#### Validation Rules

- `token`: Minimum 20 characters
- `newPassword`: Minimum 8 characters, maximum 128 characters

#### Response

**Success (204 No Content)**
No response body.

**Error Responses**

- `400 Bad Request`:
  - Invalid input data
  - Invalid or expired reset token
  - Token already used
  - Token expired
- `403 Forbidden`: Account is deactivated
- `500 Internal Server Error`: Server error

#### Security Features

- **Session Invalidation**: Revokes all refresh tokens after password change
- **Token Consumption**: Marks reset token as used

#### Flow

1. Validates token and new password
2. Hashes new password with Argon2id
3. Updates user password
4. Marks token as consumed
5. Revokes all user refresh tokens
6. Returns success

---

## Security Headers

All endpoints include appropriate security headers:

```http
Content-Security-Policy: default-src 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

---

## Error Format

All error responses follow a consistent format:

```json
{
  "error": "Human-readable error message"
}
```

---

## Rate Limiting

**Recommended rate limits** (implement at infrastructure level):

- **Login**: 5 attempts per 15 minutes per IP
- **Register**: 3 attempts per hour per IP
- **Password Reset Request**: 3 attempts per hour per IP
- **Token Refresh**: 10 attempts per minute per IP

---

## Environment Variables

Required environment variables:

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/db

# JWT Configuration
AUTH_JWT_SECRET=your-256-bit-secret-key

# Argon2 Configuration
ARGON2_MEMORY=65536
ARGON2_ITERATIONS=3
ARGON2_PARALLELISM=1

# Token TTL
REFRESH_TTL_DAYS=14
ACCESS_TTL_MIN=15

# Application
APP_BASE_URL=https://your-domain.com

# Email Configuration
EMAIL_FROM=noreply@your-domain.com
SMTP_HOST=smtp.your-provider.com
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
```

---

## Token Details

### Access JWT Structure

```json
{
  "sub": "user_id_here",
  "email": "user@example.com",
  "iat": 1640995200,
  "exp": 1640996100,
  "jti": "unique_token_id"
}
```

### Refresh Token

- **Format**: Base64URL-encoded random 256-bit value
- **Storage**: HTTP-only cookie, hashed in database
- **Rotation**: New token issued on each use
- **Expiry**: 14 days default

### One-Time Tokens

- **Format**: Base64URL-encoded random 256-bit value
- **Types**: `EMAIL_VERIFY`, `PASSWORD_RESET`
- **Storage**: Hashed in database
- **Expiry**: 24 hours (email verify), 1 hour (password reset)

---

## Database Schema

See `prisma/schema.prisma` for complete database schema including:

- **User**: Core user information
- **RefreshToken**: Rotating refresh tokens with chain tracking
- **OneTimeToken**: Email verification and password reset tokens

---

## Testing Endpoints

For development/testing, you can use tools like curl or Postman:

```bash
# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123"}'

# Login user
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123"}' \
  -c cookies.txt

# Refresh token (using saved cookies)
curl -X POST http://localhost:3000/api/auth/refresh \
  -b cookies.txt
```
