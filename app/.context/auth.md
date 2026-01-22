# Authentication System

## Overview

The Jiki frontend implements JWT-based authentication with a route-based architecture. Authentication is enforced at the layout level using hierarchically organized auth components (providers, initializers, and guards), and middleware powers dual-purpose routing for pages accessible to both authenticated and unauthenticated users.

## Architecture

The authentication system uses Next.js Server Actions with httpOnly cookies for secure token management:

1. **Server Actions** (`lib/auth/actions.ts`) - Server-side authentication operations (login, signup, logout, refresh)
2. **Token Storage** - httpOnly cookies (inaccessible to JavaScript for XSS protection)
3. **API Client** (`lib/api/client.ts`) - Automatic cookie transmission with `credentials: 'include'`
4. **Token Refresh** (`lib/auth/refresh.ts`) - Automatic token refresh via Server Actions
5. **Auth Store** (`lib/auth/authStore.ts`) - Client-side state management with Zustand
6. **Auth Components** (`components/layout/auth/`) - Layout-level authentication providers and guards
7. **Middleware** (`middleware.ts`) - Cookie-based routing for dual-purpose pages
8. **Type Definitions** (`types/auth.ts`) - TypeScript interfaces

## Auth Component Organization

Authentication components are organized hierarchically under `components/layout/auth/` with three context-specific subdirectories. This structure respects Next.js Server/Client boundaries while making the purpose and usage of each component immediately clear.

### Directory Structure

```
components/layout/auth/
├── global/              # Root layout (app/layout.tsx)
│   ├── ServerAuthProvider.tsx
│   ├── ClientAuthInitializer.tsx
│   └── ClientLoggedOutAuthInitializer.tsx
├── internal/            # (app) layout - authenticated routes
│   └── ClientAuthGuard.tsx
└── external/            # (external) layout - auth pages
    ├── ServerAuthGuard.tsx
    └── ClientAuthGuard.tsx
```

### Naming Conventions

All auth components follow a consistent naming pattern:

**Server/Client Prefix:**

- `Server*` - Server Component (async, can read cookies server-side)
- `Client*` - Client Component (uses hooks, handles interactivity)

**Purpose Suffix:**

- `*Provider` - Orchestrates authentication flow, delegates to initializers or guards
- `*Initializer` - Initializes auth state on mount, may gate rendering until ready
- `*Guard` - Protects routes by redirecting based on auth status

### Component Flow by Context

#### Global Context (Root Layout)

Used in `app/layout.tsx` to initialize authentication for the entire app:

1. **ServerAuthProvider** - Server component that checks for access token cookie
   - If no token: Renders `ClientLoggedOutAuthInitializer` + children (skip auth check)
   - If token exists: Renders `ClientAuthInitializer` (performs full auth check)

2. **ClientAuthInitializer** - Client component that runs `checkAuth()` on mount
   - Shows loading spinner while checking authentication
   - Gates children until `hasCheckedAuth` is true
   - Populates auth store with user data if token is valid

3. **ClientLoggedOutAuthInitializer** - Client component that sets logged-out state
   - Calls `setNoUser()` to immediately mark user as unauthenticated
   - Renders nothing (empty fragment)
   - Prevents unnecessary API call when no token exists

**Flow:** Server checks cookie → delegates to appropriate client initializer → app renders with auth state ready

#### Internal Context (Authenticated Routes)

Used in `app/(app)/layout.tsx` to protect authenticated pages:

1. **ClientAuthGuard** - Client component that redirects unauthenticated users
   - Waits for `hasCheckedAuth` from global initialization
   - If not authenticated: Redirects to external version (if dual-purpose) or `/auth/login`
   - If authenticated: Renders children
   - Shows nothing while checking or redirecting

**Flow:** Global auth initialized → guard checks state → redirect or render

#### External Context (Auth Pages)

Used in `app/(external)/layout.tsx` for login/signup pages:

1. **ServerAuthGuard** - Server component that checks for access token cookie
   - If no token: Renders children directly (user can see login/signup)
   - If token exists: Renders `ClientAuthGuard` (verify and possibly redirect)

2. **ClientAuthGuard** - Client component that redirects authenticated users
   - Waits for `hasCheckedAuth` from global initialization
   - If authenticated: Redirects to `/dashboard`
   - If not authenticated: Renders children
   - Shows nothing while checking or redirecting

**Flow:** Server checks cookie → if exists, delegate to client guard → redirect or render

### Key Design Principles

**Server/Client Boundary Respect:**

- Server components check cookie presence (fast, no client bundle)
- Client components handle auth state and routing (interactive)
- Clear naming makes boundary explicit

