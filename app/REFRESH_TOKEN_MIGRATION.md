# Refresh Token Migration

This document explains the migration to a **dual-token authentication system** (short-lived access tokens + long-lived refresh tokens) and details the frontend changes required to support it.

## Table of Contents

1. [Current Implementation](#current-implementation)
2. [Why Refresh Tokens?](#why-refresh-tokens)
3. [Backend Architecture](#backend-architecture)
4. [Frontend Changes Required](#frontend-changes-required)
5. [Complete Token Flow](#complete-token-flow)
6. [Testing Strategy](#testing-strategy)
7. [Security Benefits](#security-benefits)

---

## Current Implementation

### How Authentication Works Now

Our current JWT authentication (in `add-backend` branch) uses a **single long-lived token**:

```
Login → Receive 1 JWT token (30 days) → Store in sessionStorage → Use for all requests
```

**Current Flow**:

1. User logs in via POST `/v1/auth/login`
2. Backend returns JWT in `Authorization: Bearer <token>` header
3. Frontend (`lib/auth/service.ts`) extracts token and stores in sessionStorage
4. All API requests (`lib/api/client.ts`) include token in Authorization header
5. Token expires after 30 days → User must log in again

**Files Involved**:

- `lib/auth/storage.ts`: Token storage (sessionStorage)
- `lib/auth/service.ts`: Login/signup/logout functions
- `lib/api/client.ts`: API client with automatic Authorization header
- `stores/authStore.ts`: Zustand store for auth state
- `app/test-auth-v2/page.tsx`: Test page for auth flow

### The Problem: Security vs UX Trade-off

| Token Lifespan        | Security                                            | User Experience                              |
| --------------------- | --------------------------------------------------- | -------------------------------------------- |
| **30 days** (current) | ❌ If token stolen → 30 days of unauthorized access | ✅ User stays logged in for a month          |
| **1 hour**            | ✅ If token stolen → 1 hour of unauthorized access  | ❌ User must log in every hour (terrible UX) |

**We want both**: Short tokens for security AND long sessions for good UX.

**Solution**: Refresh tokens.

---

## Why Refresh Tokens?

### The Two-Token System

Instead of one 30-day token, we use **two tokens with different purposes**:

**Access Token** (short-lived):

- Lifespan: 1 hour
- Purpose: Used for API requests
- Storage: sessionStorage (cleared on tab close)
- If stolen: Only 1 hour of unauthorized access

**Refresh Token** (long-lived):

- Lifespan: 30 days
- Purpose: Used ONLY to get new access tokens
- Storage: localStorage (persists across sessions)
- If stolen: Can be revoked immediately

### The Magic: Automatic Token Refresh

When the access token expires (after 1 hour):

1. API request fails with 401 Unauthorized
2. Frontend **automatically** calls POST `/auth/refresh` with refresh token
3. Backend issues a new 1-hour access token
4. Frontend retries the original request
5. **User never notices!**

### Result: Best of Both Worlds

✅ **Security**: Access tokens expire every hour
✅ **UX**: Users stay logged in for 30 days (via refresh tokens)
✅ **Revocation**: Can invalidate specific devices by revoking their refresh token
✅ **Multi-device**: Each device has its own refresh token

---

## Backend Architecture

The backend will have **two separate tables** for tokens:

### Table 1: `user_jwt_tokens` (Access Tokens - Allowlist)

Stores short-lived JWT access tokens for the Devise JWT Allowlist strategy.

```ruby
create_table :user_jwt_tokens do |t|
  t.references :user, null: false, foreign_key: true
  t.string :jti, null: false          # JWT ID (from token payload)
  t.string :aud                       # Device identifier (optional)
  t.datetime :exp, null: false        # Expiration (1 hour from issue)
  t.timestamps
end

add_index :user_jwt_tokens, :jti, unique: true
```

**Model**: `User::JwtToken`
**Purpose**: Track valid access tokens (multi-device support via Allowlist strategy)
**Lifespan**: 1 hour

### Table 2: `user_refresh_tokens` (Refresh Tokens)

Stores long-lived refresh tokens with SHA256 hashing for security.

```ruby
create_table :user_refresh_tokens do |t|
  t.references :user, null: false, foreign_key: true
  t.string :crypted_token, null: false  # SHA256 hash (NEVER store raw token!)
  t.string :aud                         # Device identifier (optional)
  t.datetime :exp, null: false          # Expiration (30 days from issue)
  t.timestamps
end

add_index :user_refresh_tokens, :crypted_token, unique: true
```

**Model**: `User::RefreshToken`
**Purpose**: Validate refresh tokens and issue new access tokens
**Lifespan**: 30 days
**Security**: Tokens are hashed with SHA256 before storage (same as passwords)

### Why Two Tables?

| Aspect         | Access Tokens        | Refresh Tokens        |
| -------------- | -------------------- | --------------------- |
| **Lifespan**   | 1 hour               | 30 days               |
| **Storage**    | Plain JTI            | SHA256 hashed         |
| **Validation** | Devise JWT Allowlist | Custom lookup         |
| **Revocation** | Auto-expires         | Manual delete         |
| **Purpose**    | API requests         | Get new access tokens |

Keeping them separate provides better security and cleaner separation of concerns.

---

## Frontend Changes Required

### Overview of Changes

| File                  | Current Behavior                 | New Behavior                                                        |
| --------------------- | -------------------------------- | ------------------------------------------------------------------- |
| `lib/auth/storage.ts` | Stores 1 token in sessionStorage | Stores 2 tokens (access in sessionStorage, refresh in localStorage) |
| `lib/auth/service.ts` | Extracts 1 token on login        | Extracts 2 tokens on login, adds `refreshAccessToken()` function    |
| `lib/api/client.ts`   | Returns 401 error                | Intercepts 401, refreshes token, retries request                    |
| `stores/authStore.ts` | No changes needed                | Minor update to clear refresh token on logout                       |

### Change 1: Update `lib/auth/storage.ts`

Add functions to handle both tokens with appropriate storage:

```typescript
// NEW: Refresh token storage (localStorage - persists across browser sessions)
const REFRESH_TOKEN_KEY = "jiki_refresh_token";

export function setRefreshToken(token: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  } catch (error) {
    console.error("Failed to store refresh token:", error);
  }
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error("Failed to retrieve refresh token:", error);
    return null;
  }
}

export function removeRefreshToken(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error("Failed to remove refresh token:", error);
  }
}

// UPDATE: Existing removeToken() should also clear refresh token
export function removeToken(): void {
  // ... existing code ...
  removeRefreshToken(); // ADD THIS
}
```

**Key Decision**:

- **Access token** → `sessionStorage` (cleared on tab close, more secure)
- **Refresh token** → `localStorage` (persists across sessions, enables "stay logged in")

### Change 2: Update `lib/auth/service.ts`

#### 2.1 Extract Refresh Token from Login/Signup Response

```typescript
/**
 * User login
 * POST /v1/auth/login
 */
export async function login(credentials: LoginCredentials): Promise<User> {
  const response = await api.post<AuthResponse>("/auth/login", { user: credentials });

  // Extract access token from Authorization header
  let accessToken = extractTokenFromHeaders(response.headers);
  if (!accessToken) {
    accessToken = response.data.token || response.data.jwt || response.data.access_token || null;
  }

  // NEW: Extract refresh token from response body
  const refreshToken = response.data.refresh_token;

  // Store both tokens
  if (accessToken) {
    const expiry = getTokenExpiry(accessToken);
    setToken(accessToken, expiry || undefined);
  }

  if (refreshToken) {
    setRefreshToken(refreshToken); // NEW
  }

  return response.data.user;
}

// Same changes for signup()
```

#### 2.2 Add `refreshAccessToken()` Function

```typescript
/**
 * Refresh access token using refresh token
 * POST /v1/auth/refresh
 */
export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    console.error("No refresh token available");
    return null;
  }

  try {
    const response = await api.post<{ access_token?: string }>("/auth/refresh", {
      refresh_token: refreshToken
    });

    // Extract new access token from response
    let accessToken = extractTokenFromHeaders(response.headers);
    if (!accessToken) {
      accessToken = response.data.access_token || null;
    }

    if (accessToken) {
      const expiry = getTokenExpiry(accessToken);
      setToken(accessToken, expiry || undefined);
      return accessToken;
    }

    return null;
  } catch (error) {
    console.error("Failed to refresh access token:", error);
    // If refresh fails, clear all tokens (invalid refresh token)
    removeToken();
    removeRefreshToken();
    return null;
  }
}
```

### Change 3: Update `lib/api/client.ts` (Most Important!)

Add automatic token refresh on 401 errors:

```typescript
// Track refresh state to prevent concurrent refresh calls
let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

/**
 * Generic API request handler
 */
async function request<T = unknown>(path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  // ... existing code for building request ...

  try {
    const response = await fetch(url.toString(), requestOptions);

    // ... existing code for parsing response ...

    // NEW: Handle 401 Unauthorized with automatic token refresh
    if (response.status === 401) {
      // Only try to refresh if we're not already refreshing
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          // Dynamically import to avoid circular dependency
          const { refreshAccessToken } = await import("@/lib/auth/service");
          const newAccessToken = await refreshAccessToken();

          if (newAccessToken) {
            // Refresh succeeded! Retry all queued requests
            refreshQueue.forEach((callback) => callback(newAccessToken));
            refreshQueue = [];

            // Retry the original request with new token
            requestOptions.headers = {
              ...requestOptions.headers,
              Authorization: `Bearer ${newAccessToken}`
            };

            const retryResponse = await fetch(url.toString(), requestOptions);
            let retryData: T;
            const retryContentType = retryResponse.headers.get("content-type");

            if (retryContentType?.includes("application/json")) {
              retryData = await retryResponse.json();
            } else {
              retryData = (await retryResponse.text()) as T;
            }

            if (!retryResponse.ok) {
              throw new ApiError(retryResponse.status, retryResponse.statusText, retryData);
            }

            return {
              data: retryData,
              status: retryResponse.status,
              headers: retryResponse.headers
            };
          } else {
            // Refresh failed - clear tokens and reject all queued requests
            removeToken();
            refreshQueue.forEach((callback) => callback(null));
            refreshQueue = [];
          }
        } finally {
          isRefreshing = false;
        }
      } else {
        // Already refreshing - add this request to the queue
        return new Promise<ApiResponse<T>>((resolve, reject) => {
          refreshQueue.push((newToken) => {
            if (newToken) {
              // Retry request with new token
              requestOptions.headers = {
                ...requestOptions.headers,
                Authorization: `Bearer ${newToken}`
              };
              request<T>(path, options).then(resolve).catch(reject);
            } else {
              reject(new ApiError(401, "Unauthorized", data));
            }
          });
        });
      }

      // If we get here, refresh failed
      throw new ApiError(response.status, response.statusText, data);
    }

    // ... existing success handling ...
  } catch (error) {
    // ... existing error handling ...
  }
}
```

**What This Does**:

1. On 401 error: Tries to refresh the access token
2. Prevents concurrent refresh calls (only one refresh at a time)
3. Queues other failing requests while refreshing
4. Retries all queued requests with the new token
5. If refresh fails: Clears all tokens and fails all requests

### Change 4: Update `stores/authStore.ts`

Minor update to ensure refresh token is cleared on logout:

```typescript
// Logout action
logout: async () => {
  set({ isLoading: true });
  try {
    await authService.logout();
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    // Always clear state regardless of API response
    removeToken();
    removeRefreshToken(); // ADD THIS
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
  }
},
```

### Summary of Frontend Changes

| Component       | Lines Changed | Complexity                                    |
| --------------- | ------------- | --------------------------------------------- |
| `storage.ts`    | +40 lines     | Low (simple CRUD functions)                   |
| `service.ts`    | +35 lines     | Medium (extract tokens, add refresh function) |
| `api/client.ts` | +80 lines     | High (complex 401 interceptor logic)          |
| `authStore.ts`  | +1 line       | Trivial (add removeRefreshToken call)         |

**Total**: ~150-160 lines of new code

---

## Complete Token Flow

### Flow 1: Initial Login

```
1. User enters credentials
   ↓
2. POST /v1/auth/login
   ↓
3. Backend validates credentials
   ↓
4. Backend generates TWO tokens:
   - Access token (JWT, 1 hour, jti stored in user_jwt_tokens)
   - Refresh token (random, 30 days, hashed and stored in user_refresh_tokens)
   ↓
5. Response:
   Headers: Authorization: Bearer <access_token>
   Body: { user: {...}, refresh_token: "<refresh_token>" }
   ↓
6. Frontend stores:
   - sessionStorage["jiki_auth_token"] = access_token
   - localStorage["jiki_refresh_token"] = refresh_token
   ↓
7. User is authenticated ✅
```

### Flow 2: Normal API Request (Access Token Valid)

```
1. User clicks "Fetch Levels"
   ↓
2. GET /v1/levels
   Headers: Authorization: Bearer <access_token>
   ↓
3. Backend checks user_jwt_tokens table:
   - Validates JWT signature
   - Checks jti exists in table
   - Checks exp not expired
   ↓
4. 200 OK + levels data
   ↓
5. User sees levels ✅
```

### Flow 3: API Request After Access Token Expires (Auto-Refresh)

```
1. User clicks "Fetch Levels" (1 hour after login)
   ↓
2. GET /v1/levels
   Headers: Authorization: Bearer <expired_access_token>
   ↓
3. Backend checks user_jwt_tokens:
   - JWT expired → 401 Unauthorized
   ↓
4. Frontend intercepts 401 error
   ↓
5. POST /v1/auth/refresh
   Body: { refresh_token: "<refresh_token>" }
   ↓
6. Backend:
   - Hashes refresh_token
   - Looks up in user_refresh_tokens table
   - Validates exp not expired
   - Generates NEW access token
   - Stores new jti in user_jwt_tokens
   ↓
7. Response:
   Headers: Authorization: Bearer <new_access_token>
   ↓
8. Frontend:
   - Stores new access token in sessionStorage
   - Retries GET /v1/levels with new token
   ↓
9. Backend validates new access token → 200 OK + levels data
   ↓
10. User sees levels ✅ (never noticed the refresh!)
```

### Flow 4: Logout

```
1. User clicks "Logout"
   ↓
2. DELETE /v1/auth/logout
   Headers: Authorization: Bearer <access_token>
   ↓
3. Backend:
   - Deletes jti from user_jwt_tokens (revokes access token)
   - Deletes refresh_token from user_refresh_tokens (revokes refresh token)
   ↓
4. Frontend:
   - Clears sessionStorage (access token)
   - Clears localStorage (refresh token)
   - Clears authStore state
   ↓
5. User is logged out ✅
```

### Flow 5: Refresh Token Expires (After 30 Days)

```
1. User returns after 30 days
   ↓
2. Access token expired → Frontend tries to refresh
   ↓
3. POST /v1/auth/refresh
   Body: { refresh_token: "<expired_refresh_token>" }
   ↓
4. Backend checks user_refresh_tokens:
   - Refresh token exp expired → 401 Unauthorized
   ↓
5. Frontend:
   - Refresh failed → Clears all tokens
   - Redirects to /login
   ↓
6. User must log in again (expected after 30 days) ✅
```

---

## Testing Strategy

### Backend Testing (API repo)

**Test POST /v1/auth/login**:

- ✅ Returns both access_token (header) and refresh_token (body)
- ✅ Access token has 1 hour expiry
- ✅ Refresh token has 30 day expiry
- ✅ Refresh token is hashed in database

**Test POST /v1/auth/refresh**:

- ✅ Valid refresh token → Returns new access token
- ✅ Expired refresh token → 401 Unauthorized
- ✅ Invalid refresh token → 401 Unauthorized
- ✅ Old access token revoked, new jti created

**Test Multi-Device**:

- ✅ Login from Device A → refresh_token_a created
- ✅ Login from Device B → refresh_token_b created
- ✅ Refresh on Device A → Device B still works
- ✅ Logout from Device A → Deletes only refresh_token_a

### Frontend Testing (test-auth-v2 page)

**Test Login Flow**:

1. Open `/test-auth-v2`
2. Enter credentials and click "Login"
3. ✅ Check sessionStorage for access_token
4. ✅ Check localStorage for refresh_token
5. ✅ Click "Fetch Levels" → Should work

**Test Auto-Refresh** (mock expired token):

1. After login, manually set access_token to expired one
2. Click "Fetch Levels"
3. ✅ Should see 401 error briefly
4. ✅ Should auto-refresh and retry
5. ✅ Should see levels data (not error)

**Test Refresh Token Expiry**:

1. After login, manually delete refresh_token from localStorage
2. Manually expire access_token
3. Click "Fetch Levels"
4. ✅ Should fail to refresh
5. ✅ Should clear tokens and show login error

**Test Multi-Tab**:

1. Open Tab 1 → Login
2. Open Tab 2 (same user)
3. In Tab 1: Expire access token → Click "Fetch Levels"
4. ✅ Should auto-refresh and work
5. In Tab 2: Click "Fetch Levels" (still has old access token)
6. ✅ Should auto-refresh and work
7. Both tabs should work independently

**Test Logout**:

1. Login
2. Check both tokens exist
3. Logout
4. ✅ sessionStorage["jiki_auth_token"] cleared
5. ✅ localStorage["jiki_refresh_token"] cleared
6. ✅ authStore.user = null, isAuthenticated = false

---

## Security Benefits

### Comparison: Before vs After

| Security Aspect             | Single Token (30 days)               | Dual Tokens (1h access + 30d refresh)           |
| --------------------------- | ------------------------------------ | ----------------------------------------------- |
| **Token stolen via XSS**    | 30 days of access                    | 1 hour of access (access token expires quickly) |
| **Token in browser memory** | 30-day token in sessionStorage       | 1-hour token in sessionStorage (less risk)      |
| **Revocation**              | Can't revoke specific devices easily | Can revoke specific device's refresh token      |
| **Network interception**    | Exposes 30-day token                 | Exposes 1-hour token (less damage)              |
| **Database breach**         | JWT not in DB (only JTI)             | Refresh tokens hashed (like passwords)          |

### Why This Is More Secure

**1. Limited Exposure Window**

- Access tokens used for ALL requests but only valid for 1 hour
- If intercepted (network sniffing, XSS), attacker has 1 hour max

**2. Refresh Token Protection**

- Stored in localStorage (can upgrade to httpOnly cookie later for XSS immunity)
- Hashed in database (SHA256) - even DB breach doesn't expose raw tokens
- Only used for ONE endpoint (/auth/refresh), not all API requests

**3. Granular Revocation**

- Can revoke a specific device's refresh token → That device logged out
- Can revoke all refresh tokens → All devices logged out
- Access tokens auto-expire quickly (no manual cleanup needed)

**4. Multi-Device Security**

- Each device has its own refresh token
- Compromise of one device doesn't affect others
- Can see all active devices (via user_refresh_tokens table)

### Future Security Enhancements

Once this is working, we can add:

**1. Refresh Token Rotation**

- Every time `/auth/refresh` is called, issue NEW refresh token
- Delete old refresh token
- If old refresh token used again → Security breach detected → Revoke all tokens

**2. httpOnly Cookies for Refresh Tokens**

- Move refresh token from localStorage to httpOnly cookie
- Immune to XSS attacks (JavaScript can't access it)
- Requires CORS credential handling

**3. Device Fingerprinting**

- Store device info in `aud` column
- Validate device fingerprint on refresh
- Detect token theft if device changes

**4. Rate Limiting**

- Limit /auth/refresh calls (e.g., max 10 per hour)
- Prevents brute-force refresh token guessing

---

## Migration Checklist

### Backend (API Repo)

- [ ] Create `user_refresh_tokens` table migration
- [ ] Create `User::RefreshToken` model with SHA256 hashing
- [ ] Create `RefreshTokensController` with POST /auth/refresh
- [ ] Update `SessionsController` to issue refresh tokens
- [ ] Update `RegistrationsController` to issue refresh tokens
- [ ] Update Devise JWT config (1 hour access token expiry)
- [ ] Complete Allowlist migration (override initializer, User model)
- [ ] Write comprehensive tests
- [ ] Update `.context/auth.md`

### Frontend (This Repo - Future)

- [ ] Update `lib/auth/storage.ts` for dual token storage
- [ ] Update `lib/auth/service.ts` to extract refresh token and add refresh function
- [ ] Update `lib/api/client.ts` with 401 interceptor and auto-refresh logic
- [ ] Update `stores/authStore.ts` to clear refresh token on logout
- [ ] Update `types/auth.ts` to include refresh_token in AuthResponse
- [ ] Test with `/test-auth-v2` page
- [ ] Test multi-tab scenario
- [ ] Test token expiry scenarios

---

## Questions?

**Q: Why not store both tokens in the same table?**
A: Different purposes, lifespans, and security needs. Access tokens auto-expire quickly (no manual cleanup), refresh tokens are long-lived and hashed. Separate tables = cleaner code.

**Q: Why localStorage for refresh tokens instead of sessionStorage?**
A: sessionStorage clears when tab closes. We want users to stay logged in across browser restarts (30-day sessions). Can upgrade to httpOnly cookies later for better XSS protection.

**Q: What happens if the refresh token is stolen?**
A: Attacker can get new access tokens. BUT: We can revoke the refresh token immediately from the backend (delete from user_refresh_tokens). With future token rotation, we can detect theft and revoke all tokens.

**Q: Why not just use longer access tokens?**
A: Security. Short-lived access tokens mean if they're stolen (XSS, network interception), the damage window is only 1 hour. Refresh tokens are rarely transmitted (only to /auth/refresh), making them harder to steal.

**Q: Will this break the frontend?**
A: Yes, temporarily! After backend changes, login will return refresh_token in body, but frontend won't store it yet. Once frontend changes are implemented, everything will work seamlessly.

**Q: Can I test refresh tokens with the current frontend?**
A: Partially. You can see refresh_token in login response (browser DevTools → Network → /auth/login → Response). But auto-refresh won't work until frontend changes are implemented.

---

## Summary

### What's Changing

**Backend**:

- ✅ Two token tables: `user_jwt_tokens` (1h) + `user_refresh_tokens` (30d)
- ✅ Login/signup returns both tokens
- ✅ New endpoint: POST /v1/auth/refresh
- ✅ Access tokens expire in 1 hour (down from 30 days)

**Frontend** (documented here, to be implemented later):

- Dual token storage (access in sessionStorage, refresh in localStorage)
- Extract both tokens from login/signup response
- New `refreshAccessToken()` function
- Auto-refresh on 401 errors (transparent to user)

### Why This Matters

- 🔒 **Better Security**: 1-hour access tokens instead of 30-day
- 🎯 **Same UX**: Users stay logged in for 30 days (via refresh tokens)
- 🚀 **Seamless**: Auto-refresh happens behind the scenes
- 🔧 **Revocable**: Can log out specific devices
- 📱 **Multi-Device**: Each device has its own tokens

### Next Steps

1. ✅ Backend implements refresh token system
2. ✅ Backend tests pass
3. ⏳ Frontend implements changes per this document
4. ⏳ End-to-end testing with test-auth-v2
