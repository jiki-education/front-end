# Devise Authentication Flows - Frontend Implementation

This document explains how to implement authentication flows (password reset and email confirmation) in the frontend. The backend API handles token generation and email sending - your job is to build the pages users interact with.

## Password Reset Flow

### How It Works

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Frontend  │  POST   │      API     │  Email  │    User     │
│             │────────>│              │────────>│             │
│  /forgot-   │         │   Generates  │         │   Inbox     │
│  password   │         │    Token     │         │             │
└─────────────┘         └──────────────┘         └─────────────┘
                                                         │
                                                         │ Clicks link
                                                         ▼
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Frontend  │  PATCH  │      API     │         │   Frontend  │
│             │<────────│              │<────────│  /reset-    │
│  Success!   │         │  Validates   │         │  password   │
│  Redirect   │         │    Token     │         │  ?token=... │
└─────────────┘         └──────────────┘         └─────────────┘
```

**User Journey:**
1. User forgets password → visits `/auth/forgot-password`
2. User enters email → frontend POSTs to API
3. API sends email with link to `/auth/reset-password?token=abc123`
4. User clicks link → opens frontend page
5. User enters new password → frontend PATCHes to API with token
6. Success → redirect to login

### 1. Forgot Password Page

**Route**: `/auth/forgot-password`

**What it does**: Lets users request a password reset email

```typescript
// app/auth/forgot-password/page.tsx
'use client';