**Single Source of Truth:**

- Global `ServerAuthProvider` initializes auth exactly once
- All guards wait for `hasCheckedAuth` from the global store
- Defense-in-depth prevents duplicate `checkAuth()` calls and race conditions (see below)

**Hierarchical Organization:**

- Directory structure matches usage context (global/internal/external)
- File location tells you WHERE it's used
- Prefix tells you WHEN it runs (server/client)
- Suffix tells you WHAT it does (provider/initializer/guard)

**Progressive Enhancement:**

- Server components provide fast initial checks
- Client components handle full validation and interactivity
- Loading states prevent layout shift and flashing content

**Defense in Depth: Race Condition Prevention:**

The auth system uses multiple layers of protection to prevent duplicate `checkAuth()` calls:

1. **Architectural Layer (ServerAuthProvider)**
   - Routes to appropriate initializer based on server-side cookie presence
   - Ensures only one initializer (ClientAuthInitializer OR ClientLoggedOutAuthInitializer) renders
   - Prevents architectural race conditions (only one code path executes)

2. **Component Layer (Ref Guard in ClientAuthInitializer)**
   - Prevents React-specific race conditions:
     - React Strict Mode double-mounting in development
     - Zustand selector instability causing dependency array changes
     - Rapid parent re-renders before store state updates
   - Uses `useRef` to track initialization across component lifecycle
   - Essential despite architectural routing because React can remount components

3. **Store Layer (Internal Guards in authStore.ts)**
   - Checks `hasCheckedAuth` and `isLoading` flags before executing
   - Provides final safety net if previous layers fail
   - Ensures idempotency at the data layer

**Why all three layers are necessary:**

- Architectural layer alone can't prevent React remounting
- Ref guard alone wouldn't help if wrong initializer was chosen
- Store guards alone would allow unnecessary function calls
- Together they provide comprehensive protection with zero performance cost

### Why This Architecture?

The server/client split optimizes for two fundamentally different user experiences:

**Logged-Out Users (No Cookie) - Server-Side Rendering:**

- Server detects no token and immediately renders full HTML server-side
- `ClientLoggedOutAuthInitializer` sets store state synchronously on hydration
- No loading spinner, no client-side auth check, no waiting
- Pages are fully rendered and interactive immediately
- **SEO benefit**: Search engines see complete rendered content
- **UX benefit**: Instant page load with no flashing or layout shifts

**Logged-In Users (Has Cookie) - Client-Side Validation:**

- Server detects token presence and delegates to client for validation
- Shows loading spinner consistently while validating token with API
- Prevents flash of unauthenticated content (FOUC)
- Token validation determines next step:
  - **Valid token**: Renders authenticated version seamlessly
  - **Invalid token**: Deletes cookie and handles based on context:
    - `internal/`: Redirects to external version (dual-purpose) or `/auth/login`
    - `external/`: Renders auth pages (login/signup)

**The Core Trade-off:**

- **Logged-out**: Server-rendered HTML → fast, SEO-friendly, no spinner
- **Logged-in**: Client validation required → spinner shown, but prevents FOUC and validates token freshness

This architecture ensures logged-out users (most important for marketing pages, blog, SEO) get optimal performance, while logged-in users get a smooth, consistent experience without flashing content.

## Route-Based Authentication

### Route Group Structure

The app uses Next.js route groups to organize pages by authentication requirement:

```
app/
├── layout.tsx               # Root: ServerAuthProvider (global auth init)
├── (app)/                   # Authenticated routes
│   ├── layout.tsx          # Uses internal/ClientAuthGuard
│   ├── dashboard/
│   ├── projects/
│   ├── blog/               # Authenticated version
│   └── ...
│
├── (external)/             # Auth pages (login/signup)
│   ├── layout.tsx          # Uses external/ServerAuthGuard
│   └── auth/
│       ├── login/
│       ├── signup/
│       └── ...
│
└── external/               # Public static versions
    ├── layout.tsx          # No guard - public access
    ├── page.tsx            # Landing page
    ├── blog/               # Public version
    └── ...
```

### Layout Authentication Flow

#### Root Layout (`app/layout.tsx`)

Initializes authentication once for the entire app using `global/ServerAuthProvider`:

- Server-side cookie check determines initial auth state
- Delegates to `ClientAuthInitializer` (if token exists) or `ClientLoggedOutAuthInitializer` (if no token)
- Ensures `hasCheckedAuth` is true before any route renders

#### Authenticated Routes (`app/(app)/layout.tsx`)

Protects all authenticated pages using `internal/ClientAuthGuard`:

- Waits for global auth initialization to complete
- Redirects unauthenticated users to external version or `/auth/login`
- Only renders children when user is authenticated
- Pages inside this layout are guaranteed to have an authenticated user

#### Auth Pages (`app/(external)/layout.tsx`)

Prevents authenticated users from seeing login/signup using `external/ServerAuthGuard`:

- Server-side cookie check provides fast initial redirect path
- Delegates to `ClientAuthGuard` if token exists (verifies and redirects to dashboard)
- Only renders children when user is not authenticated
- Pages inside this layout are guaranteed to have an unauthenticated user

### Dual-Purpose Routing Pattern

Some pages (blog, articles, concepts) are accessible to both authenticated and unauthenticated users. This is powered by:

1. **Middleware routing** (`middleware.ts`)
2. **Duplicate route implementations**
3. **Cookie-based detection**

#### How It Works

**Step 1: Define external URLs**

```typescript
// lib/routing/external-urls.ts
export function isExternalUrl(pathname: string): boolean {
  if (pathname === "/" || pathname === "/blog" || pathname.startsWith("/blog/")) {
    return true;
  }
  // ... other public routes
  return false;
}
```

**Step 2: Middleware rewrites unauthenticated requests**

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.has("jiki_user_id");

  if (!isAuthenticated && isExternalUrl(path)) {
    // Rewrite /blog → /external/blog
    const url = request.nextUrl.clone();
    url.pathname = `/external${path}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}
```

**Step 3: Implement both versions**

```
app/
├── (app)/blog/              # Authenticated version
│   ├── page.tsx             # Has AuthGuard via layout
│   └── [slug]/page.tsx
│
└── external/blog/           # Public version
    ├── page.tsx             # No AuthGuard - public access
    └── [slug]/page.tsx
```

**Result:**

- **Logged out:** `/blog` → middleware rewrites to `/external/blog` (public version)
- **Logged in:** `/blog` → serves `(app)/blog` (authenticated version with sidebar, user data, etc.)

## Token Management

### Storage Strategy

Tokens are stored in httpOnly cookies managed by Server Actions:

- **Access Token**: 1-year cookie with short-lived JWT inside (few minutes)
- **Refresh Token**: 5-year cookie for token refresh
- **httpOnly**: Cookies inaccessible to JavaScript (XSS protection)
- **Domain-scoped**: `.jiki.io` (production) or `.local.jiki.io` (development)
- **SameSite**: `strict` for CSRF protection

The long cookie expiry allows persistent login, while the short-lived JWT inside provides security. Cookie presence indicates user should be logged in, while JWT expiry requires refresh.

### Token Flow

1. User logs in → Server Action calls API and receives JWT
2. Server Action stores tokens in httpOnly cookies
3. Server Action calls `revalidatePath()` to clear Next.js cache
4. All API calls automatically send cookies via `credentials: 'include'`
5. On 401 response:
   - Client calls `refreshAccessToken()` from `lib/auth/refresh.ts`
   - Refresh module calls `refreshTokenAction()` Server Action
   - Server Action reads refresh token from cookie and gets new access token
   - Server Action updates access token cookie
   - Original request is retried automatically

## Authentication State Management

### Auth Store (Zustand)

The `useAuthStore` provides global authentication state:

```typescript
import { useAuthStore } from "@/lib/auth/authStore";

function Component() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuthStore();

  // Access state
  console.log(isAuthenticated); // boolean
  console.log(user); // User object or null

  // Perform actions
  await login({ email, password });
  await logout();
}
```

### Store Actions

```typescript
interface AuthStore {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  hasCheckedAuth: boolean;

  // Actions
  login(credentials: LoginCredentials): Promise<void>;
  signup(userData: SignupData): Promise<void>;
  logout(): Promise<void>;
  checkAuth(): Promise<void>;
  requestPasswordReset(email: string): Promise<void>;
  resetPassword(data: PasswordReset): Promise<void>;
  clearError(): void;
  setLoading(isLoading: boolean): void;
}
```

### Integration with Server Actions

The auth store acts as a client-side state manager that calls Server Actions for authentication operations:

```typescript
// Auth store implementation (simplified)
export const useAuthStore = create<AuthStore>((set, get) => ({
  // State...

  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const result = await loginAction(credentials); // Server Action
      if (!result.success || !result.user) {
        throw new Error(result.error || "Login failed");
      }
      get().setUser(result.user); // Update client state
    } catch (error) {
      get().setNoUser();
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await logoutAction(); // Server Action clears cookies
    } finally {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  }
}));
```

**Key Points:**

- Store manages client-side state (user object, loading flags)
- Server Actions handle all token operations (inaccessible from client)
- Store calls Server Actions and updates state based on results
- Token storage and validation happen entirely server-side

## Usage Examples

### Login Form

```typescript
"use client";

import { useAuthStore } from "@/lib/auth/authStore";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await login({ email, password });
      router.push("/dashboard");
    } catch (error) {
      // Error available in store.error
      console.error("Login failed:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
```

### User Menu

```typescript
import { useAuthStore } from "@/lib/auth/authStore";

export function UserMenu() {
  const { user, logout, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Link href="/auth/login">Login</Link>;
  }

  return (
    <div>
      <span>Welcome, {user?.name || user?.email}</span>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Conditional Rendering

```typescript
import { useAuthStore } from "@/lib/auth/authStore";

export function BlogPost({ post }: { post: Post }) {
  const { isAuthenticated } = useAuthStore();

  return (
    <article>
      <h1>{post.title}</h1>
      <div>{post.content}</div>

      {isAuthenticated && (
        <button>Save to Reading List</button>
      )}
    </article>
  );
}
```

## Server Actions

Authentication operations are handled by Server Actions in `lib/auth/actions.ts`:

- **loginAction(credentials)** - User login
  - Calls: `POST /auth/login`
  - Sets: httpOnly cookies for access and refresh tokens
  - Returns: `{ success, user?, error? }`

- **signupAction(userData)** - User registration
  - Calls: `POST /auth/signup`
  - Sets: httpOnly cookies for access and refresh tokens
  - Returns: `{ success, user?, error? }`

- **googleLoginAction(code)** - Google OAuth login
  - Calls: `POST /auth/google`
  - Sets: httpOnly cookies for access and refresh tokens
  - Returns: `{ success, user?, error? }`

- **refreshTokenAction()** - Refresh access token
  - Reads: Refresh token from httpOnly cookie
  - Calls: `POST /auth/refresh`
  - Updates: Access token cookie
  - Returns: `{ success, user?, error? }`

- **logoutAction()** - Logout from current device
  - Calls: `DELETE /auth/logout` (best effort)
  - Clears: All auth cookies
  - Revalidates: Next.js cache

- **logoutFromAllDevicesAction()** - Logout from all devices
  - Calls: `DELETE /auth/logout/all` (best effort)
  - Clears: All auth cookies
  - Revalidates: Next.js cache

All Server Actions automatically call `revalidatePath("/", "layout")` to clear Next.js cache after auth state changes.

## Security Considerations

### Token Security

- **httpOnly cookies**: Tokens inaccessible to JavaScript (XSS protection)
- **SameSite strict**: Prevents CSRF attacks
- **Secure flag**: Cookies only sent over HTTPS in production
- **Domain-scoped**: Cookies work across subdomains (.jiki.io)
- **Short-lived JWTs**: Access tokens expire in minutes despite long cookie expiry
- **Automatic refresh**: Token refresh handled transparently via Server Actions
- **Server-side validation**: All token operations happen server-side

### Best Practices

1. **Never access tokens in client code** - Use Server Actions for all token operations
2. **HTTPS only** in production - Secure flag ensures encrypted transmission
3. **Token rotation** - Automatic refresh on 401 responses
4. **Logout clears cookies** - Both logout actions clear all auth cookies
5. **AuthGuard at layout level** - Pages don't need individual auth checks
6. **Cache revalidation** - `revalidatePath()` called after all auth changes

### Error Handling

The system handles various error scenarios:

```typescript
try {
  await login(credentials);
} catch (error) {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 401:
        // Invalid credentials
        break;
      case 422:
        // Validation errors
        break;
      case 429:
        // Rate limited
        break;
    }
  }
}
```

## Testing

### Mocking Auth Store

```typescript
import { useAuthStore } from "@/lib/auth/authStore";

