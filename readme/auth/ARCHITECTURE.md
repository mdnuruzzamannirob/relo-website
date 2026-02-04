# Authentication System - Visual Architecture & Data Flow

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Next.js Application                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Redux Store (Global State)                  │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │                                                           │   │
│  │  ┌────────────────────┐  ┌──────────────────────────┐   │   │
│  │  │   User Slice       │  │   RTK Query API Cache    │   │   │
│  │  ├────────────────────┤  ├──────────────────────────┤   │   │
│  │  │ user: User | null  │  │ authApi endpoints        │   │   │
│  │  │ isAuthenticated    │  │ - signUp                 │   │   │
│  │  │ isLoading          │  │ - signIn                 │   │   │
│  │  └────────────────────┘  │ - getMe                  │   │   │
│  │                          │ - forgotPassword         │   │   │
│  │                          │ - verifyOTP              │   │   │
│  │                          │ - resetPassword          │   │   │
│  │                          │ - logout                 │   │   │
│  │                          └──────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           ↓↑                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              React Components                            │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │                                                           │   │
│  │  SignUpForm    SignInForm    ForgotPasswordForm          │   │
│  │       ↓              ↓                  ↓                 │   │
│  │   React Hook Form + Zod Validation                      │   │
│  │                                                           │   │
│  │  VerifyOtpForm    ResetPasswordForm                      │   │
│  │       ↓                   ↓                               │   │
│  │   React Hook Form + Zod Validation                      │   │
│  │                                                           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           ↓↑                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │        localStorage / sessionStorage                     │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │ authToken          forgotPasswordEmail    resetPasswordOTP  │
│  │ refreshToken       (sessionStorage)       (sessionStorage)   │
│  │                    resetPasswordEmail     resetPasswordEmail │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                          ↓↑
                    Fetch with Auth Header
                          ↓↑
        ┌──────────────────────────────────────┐
        │     Backend API Server               │
        ├──────────────────────────────────────┤
        │ POST /auth/sign-up                   │
        │ POST /auth/sign-in                   │
        │ GET  /auth/me                        │
        │ POST /auth/forgot-password           │
        │ POST /auth/verify-otp                │
        │ POST /auth/reset-password            │
        │ POST /auth/change-password           │
        │ POST /auth/logout                    │
        └──────────────────────────────────────┘
                          ↓↑
        ┌──────────────────────────────────────┐
        │     Database                         │
        └──────────────────────────────────────┘
```

## 📊 Data Flow Diagrams

### Sign Up Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Sign Up Flow                                 │
└─────────────────────────────────────────────────────────────────────┘

User Input
    ↓
┌─────────────────────────────────────────────────────────────────────┐
│ SignUpForm Component                                                 │
│  • useForm hook manages state                                       │
│  • Zod resolver validates in real-time                             │
│  • Shows errors with icons                                         │
└─────────────────────────────────────────────────────────────────────┘
    ↓
Validation Check
    ↓ (All Valid)
┌─────────────────────────────────────────────────────────────────────┐
│ useSignUpMutation Hook                                              │
│  • RTK Query mutation                                              │
│  • Button shows loading state                                      │
│  • Form inputs disabled                                            │
└─────────────────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────────────────┐
│ API Call: POST /auth/sign-up                                        │
│ {                                                                   │
│   "fullName": "John Doe",                                          │
│   "email": "john@example.com",                                     │
│   "password": "SecurePass123!"                                     │
│ }                                                                   │
└─────────────────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────────────────┐
│ Response: AuthResponse                                              │
│ {                                                                   │
│   "token": "eyJhbGc...",                                           │
│   "refreshToken": "eyJhbGc...",                                    │
│   "user": { id, fullName, email, role, ... }                      │
│ }                                                                   │
└─────────────────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────────────────┐
│ onQueryStarted Callback                                            │
│  • localStorage.setItem('authToken', token)                        │
│  • localStorage.setItem('refreshToken', refreshToken)              │
│  • invalidatesTags: ['User'] - clears cache                       │
└─────────────────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────────────────┐
│ Component Handler                                                   │
│  • dispatch(setUser(response.user))                                │
│  • dispatch(setIsAuthenticated(true))                              │
└─────────────────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────────────────┐
│ Redux Store Updated                                                │
│ user.slice:                                                        │
│  • user = { id, fullName, email, role, ... }                     │
│  • isAuthenticated = true                                          │
└─────────────────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────────────────┐
│ Call getMe Query (Auto)                                             │
│  • useGetMeQuery hook triggers                                     │
│  • Fetches fresh user data from API                               │
└─────────────────────────────────────────────────────────────────────┘
    ↓
router.push('/buyer/overview') ← Redirect to dashboard
```

