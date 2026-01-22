# Settings Page

## Overview

The settings page (`/settings`) provides users with subscription management functionality integrated with Stripe. It handles all 9 subscription states with appropriate actions and user feedback.

## Architecture

### Component Organization

```
components/settings/
├── SettingsPage.tsx           # Main page component with auth integration
├── subscription/              # Subscription management section
│   ├── SubscriptionSection.tsx          # Container with data flow
│   ├── SubscriptionStateSwitch.tsx      # Routes to appropriate state component
│   ├── SubscriptionErrorBoundary.tsx    # Error handling wrapper
│   ├── CheckoutModal.tsx                # Stripe Elements checkout UI
│   ├── handlers.ts                      # Real Stripe API integration
│   ├── utils.ts                         # Subscription state detection logic
│   ├── types.ts                         # TypeScript type definitions
│   └── states/                          # Individual state components
│       ├── NeverSubscribedState.tsx
│       ├── ActivePremiumState.tsx
│       ├── CancellingScheduledState.tsx
│       ├── PaymentFailedGraceState.tsx
│       ├── PaymentFailedExpiredState.tsx
│       ├── PreviouslySubscribedState.tsx
│       ├── IncompletePaymentState.tsx
│       └── IncompleteExpiredState.tsx
└── ui/                        # Reusable UI components
    ├── SettingsCard.tsx       # Consistent card layout
    ├── SubscriptionButton.tsx # Standardized action buttons
    └── SubscriptionStatus.tsx # Current tier/status display
```

### Data Flow

1. **Authentication**: Uses `useRequireAuth()` hook for user data and auth protection
2. **State Detection**: `getSubscriptionState(user)` determines current subscription state
3. **Actions**: Real Stripe API calls via `handlers.ts` functions
4. **User Feedback**: Toast notifications and confirmation dialogs
5. **Data Refresh**: `refreshUser()` updates user object after subscription changes

## Key Features

### Real Stripe Integration

- **API Integration**: Uses `@/lib/api/subscriptions` for all Stripe operations
- **Checkout Flow**: Stripe Elements integration with modal UI
- **State Management**: Tracks `selectedTier` and `clientSecret` for checkout flows
- **Portal Integration**: Stripe Customer Portal for payment management

### Subscription States

The component handles all 9 subscription states as defined in `STRIPE_IMPLEMENTATION.md`:

1. **never_subscribed**: Show upgrade options with plan comparison
2. **incomplete_payment**: Guide user through payment completion
3. **active_premium**: Upgrade, cancel, or manage payment options
4. **active_max**: Downgrade, cancel, or manage payment options
5. **cancelling_scheduled**: Reactivate or manage subscription
6. **payment_failed_grace**: Update payment method or retry payment
7. **payment_failed_expired**: Restart subscription with fresh checkout
8. **previously_subscribed**: Resubscribe with plan options
9. **incomplete_expired**: Restart with fresh checkout flow

### User Experience Features

- **Loading States**: Comprehensive loading indicators for all async operations
- **Error Handling**: Error boundaries with graceful degradation
- **Confirmation Dialogs**: User confirmations for destructive actions (cancel, downgrade)
- **Toast Feedback**: Success/error messages for all actions
- **Accessibility**: WCAG 2.1 compliant with ARIA attributes and keyboard navigation
- **Responsive Design**: Mobile-first design working across all devices

### Performance Optimizations

- **Lazy Loading**: CheckoutModal and state components load only when needed
- **Code Splitting**: Dynamic imports reduce initial bundle size
- **Suspense Boundaries**: Smooth loading experience with fallbacks

## Usage Patterns

### Adding New Settings Sections

To add new settings sections alongside subscription management:

1. Create new components in `components/settings/`
2. Add section to `SettingsPage.tsx` main layout
3. Wrap in appropriate error boundaries
4. Follow existing card layout pattern

### Modifying Subscription Logic

When updating subscription functionality:

1. **State Logic**: Update `utils.ts` for state detection changes
2. **API Integration**: Modify `handlers.ts` for new Stripe operations
3. **UI Components**: Update state components for new user flows
4. **Types**: Update `types.ts` for new data structures

### Testing Approach

- **Unit Tests**: Test individual components and handlers with mocked APIs
- **Integration Tests**: Test state detection logic and data flows
- **Manual Testing**: Use development environment to test different subscription states

## Dependencies

### Required Libraries

- `@stripe/stripe-js`: Client-side Stripe integration
- `react-hot-toast`: Toast notifications for user feedback
- Real authentication system via `useRequireAuth()`
- Modal system via `@/lib/modal` for confirmations

### API Endpoints

Uses these endpoints from `@/lib/api/subscriptions`:

- `createCheckoutSession()`: Start new subscriptions
- `updateSubscription()`: Upgrade/downgrade existing subscriptions
- `cancelSubscription()`: Cancel active subscriptions
- `reactivateSubscription()`: Resume cancelled subscriptions
- `createPortalSession()`: Open Stripe Customer Portal

### Related Context

- **[stripe.md](./stripe.md)**: Complete Stripe subscription states and API integration
- **[auth.md](./auth.md)**: Authentication system and user data flow
- **[toasts.md](./toasts.md)**: Toast notification system
- **[modals.md](./modals.md)**: Confirmation dialog system

## Development Notes

### State Detection Logic

The `getSubscriptionState()` function maps user data to subscription states:

```typescript
// Example state detection
if (subscription_status === "active") {
  return membership_type === "premium" ? "active_premium" : "active_max";
}
if (subscription?.in_grace_period) {
  return "payment_failed_grace";
}
```

### Handler Pattern

All subscription actions follow consistent pattern:

```typescript
export async function handleAction(params) {
  try {
    await stripeApiCall(params);
    toast.success("Success message");
    await refreshUser(); // Update user data
  } catch (error) {
    toast.error("Error message");
    console.error(error);
  }
}
```

### Error Boundaries

The `SubscriptionErrorBoundary` component provides graceful degradation when Stripe integration fails, ensuring the page remains functional.

## Future Considerations

- **Additional Settings**: Architecture supports adding profile, notification, and other settings sections
- **Enhanced Analytics**: Track subscription conversion events and user flows
- **A/B Testing**: Component structure supports testing different UI variations
- **Internationalization**: Text content ready for translation to multiple languages
