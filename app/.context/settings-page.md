# Settings Page

## Overview

The settings page (`/settings`) has tabs for account, billing, notifications, learning and the danger zone. This document covers the Billing tab, which shows a user how they hold Premium and lets them buy it or manage a legacy subscription. See [stripe.md](./stripe.md) for the payment flows and the user fields involved.

## Component Organization

```
components/settings/
├── SettingsPage.tsx                 # Tabs, auth integration
├── tabs/SubscriptionTab.tsx         # The Billing tab, wrapped in an error boundary
├── subscription/
│   ├── SubscriptionSection.tsx      # Picks what to show for each kind of member
│   ├── membership.ts                # getMembershipKind(): lifetime / subscription / premium / free
│   ├── useSubscription.ts           # Purchase, cancel and reactivate handlers, billing date
│   ├── useSubscriptionPrice.ts      # A legacy subscription's own renewal price
│   ├── PremiumUpsell.tsx            # The one-off purchase offer
│   ├── PurchasePending.tsx          # Shown while a purchase is still clearing
│   ├── BenefitSection.tsx           # Premium benefits, plus the resubscribe offer while cancelling
│   ├── CancelSection.tsx            # Cancel a live legacy subscription
│   ├── SubscriptionErrorBoundary.tsx
│   └── handlers.ts                  # Settings-configured re-exports of lib/subscriptions/handlers
├── ui/SubscriptionStatus.tsx        # The "Current Plan" card
├── payment-history/                 # Payment history table
└── modals/                          # Cancel confirm/success, avatar, email, delete account
```

## What Each Member Sees

`SubscriptionSection` renders the "Current Plan" card, then one body section, then payment history:

| Kind (`getMembershipKind`) | Current Plan card                                                                        | Body                                                  | Cancel section                 |
| -------------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------- | ------------------------------ |
| `free`                     | Free plan                                                                                | Upsell, or the pending notice while a purchase clears | No                             |
| `lifetime`                 | Premium for life                                                                         | Benefits                                              | No                             |
| `premium`                  | Premium (no price, e.g. via Exercism)                                                    | Benefits                                              | No                             |
| `subscription`             | Price per interval and next billing date, a scheduled cancellation, or a payment problem | Benefits (with resubscribe while cancelling)          | Yes, unless already cancelling |

A legacy subscription whose payment failed after the grace period leaves the user on `standard` with the subscription still live. They see the payment problem and the cancel section, and no upsell, because the API won't sell Premium while that subscription exists.

## Data Flow

1. `SettingsPage` gets the user from `useRequireAuth()` and passes `refreshUser` down.
2. Buttons call handlers from `useSubscription`, which call the shared handlers in `lib/subscriptions/handlers.ts`.
3. Handlers show toasts for success and failure, and call `refreshUser()` after a subscription change. A purchase returns through `CheckoutReturnHandler`, which refreshes the user itself.

## Testing

- `tests/unit/components/settings/subscription/SubscriptionSection.test.tsx` covers what each kind of member sees.
- `tests/unit/components/settings/ui/SubscriptionStatus.test.tsx` covers the Current Plan card, including a legacy subscription's own price and a missing amount.
- `tests/unit/components/settings/subscription/handlers.test.ts` covers the purchase and subscription handlers.
- `/dev/stripe-test` drives the real flows against the local API.
