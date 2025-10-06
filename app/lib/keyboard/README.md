# Keyboard Shortcuts

Simple keyboard shortcut system with scopes and sequences.

## Basic Usage

### Module-Level Registration

Register shortcuts at module level for app-wide shortcuts that don't need component state:

```ts
import { keyboard } from "@/lib/keyboard";

keyboard.on("cmd+k", () => openCommandPalette());
keyboard.on("?", () => keyboard.showHelp());
```

### Component Registration with Hook

Use `useKeyboard` hook to register shortcuts that need access to component state:

```ts
import { useKeyboard } from "@/lib/keyboard";

function MyComponent() {
  const [count, setCount] = useState(0);

  useKeyboard("cmd+s", (e) => {
    e.preventDefault();
    saveData(count);
  }, { description: "Save" });

  return <div>Count: {count}</div>;
}
```

The hook automatically:

- Captures the latest handler (including closures over state)
- Registers the shortcut on mount
- Cleans up on unmount
- Re-registers only when keys or options change

## Scopes

Activate shortcuts only in specific contexts:

```ts
import { keyboard, pushScope } from "@/lib/keyboard";

function openModal() {
  const removeScope = pushScope("modal");

  const unsubscribe = keyboard.on(
    "escape",
    () => {
      closeModal();
      removeScope();
      unsubscribe();
    },
    { scope: "modal" }
  );
}
```

## Sequences (Chords)

```ts
keyboard.on("g g", () => scrollToTop()); // Press 'g' twice
keyboard.on("g i", () => goToInbox()); // Press 'g' then 'i'
```

## Options

```ts
keyboard.on("cmd+s", handler, {
  description: "Save file", // Shows in help
  scope: "editor", // Only active in scope
  preventDefault: true, // Default: true
  stopPropagation: false, // Default: false
  enabled: true, // Toggle on/off
  throttle: 500, // Throttle to max once per 500ms (for rapid fire prevention)
  debounce: 300 // Debounce for 300ms (for search/filter inputs)
});
```

### Performance Optimization

For shortcuts that might be triggered rapidly, use `throttle` or `debounce`:

- **throttle**: Limits execution to once per interval. Good for save operations.
- **debounce**: Delays execution until after a quiet period. Good for search/filter.

```ts
// Prevent rapid save operations
keyboard.on("ctrl+s", handleSave, { throttle: 1000 });

// Wait for user to finish typing before searching
keyboard.on("ctrl+f", handleSearch, { debounce: 300 });
```

## Cleanup

```ts
const unsubscribe = keyboard.on("cmd+s", handler);
unsubscribe(); // Remove shortcut
```

## Show Help

```ts
keyboard.showHelp(); // Shows modal with all active shortcuts
```
