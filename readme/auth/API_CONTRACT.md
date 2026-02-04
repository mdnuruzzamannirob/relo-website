# Authentication API Contract

## Overview

This document defines the expected API endpoints and responses for the authentication system.

## Base URL

```
http://localhost:3001/api
```

## Authentication Header

All protected endpoints require:

```
Authorization: Bearer {token}
```

---

## Endpoints

### 1. Sign Up

**Endpoint:** `POST /auth/sign-up`

**Request:**

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (200):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_123",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "buyer",
    "isVerified": false,
    "createdAt": "2026-02-04T10:00:00Z",
    "updatedAt": "2026-02-04T10:00:00Z"
  }
}
```

**Error Responses:**

- 400: Validation error (invalid email, weak password, etc.)
- 409: Email already exists
- 500: Server error

---

### 2. Sign In

**Endpoint:** `POST /auth/sign-in`

**Request:**

```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (200):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_123",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "buyer",
    "isVerified": true,
    "createdAt": "2026-02-04T10:00:00Z",
    "updatedAt": "2026-02-04T10:00:00Z"
  }
}
```

**Error Responses:**

- 400: Invalid credentials
- 404: User not found
- 500: Server error

---

### 3. Get Current User

**Endpoint:** `GET /auth/me`

**Headers:**

```
Authorization: Bearer {token}
```

**Success Response (200):**

```json
{
  "id": "user_123",
  "fullName": "John Doe",
  "email": "john@example.com",
  "role": "buyer",
  "isVerified": true,
  "createdAt": "2026-02-04T10:00:00Z",
  "updatedAt": "2026-02-04T10:00:00Z"
}
```

**Error Responses:**

- 401: Unauthorized (invalid/missing token)
- 500: Server error

---

### 4. Forgot Password

**Endpoint:** `POST /auth/forgot-password`

**Request:**

```json
{
  "email": "john@example.com"
}
```

**Success Response (200):**

```json
{
  "otpId": "otp_xyz789",
  "expiresIn": 600,
  "message": "OTP sent to your email"
}
```

**Notes:**

- OTP should be 6 digits
- Expires in 10 minutes (600 seconds)
- OTP sent to user's email
- Resend limit: 1 per minute

**Error Responses:**

- 400: Invalid email
- 404: User not found
- 429: Too many requests (rate limited)
- 500: Server error

---

### 5. Verify OTP

**Endpoint:** `POST /auth/verify-otp`

**Request:**

```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Success Response (200):**

```json
{
  "valid": true
}
```

**Error Responses:**

- 400: Invalid OTP or email
- 401: OTP expired
- 404: User not found
- 500: Server error

---

### 6. Reset Password

**Endpoint:** `POST /auth/reset-password`

**Request:**

```json
{
  "email": "john@example.com",
  "otp": "123456",
  "newPassword": "NewSecurePass456!"
}
```

**Success Response (200):**

```json
{
  "message": "Password reset successfully"
}
```

**Error Responses:**

- 400: Invalid data or validation error
- 401: Invalid OTP
- 404: User not found
- 500: Server error

---

### 7. Change Password

**Endpoint:** `POST /auth/change-password`

**Headers:**

```
Authorization: Bearer {token}
```

**Request:**

```json
{
  "oldPassword": "SecurePass123!",
  "newPassword": "NewSecurePass456!"
}
```

**Success Response (200):**

```json
{
  "message": "Password changed successfully"
}
```

**Error Responses:**

- 400: Old password incorrect or validation error
- 401: Unauthorized
- 500: Server error

---

### 8. Logout

**Endpoint:** `POST /auth/logout`

**Headers:**

```
Authorization: Bearer {token}
```

**Success Response (200):**

```json
{
  "message": "Logged out successfully"
}
```

**Error Responses:**

- 401: Unauthorized
- 500: Server error

---

## Error Response Format

All error responses follow this format:

```json
{
  "statusCode": 400,
  "message": "Descriptive error message",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "password",
      "message": "Password must contain at least one special character"
    }
  ]
}
```

---

## User Role Values

```typescript
type UserRole = 'buyer' | 'seller' | 'admin';
```

---

## Token Claims (JWT Payload)

Recommended JWT payload structure:

```json
{
  "sub": "user_123",
  "email": "john@example.com",
  "role": "buyer",
  "iat": 1702000000,
  "exp": 1702086400
}
```

---

## Validation Rules

### Password Requirements

- Minimum 8 characters
- At least 1 uppercase letter (A-Z)
- At least 1 lowercase letter (a-z)
- At least 1 number (0-9)
- At least 1 special character (!@#$%^&\*)

### Email Validation

- Valid RFC 5322 format
- Unique per user (409 conflict if exists)
- Case-insensitive matching recommended

### Full Name Validation

- 2-50 characters
- Alphanumeric and spaces allowed

### OTP Validation

- Exactly 6 digits
- Expires after 10 minutes
- Single use only (cannot reuse same OTP)

---

## Rate Limiting Recommendations

| Endpoint        | Rate Limit                |
| --------------- | ------------------------- |
| Sign Up         | 5 per hour per IP         |
| Sign In         | 10 per hour per email     |
| Forgot Password | 1 per minute per email    |
| Verify OTP      | 5 per minute per email    |
| Reset Password  | 1 per 5 minutes per email |
| Get Me          | No limit (authenticated)  |
| Change Password | 1 per hour per user       |

---

## Security Recommendations

1. **HTTPS Only** - Always use HTTPS in production
2. **Token Expiration** - JWT tokens should expire (recommended 24 hours)
3. **Refresh Tokens** - Use refresh tokens for renewing access (recommended 7 days)
4. **CORS** - Configure CORS for frontend domain only
5. **Password Hashing** - Use bcrypt with salt rounds ≥ 10
6. **Email Verification** - Consider requiring email verification
7. **2FA** - Consider adding two-factor authentication
8. **Account Lockout** - Lock account after 5 failed login attempts
9. **CSRF Protection** - Use CSRF tokens for state-changing operations
10. **SQL Injection** - Use parameterized queries

---

## Implementation Examples

### Node.js/Express

```typescript
router.post('/auth/sign-up', async (req, res) => {
  const { fullName, email, password } = req.body;

  // Validate input
  if (!email || !password || !fullName) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: 'Email already exists' });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
    role: 'buyer',
  });

  // Generate token
  const token = jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' },
  );

  res.status(200).json({
    token,
    refreshToken: generateRefreshToken(user.id),
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
});
```

### Frontend Usage

```typescript
const response = await signUp({
  fullName: 'John Doe',
  email: 'john@example.com',
  password: 'SecurePass123!',
}).unwrap();

// Response automatically stored
localStorage.setItem('authToken', response.token);
```

---

## Testing the API

### Use Postman or cURL

```bash
# Sign Up
curl -X POST http://localhost:3001/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!"
  }' | jq

# Sign In
curl -X POST http://localhost:3001/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }' | jq

# Get token from response, then:

# Get Me
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" | jq

# Logout
curl -X POST http://localhost:3001/api/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" | jq
```

---

## Response Status Codes

| Code | Meaning                              |
| ---- | ------------------------------------ |
| 200  | OK - Successful request              |
| 400  | Bad Request - Invalid input          |
| 401  | Unauthorized - Invalid/missing token |
| 404  | Not Found - Resource not found       |
| 409  | Conflict - Email already exists      |
| 429  | Too Many Requests - Rate limited     |
| 500  | Server Error - Internal server error |

---

## Changelog

### v1.0.0 (2026-02-04)

- Initial authentication API specification
- 8 endpoints defined
- Complete validation rules
- Security recommendations
- Example implementations

---

**Last Updated:** February 4, 2026
**Version:** 1.0.0