jest.mock("@/lib/auth/authStore");

const mockAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;

beforeEach(() => {
  mockAuthStore.mockReturnValue({
    user: {
      id: 1,
      email: "test@example.com",
      name: "Test User",
      handle: "testuser",
      created_at: "2024-01-01",
      membership_type: "standard",
      subscription_status: "never_subscribed",
      subscription: null
    },
    isAuthenticated: true,
    isLoading: false,
    hasCheckedAuth: true,
    error: null,
    login: jest.fn(),
    signup: jest.fn(),
    logout: jest.fn(),
    checkAuth: jest.fn(),
    requestPasswordReset: jest.fn(),
    resetPassword: jest.fn(),
    clearError: jest.fn(),
    setLoading: jest.fn()
  });
});
```

### Testing Components with Auth

```typescript
import { render, screen } from "@testing-library/react";
import { useAuthStore } from "@/lib/auth/authStore";

// Mock the auth store
jest.mock("@/lib/auth/authStore");

test("shows login button when not authenticated", () => {
  (useAuthStore as jest.Mock).mockReturnValue({
    isAuthenticated: false,
    isLoading: false,
    user: null
  });

  render(<UserMenu />);

  expect(screen.getByText("Login")).toBeInTheDocument();
});
```

## Environment Configuration

Required environment variables:

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3061
NEXT_PUBLIC_API_VERSION=v1
```