### Password Reset Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Password Reset Flow                              │
└─────────────────────────────────────────────────────────────────────┘

User: /forgot-password
    ↓
┌──────────────────────────┐
│ Enter email              │
│ Validate: Valid email    │
│ Click: Send OTP          │
└──────────────────────────┘
    ↓
┌──────────────────────────────────────────────────────────────────┐
│ API: POST /auth/forgot-password { email }                       │
│ Response: { otpId, expiresIn: 600, message }                    │
└──────────────────────────────────────────────────────────────────┘
    ↓
┌──────────────────────────────────────────────────────────────────┐
│ Store: sessionStorage.setItem('forgotPasswordEmail', email)      │
│ Redirect: /verify-otp                                           │
└──────────────────────────────────────────────────────────────────┘
    ↓
┌──────────────────────────────────────────────────────────────────┐
│ User: /verify-otp                                               │
│ Display: Email (from sessionStorage)                            │
│ Input: 6-digit OTP (auto-focus inputs)                         │
│ Feature: Resend timer (60 seconds)                              │
│ Click: Verify                                                   │
└──────────────────────────────────────────────────────────────────┘
    ↓
┌──────────────────────────────────────────────────────────────────┐
│ API: POST /auth/verify-otp { email, otp }                       │
│ Response: { valid: true }                                       │
└──────────────────────────────────────────────────────────────────┘
    ↓
┌──────────────────────────────────────────────────────────────────┐
│ Store: sessionStorage.setItem('resetPasswordEmail', email)       │
│ Store: sessionStorage.setItem('resetPasswordOTP', otp)           │
│ Redirect: /reset-password                                       │
└──────────────────────────────────────────────────────────────────┘
    ↓
┌──────────────────────────────────────────────────────────────────┐
│ User: /reset-password                                           │
│ Input: New password (with strength indicators)                  │
│ Input: Confirm password                                         │
│ Validate: Password requirements                                 │
│ Validate: Passwords match                                       │
│ Click: Reset Password                                           │
└──────────────────────────────────────────────────────────────────┘
    ↓
┌──────────────────────────────────────────────────────────────────┐
│ API: POST /auth/reset-password                                  │
│ {                                                               │
│   email,                                                        │
│   otp,                                                          │
│   newPassword                                                   │
│ }                                                               │
│ Response: { message: "Password reset successfully" }            │
└──────────────────────────────────────────────────────────────────┘
    ↓
┌──────────────────────────────────────────────────────────────────┐
│ Clear sessionStorage:                                            │
│  • removeItem('forgotPasswordEmail')                             │
│  • removeItem('resetPasswordEmail')                              │
│  • removeItem('resetPasswordOTP')                                │
│ Redirect: /sign-in                                              │
└──────────────────────────────────────────────────────────────────┘
```

## 🔄 Component Interaction Flow

```
┌───────────────────────────────────────────────────────────────────┐
│                    Redux Provider (Root)                          │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Redux Store                                                 │ │
│  │  - user slice (user data, isAuthenticated, isLoading)      │ │
│  │  - authApi reducer (cached API responses)                  │ │
│  └─────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────┘
           ↓
