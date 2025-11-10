# LLM Chat Proxy Refresh Token Implementation Plan

## Current State Analysis

### LLM Chat Proxy (`/llm-chat-proxy`)
- ✅ **Token validation**: Uses `verifyJWT()` to validate incoming JWT tokens
- ✅ **401 response**: Returns `401` with `{"error": "Invalid or expired token"}` for expired/invalid tokens
- ❌ **No specific "expired" detection**: Generic error message for all auth failures
- ❌ **No refresh token awareness**: Does not distinguish between "expired" vs "invalid" tokens

### Frontend App (`/app`)
- ✅ **Full refresh token system**: Complete implementation with `refreshAccessToken()` 
- ✅ **Automatic retry**: API client detects 401, refreshes token, retries request
- ✅ **Token expiry detection**: `isTokenActuallyExpired()` checks JWT exp claim
- ✅ **Race condition handling**: Prevents multiple simultaneous refresh attempts

## Major Implementation Gaps

### 1. **Token Expiry Detection in Proxy** ⚠️ **CRITICAL**

**Problem**: The proxy returns the same error message for both expired and invalid tokens. The frontend needs to know if a token is expired (refreshable) vs invalid (requires re-login).

**Impact**: Frontend cannot distinguish between recoverable (expired) and non-recoverable (invalid) auth errors.

### 2. **Frontend Chat API Integration** ⚠️ **MODERATE**

**Problem**: The chat error handler (`chatErrorHandler.ts`) currently shows "Authentication expired. Please refresh the page." for all 401s without attempting automatic refresh.

**Impact**: Poor user experience - users must manually refresh page instead of automatic token refresh.

### 3. **Response Format Standardization** ⚠️ **MODERATE**

**Problem**: Proxy and main API return inconsistent error formats.

**Current proxy format:**
```json
{"error": "Invalid or expired token"}
```

**Should match main API format:**
```json
{"error": "token_expired", "message": "Token has expired"}
```

## Implementation Plan

### Phase 1: Enhanced Token Detection in Proxy

#### File: `llm-chat-proxy/src/auth.ts`

**Current:**
```typescript
export async function verifyJWT(token: string, secret: string): Promise<string | null>
```

**Enhanced:**
```typescript
export interface JWTResult {
  userId: string | null;
  error?: 'expired' | 'invalid' | 'missing_claim';
}

export async function verifyJWT(token: string, secret: string): Promise<JWTResult> {
  try {
    const secretKey = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ["HS256"]
    });

    // Check if token is expired
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return { userId: null, error: 'expired' };
    }

    // User ID is in the 'sub' claim
    if (typeof payload.sub !== "string") {
      console.log("Invalid token: missing or invalid sub claim");
      return { userId: null, error: 'missing_claim' };
    }

    return { userId: payload.sub };
  } catch (error) {
    console.error("JWT verification failed:", error);
    return { userId: null, error: 'invalid' };
  }
}
```

#### File: `llm-chat-proxy/src/index.ts`

**Update chat endpoint (lines 55-59):**
```typescript
const jwtResult = await verifyJWT(token, c.env.DEVISE_JWT_SECRET_KEY);
if (!jwtResult.userId) {
  console.log(`[Chat] ❌ JWT verification failed - ${jwtResult.error}`);
  
  if (jwtResult.error === 'expired') {
    return c.json({ 
      error: "token_expired", 
      message: "Token has expired" 
    }, 401);
  }
  
  return c.json({ 
    error: "invalid_token", 
    message: "Invalid token" 
  }, 401);
}

console.log("[Chat] ✅ JWT verified, user ID:", jwtResult.userId);
const userId = jwtResult.userId;
```

#### File: `llm-chat-proxy/tests/auth.test.ts`

**Add test for enhanced JWT result:**
```typescript
it("should return expired error for expired JWT", async () => {
  const secret = new TextEncoder().encode(testSecret);
  const token = await new SignJWT({ sub: "user-123" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("-1h")
    .sign(secret);

  const result = await verifyJWT(token, testSecret);
  expect(result.userId).toBeNull();
  expect(result.error).toBe("expired");
});
```

### Phase 2: Frontend Chat Integration

#### Option A: Use Main API Client (Recommended)

**File: `app/components/coding-exercise/lib/chatApi.ts`**

Integrate chat API calls with the main API client that already has refresh logic:

```typescript
import { request } from "@/lib/api/client";

export async function sendChatMessage(data: ChatRequest): Promise<ReadableStream> {
  // Use main API client for authentication handling
  const response = await request<ReadableStream>("/llm-chat-proxy/chat", {
    method: "POST",
    body: data
  });
  
  return response.data;
}
```

#### Option B: Chat-Specific Refresh Logic

