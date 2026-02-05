# Visual Architecture & Flow Diagrams

## State Management Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Browser Storage                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  localStorage.authToken  ──→  Token for API calls      │
│  localStorage.userData   ──→  Cached user data         │
│                                                         │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│              Provider (AuthInitializer)                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. Check for localStorage token                        │
│  2. Restore userData to Redux (sync)                    │
│  3. Trigger getMe query (async, background)            │
│                                                         │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│              Redux Store (userSlice)                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  state.user.user              ← User data              │
│  state.user.isAuthenticated   ← Auth flag              │
│                                                         │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│           Components (Navbar, Pages, etc.)            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  useAppSelector(state.user)  → Get user data          │
│  <Navbar />                  → Render instantly        │
│                                                         │
└─────────────────────────────────────────────────────────┘
                           ↓
            ┌──────────────────────────────┐
            │   API Sync (Background)      │
            │   getMe query running        │
            │   (doesn't block anything!)  │
            └──────────────────────────────┘
```

## Data Flow: Page Reload (Logged In)

```
┌─────────────────────────────────────────────────────────────────┐
│                     BROWSER RELOAD                              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    ┌─────────────────────┐
                    │  App Initialize     │
                    └─────────────────────┘
                              ↓
                ┌─────────────────────────────────┐
                │ Provider: AuthInitializer       │
                │ useEffect() runs                │
                └─────────────────────────────────┘
                    ↙                       ↘
    ┌──────────────────────┐     ┌──────────────────────┐
    │ localStorage exists? │     │ Has authToken?       │
    │    userData          │     │                      │
    └──────────────────────┘     └──────────────────────┘
            │ YES                        │ YES
            ↓                           ↓
    ┌──────────────────┐       ┌──────────────────────┐
    │ dispatch(        │       │ useGetMeQuery()      │
    │   setUser()      │       │ (background)         │
    │ ) SYNC           │       │ ASYNC                │
    └──────────────────┘       └──────────────────────┘
            ↓                           ↓
        [INSTANT]              [~500ms in background]
            ↓                           ↓
    Redux updates          API response received
    ↓                       ↓
    ┌─────────────────────────────────┐
    │ Components Re-render             │
    │ - Navbar shows user data         │
    │ - No skeleton                    │
    │ - No flicker                     │
    └─────────────────────────────────┘
                        ↓
            ✨ SMOOTH USER EXPERIENCE ✨
            User sees data instantly!
```

## Comparison: Before vs After

### BEFORE (Problem)
```
Reload Page
    ↓
App starts
    ↓
Suspense shows skeleton 💀
    ↓ (200ms+ waiting)
API request sent
    ↓ (500ms+ network)
Data arrives
    ↓
Suspense fallback clears ⚠️
    ↓
Redux updates (isLoading changes)
    ↓
Navbar re-renders (SCREEN SHAKE!) 😵
    ↓
User sees data finally
    ↓
Total delay: 700-1000ms + flickering
❌ Bad UX
```

### AFTER (Solution)
```
Reload Page
    ↓
App starts
    ↓
localStorage checked
    ↓ (5ms, instant!)
Redux updated from cache
    ↓
Navbar renders with user data ⚡
    ↓ (50ms, smooth!)
API syncs in background
    ↓ (doesn't affect UI)
Data updated silently
    ↓
User sees same data
    ↓
Total delay: 50ms, zero flicker
✅ Great UX!
```

## Component Hydration Safety

```
┌──────────────────────────────────────────┐
│      Next.js Server-Side Render          │
│  (produces initial HTML)                 │
└──────────────────────────────────────────┘
                    ↓
            ┌───────────────┐
            │ Send HTML to  │
            │ Browser       │
            └───────────────┘
                    ↓
┌──────────────────────────────────────────┐
│    Browser Hydration (React takes over)  │
│                                          │
│  1. Run useEffect hooks                  │
│  2. Read localStorage                    │
│  3. Compare server HTML with client      │
│  4. Update state if needed               │
│                                          │
│  ⚠️ MUST MATCH!                          │
│     Server content = Client content      │
│                                          │
│  ✅ Our solution: Both use localStorage  │
│     Both render same content             │
│     No hydration mismatch!               │
└──────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────┐
│   Smooth, Interactive App                │
│   ✨ No warnings, no flicker             │
└──────────────────────────────────────────┘
```

## useAuth Hook Behavior

```
┌─────────────────────────────────────────────────────────┐
│           Component calls useAuth()                    │
└─────────────────────────────────────────────────────────┘
                          ↓
        ┌─────────────────────────────────┐
        │ Check Redux state                │
        │ - user                           │
        │ - isAuthenticated                │
        │ - isInitialized (local state)    │
        │ - isSyncing (from API query)     │
        └─────────────────────────────────┘
                          ↓
        ┌──────────────────────────────────────┐
        │ Restore from localStorage on mount   │
        │ (only if not already in Redux)       │
        └──────────────────────────────────────┘
                          ↓
        ┌──────────────────────────────────────┐
        │ Trigger background API sync          │
        │ (getMe query with skip option)       │
        │ Doesn't affect component rendering   │
        └──────────────────────────────────────┘
                          ↓
        ┌──────────────────────────────────────┐
        │ Return state object                  │
        │ {                                    │
        │   user,            ← current user    │
        │   isAuthenticated, ← boolean         │
        │   isInitialized,   ← loaded from LS │
        │   isSyncing,       ← API in progress│
        │   isError          ← API error      │
        │ }                                    │
        └──────────────────────────────────────┘
```

## Logout Flow

```
User clicks "Sign Out"
        ↓
logout() mutation called
        ↓
┌──────────────────────────────┐
│ Button shows: "Signing out..." │
│ Disabled: true                │
│ Icon: spinning loader         │
└──────────────────────────────┘
        ↓
┌──────────────────────────────┐
│ Backend: /auth/logout        │
│ (Best effort, can fail)      │
└──────────────────────────────┘
        ↓
┌──────────────────────────────────────┐
│ onQueryStarted cleanup:              │
│ 1. dispatch(clearUser())             │
│ 2. localStorage.removeItem(authToken) │
│ 3. localStorage.removeItem(userData) │
│ 4. API cache cleared                 │
│ 5. Toast: "Logged out"               │
└──────────────────────────────────────┘
        ↓
┌──────────────────────────────────┐
│ Navbar detects:                 │
│ isAuthenticated = false         │
│                                 │
│ Shows guest UI:                 │
│ - Sign In button                │
│ - Sign Up button                │
│ - (No user profile dropdown)    │
└──────────────────────────────────┘
        ↓
Router redirects to "/"
        ↓
Homepage loads
```

## Network Waterfall Comparison

### BEFORE (Sequential)
```
Timeline:
0ms  ├─ App starts
     ├─ Show skeleton
50ms │
100ms├─ API request sent
     │
500ms├─ API response received
     ├─ Update Redux (isLoading: false)
550ms│
600ms├─ Navbar re-renders
     ├─ Show user data
650ms│
     └─ User sees data

⚠️   650ms total delay!
⚠️  Flicker/re-render at 600ms
```

### AFTER (Parallel)
```
Timeline:
0ms  ├─ App starts
     ├─ Read localStorage
     ├─ Update Redux (sync)
     │
50ms ├─ Navbar renders with data ✨
     │
     ├─ API request sent (background)
     │
500ms├─ API response received
     ├─ Update Redux silently
550ms│
     └─ User still sees same data

✅  50ms instant render!
✅  No flicker!
✅  API updates in background!
```

## Key Insight: The Three States

```
┌──────────────┬──────────────┬──────────────┐
│ localStorage │    Redux     │     API      │
├──────────────┼──────────────┼──────────────┤
│              │              │              │
│  FAST        │  IMMEDIATE   │   SLOW       │
│  (5-50ms)    │  (sync)      │  (500ms+)    │
│              │              │              │
│  Reliable    │  Source of   │  Background  │
│  Cache       │  Truth       │  Sync        │
│              │              │              │
│  Persists    │  In-Memory   │  Network     │
│  Across      │  Current     │  Optional    │
│  Sessions    │  State       │  Update      │
│              │              │              │
└──────────────┴──────────────┴──────────────┘

           ↓        ↓         ↓
        Used for fast render, background sync, fallback
```

This architecture ensures:
- ✅ **Fast**: localStorage data available instantly
- ✅ **Reliable**: Redux is source of truth
- ✅ **Resilient**: Works offline with cached data
- ✅ **Fresh**: API syncs when available