┌───────────────────────────────────────────────────────────────────┐
│ Route: /sign-up                                                  │
│  ├─ SignUpForm Component                                         │
│  │   ├─ useForm (React Hook Form)                              │
│  │   ├─ zodResolver (Zod validation)                          │
│  │   ├─ useSignUpMutation (RTK Query)                         │
│  │   ├─ useAppDispatch (Typed dispatch)                       │
│  │   └─ useRouter (Next.js navigation)                        │
│  └─ Validation Schema: signUpSchema                             │
└───────────────────────────────────────────────────────────────────┘
           ↓
┌───────────────────────────────────────────────────────────────────┐
│ Route: /sign-in                                                  │
│  ├─ SignInForm Component                                         │
│  │   ├─ useForm (React Hook Form)                              │
│  │   ├─ zodResolver (Zod validation)                          │
│  │   ├─ useSignInMutation (RTK Query)                         │
│  │   ├─ useAppDispatch (Typed dispatch)                       │
│  │   └─ useRouter (Next.js navigation)                        │
│  └─ Validation Schema: signInSchema                              │
└───────────────────────────────────────────────────────────────────┘
           ↓
┌───────────────────────────────────────────────────────────────────┐
│ Route: /forgot-password                                          │
│  ├─ ForgotPasswordForm Component                                 │
│  │   ├─ useForm (React Hook Form)                              │
│  │   ├─ useForgotPasswordMutation (RTK Query)                 │
│  │   └─ useRouter (Next.js navigation)                        │
│  └─ Validation Schema: forgotPasswordSchema                      │
└───────────────────────────────────────────────────────────────────┘
           ↓
┌───────────────────────────────────────────────────────────────────┐
│ Route: /verify-otp                                               │
│  ├─ VerifyOtpForm Component                                      │
│  │   ├─ useState (OTP values, timer, email)                   │
│  │   ├─ useVerifyOTPMutation (RTK Query)                      │
│  │   ├─ useRouter (Next.js navigation)                        │
│  │   └─ useRef (Input focus management)                       │
│  └─ Manual state, no Zod (simple 6-digit validation)            │
└───────────────────────────────────────────────────────────────────┘
           ↓
┌───────────────────────────────────────────────────────────────────┐
│ Route: /reset-password                                           │
│  ├─ ResetPasswordForm Component                                  │
│  │   ├─ useForm (React Hook Form)                              │
│  │   ├─ zodResolver (Zod validation)                          │
│  │   ├─ useResetPasswordMutation (RTK Query)                  │
│  │   └─ useRouter (Next.js navigation)                        │
│  └─ Validation Schema: resetPasswordSchema                       │
└───────────────────────────────────────────────────────────────────┘
```

## 📦 Component Dependency Graph

```
SignUpForm.tsx
├── useForm (React Hook Form)
├── zodResolver (@hookform/resolvers)
├── signUpSchema (lib/schema/auth.ts)
├── useSignUpMutation (store/apis/authApi.ts)
├── useGetMeQuery (store/apis/authApi.ts)
├── setUser (store/slices/userSlice.ts)
├── useAppDispatch (store/hook.ts)
└── Next.js Components (Button, input, Link, etc.)

SignInForm.tsx
├── useForm
├── zodResolver
├── signInSchema
├── useSignInMutation
├── useGetMeQuery
├── setUser
├── useAppDispatch
└── Next.js Components

ForgotPasswordForm.tsx
├── useForm
├── zodResolver
├── forgotPasswordSchema
├── useForgotPasswordMutation
└── Next.js Components

VerifyOtpForm.tsx
├── useVerifyOTPMutation
├── useRef
├── useState
└── Next.js Components

ResetPasswordForm.tsx
├── useForm
├── zodResolver
├── resetPasswordSchema
├── useResetPasswordMutation
└── Next.js Components
```

## 🔐 Token & Storage Management

```
┌─────────────────────────────────────────────────────────────────┐
│              Token & Data Storage Strategy                       │
└─────────────────────────────────────────────────────────────────┘

