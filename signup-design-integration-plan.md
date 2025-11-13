# Signup Design Integration Plan

## Current State
- **Login**: Uses a two-column split layout (form on left, gradient background on right) with sophisticated styling
- **Signup**: Currently has basic form styling, needs design upgrade to match the design repo

## Integration Plan

### 1. Update SignupForm component (`components/auth/SignupForm.tsx`)
- Remove name field (not in design)
- Remove password confirmation field (not in design) 
- Remove terms checkbox (not in design)
- Add Google OAuth button at top
- Update styling to match login form patterns using StyledInput components
- Add OR divider
- Update button styling to match login button
- Add "Didn't receive confirmation email" link

### 2. Create/Update signup page layout (`app/(external)/auth/signup/page.tsx`)
- Use same AuthPageWrapper and AuthLayout as login
- Update title to "Sign Up"
- Update subtitle to link to login page
- Use two-column layout similar to login

### 3. Update AuthLayout component (if needed)
- Ensure it supports the right-side gradient content area
- Add Jiki branding and tagline content for signup

### 4. Key Design Elements to Implement
- Two-column split layout (form left, gradient right)
- Gradient background: `linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #667eea 100%)`
- Right side with large "Jiki" logo, tagline "Your coding journey starts here"
- Description: "Join millions of learners transforming their careers through hands-on coding practice"
- "Created by The team behind Exercism" badge
- Sticky right side behavior for desktop
- Mobile-responsive stacking

### 5. Maintain existing functionality
- Keep all auth store integration
- Keep validation logic
- Keep form submission handling
- Keep error displays

## Notes
The design simplifies the signup to just email + password (no name, no password confirmation, no terms), following a cleaner UX pattern while maintaining the visual consistency with the login page design.