# Password Reset & Forgotten Password Implementation Plan

## Overview

This plan outlines the implementation of password reset and forgotten password functionality for the Jiki frontend application. The backend already supports this functionality via Devise mailer integration.

## Current State Analysis

### Existing Authentication Infrastructure

**✅ Already Implemented:**
- Authentication service layer (`lib/auth/service.ts`) with password reset methods
- Type definitions (`types/auth.ts`) for `PasswordResetRequest` and `PasswordReset`
- Auth store (`stores/authStore.ts`) with `requestPasswordReset` and `resetPassword` actions
- API client with JWT token handling and error management
- Auth layout and form components structure
- Login form with "Forgot your password?" link pointing to `/auth/forgot-password`

**Backend Integration:**
- API endpoints: `POST /v1/auth/password` and `PATCH /v1/auth/password`
- Email flow: Backend sends MJML emails with reset links to frontend
- Reset URL format: `http://localhost:3000/auth/reset-password?token=abc123`
- Internationalization: Supports English and Hungarian locales

## Implementation Tasks

### 1. Forgot Password Page
**Route:** `/auth/forgot-password`
**Purpose:** Allow users to request password reset email

**Components to Create:**
- `app/auth/forgot-password/page.tsx` - Next.js page component
- `components/auth/ForgotPasswordForm.tsx` - Form component

**Form Requirements:**
- Single email input field with validation
- Submit button with loading state
- Error handling for invalid emails or API failures
- Success message after email sent
- Link back to login page
- Follow existing form styling patterns from LoginForm

**Flow:**
1. User enters email address
2. Form validates email format
3. Calls `useAuthStore().requestPasswordReset(email)`
4. Shows success message: "If an account with that email exists, you'll receive reset instructions shortly"
5. Provides link to return to login

### 2. Reset Password Page
**Route:** `/auth/reset-password`
**Purpose:** Allow users to set new password using token from email

**Components to Create:**
- `app/auth/reset-password/page.tsx` - Next.js page component
- `components/auth/ResetPasswordForm.tsx` - Form component

**Form Requirements:**
- Password input field
- Password confirmation input field
- Password validation (minimum 6 characters, passwords match)
- Submit button with loading state
- Error handling for invalid tokens or API failures
- Success message with redirect to login

**URL Handling:**
- Extract token from query parameter: `?token=abc123`
- Validate token exists before showing form
- Show error if token is missing or malformed

**Flow:**
1. User arrives from email link with token
2. Form validates token exists
3. User enters new password and confirmation
4. Form validates password requirements and matching
5. Calls `useAuthStore().resetPassword({ token, password, password_confirmation })`
6. Shows success message and redirects to login after 3 seconds

### 3. Route Protection & Error Handling

**Token Validation:**
- Client-side validation of token format
- Server-side validation via API call
- Handle expired tokens gracefully
- Clear error messages for all failure scenarios

**Security Considerations:**
- No sensitive data in URLs (token is temporary and single-use)
- Proper form validation and sanitization
- Clear success/error messaging without information leakage

## Technical Implementation Details

### File Structure
```
app/
├── auth/
│   ├── forgot-password/
│   │   └── page.tsx
│   └── reset-password/
│       └── page.tsx
components/
└── auth/
    ├── ForgotPasswordForm.tsx
    └── ResetPasswordForm.tsx
```

### Styling & UX
- Follow existing auth form patterns from `LoginForm.tsx` and `SignupForm.tsx`
- Use consistent Tailwind CSS classes
- Maintain responsive design
- Include proper loading states and error handling
- Clear, user-friendly messaging

### State Management
- Leverage existing `useAuthStore` methods:
  - `requestPasswordReset(email: string): Promise<void>`
  - `resetPassword(data: PasswordReset): Promise<void>`
- Use local state for form data and validation
- Handle loading and error states from auth store

### Validation
- Email format validation on forgot password form
- Password strength validation (minimum 6 characters)
- Password confirmation matching
- Token presence validation on reset form

### Error Handling
- Network errors from API calls
- Invalid email addresses
- Invalid or expired tokens
- Weak passwords
- Password mismatch
- Server validation errors

### Success Flows
- Forgot password: Show confirmation message, don't reveal if email exists
- Reset password: Show success and auto-redirect to login
- Clear, actionable messaging throughout

## Testing Strategy

### Unit Tests
Create tests in `tests/unit/components/auth/`:
- `ForgotPasswordForm.test.tsx` - Form validation, submission, error handling
- `ResetPasswordForm.test.tsx` - Token validation, form submission, success flow

### Integration Tests
- E2E flow simulation (if email testing is possible in dev)
- API integration with mock responses
- Route navigation and state management

### Manual Testing
- Test with valid/invalid email addresses
- Test with valid/invalid/expired tokens
- Test form validation and error states
- Test responsive design on mobile devices

## Implementation Priority

1. **High Priority:** Forgot password page and form (blocks user recovery)
2. **High Priority:** Reset password page and form (completes the flow)
3. **Medium Priority:** Enhanced error handling and UX polish
4. **Low Priority:** Additional security features or analytics

## Dependencies

**No new dependencies required** - all functionality uses existing:
- Next.js 15 with App Router
- Existing auth store and service layer
- Tailwind CSS for styling
- Existing API client and error handling

## Success Criteria

- ✅ Users can request password reset emails
- ✅ Users can reset passwords using email tokens
- ✅ All error cases are handled gracefully
- ✅ Forms follow existing design patterns
- ✅ Mobile-responsive design
- ✅ Proper loading states and user feedback
- ✅ Integration with existing auth system
- ✅ Security best practices followed

## Time Estimate

**Total: 4-6 hours**
- Forgot password page/form: 1.5-2 hours
- Reset password page/form: 2-2.5 hours
- Testing and refinement: 1-1.5 hours

This implementation leverages the existing auth infrastructure and follows established patterns, making it a straightforward addition to the current codebase.