**File: `app/components/coding-exercise/lib/chatApi.ts`**

Add refresh-retry logic specifically for chat:

```typescript
export async function sendChatMessage(data: ChatRequest): Promise<ReadableStream> {
  try {
    return await performChatRequest(data);
  } catch (error) {
    if (error instanceof ChatApiError && error.status === 401) {
      // Check if this is a token_expired error
      if (error.data?.error === 'token_expired') {
        // Attempt token refresh
        const newToken = await refreshAccessToken();
        if (newToken) {
          // Retry with new token
          return await performChatRequest(data);
        }
      }
    }
    throw error;
  }
}
```

#### File: `app/components/coding-exercise/lib/chatErrorHandler.ts`

**Update error handling:**
```typescript
export function formatChatError(error: unknown): string {
  if (error instanceof ChatApiError) {
    if (error.status === 401) {
      // Check specific error type
      if (error.data?.error === 'token_expired') {
        return "Session expired. Refreshing authentication...";
      }
      if (error.data?.error === 'invalid_token') {
        return "Authentication failed. Please sign in again.";
      }
      return "Authentication expired. Please refresh the page.";
    }
    // ... rest of error handling
  }
  // ... rest of function
}

export function shouldRetryError(error: unknown): boolean {
  if (error instanceof ChatApiError) {
    // Don't retry expired tokens - they should be handled by refresh logic
    if (error.status === 401 && error.data?.error === 'token_expired') {
      return false; // Refresh logic handles this
    }
    // Retry on server errors and rate limits
    return error.status === 429 || (error.status !== undefined && error.status >= 500);
  }
  // ... rest of function
}
```

### Phase 3: Testing & Validation

#### Test Scenarios

1. **Valid token**: Chat works normally
2. **Expired token**: 
   - Proxy returns `token_expired` error
   - Frontend detects error, refreshes token
   - Frontend retries chat request with new token
   - Chat succeeds
3. **Invalid token**: 
   - Proxy returns `invalid_token` error
   - Frontend shows re-login prompt (no refresh attempt)
4. **Refresh failure**: 
   - Clear tokens and redirect to login

#### Unit Tests to Add/Update

**llm-chat-proxy:**
- Update existing auth tests for new return format
- Add test for expired token detection
- Test new error response formats

**app:**
- Update chat error handler tests
- Add integration tests for chat refresh flow
- Test chat API retry logic

## Implementation Timeline

### Week 1: Proxy Enhancement
- **Days 1-2**: Update `verifyJWT()` function and response handling
- **Day 3**: Update tests and validate proxy changes
- **Days 4-5**: Deploy and test proxy in isolation

### Week 2: Frontend Integration
- **Days 1-2**: Implement chat API integration with refresh logic
- **Day 3**: Update error handling and user messaging
- **Days 4-5**: Comprehensive testing and bug fixes

## Risk Assessment & Mitigation

### Low Risk
- Proxy changes can be made backward compatible initially
- Frontend already has robust refresh token system
- Changes are localized to specific components

### Moderate Risk
- **Chat streaming complexity**: Refresh logic must work with streaming responses
- **Race conditions**: Multiple chat requests during token refresh
- **Error handling coordination**: Ensuring consistent behavior between proxy and frontend

### Mitigation Strategies
1. **Gradual rollout**: Deploy proxy changes first with backward compatibility
2. **Feature flags**: Enable new behavior gradually
3. **Comprehensive testing**: Both unit tests and integration testing
4. **Monitoring**: Add logging for refresh attempts and failures
5. **Fallback handling**: Graceful degradation if refresh fails

## Success Metrics

### Technical Metrics
- ✅ Token refresh success rate > 95%
- ✅ Chat API 401 errors reduced by > 80%
- ✅ No increase in authentication-related support tickets

### User Experience Metrics
- ✅ Users no longer see "Please refresh the page" messages
- ✅ Seamless chat experience during token expiration
- ✅ Faster resolution of temporary auth issues

## Dependencies

### External Dependencies
- No new external dependencies required
- Uses existing JWT libraries (`jose`)
- Leverages existing refresh token infrastructure

### Internal Dependencies
- Proxy deployment must happen before frontend changes
- Requires coordination with Rails API team for testing
- May need coordination with monitoring/alerting systems

## Rollback Plan

### If Issues Arise
1. **Immediate**: Feature flag to disable new error handling
2. **Short-term**: Revert to generic 401 responses in proxy
3. **Long-term**: Roll back to previous chat error handling

### Rollback Triggers
- Authentication success rate drops below 90%
- Increase in user-reported auth issues
- Chat functionality errors increase significantly

---

**Document Status**: Draft v1.0  
**Last Updated**: 2025-11-07  
**Next Review**: After Phase 1 completion