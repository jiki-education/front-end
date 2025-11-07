# Stripe Subscription Implementation

This document outlines the 9 different subscription states and the actions that should be available to users in each state.

## Never Subscribed

This is the state for users who have never had a premium or max subscription.

They need the ability to upgrade to either Premium or Max. Provide a button for each.

## Incomplete Payment

Users in this state have started a payment that can take more time to complete (e.g. PayPal or a BACS payment). Stripe is awaiting confirmation that the payment has completed successfully. When that happens, the subscription state will update.

The user needs to be informed that we're awaiting payment confirmation. They should have the ability to change the payment method or cancel if they want.

## Active Premium

Users in this state have an active Premium subscription with full access to premium features.

They need the ability to:

- Upgrade to Max tier
- Manage their subscription (change payment method, view billing history, cancel subscription) via Stripe Customer Portal

## Active Max

Users in this state have an active Max subscription with full access to all features (highest tier).

They need the ability to:

- Manage their subscription (downgrade to Premium, change payment method, view billing history, cancel subscription) via Stripe Customer Portal

## Cancelling Scheduled

Users in this state have an active subscription that is scheduled for cancellation at the end of the current billing period. They continue to have access until that date.

The user needs to be informed that their subscription will end at the period end. They should have the ability to:

- Resume their subscription (cancel the cancellation)
- Continue managing their subscription via Stripe Customer Portal

## Payment Failed - Grace Period

Users in this state have had a payment failure but are still within the 7-day grace period. They maintain access to their subscription features during this time.

The user needs to be clearly informed that:

- Their payment failed
- They have 7 days remaining to fix the issue
- They still have access during the grace period

They should have the ability to:

- Update their payment method via Stripe Customer Portal
- Retry the payment

## Payment Failed - Grace Expired

Users in this state have had a payment failure and the 7-day grace period has expired. They have been downgraded to the standard (free) tier and no longer have access to premium features.

The user needs to be informed that:

- Their payment failed and grace period expired
- They have been downgraded to standard tier
- Access to premium features has been revoked

They should have the ability to:

- Update their payment method and resume their subscription via Stripe Customer Portal
- Start a fresh subscription to Premium or Max (new checkout flow)

## Previously Subscribed

Users in this state previously had a subscription that has ended (canceled, expired, or otherwise terminated). They are currently on the standard (free) tier with no active subscription.

The user needs to be informed that their previous subscription has ended. They should have the ability to:

- Re-subscribe to Premium
- Re-subscribe to Max

## Incomplete Expired

Users in this state started a checkout session but abandoned it or the payment method authorization expired before completion.

The user needs to be informed that their previous checkout session expired. They should have the ability to:

- Start a fresh checkout process for Premium
- Start a fresh checkout process for Max
