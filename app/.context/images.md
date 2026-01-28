# Images & Icons

## Overview

This project uses SVGs exclusively for icons. All icons are stored in `app/icons/` and can be imported as React components.

## Dynamic Icon Components

For content that has associated icons (badges, concepts, exercises, projects), use the dedicated icon components in `components/icons/`:

| Component                     | Source Directory                    | Usage             |
| ----------------------------- | ----------------------------------- | ----------------- |
| `<BadgeIcon slug="..." />`    | `curriculum/images/badge-icons/`    | Badge displays    |
| `<ConceptIcon slug="..." />`  | `curriculum/images/concept-icons/`  | Concept cards     |
| `<ExerciseIcon slug="..." />` | `curriculum/images/exercise-icons/` | Exercise displays |
| `<ProjectIcon slug="..." />`  | `curriculum/images/project-icons/`  | Project cards     |

These components:

- Load SVGs dynamically via `IconWithFallback`
- Show a `fallback.svg` if the requested icon doesn't exist
- Accept `width` and `height` props (default: 48)

### Example

```tsx
import { ExerciseIcon } from "@/components/icons/ExerciseIcon";
import { ProjectIcon } from "@/components/icons/ProjectIcon";

// In a component
<ExerciseIcon slug="bouncy-ball" width={24} height={24} />
<ProjectIcon slug="calculator" />
```

### Icon Directories

The `app/icons/` directory contains symlinks to curriculum icon directories:

- `icons/badges/` → `curriculum/images/badge-icons/`
- `icons/concepts/` → `curriculum/images/concept-icons/`
- `icons/exercises/` → `curriculum/images/exercise-icons/`
- `icons/projects/` → `curriculum/images/project-icons/`

## SVGR Integration

This project uses SVGR to automatically convert SVG files into React components. SVGs can be imported directly as components without manual conversion.

### Importing SVG as Component

**IMPORTANT**: Always use `@/icons/` for importing SVG icons, NOT `@static/icons/`. The `@static` alias breaks compilation.

```tsx
// CORRECT - use @/icons/
import IconName from "@/icons/icon-name.svg";

// INCORRECT - breaks compilation
// import IconName from "@static/icons/icon-name.svg";

// Use as component
<IconName className="w-6 h-6" />;
```

### Important Guidelines

1. **Always import SVGs as components** - Never paste SVG markup directly into JSX
2. **Use descriptive import names** - Import as `PascalCase` component names
3. **Apply CSS classes** - SVGs inherit styles through CSS classes and `currentColor`
4. **Follow existing patterns** - Look at existing icon usage in the codebase

### Example

```tsx
// Correct
import SettingsIcon from "@/icons/settings.svg";
import AccountIcon from "@/icons/account-settings.svg";

<SettingsIcon className="icon-class" />
<AccountIcon />

// Incorrect - don't paste SVG markup directly
<svg viewBox="0 0 24 24" fill="none">
  <path d="..." />
</svg>
```

### Benefits

- **Type safety**: SVGs are typed React components
- **Tree shaking**: Unused SVGs are automatically excluded from bundles
- **Consistent styling**: SVGs inherit CSS properties like `currentColor`
- **Maintainability**: Single source of truth for icon assets
- **Performance**: Optimized SVG output with automatic cleanup

### Icon Naming Convention

Icons in `/app/icons/` follow kebab-case naming:

- `settings.svg`
- `account-settings.svg`
- `chevron-right.svg`

When importing, convert to PascalCase:

- `SettingsIcon`
- `AccountSettingsIcon`
- `ChevronRightIcon`
