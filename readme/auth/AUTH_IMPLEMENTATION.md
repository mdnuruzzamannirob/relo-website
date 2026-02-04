# Authentication System Implementation Guide

## Overview

A complete authentication system with TypeScript, React Hook Form, Zod validation, and Redux Toolkit Query (RTK Query) for state management and API caching.

## Features Implemented

### ✅ Core Authentication Pages

1. **Sign Up** (`/sign-up`) - User registration with full validation
2. **Sign In** (`/sign-in`) - Login with email and password
3. **Forgot Password** (`/forgot-password`) - Request password reset OTP
4. **Verify OTP** (`/verify-otp`) - 6-digit OTP verification with auto-focus
5. **Reset Password** (`/reset-password`) - Create new password with validation

### ✅ Validation & Security

- **React Hook Form** for efficient form state management
- **Zod Schema Validation** with real-time feedback
- **Password Requirements:**
  - Minimum 8 characters
  - At least one uppercase letter (A-Z)
  - At least one lowercase letter (a-z)
  - At least one number (0-9)
  - At least one special character (!@#$%^&\*)
- **Password Mismatch Prevention** - Confirm password validation
- **Email Validation** - RFC-compliant email format checking
- **All Fields Required** - No optional fields in auth forms

### ✅ Loading & UX

- **Disabled Buttons During Loading** - Form inputs and buttons disabled when request is in progress
- **Loading States** - Spinner indicators with loading text
- **Real-time Validation Feedback** - Visual error messages with icons
- **Password Strength Indicators** - Green checkmarks for satisfied requirements
- **Resend OTP Timer** - 60-second cooldown with countdown display
- **Form Field Validation Messages** - Alert icons with descriptive error text

### ✅ State Management (RTK Query)

- **Global User State** - Redux slice for storing authenticated user
- **API Caching** - Automatic cache invalidation on login/logout
- **Auth Token Management** - Tokens stored in localStorage
- **Automatic User Fetching** - `getMe` query called after signup/login

## Project Structure

```
src/
├── types/
│   └── auth.ts                    # Auth type definitions
├── lib/
│   └── schema/
│       └── auth.ts               # Zod validation schemas
├── store/
│   ├── hook.ts                   # Redux hooks (useAppDispatch, useAppSelector)
│   ├── store.ts                  # Redux store configuration
│   ├── slices/
│   │   └── userSlice.ts         # User state management
│   └── apis/
│       └── authApi.ts           # RTK Query auth endpoints
├── components/modules/auth/
│   ├── SignUpForm.tsx           # Sign-up page
│   ├── SignInForm.tsx           # Sign-in page
│   ├── ForgotPasswordForm.tsx    # Password reset request
│   ├── VerifyOtpForm.tsx        # OTP verification
│   └── ResetPasswordForm.tsx     # New password creation
└── app/
    └── provider.tsx             # Redux provider wrapper
```

## Type Definitions

### User Type

```typescript
interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'buyer' | 'seller' | 'admin';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Auth Response

```typescript
interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: User;
}
```

## Validation Schemas

### SignUpFormData

- `fullName`: 2-50 characters required
- `email`: Valid email required
- `password`: 8+ chars, uppercase, lowercase, number, special char
- `confirmPassword`: Must match password
- `agreeTerms`: Must be checked

### SignInFormData

- `email`: Valid email required
- `password`: Required

### ForgotPasswordFormData

- `email`: Valid email required

### OTPVerificationFormData

- `email`: Valid email (from sessionStorage)
- `otp`: Exactly 6 digits required

### ResetPasswordFormData

- `email`: Valid email (from sessionStorage)
- `otp`: Exactly 6 digits
- `newPassword`: 8+ chars, uppercase, lowercase, number, special char
- `confirmPassword`: Must match newPassword

## RTK Query API Endpoints

### Sign Up

```typescript
signUp({ fullName, email, password })
→ AuthResponse
```

- Stores token in localStorage
- Invalidates User tag for cache refresh

### Sign In

```typescript
signIn({ email, password })
→ AuthResponse
```

- Stores token in localStorage
- Invalidates User tag for cache refresh

### Get Current User

```typescript
getMe()
→ User
```

- Provides the User tag for caching
- Called automatically after signup/login

### Forgot Password

```typescript
forgotPassword({ email })
→ OTPResponse
```

- Sends OTP to user's email

### Verify OTP

```typescript
verifyOTP({ email, otp })
→ { valid: boolean }
```

- Validates the 6-digit OTP
- Stores email and OTP in sessionStorage for reset form

### Reset Password

```typescript
resetPassword({ email, otp, newPassword })
→ { message: string }
```

- Resets password using OTP
- Clears sessionStorage

### Change Password

```typescript
changePassword({ oldPassword, newPassword })
→ { message: string }
```

- For authenticated users to change password
- Invalidates User tag

### Logout

```typescript
logout()
→ { message: string }
```

- Clears tokens from localStorage
- Resets Redux state
- Invalidates all cached data

## State Management

### User Slice Actions

```typescript
setUser(user: User | null)     // Store user data
setIsAuthenticated(bool)        // Set auth status
setIsLoading(bool)             // Set loading state
clearUser()                    // Clear user data on logout
```

### Global User State

```typescript
interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
```

## Using Authentication Hooks

### Sign Up

```typescript
const [signUp, { isLoading }] = useSignUpMutation();

