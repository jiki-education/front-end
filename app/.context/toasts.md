# Toast Notifications

## Overview

Jiki uses `react-hot-toast` for toast notifications throughout the application. Toasts provide non-blocking feedback to users for actions, errors, and system states.

## Setup

### Provider Configuration

The toast provider is configured in `components/toaster-config.tsx` and mounted in the root layout (`app/layout.tsx`). This makes toasts globally available throughout the application.

Configuration:

- Position: Top center of the screen
- Duration: 4 seconds default
- Styling: Dark theme (#363636 background)
- Success toasts: Green background
- Error toasts: Red background

## Usage

### Fire toasts by translation key (default)

User-facing toasts are localized. Fire them with the keyed helpers in
`lib/toast.tsx` instead of passing a hardcoded string to react-hot-toast:

```typescript
import { toastError, toastSuccess, toastMessage, toastLoading } from "@/lib/toast";

toastSuccess("subscription.reactivated");
toastError("settings.updateFailed");
toastLoading("logout.loading");

// ICU interpolation — pass values as the second argument:
toastSuccess("subscription.canceled", { date: new Date().toLocaleDateString() });

// react-hot-toast options (e.g. dedup id, duration) go in the third argument:
toastError("exercise.submissionFailed", undefined, { id: "exercise-submission-error" });
```

Keys live under the `toasts` namespace in `messages/{locale}.json`, grouped by
area (`subscription.*`, `settings.*`, `avatar.*`, `logout.*`, `auth.*`,
`exercise.*`). The `ToastKey` type is derived from that namespace, so
`pnpm typecheck` rejects an unknown key.

**How it works:** each helper hands react-hot-toast a small `<ToastMessage>`
element that runs `useTranslations("toasts")` and renders the resolved copy when
the toast paints. Because `<Toaster>` is mounted inside the
`NextIntlClientProvider` (via `ClientLocaleProvider`) in the root layout, this
resolves against the active locale — so the helpers work from **anywhere**,
including Zustand stores and plain classes with no hook or locale in scope
(e.g. `settingsStore`, `TestSuiteManager`).

For rich content (a link inside the message), render a small component that
calls `t.rich(...)` and pass its element to `toast.error`; see
`lib/toasts/lessonSaveError.tsx`.

### Dynamic server messages

API error toasts show the server-provided `error.message` when present (it is
dynamic and not translatable client-side) and fall back to a translated key
otherwise:

```typescript
if (error instanceof Error) {
  toast.error(error.message);
} else {
  toastError("settings.updateFailed");
}
```

### Raw react-hot-toast (dev-only / non-localized)

Dev-only tooling (e.g. the Stripe-history handlers) and the `/dev` and `/test`
routes may still call react-hot-toast directly with hardcoded strings, since
they are never shown to students:

```typescript
import toast from "react-hot-toast";

toast("Message");
toast.success("Operation completed");
toast.error("Something went wrong");

// Loading state
const toastId = toast.loading("Processing...");
// Later: toast.dismiss(toastId);
```

### Promise-based Toasts

Automatically handle async operations:

```typescript
toast.promise(myPromise, {
  loading: "Loading...",
  success: "Success!",
  error: "Failed to complete"
});
```

### Custom Toasts

For complex UI requirements:

```typescript
toast.custom((t) => (
  <CustomComponent
    visible={t.visible}
    onDismiss={() => toast.dismiss(t.id)}
  />
));
```

### Dismissing Toasts

```typescript
// Dismiss specific toast
toast.dismiss(toastId);

// Dismiss all toasts
toast.dismiss();
```

## Best Practices

1. **User Actions**: Show success toasts for completed user actions (saves, submissions)
2. **Errors**: Use error toasts for user-facing errors, include actionable messages
3. **Loading States**: Use loading toasts for operations > 1 second, always dismiss when complete
4. **Avoid Overuse**: Don't stack multiple toasts for related actions
5. **Test Page**: See `app/test/test-toasts/page.tsx` for implementation examples

## Implementation Notes

- Toasts are rendered outside the main component tree via React Portal
- The provider must be included in the root layout to work globally
- Toast state is managed internally by react-hot-toast
- No additional state management required
