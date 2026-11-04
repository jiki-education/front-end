# Stripe Payments

Jiki Premium is sold as a one-off lifetime purchase. Members who subscribed before that keep their monthly or annual Stripe subscription, so the front-end supports two things:

- **Buying Premium** for anyone who doesn't have it.
- **Managing a legacy subscription** (cancel, reactivate, customer portal) for members who still have one. Nothing in the front-end can start a new subscription.

## Who Has What

The `/internal/me` user object carries everything the UI branches on (see `types/auth.ts` and `types/subscription.ts`):

| Field                      | Meaning                                                                                                           |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `membership_type`          | `standard` or `premium`. Every feature gate reads this through `tierIncludes()` in `lib/pricing.ts`.              |
| `lifetime_premium`         | The user bought Premium outright.                                                                                 |
| `can_purchase_premium`     | The user may start a purchase. False while they have Premium by any route, or while a purchase is still clearing. |
| `premium_purchase_pending` | A purchase paid by a delayed method (e.g. a bank debit) hasn't cleared yet.                                       |
| `subscription_status`      | The legacy subscription's state.                                                                                  |
| `subscription`             | Present only while a legacy subscription is live (`active`, `incomplete`, `payment_failed`, `cancelling`).        |
| `premium_prices`           | `{ currency, lifetime, country_code }`: the one-off price for the user's country.                                 |

`getMembershipKind()` in `components/settings/subscription/membership.ts` turns these into one of four kinds: `lifetime`, `subscription` (a live legacy subscription), `premium` (Premium from elsewhere, e.g. an Exercism membership) or `free`. A former subscriber whose subscription has ended is `free`.

## Buying Premium

1. A gate opens the premium upgrade modal (`showPremiumUpgradeModal`), or the user clicks the upsell in settings.
2. `handlePurchasePremium()` in `lib/subscriptions/handlers.ts` calls `createPurchaseCheckoutSession()` (`POST /internal/premium_purchases/checkout_session`) with a return URL built by `lib/subscriptions/checkout.ts`. The API picks the currency and the Stripe Price from the user's country.
3. The client secret opens `PremiumCheckoutModal`, which embeds Stripe Checkout (`CheckoutProvider` + `PaymentElement`). On confirm, Stripe redirects to the return URL.
4. `CheckoutReturnHandler` (mounted in `app/(app)/layout.tsx`) reads the session id, shows the confirming modal and calls `verifyPurchaseCheckout()` (`POST /internal/premium_purchases/verify_checkout`):
   - `payment_state: "paid"` shows the welcome modal. The API has already granted Premium.
   - `payment_state: "processing"` shows the processing modal. The API marks the purchase pending and grants Premium by webhook once the payment clears.
   - A `checkout_payment_incomplete` error becomes a `CheckoutIncompleteError`, and checkout reopens with the decline message from `checkout.declineCodes`.
5. The user object is refreshed in every case.

While `premium_purchase_pending` is true, every place that would offer the purchase shows a "payment on its way" notice instead: the upgrade modal, the settings upsell and the premium page CTA. If a purchase is attempted anyway, the API rejects it with `purchase_pending`, and `already_premium` if the user already has Premium. `handlePurchasePremium()` shows the catalog copy for both.

## Legacy Subscriptions

Members with a live subscription see the subscription UI in settings: their renewal price and next billing date, a scheduled cancellation with the days remaining, or a failed/incomplete payment. Their actions live in `lib/subscriptions/handlers.ts` and call `lib/api/subscriptions.ts`:

- **Cancel** (`cancelSubscription()`): scheduled for the end of the billing period, behind `CancelSubscriptionConfirmModal`.
- **Reactivate** (`reactivateSubscription()`): clears a scheduled cancellation.
- **Customer portal** (`createPortalSession()`): payment methods and invoices, managed by Stripe.

The renewal price comes from `subscription.amount_in_cents` and `subscription.currency`, with `subscription.interval` deciding "/month" or "/year" (`useSubscriptionPrice()`). These describe what Stripe will actually charge, which can differ from today's price for the user's country. The amount is null until the API has stored it, and the UI then leaves the price out.

Account deletion cancels a live subscription first. The API reports a failure there as `stripe_error`, which `DeleteAccountConfirmContent` shows.

## Payment History

`GET /internal/payments` lists both kinds of payment. `purchase_type` (`subscription` or `lifetime`) labels each row "Recurring" or "One-time", and `revoked_reason` (`refunded` or `disputed`) marks a lifetime purchase that has been reversed.

## Formatting Prices

All amounts from the API (`premium_prices`, `subscription.amount_in_cents`, payment history) are Stripe minor units. `lib/formatCurrency.ts` owns the conversion to display units, and everything that renders a price goes through it (`formatCurrency`, or `formatPremiumPrice`/`formatPrice` in `lib/pricing.ts`, which wrap it).

Two separate questions, two separate functions, and they deliberately disagree for some currencies:

- **How many minor units per major unit** (the divisor) comes from Stripe's own tables, never from `Intl`. Intl/CLDR calls RSD, ISK, ALL, LBP and ~10 others zero-decimal because their sub-units are obsolete, but Stripe still bills them in 1/100ths. Trusting Intl here rendered Serbian prices 100x too high.
- **How many decimal places to show** (`currencyFractionDigits`) is Intl-driven, with HUF/TWD/UGX forced to 0.

Never derive a divisor from `Intl.NumberFormat(...).resolvedOptions().minimumFractionDigits`.

## Development

`/dev/stripe-test` shows the current user's raw subscription and purchase fields, starts a purchase, and drives the legacy subscription actions. `/dev/subscription-modal-test` shows the confirming, processing, verification-failed and welcome modals.