AFTER SIGN UP / SIGN IN:
    ↓
┌──────────────────────────────────────────────────────────────────┐
│ localStorage (Persistent)                                        │
│                                                                  │
│ authToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."            │
│ refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."        │
│                                                                  │
│ Purpose: Store tokens across page reloads                       │
│ Scope: Persists until user logs out                            │
│ Accessible: All pages and tabs                                 │
│ Security: HttpOnly not possible (use secure API calls)         │
└──────────────────────────────────────────────────────────────────┘
    ↓
┌──────────────────────────────────────────────────────────────────┐
│ Redux Store (In-Memory)                                         │
│                                                                  │
│ user: {                                                         │
│   id: "user_123",                                              │
│   fullName: "John Doe",                                        │
│   email: "john@example.com",                                   │
│   role: "buyer",                                               │
│   isVerified: true,                                            │
│   createdAt: "2026-02-04...",                                  │
│   updatedAt: "2026-02-04..."                                   │
│ }                                                               │
│ isAuthenticated: true                                          │
│ isLoading: false                                               │
│                                                                  │
│ Purpose: Global user state and auth status                     │
│ Scope: Current page session only                              │
│ Cached: RTK Query caches API responses                        │
└──────────────────────────────────────────────────────────────────┘

DURING FORGOT PASSWORD FLOW:
    ↓
┌──────────────────────────────────────────────────────────────────┐
│ sessionStorage (Temporary)                                       │
│                                                                  │
│ forgotPasswordEmail: "john@example.com"  (forgot-password → verify-otp)
│ resetPasswordEmail: "john@example.com"   (verify-otp → reset-password)
│ resetPasswordOTP: "123456"               (verify-otp → reset-password)
│                                                                  │
│ Purpose: Pass data between auth flow pages                      │
│ Scope: Cleared after password reset                            │
│ Security: Sensitive data cleared automatically                 │
└──────────────────────────────────────────────────────────────────┘

ON LOGOUT:
    ↓
┌──────────────────────────────────────────────────────────────────┐
│ All Storage Cleared:                                            │
│                                                                  │
│ localStorage:                                                   │
│  ✓ authToken removed                                            │
│  ✓ refreshToken removed                                         │
│                                                                  │
│ Redux Store:                                                    │
│  ✓ user set to null                                             │
│  ✓ isAuthenticated set to false                                 │
│  ✓ API cache reset (resetApiState)                              │
│                                                                  │
│ sessionStorage:                                                 │
│  ✓ Auto-cleared after password reset anyway                     │
└──────────────────────────────────────────────────────────────────┘
```

## 🎯 Key Decision Points

```
┌─────────────────────────────────────────────────────────────────┐
│              Form Validation Decision Tree                       │
└─────────────────────────────────────────────────────────────────┘

User fills form
    ↓
Is field required? ──→ NO ──→ Skip
    │
    YES
    ↓
Zod validates field in real-time
    ↓
├─ Valid? ────→ Show success state (green checkmark)
│
└─ Invalid? ──→ Show error message with icon
    │
    └─ Keep field focused
    └─ Disable submit button

User corrects error
    ↓
Re-validation triggers (onChange event)
    ↓
├─ Valid now? ────→ Clear error, enable button
│
└─ Still invalid? ──→ Keep error, keep button disabled

All fields valid?
    ↓
YES
    ↓
User clicks submit
    ↓
Form submitting
    └─ Disable all inputs
    └─ Show loading spinner
    └─ Disable submit button
    ↓
API call in progress
    ↓
├─ Success ────→ Store token → Update Redux → Redirect
│
└─ Error ──────→ Display error → Re-enable form → Allow retry
```

---

**Last Updated:** February 4, 2026
**Version:** 1.0.0