import { useState } from 'react';
import { api } from '@/lib/api/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post('/v1/auth/password', {
        user: { email }
      });
      setSuccess(true);
    } catch (err) {
      // Show generic error (don't reveal if email exists)
      alert('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div>
        <h1>Check Your Email</h1>
        <p>We've sent password reset instructions to {email}.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Reset Your Password</h1>
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

**API Request**:
```typescript
POST /v1/auth/password
{
  "user": {
    "email": "user@example.com"
  }
}
```

**API Response**: Always 200 OK (security: don't reveal if email exists)

### 2. Reset Password Page

**Route**: `/auth/reset-password?token=abc123`

**What it does**: Lets users set a new password

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

  if (!token) {
    return (
      <div>
        <h1>Invalid Link</h1>
        <p>This password reset link is invalid or expired.</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== passwordConfirmation) {
      alert('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      await api.patch('/v1/auth/password', {
        user: {
          reset_password_token: token,
          password,
          password_confirmation: passwordConfirmation
        }
      });

      router.push('/auth/login?reset=success');
    } catch (err: any) {
      if (err.response?.status === 422) {
        alert('Reset token is invalid or expired. Please request a new one.');
      } else {
        alert('Failed to reset password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Choose a New Password</h1>
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
        placeholder="Confirm password"
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

**API Request**:
```typescript
PATCH /v1/auth/password
{
  "user": {
    "reset_password_token": "abc123...",
    "password": "new_password",
    "password_confirmation": "new_password"
  }
}
```

**API Responses**:
- **Success** (200): `{ "message": "Password has been reset successfully" }`
- **Error** (422): `{ "error": { "type": "invalid_token", "message": "..." } }`

---

## Email Confirmation Flow

### How It Works

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Frontend  │  POST   │      API     │  Email  │    User     │
│             │────────>│              │────────>│             │
│  /signup    │         │   Creates    │         │   Inbox     │
│             │         │   Account    │         │             │
└─────────────┘         └──────────────┘         └─────────────┘
                                                         │
                                                         │ Clicks link
                                                         ▼
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Frontend  │   GET   │      API     │         │   Frontend  │
│             │────────>│              │<────────│  /confirm-  │
│  Success!   │         │   Confirms   │         │  email      │
│  Redirect   │         │   Account    │         │  ?token=... │
└─────────────┘         └──────────────┘         └─────────────┘
```

**User Journey:**
1. User signs up → API creates account (unconfirmed)
2. API sends email with link to `/auth/confirm-email?token=abc123`
3. User clicks link → opens frontend page
4. Frontend immediately GETs API with token → API confirms account
5. Success → redirect to login or dashboard

### Confirm Email Page

**Route**: `/auth/confirm-email?token=abc123`

**What it does**: Confirms user's email address automatically when they visit

```typescript
// app/auth/confirm-email/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api/client';

export default function ConfirmEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();

  const [status, setStatus] = useState<'confirming' | 'success' | 'error'>('confirming');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }

    const confirmEmail = async () => {
      try {
        await api.get('/v1/auth/confirmation', {
          params: { confirmation_token: token }
        });

        setStatus('success');

        // Redirect after 2 seconds
        setTimeout(() => {
          router.push('/auth/login?confirmed=true');
        }, 2000);
      } catch (err: any) {
        setStatus('error');
      }
    };

    confirmEmail();
  }, [token, router]);

  if (status === 'confirming') {
    return (
      <div>
        <h1>Confirming Your Email...</h1>
        <p>Please wait while we confirm your email address.</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div>
        <h1>Email Confirmed!</h1>
        <p>Your email has been confirmed. Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Confirmation Failed</h1>
      <p>This confirmation link is invalid or has expired.</p>
      <a href="/auth/signup">Sign up again</a>
    </div>
  );
}
```

**API Request**:
```typescript
GET /v1/auth/confirmation?confirmation_token=abc123
```

**API Responses**:
- **Success** (200): `{ "message": "Email confirmed successfully" }`
- **Error** (422): `{ "error": { "type": "invalid_token", "message": "..." } }`

---

## Testing Locally

### Setup

```bash
# Terminal 1: Start API (localhost:3061)
cd api
bin/rails server

# Terminal 2: Start Frontend (localhost:3060)
cd front-end-app/app
pnpm dev
```

### Test Password Reset

1. Visit `http://localhost:3060/auth/forgot-password`
2. Enter email of existing user
3. Check browser - email opens automatically (Letter Opener)
4. Click "Reset My Password" in email
5. Opens `http://localhost:3060/auth/reset-password?token=...`
6. Enter new password
7. Should redirect to login

### Test Email Confirmation

1. Sign up a new user (if signup is implemented)
2. Check browser - confirmation email opens automatically
3. Click "Confirm My Email" in email
4. Opens `http://localhost:3060/auth/confirm-email?token=...`
5. Page confirms automatically
6. Redirects to login after 2 seconds

---

## Implementation Checklist

### Pages
- [ ] `/app/auth/forgot-password/page.tsx`
- [ ] `/app/auth/reset-password/page.tsx`
- [ ] `/app/auth/confirm-email/page.tsx`

### Styling
- [ ] Match existing auth pages (login/signup)
- [ ] Mobile responsive
- [ ] Loading spinners
- [ ] Clear error messages
- [ ] Success feedback

### UX Enhancements
- [ ] Password visibility toggle
- [ ] Password strength indicator
- [ ] "Back to login" links
- [ ] Prevent double submissions
- [ ] Form validation

### Edge Cases
- [ ] Missing token parameter
- [ ] Expired tokens
- [ ] Network errors
- [ ] CORS issues (check API config)

---

## Security Notes

### For Frontend Developers

- **Never log tokens** - Don't `console.log()` tokens
- **Generic errors on request** - Don't reveal if email exists when requesting reset
- **Specific errors on completion** - It's safe to say "token expired" when using the token
- **HTTPS in production** - Tokens are in URLs, need encryption
- **Minimum password length** - Enforce 6+ characters (matches backend)

### Token Lifecycle

- **Reset tokens**: Valid for 6 hours, single-use
- **Confirmation tokens**: Valid until used, single-use
- Once used or expired, user must request new one

---

## Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Email link wrong URL | Config issue | Check `frontend_base_url` in API config |
| CORS error | API not allowing origin | Check API CORS settings |
| Token expired | Too slow clicking link | Request new reset/confirmation |
| Token invalid | Already used or fake | Request new reset/confirmation |

---

## Optional: Auto-Login After Reset

By default, users redirect to login after password reset (more secure). If you want auto-login:

```typescript
const response = await api.patch('/v1/auth/password', { ... });
const token = response.headers.authorization?.replace('Bearer ', '');
if (token) {
  // Store JWT and redirect to dashboard
  useAuthStore.getState().setAuth(token, response.data.user);
  router.push('/dashboard');
}
```

⚠️ **Security tradeoff**: If user's email was compromised, attacker could auto-login
