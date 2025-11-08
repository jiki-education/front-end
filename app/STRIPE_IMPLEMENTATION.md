# Stripe Subscription Implementation

This document outlines the 9 different subscription states and the actions that should be available to users in each state.

## Subscription States

### Never Subscribed

This is the state for users who have never had a premium or max subscription.

They need the ability to "Upgrade To Premium From Standard" or "Upgrade To Max From Standard". Provide a button for each.

### Incomplete Payment

Users in this state have started a payment that can take more time to complete (e.g. PayPal or a BACS payment). Stripe is awaiting confirmation that the payment has completed successfully. When that happens, the subscription state will update.

The user needs to be informed that we're awaiting payment confirmation.

### Active Premium

Users in this state have an active Premium subscription with full access to premium features.

They need the ability to:

- "Upgrade To Max From Premium" (direct tier change via API)
- "Manage Subscription Via Customer Portal" (change payment method, view billing history, cancel subscription)

### Active Max

Users in this state have an active Max subscription with full access to all features (highest tier).

They need the ability to:

- "Downgrade To Premium From Max" (direct tier change via API)
- "Manage Subscription Via Customer Portal" (change payment method, view billing history, cancel subscription)

### Cancelling Scheduled

Users in this state have an active subscription that is scheduled for cancellation at the end of the current billing period. They continue to have access until that date.

The user needs to be informed that their subscription will end at the period end. They should have the ability to:

- "Resume Subscription" (cancel the cancellation)
- "Manage Subscription Via Customer Portal"

### Payment Failed - Grace Period

Users in this state have had a payment failure but are still within the 7-day grace period. They maintain access to their subscription features during this time.

The user needs to be clearly informed that:

- Their payment failed
- They have 7 days remaining to fix the issue
- They still have access during the grace period

They should have the ability to:

- "Manage Subscription Via Customer Portal" to update their payment method
- Retry the payment (happens automatically when payment method is updated)

### Payment Failed - Grace Expired

Users in this state have had a payment failure and the 7-day grace period has expired. They have been downgraded to the standard (free) tier and no longer have access to premium features.

The user needs to be informed that:

- Their payment failed and grace period expired
- They have been downgraded to standard tier
- Access to premium features has been revoked

They should have the ability to:

- "Manage Subscription Via Customer Portal" to update their payment method and resume their subscription
- "Start Fresh Subscription To Premium" or "Start Fresh Subscription To Max" (new checkout flow)

### Previously Subscribed

Users in this state previously had a subscription that has ended (canceled, expired, or otherwise terminated). They are currently on the standard (free) tier with no active subscription.

The user needs to be informed that their previous subscription has ended. They should have the ability to:

- "Start Fresh Subscription To Premium"
- "Start Fresh Subscription To Max"

### Incomplete Expired

Users in this state started a checkout session but abandoned it or the payment method authorization expired before completion.

The user needs to be informed that their previous checkout session expired. They should have the ability to:

- "Start Fresh Subscription To Premium"
- "Start Fresh Subscription To Max"

## Actions

### Upgrade To Premium From Standard

Create a checkout session for the Premium tier and redirect the user to the Stripe-hosted checkout page.

**Implementation:**

1. Call `createCheckoutSession('premium', returnUrl)` API
2. Use the Stripe Checkout SDK with the returned `client_secret`
3. Display the checkout form in-app or redirect to Stripe-hosted page
4. Handle the return URL with session verification

### Upgrade To Max From Standard

Create a checkout session for the Max tier and redirect the user to the Stripe-hosted checkout page.

**Implementation:**
Same as "Upgrade To Premium From Standard" but use `'max'` as the tier parameter.

### Upgrade To Max From Premium

Directly upgrade an existing Premium subscription to Max tier.

**Implementation:**

1. Call `updateSubscription('max')` API
2. Handle the immediate tier change response
3. Update UI to reflect new tier
4. Show success message

The tier change happens immediately. If the subscription is in "cancelling" status, the upgrade will automatically resume the subscription.

### Manage Subscription Via Customer Portal

Open the Stripe Customer Portal where users can manage all aspects of their subscription.

**Implementation:**

1. Call `createPortalSession()` API
2. Redirect user to the returned portal URL
3. User can:
   - Update payment method
   - Change subscription tier (upgrade/downgrade)
   - Cancel subscription
   - View billing history
   - Download invoices

The Customer Portal is managed by Stripe and requires no additional UI implementation.

### Resume Subscription

Allow users to cancel their scheduled cancellation and resume their subscription.

**Implementation:**
This is handled via "Manage Subscription Via Customer Portal". Users can reactivate their subscription before the cancellation takes effect.

### Start Fresh Subscription To Premium

Create a new checkout session for users who previously had a subscription or had an incomplete checkout.

**Implementation:**
Same as "Upgrade To Premium From Standard". The checkout flow handles both new and returning subscribers.

### Start Fresh Subscription To Max

Create a new checkout session for the Max tier for returning or incomplete users.

**Implementation:**
Same as "Upgrade To Max From Standard". The checkout flow handles both new and returning subscribers.

### Downgrade To Premium From Max

Directly downgrade an existing Max subscription to Premium tier.

**Implementation:**

1. Call `updateSubscription('premium')` API
2. Handle the immediate tier change response
3. Update UI to reflect new tier
4. Show success message

The tier change happens immediately and the user loses Max features right away. If the subscription is in "cancelling" status, the downgrade will automatically resume the subscription.
