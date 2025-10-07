# Modal System

## Overview

Jiki uses a global modal system built with `react-modal` and Zustand state management. Modals can be triggered from anywhere in the application without prop drilling or context wrapping at the component level.

## Architecture

### Core Components

- **`lib/modal/store.ts`** - Zustand store managing modal state (open/closed, active modal, props)
- **`lib/modal/GlobalModalProvider.tsx`** - Provider component that renders the active modal
- **`lib/modal/BaseModal.tsx`** - Base modal wrapper handling overlay, close button, and accessibility
- **`lib/modal/modals/`** - Directory containing all modal component implementations

### Modal Registry

All modals must be registered in `lib/modal/modals/index.ts`:

```typescript
export const availableModals = {
  "example-modal": ExampleModal,
  "confirmation-modal": ConfirmationModal,
  "info-modal": InfoModal
};
```

## Usage

### Basic Modal Control

```typescript
import { showModal, hideModal } from "@/lib/modal";

// Show a modal by name with props
showModal("example-modal", { title: "Hello", message: "World" });

// Hide the current modal
hideModal();
```

### Built-in Modal Types

#### Confirmation Modal

```typescript
import { showConfirmation } from "@/lib/modal";

showConfirmation({
  title: "Delete Item",
  message: "This action cannot be undone",
  variant: "danger", // or "default"
  onConfirm: () => handleDelete(),
  onCancel: () => console.log("Cancelled")
});
```

#### Info Modal

```typescript
import { showInfo } from "@/lib/modal";

showInfo({
  title: "Information",
  content: "Your operation completed successfully",
  buttonText: "OK"
});
```

#### Exercise Success Modal

Automatically shown when all tests pass in a complex exercise. Appears after the test animation completes with spotlight effect.

```typescript
import { showModal } from "@/lib/modal";

showModal("exercise-success-modal", {
  title: "Congratulations!",
  message: "All tests passed! You've successfully completed this exercise.",
  buttonText: "Continue"
});
```

**Note**: This modal is typically triggered automatically by the orchestrator and doesn't require manual invocation.

## Adding New Modals

1. Create component in `lib/modal/modals/YourModal.tsx`
2. Register in `lib/modal/modals/index.ts`
3. Optionally add convenience function in `lib/modal/store.ts`

## Implementation Details

- **Single Modal Policy**: Only one modal can be open at a time
- **Global Access**: Modal functions can be called from any component or non-React code
- **Props Passing**: Any props passed to `showModal()` are forwarded to the modal component
- **Provider Location**: `GlobalModalProvider` is mounted in the root layout (`app/layout.tsx`)
- **Test Page**: See `app/dev/test-global-modals/page.tsx` for implementation examples

## Best Practices

1. **User Confirmations**: Use confirmation modals for destructive actions
2. **Information Display**: Use info modals for important notifications that require acknowledgment
3. **Custom Modals**: Create specific modal components for complex interactions
4. **Accessibility**: BaseModal handles ESC key and overlay clicks for closing
5. **State Cleanup**: Modal state automatically resets on close
