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

### Basic Toast Types

```typescript
import toast from "react-hot-toast";

// Standard notification
toast("Message");

// Success notification
toast.success("Operation completed");

// Error notification
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
