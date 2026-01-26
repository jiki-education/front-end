# TODO List

## Security Issues

### High Priority

- [ ] **Fix open redirect vulnerability in PaymentHistory.tsx**
  - **File**: `components/settings/payment-history/PaymentHistory.tsx:9-13`
  - **Issue**: Receipt URLs from API are opened without validation. If the API is compromised, users could be redirected to phishing sites.
  - **Fix**: Validate that receiptUrl matches expected Stripe domain patterns (invoice.stripe.com, pay.stripe.com)
  - **Implementation**:
    ```typescript
    const handleDownloadReceipt = (payment: { receiptUrl?: string }) => {
      if (payment.receiptUrl) {
        try {
          const url = new URL(payment.receiptUrl);
          // Validate it's a Stripe receipt URL
          const allowedHosts = ["invoice.stripe.com", "pay.stripe.com"];
          if (!allowedHosts.includes(url.hostname)) {
            console.error("Invalid receipt URL domain:", url.hostname);
            return;
          }
          // Use noopener for security
          window.open(payment.receiptUrl, "_blank", "noopener,noreferrer");
        } catch (e) {
          console.error("Invalid receipt URL:", payment.receiptUrl);
        }
      }
    };
    ```

## UI/UX Issues

### Medium Priority

- [ ] **Add proper Terms of Service and Privacy Policy links**
  - **File**: `lib/modal/modals/SubscriptionCheckoutModal.tsx:146-148`
  - **Issue**: The Terms of Service and Privacy Policy links in the checkout modal are using placeholder "#" hrefs
  - **Fix**: Replace with actual links to the Terms of Service and Privacy Policy pages
  - **Implementation**: Update the links once the actual pages/routes are available

## Completed Items

### 2024-01-22

- [x] Removed all "max" tier remnants from subscription system
  - Updated useSubscription.ts, handlers.ts, subscriptions.ts, payments.ts
  - Removed max-related handlers: handleUpgradeToMax, handleDowngradeToPremium, handleResubscribeToMax, handleTryMaxAgain
  - Fixed dev stripe-test page to remove ActiveMaxActions component
  - Updated test files to remove references to deleted handlers
  - Fixed PaymentsError import to use generic Error instead
  - System now correctly only supports "standard" and "premium" tiers
