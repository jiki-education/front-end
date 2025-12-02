# Authentication System

## Overview

The Jiki frontend implements JWT-based authentication with a route-based architecture. Authentication is enforced at the layout level using `AuthGuard` components, and middleware powers dual-purpose routing for pages accessible to both authenticated and unauthenticated users.

## Architecture

The authentication system consists of several layers:

1. **Token Storage** (`lib/auth/storage.ts`) - Secure client-side JWT storage
2. **API Client** (`lib/api/client.ts`) - Automatic token attachment to requests
3. **Auth Service** (`lib/auth/service.ts`) - API endpoint integration
4. **Auth Store** (`lib/auth/authStore.ts`) - Global state management with Zustand
5. **AuthGuard Components** (`app/(app)/AuthGuard.tsx`, `app/(external)/AuthGuard.tsx`) - Layout-level authentication enforcement
6. **Middleware** (`middleware.ts`) - Cookie-based routing for dual-purpose pages
7. **Type Definitions** (`types/auth.ts`) - TypeScript interfaces

## Route-Based Authentication

### Route Group Structure

The app uses Next.js route groups to organize pages by authentication requirement:

```
app/
├── (app)/                    # Authenticated routes
│   ├── layout.tsx           # Wraps children with AuthGuard
│   ├── AuthGuard.tsx        # Client-side auth check + redirect
│   ├── dashboard/
│   ├── projects/
│   ├── blog/                # Authenticated version
│   └── ...
│
├── (external)/              # Auth pages (login/signup)
│   ├── layout.tsx           # Wraps children with AuthGuard
│   ├── AuthGuard.tsx        # Redirects if authenticated
│   └── auth/
│       ├── login/
│       ├── signup/
│       └── ...
│
└── external/                # Public static versions
    ├── layout.tsx           # No AuthGuard - public access
    ├── page.tsx             # Landing page
    ├── blog/                # Public version
    └── ...
```

### AuthGuard Components

#### `(app)/AuthGuard.tsx` - Protected Routes

Guards authenticated routes and redirects unauthenticated users:

```typescript
// app/(app)/AuthGuard.tsx
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      removeAccessToken();

      if (isExternalUrl(pathname)) {
        router.push(pathname); // Reload → shows external version
      } else {
        router.push("/auth/login"); // Redirect to login
      }
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // Show loading while checking auth or redirecting
  if (isLoading || !isAuthenticated) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
}
```

**Behavior:**

- Shows loading spinner while checking authentication
- Redirects to external version if route is dual-purpose (blog, articles)
- Redirects to `/auth/login` for app-only routes (dashboard, projects)
- Only renders children when authenticated

#### `(external)/AuthGuard.tsx` - Auth Pages

Guards login/signup pages and redirects authenticated users:

```typescript
// app/(external)/AuthGuard.tsx
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading while checking auth or redirecting
  if (isLoading || isAuthenticated) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
}
```

**Behavior:**

- Shows loading spinner while checking authentication
- Redirects to `/dashboard` if already authenticated
- Only renders children when unauthenticated

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
  const isAuthenticated = request.cookies.has("jiki_access_token");

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

Tokens are stored in `sessionStorage` for security:

- Cleared when browser tab closes
- Not accessible across tabs (prevents CSRF)
- Not persisted to disk

For cross-tab persistence, change to `localStorage` in `lib/auth/storage.ts`.

### Token Flow

1. User logs in → API returns JWT in Authorization header
2. Frontend extracts token and stores it securely
3. Middleware checks for token cookie (set by API)
4. All API calls include token automatically via API client
5. On 401 response, token is cleared and user redirected to login

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

## API Endpoints

The auth service integrates with these Rails API endpoints:

- **POST /v1/auth/login** - User login
  - Body: `{ user: { email, password } }`
  - Returns: User data + JWT in Authorization header

- **POST /v1/auth/signup** - User registration
  - Body: `{ user: { email, password, password_confirmation, name? } }`
  - Returns: User data + JWT in Authorization header

- **DELETE /v1/auth/logout** - User logout
  - Headers: Authorization token
  - Effect: Revokes JWT on server

- **POST /v1/auth/password** - Request password reset
  - Body: `{ user: { email } }`
  - Effect: Sends reset email

- **PATCH /v1/auth/password** - Complete password reset
  - Body: `{ user: { token, password, password_confirmation } }`
  - Effect: Updates password

## Security Considerations

### Token Security

- Tokens stored in sessionStorage (not localStorage)
- Automatically cleared on 401 responses
- Token expiry checked before use
- Bearer tokens in Authorization headers
- Cookie-based middleware routing (server-side check)

### Best Practices

1. **Never log tokens** - Avoid console.log of sensitive data
2. **HTTPS only** in production - Tokens should only be sent over secure connections
3. **Token rotation** - Backend should rotate tokens periodically
4. **Logout everywhere** - Clear tokens on logout across all storage
5. **AuthGuard at layout level** - Pages don't need individual auth checks

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

## Migration Guide

### From Hooks to AuthGuard

The previous hook-based approach (`useRequireAuth`, `useAuth`) has been replaced with layout-level `AuthGuard` components:

**Before (deprecated):**

```typescript
// ❌ Old approach - hooks in every page
export default function DashboardPage() {
  const { isAuthenticated, isLoading } = useRequireAuth();

  if (isLoading) return <Loading />;
  if (!isAuthenticated) return null;

  return <div>Dashboard</div>;
}
```

**After (current):**

```typescript
// ✅ New approach - AuthGuard at layout level
export default function DashboardPage() {
  // No auth checks needed - guaranteed authenticated
  return <div>Dashboard</div>;
}
```

The `(app)/layout.tsx` wraps all children with `AuthGuard`, so individual pages don't need auth checks.

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

- Check sessionStorage has token: `sessionStorage.getItem("jiki_access_token")`
- Verify cookie exists: Check browser DevTools → Application → Cookies
- Ensure using the api client, not raw fetch
- Verify API client imports: `import { api } from "@/lib/api/client"`

### 401 Errors After Login

- Token might be expired - check expiry
- API version mismatch - verify `NEXT_PUBLIC_API_VERSION`
- CORS issues - check backend CORS settings
- Cookie not set by API - verify API response includes Set-Cookie header

### State Not Persisting

- Using sessionStorage (closes with tab)
- For persistence, modify `lib/auth/storage.ts` to use localStorage
- Check Zustand persist middleware configuration

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
