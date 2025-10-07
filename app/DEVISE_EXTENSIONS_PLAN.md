# Devise Extensions - Frontend Implementation Plan

This document outlines how to implement password reset and other Devise flows in the frontend, working with the Rails API's Devise + JWT authentication.

## Overview

The backend uses Devise with JWT for authentication in an API-only Rails app. Devise handles flows like password reset by sending emails with tokens. The **frontend is responsible** for:

1. Providing forms for users to request actions (reset password, etc.)
2. Displaying pages that the backend emails link to
3. Submitting tokens + data back to the API

## Architecture Pattern

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Frontend  │  POST   │   Rails API  │  Email  │    User     │
│             │────────>│   + Devise   │────────>│             │
│  /forgot-   │         │              │         │   Inbox     │
│  password   │         │  Generates   │         │             │
└─────────────┘         │    Token     │         └─────────────┘
                        └──────────────┘                │
                                                        │ Clicks link
                                                        ▼
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Frontend  │  PATCH  │   Rails API  │         │   Frontend  │
│             │<────────│              │<────────│  /reset-    │
│  Success    │         │  Validates   │         │  password   │
│  Message    │         │    Token     │         │  ?token=... │
└─────────────┘         └──────────────┘         └─────────────┘
```

## Password Reset Flow

### 1. Request Password Reset

**Page**: `/auth/forgot-password`

**Purpose**: Let users request a password reset email

**Implementation**:

```typescript
// app/auth/forgot-password/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await api.post('/v1/auth/password', {
        user: { email }
      });
      setSuccess(true);
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div>
        <h1>Check Your Email</h1>
        <p>
          We've sent password reset instructions to {email}.
          Please check your inbox.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Reset Your Password</h1>
      {error && <div className="error">{error}</div>}

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
      />

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Sending...' : 'Send Reset Instructions'}
      </button>
    </form>
  );
}
```

**API Endpoint**: `POST /v1/auth/password`

**Request Body**:
```json
{
  "user": {
    "email": "user@example.com"
  }
}
```

**Response**: Always returns 200 OK to prevent email enumeration
```json
{
  "message": "Reset instructions sent to user@example.com"
}
```

### 2. Reset Password Page

**Page**: `/auth/reset-password?token=abc123...`

**Purpose**: Allow users to set a new password after clicking the email link

**Implementation**:

```typescript
// app/auth/reset-password/page.tsx
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api/client';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!token) {
    return (
      <div>
        <h1>Invalid Reset Link</h1>
        <p>This password reset link is invalid or has expired.</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password !== passwordConfirmation) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      await api.patch('/v1/auth/password', {
        user: {
          reset_password_token: token,
          password: password,
          password_confirmation: passwordConfirmation
        }
      });

      // Success - redirect to login
      router.push('/auth/login?reset=success');
    } catch (err: any) {
      if (err.response?.status === 422) {
        setError('Reset token is invalid or has expired. Please request a new one.');
      } else {
        setError('Failed to reset password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Choose a New Password</h1>
      {error && <div className="error">{error}</div>}

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="New password"
        minLength={6}
        required
      />

      <input
        type="password"
        value={passwordConfirmation}
        onChange={(e) => setPasswordConfirmation(e.target.value)}
        placeholder="Confirm new password"
        minLength={6}
        required
      />

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Resetting...' : 'Reset Password'}
      </button>
    </form>
  );
}
```

**API Endpoint**: `PATCH /v1/auth/password`

**Request Body**:
```json
{
  "user": {
    "reset_password_token": "abc123...",
    "password": "new_password",
    "password_confirmation": "new_password"
  }
}
```

**Success Response** (200):
```json
{
  "message": "Password has been reset successfully"
}
```

**Error Response** (422):
```json
{
  "error": {
    "type": "invalid_token",
    "message": "Reset token is invalid or has expired",
    "errors": {
      "reset_password_token": ["is invalid"]
    }
  }
}
```

## Email Template Context

The backend sends emails with links that point to the frontend:

**Password Reset Email**:
- **Link**: `http://localhost:3000/auth/reset-password?token=abc123...`
- **Backend Variable**: `Jiki.config.frontend_base_url` (from config gem)
- **Configured In**: `../config/settings/local.yml` and `ci.yml`

## Testing in Development

### 1. Test Password Reset Flow

```bash
# Start Rails API (runs on http://localhost:3061)
cd api
bin/rails server

# Start Frontend (runs on http://localhost:3000)
cd front-end-app/app
pnpm dev
```

### 2. Trigger Password Reset Email

1. Navigate to `http://localhost:3000/auth/forgot-password`
2. Enter an email address of an existing user
3. Submit the form

### 3. Check Email (Letter Opener)

Rails development uses Letter Opener - emails automatically open in your browser.

Check the email contains:
- Link to `http://localhost:3000/auth/reset-password?token=...`
- Clear call-to-action button
- Expiry information (6 hours)

### 4. Complete Reset

1. Click the link in the email
2. Should navigate to frontend reset password page
3. Enter new password (twice)
4. Submit form
5. Should redirect to `/auth/login?reset=success`

## Implementation Checklist

### Pages to Create

- [ ] `/app/auth/forgot-password/page.tsx` - Request password reset form
- [ ] `/app/auth/reset-password/page.tsx` - Reset password form with token

### Components to Create (Optional)

- [ ] `<PasswordResetRequestForm />` - Reusable forgot password form
- [ ] `<PasswordResetForm />` - Reusable reset password form
- [ ] `<PasswordStrengthIndicator />` - Show password strength

### API Integration

- [x] Password reset request endpoint exists: `POST /v1/auth/password`
- [x] Password reset completion endpoint exists: `PATCH /v1/auth/password`
- [x] Backend sends emails with correct frontend URLs
- [ ] Frontend API client handles password reset requests
- [ ] Error handling for invalid/expired tokens

### User Experience

- [ ] Loading states during API calls
- [ ] Clear error messages
- [ ] Success messages with next steps
- [ ] Form validation (password length, matching passwords)
- [ ] Password visibility toggle
- [ ] "Back to login" links
- [ ] Auto-redirect after successful reset

### Styling

- [ ] Consistent with existing auth pages (login/signup)
- [ ] Mobile responsive
- [ ] Accessible (ARIA labels, keyboard navigation)
- [ ] Loading spinners/indicators

### Edge Cases

- [ ] Handle missing token parameter
- [ ] Handle expired tokens
- [ ] Handle already-used tokens
- [ ] Handle user not found (backend returns success to prevent enumeration)
- [ ] Handle network errors
- [ ] Prevent multiple submissions

## Future Extensions

### Email Confirmation (If Needed)

**Pattern is identical to password reset**:

1. **Backend adds** `:confirmable` module to User model
2. **Backend sends** confirmation email with token
3. **Frontend creates** `/auth/confirm-email?token=...` page
4. **Page calls** `GET /v1/auth/confirmation?confirmation_token=...`
5. **Backend confirms** user and returns success

### Account Unlocking (If :lockable enabled)

Same pattern - backend sends email, frontend displays page, calls API with token.

## Security Considerations

### Token Handling

- **Never log tokens** - Don't console.log tokens
- **HTTPS only in production** - Tokens sent over URL params
- **Short token expiry** - Backend expires reset tokens after 6 hours
- **Single-use tokens** - Backend invalidates tokens after use

### Password Requirements

Match backend requirements:
- Minimum 6 characters (Devise default)
- Consider adding:
  - Password strength indicator
  - Common password checks
  - Minimum character requirements

### Error Messages

- **Generic on request** - "If this email exists, we've sent instructions"
- **Specific on reset** - "Token is invalid or expired" is safe to reveal
- **No user enumeration** - Don't reveal if email exists

## Related Documentation

- **Backend Auth**: See `api/.context/auth.md` for API details
- **Frontend Auth**: See `.context/auth.md` for current auth implementation
- **API Client**: See `.context/api.md` for HTTP client setup
- **Mailers**: See `api/.context/mailers.md` for email template patterns

## Common Issues & Solutions

### Issue: Email link doesn't work locally

**Problem**: Link points to wrong URL
**Solution**: Check `Jiki.config.frontend_base_url` in `../config/settings/local.yml`

### Issue: Token expired error

**Problem**: Took too long to click email link
**Solution**: Backend expires tokens after 6 hours - request new reset

### Issue: Token invalid error

**Problem**: Token already used or never existed
**Solution**: Request new reset link

### Issue: CORS error when calling API

**Problem**: API not allowing frontend origin
**Solution**: Check CORS configuration in `api/config/initializers/cors.rb`

## Implementation Notes

### Why Not Auto-Login After Reset?

The backend can auto-login after password reset by returning a JWT token. However, for security:
- Better to redirect to login page
- Forces user to confirm new password works
- Prevents session hijacking if email was compromised

If you want auto-login:
```typescript
// In reset-password page.tsx
const response = await api.patch('/v1/auth/password', { ... });
const token = response.headers.authorization?.replace('Bearer ', '');
if (token) {
  // Store token and redirect to dashboard
  useAuthStore.getState().setAuth(token, response.data.user);
  router.push('/dashboard');
}
```

### Internationalization

Password reset pages should support multiple languages:
- Use same locale detection as login/signup pages
- Backend sends emails in user's preferred language
- Frontend forms match email language

### Analytics

Consider tracking:
- Password reset requests (count)
- Successful password resets (count)
- Time between request and completion
- Failed reset attempts (expired/invalid tokens)
