# SVGR Integration

## Overview

This project uses SVGR to automatically convert SVG files into React components. SVGs can be imported directly as components without manual conversion.

## Icon Location

All SVG icons are stored in the `app/icons/` directory and can be imported using the `@/icons/` path alias.

## Usage

### Importing SVG as Component

```tsx
import IconName from "@/icons/icon-name.svg";

// Use as component
<IconName className="w-6 h-6" />;
```

### Important Guidelines

1. **Always import SVGs as components** - Never paste SVG markup directly into JSX
2. **Use descriptive import names** - Import as `PascalCase` component names
3. **Apply CSS classes** - SVGs inherit styles through CSS classes and `currentColor`
4. **Follow existing patterns** - Look at existing icon usage in the codebase

### Example

✅ **CORRECT**:

```tsx
import SettingsIcon from "@/icons/settings.svg";
import AccountIcon from "@/icons/account-settings.svg";

<SettingsIcon className="icon-class" />
<AccountIcon />
```

❌ **INCORRECT**:

```tsx
// Don't paste SVG markup directly
<svg viewBox="0 0 24 24" fill="none">
  <path d="..." />
</svg>
```

## Benefits

- **Type safety**: SVGs are typed React components
- **Tree shaking**: Unused SVGs are automatically excluded from bundles
- **Consistent styling**: SVGs inherit CSS properties like `currentColor`
- **Maintainability**: Single source of truth for icon assets
- **Performance**: Optimized SVG output with automatic cleanup

## Icon Naming Convention

Icons in `/app/icons/` follow kebab-case naming:

- `settings.svg`
- `account-settings.svg`
- `learning-settings.svg`
- `notifications-settings.svg`
- etc.

When importing, convert to PascalCase:

- `SettingsIcon`
- `AccountSettingsIcon`
- `LearningSettingsIcon`
- `NotificationsSettingsIcon`