const response = await signUp({
  fullName: 'John Doe',
  email: 'john@example.com',
  password: 'SecurePass123!',
}).unwrap();

dispatch(setUser(response.user));
```

### Sign In

```typescript
const [signIn, { isLoading }] = useSignInMutation();

const response = await signIn({
  email: 'john@example.com',
  password: 'SecurePass123!',
}).unwrap();

dispatch(setUser(response.user));
```

### Get Current User

```typescript
const { data: user, isLoading } = useGetMeQuery();
```

### Logout

```typescript
const [logout, { isLoading }] = useLogoutMutation();

await logout().unwrap();
// User state automatically cleared
```

## Flow Diagrams

### Sign Up Flow

```
Sign Up Form
  ↓
React Hook Form + Zod Validation
  ↓
Call useSignUpMutation
  ↓
API: POST /auth/sign-up
  ↓
Store token in localStorage
  ↓
Invalidate User cache
  ↓
Dispatch setUser action
  ↓
Redirect to /buyer/overview
```

### Password Reset Flow

```
Forgot Password Form
  ↓
Enter email
  ↓
Call useForgotPasswordMutation
  ↓
API: POST /auth/forgot-password
  ↓
Store email in sessionStorage
  ↓
Redirect to /verify-otp
  ↓
Enter 6-digit OTP
  ↓
Call useVerifyOTPMutation
  ↓
API: POST /auth/verify-otp
  ↓
Store email & OTP in sessionStorage
  ↓
Redirect to /reset-password
  ↓
Enter new password
  ↓
Call useResetPasswordMutation
  ↓
API: POST /auth/reset-password
  ↓
Clear sessionStorage
  ↓
Redirect to /sign-in
```

## Session Storage Usage

### Forgot Password Flow

- `forgotPasswordEmail`: Passed from forgot-password to verify-otp to reset-password
- `resetPasswordOTP`: Passed from verify-otp to reset-password
- Cleared after successful password reset

## Environment Variables

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Installation & Setup

### 1. Install Dependencies

```bash
pnpm install
pnpm add @reduxjs/toolkit react-redux
```

### 2. Import Redux Provider in Root Layout

```tsx
// src/app/provider.tsx
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/store/store';

export default function Provider({ children }) {
  return <ReduxProvider store={store}>{children}</ReduxProvider>;
}
```

### 3. Use Auth Hooks in Components

```tsx
import { useSignInMutation } from '@/store/apis/authApi';
import { useAppDispatch } from '@/store/hook';

function LoginComponent() {
  const [signIn] = useSignInMutation();
  const dispatch = useAppDispatch();
  // ... implementation
}
```

## Best Practices

1. **Always use useAppDispatch and useAppSelector** - Typed Redux hooks
2. **Store tokens in localStorage** - Persists across page reloads
3. **Use sessionStorage for OTP flow** - Cleared after password reset
4. **Invalidate User tag on login** - Ensures fresh user data
5. **Disable form inputs during loading** - Better UX
6. **Show validation errors inline** - Real-time feedback
7. **Use Zod for validation** - Type-safe and declarative
8. **Implement proper error handling** - Catch API errors gracefully

## Common Implementation Patterns

### Protected Route Hook (Example)

```typescript
export function useProtectedRoute() {
  const { user } = useAppSelector((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/sign-in');
    }
  }, [user, router]);

  return user;
}
```

### Error Handling

```typescript
try {
  const response = await signUp(data).unwrap();
  dispatch(setUser(response.user));
} catch (error: any) {
  // Handle specific error codes
  if (error.status === 409) {
    // Email already exists
  } else if (error.status === 400) {
    // Validation error
  }
}
```

## Testing Checklist

- [ ] Sign up with valid credentials
- [ ] Sign up with invalid email format
- [ ] Sign up with mismatched passwords
- [ ] Sign up with weak password
- [ ] Sign up with unchecked terms
- [ ] Sign in with correct credentials
- [ ] Sign in with incorrect password
- [ ] Sign in with non-existent email
- [ ] Forgot password flow (request → verify → reset)
- [ ] OTP verification with wrong code
- [ ] OTP resend timer
- [ ] Token persists on page reload
- [ ] Logout clears auth state
- [ ] Password reset validation
- [ ] All form fields disabled during loading
- [ ] Error messages display correctly
- [ ] Redirects work correctly

## Troubleshooting

### "authToken not found" on page reload

- Check localStorage is enabled
- Verify token is being stored: `localStorage.setItem('authToken', token)`

### "User not fetching after login"

- Ensure `getMe` is called after signup/login
- Check API endpoint returns correct User type
- Verify invalidatesTags: ['User'] is set

### "OTP form showing blank email"

- Verify sessionStorage.getItem('forgotPasswordEmail') returns value
- Check redirect from forgot-password to verify-otp

### "Form not submitting"

- Check all fields pass Zod validation
- Verify loading state isn't blocking submission
- Check console for API errors

---

**Last Updated:** February 4, 2026
**Version:** 1.0.0