## Layout-Level Authentication

Authentication is enforced at the layout level using guard components from `components/layout/auth/`, eliminating the need for auth checks in individual pages.

The `(app)/layout.tsx` wraps all children with `internal/ClientAuthGuard`, ensuring all pages in the authenticated route group are protected. This guard waits for the global `ServerAuthProvider` (in root layout) to complete initialization before checking auth state.

Individual pages are guaranteed to be authenticated:

```typescript
// app/(app)/dashboard/page.tsx
export default function DashboardPage() {
  // No auth checks needed - ClientAuthGuard in layout handles it
  // User is guaranteed to be authenticated when this renders
  return <div>Dashboard Content</div>;
}
```

Similarly, auth pages (login/signup) use `external/ServerAuthGuard` to prevent authenticated users from accessing them, with pages guaranteed to render only for unauthenticated users.

## Common Patterns

### Protected Page (No Auth Code Needed)

```typescript
// app/(app)/dashboard/page.tsx
export default function DashboardPage() {
  // Guaranteed to be authenticated - rendered via (app) layout
  return <div>Dashboard Content</div>;
}
```

### Auth Page (Redirects if Authenticated)

```typescript
// app/(external)/auth/login/page.tsx
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  // Guaranteed to be unauthenticated - rendered via (external) layout
  return <LoginForm />;
}
```

### Dual-Purpose Page (Blog Example)

```typescript
// app/(app)/blog/page.tsx - Authenticated version
import AuthenticatedSidebarLayout from "@/components/layout/AuthenticatedSidebarLayout";
import { BlogContent } from "./BlogContent";

export default function BlogPage() {
  return (
    <AuthenticatedSidebarLayout activeItem="blog">
      <BlogContent />
    </AuthenticatedSidebarLayout>
  );
}

// app/external/blog/page.tsx - Public version
import ExternalHeader from "@/components/layout/header/external";
import { BlogContent } from "./BlogContent";

export default function BlogPage() {
  return (
    <div>
      <ExternalHeader />
      <BlogContent />
    </div>
  );
}
```

Middleware automatically routes requests based on authentication status.

## Troubleshooting

### Token Not Being Sent

- Verify cookies exist: Check browser DevTools → Application → Cookies → `jiki_user_id`
- Check domain: Cookies should be scoped to `.jiki.io` (prod) or `.local.jiki.io` (dev)
- Ensure using `credentials: 'include'` in fetch calls
- Verify API client imports: `import { api } from "@/lib/api/client"`
- For custom fetch calls, always include `credentials: 'include'`

### 401 Errors After Login

- Token might be expired - automatic refresh should handle this
- Check refresh token exists in cookies
- Verify `NEXT_PUBLIC_API_URL` environment variable
- Check backend CORS settings allow credentials
- Ensure domain matches between frontend and cookie domain

### Login Not Persisting Across Sessions

- Cookies have long expiry (1-5 years) - login should persist
- Check if cookies are being cleared by browser settings
- Verify httpOnly and Secure flags are set correctly
- Check SameSite attribute compatibility with your setup

### Redirect Loops

- Ensure `isExternalUrl()` correctly identifies dual-purpose routes
- Check middleware rewrite logic
- Verify AuthGuard `useEffect` dependencies are correct
- Check that navigation happens in `useEffect`, not during render

### "Cannot update Router while rendering" Error

This happens when `router.push()` is called during render instead of in `useEffect`:

```typescript
// ❌ Bad - causes error
if (!isAuthenticated) {
  router.push("/login"); // During render!
  return null;
}

// ✅ Good - in useEffect
useEffect(() => {
  if (!isAuthenticated && !isLoading) {
    router.push("/login");
  }
}, [isAuthenticated, isLoading, router]);
```

## Related Documentation

- [API Client](./api.md) - HTTP client configuration
- [Architecture](./architecture.md) - Overall frontend architecture
- [Testing](./testing.md) - Testing patterns
- [Routing](./routing.md) - Route organization and patterns
