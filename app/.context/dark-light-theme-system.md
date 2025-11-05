# Dark/Light Theme System Implementation

## Overview

The Jiki frontend implements a comprehensive, production-ready dark/light theme system using CSS custom properties, React Context, and semantic design tokens. The system provides seamless theme switching with excellent performance, accessibility, and developer experience.

## Architecture Components

### 1. CSS Custom Properties Foundation (`app/globals.css`)

**Semantic Color Tokens:**

- Light theme tokens defined in `:root`
- Dark theme tokens defined in `[data-theme="dark"]`
- Organized by purpose: backgrounds, text, interactive elements, status colors, borders

```css
:root {
  /* Semantic color tokens for theming */
  --color-background-primary: #ffffff;
  --color-background-secondary: #f8f9fa;
  --color-text-primary: #171717;
  --color-text-secondary: #6b7280;
  /* ... more tokens */
}

[data-theme="dark"] {
  --color-background-primary: #0a0a0a;
  --color-background-secondary: #1a1a1a;
  --color-text-primary: #ededed;
  --color-text-secondary: #a3a3a3;
  /* ... more tokens */
}
```

### 2. React Theme Provider (`lib/theme/`)

**Files:**

- `ThemeProvider.tsx` - Main provider component with Context and localStorage
- `useTheme.ts` - Hook for accessing theme state
- `types.ts` - TypeScript interfaces

**Features:**

- Three theme modes: 'light', 'dark', 'system'
- Automatic system theme detection via `prefers-color-scheme`
- localStorage persistence
- Hydration-safe implementation
- Document attribute management (`data-theme="dark"`)

### 3. Tailwind CSS Integration

**Semantic Utility Classes:**

- `bg-bg-primary`, `bg-bg-secondary`, `bg-bg-tertiary` - Backgrounds
- `text-text-primary`, `text-text-secondary`, `text-text-tertiary` - Text colors
- `border-border-primary`, `border-border-secondary` - Borders
- `bg-button-primary-bg`, `text-button-primary-text` - Interactive elements
- Status colors: `bg-success-bg`, `bg-error-bg`, `bg-warning-bg`, `bg-info-bg`

**Configuration in `@theme` block:**

```css
@theme inline {
  /* Map semantic tokens to Tailwind */
  --color-bg-primary: var(--color-background-primary);
  --color-text-primary: var(--color-text-primary);
  /* ... more mappings */
}
```

### 4. CodeMirror Theme Integration

**Adaptive Themes (`components/coding-exercise/ui/codemirror/extensions/`):**

- `theme-adapter.ts` - Light and dark syntax highlighting themes
- `adaptive-theme.ts` - Runtime theme switching with compartments
- `js-theme.ts` - Backward compatibility exports

**Usage:**

```typescript
// Create theme based on current mode
const theme = createAdaptiveTheme(isDark ? "dark" : "light");

// Runtime theme switching
editor.dispatch({
  effects: createThemeChangeEffect(isDark)
});
```

## Implementation Details

### Theme Toggle Component (`components/ui/ThemeToggle.tsx`)

**Features:**

- Three-state cycle: light → dark → system → light
- Visual icons: Sun (light), Moon (dark), Monitor (system)
- Accessible with ARIA labels and descriptions
- Keyboard navigation support
- Screen reader announcements

**Current Locations:**

- Header: `components/layout/AuthHeader.tsx` (blog/articles pages)
- Dashboard: `components/index-page/sidebar/Sidebar.tsx` (sidebar footer)

### Transition System

**CSS Classes for smooth animations:**

```css
.theme-transition        /* 0.3s - Standard speed */
.theme-transition-fast   /* 0.15s - Quick interactions */
.theme-transition-slow   /* 0.5s - Complex elements */
```

**Applied to:**

- `body` element for global transitions
- `main` layout elements
- Editor components (`.editor`, `.cm-gutters`)
- Dashboard components

### Accessibility Features

**Focus States:**

- `.focus-ring` - Standard focus ring with theme-aware colors
- `.focus-ring-inset` - Inset focus ring variant
- Applied to all interactive elements (buttons, links, form inputs)

**Screen Reader Support:**

- `.sr-only` utility class for screen reader only content
- Proper ARIA labels on theme toggle
- Status announcements for theme changes

**System Preferences:**

```css
/* High contrast mode support */
@media (prefers-contrast: high) {
  :root {
    --color-border-primary: #000000;
    --color-text-secondary: var(--color-text-primary);
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .theme-transition,
  .theme-transition-fast,
  .theme-transition-slow {
    transition: none;
  }
}
```

## Migrated Components

### Layout Components

- `components/layout/AuthHeader.tsx` - Header with theme toggle
- `components/footer/index.tsx` - Footer with semantic tokens
- `components/ui/SoundToggle.tsx` - Audio control
- `components/ui/Pagination.tsx` - Pagination controls
- `components/ui/Tooltip.tsx` - Tooltip component

### Dashboard Components

- `app/(app)/dashboard/page.tsx` - Main dashboard page
- `components/index-page/sidebar/Sidebar.tsx` - Sidebar with theme toggle
- `components/index-page/sidebar/NavigationItem.tsx` - Navigation items

### Coding Exercise Components

- `components/coding-exercise/ui/LanguageToggle.tsx` - Language selector
- `components/coding-exercise/ui/test-results-view/TestResultsButtons.tsx` - Test buttons
- `components/coding-exercise/ui/test-results-view/PassMessage.tsx` - Success messages
- `components/coding-exercise/ui/test-results-view/TestResultsView.tsx` - Results panel
- `components/coding-exercise/ui/InstructionsPanel.tsx` - Instructions panel

### Custom CSS Updates

- Editor styles (`.editor`, `.cm-gutters`, `.cm-lockedLine`)
- Tooltip styles (`.custom-tooltip`, `.information-tooltip`)
- Test button states (`.test-button.pass`, `.test-button.fail`)
- Scenario components (`.c-scenario`, `.io-test-result-info`)

## Usage Patterns

### Basic Component Migration

```tsx
// Before (hardcoded colors)
<div className="bg-white text-gray-900 border-gray-200">

// After (semantic tokens)
<div className="bg-bg-primary text-text-primary border-border-primary">

// With transitions
<div className="bg-bg-primary text-text-primary theme-transition">

// With focus states
<button className="bg-button-primary-bg focus-ring">
```

### Hook Usage

```tsx
import { useTheme } from "@/lib/theme";

function MyComponent() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <div>
      <p>
        Current: {theme} (resolved: {resolvedTheme})
      </p>
      <button onClick={() => setTheme("dark")}>Dark Mode</button>
    </div>
  );
}
```

### CSS Custom Properties (for complex styling)

```css
.my-component {
  background: var(--color-background-primary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-primary);
  transition: background-color 0.3s ease;
}
```

## Testing Infrastructure

### Test Pages (Development Only)

- `/dev/theme-test` - Visual testing of all semantic tokens
- `/dev/accessibility-test` - WCAG compliance verification
- `/dev/performance-test` - Performance monitoring and stress testing

### Quality Assurance

- **Performance**: <16ms theme switches (60fps target)
- **Accessibility**: WCAG 2.1 AA compliant contrast ratios
- **Browser Support**: Modern browsers with CSS custom properties
- **Memory**: Stable during extensive theme switching

## Documentation

### Primary Documentation

- `.context/dark-light-theme-system.md` - This comprehensive context file (complete guide)
- Complete TypeScript interfaces in `lib/theme/types.ts`
- Inline code documentation throughout components
- Usage examples in development test pages (`/dev/theme-test`, `/dev/accessibility-test`, `/dev/performance-test`)

## Integration Points

### Layout Integration

```tsx
// app/layout.tsx
<ThemeProvider>
  <AuthProvider>
    <ConditionalAuthHeader />
    <main className="min-h-screen bg-bg-secondary theme-transition">{children}</main>
  </AuthProvider>
</ThemeProvider>
```

### Dashboard Integration

The theme toggle appears in two locations:

1. **Blog/Articles Header**: For content pages
2. **Dashboard Sidebar**: For authenticated user dashboard

### CodeMirror Integration

Editor themes automatically switch with the global theme through the orchestrator pattern and compartment system.

## Maintenance Notes

### Adding New Components

1. Use semantic tokens instead of hardcoded colors
2. Add appropriate transition classes
3. Include focus states for interactive elements
4. Test in both light and dark themes
5. Verify accessibility with screen readers

### Adding New Semantic Tokens

1. Define in both light and dark themes in `globals.css`
2. Add to Tailwind `@theme` configuration
3. Update TypeScript interfaces if needed
4. Test across all usage scenarios
5. Update documentation

### Performance Considerations

- CSS custom properties provide optimal performance
- Avoid JavaScript-heavy theme switching
- Use transitions sparingly on complex elements
- Respect user motion preferences
- Monitor memory usage during development

## API Reference

### Theme Hook Interface

```typescript
interface ThemeContextType {
  theme: "light" | "dark" | "system";
  resolvedTheme: "light" | "dark";
  setTheme: (theme: "light" | "dark" | "system") => void;
}
```

### Theme Provider Props

```typescript
interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: "light" | "dark" | "system";
}
```

### Complete CSS Custom Properties Reference

**Background Colors:**

```css
var(--color-background-primary)    /* Main background */
var(--color-background-secondary)  /* Cards, sidebars */
var(--color-background-tertiary)   /* Subtle highlights */
var(--color-surface-elevated)      /* Modals, dropdowns */
```

**Text Colors:**

```css
var(--color-text-primary)      /* High contrast text */
var(--color-text-secondary)    /* Medium contrast text */
var(--color-text-tertiary)     /* Lower contrast text */
var(--color-text-muted)        /* Subtle information */
```

**Interactive Elements:**

```css
var(--color-button-primary-bg)    /* Primary button background */
var(--color-button-primary-text)  /* Primary button text */
var(--color-button-secondary-bg)  /* Secondary button background */
var(--color-button-secondary-text) /* Secondary button text */
var(--color-link-primary)         /* Link color */
var(--color-link-hover)           /* Link hover color */
```

**Status Colors:**

```css
var(--color-success-bg)    /* Success background */
var(--color-success-text)  /* Success text */
var(--color-success-border) /* Success border */
var(--color-error-bg)      /* Error background */
var(--color-error-text)    /* Error text */
var(--color-error-border)  /* Error border */
var(--color-warning-bg)    /* Warning background */
var(--color-warning-text)  /* Warning text */
var(--color-warning-border) /* Warning border */
var(--color-info-bg)       /* Info background */
var(--color-info-text)     /* Info text */
var(--color-info-border)   /* Info border */
```

**Borders:**

```css
var(--color-border-primary)   /* Primary borders */
var(--color-border-secondary) /* Secondary borders */
```

## Troubleshooting Guide

### Common Issues

**1. Theme not persisting between sessions**

- Verify `ThemeProvider` wraps your entire app in `layout.tsx`
- Check that localStorage is available (not in SSR context)
- Ensure no JavaScript errors are preventing theme initialization

**2. Colors not updating when theme changes**

- Confirm you're using semantic tokens (`bg-bg-primary`) not hardcoded colors (`bg-white`)
- Check that CSS custom properties are properly defined in `globals.css`
- Verify the component is inside the `ThemeProvider` context

**3. Theme transitions too slow or not working**

- Use appropriate transition class: `.theme-transition`, `.theme-transition-fast`, `.theme-transition-slow`
- Check for `prefers-reduced-motion: reduce` media query override
- Avoid transitioning too many properties simultaneously

**4. Focus states not visible in dark theme**

- Ensure interactive elements have `focus-ring` class
- Verify focus ring colors are defined for both themes
- Check that focus-visible is supported in your target browsers

**5. CodeMirror theme not switching**

- Verify `createThemeExtension` is properly mocked in tests
- Check that editor compartments are being reconfigured
- Ensure theme adapter is receiving the correct theme value

### Browser Compatibility

| Feature                | Chrome | Firefox | Safari | Edge |
| ---------------------- | ------ | ------- | ------ | ---- |
| CSS Custom Properties  | ✅     | ✅      | ✅     | ✅   |
| prefers-color-scheme   | ✅     | ✅      | ✅     | ✅   |
| prefers-contrast       | ✅     | ✅      | ✅     | ✅   |
| prefers-reduced-motion | ✅     | ✅      | ✅     | ✅   |

### Debug Mode

Enable theme debugging in development:

```tsx
// Temporary debug logging
import { useTheme } from "@/lib/theme";

function DebugTheme() {
  const { theme, resolvedTheme } = useTheme();

  if (process.env.NODE_ENV === "development") {
    console.log("Theme state:", { theme, resolvedTheme });
    console.log("Document data-theme:", document.documentElement.getAttribute("data-theme"));
  }

  return null;
}
```

## Contributing Guidelines

### Code Review Checklist

When reviewing theme-related changes:

- [ ] Uses semantic tokens instead of hardcoded colors
- [ ] Includes focus states for interactive elements
- [ ] Has proper accessibility attributes (ARIA labels, etc.)
- [ ] Tested in both light and dark themes
- [ ] Includes smooth transitions where appropriate
- [ ] No performance regressions during theme switching
- [ ] Respects user motion preferences
- [ ] Compatible with high contrast mode

### Adding New Semantic Tokens

1. **Define in both themes** in `globals.css`:

   ```css
   :root {
     --color-my-new-token: #value-for-light;
   }

   [data-theme="dark"] {
     --color-my-new-token: #value-for-dark;
   }
   ```

2. **Add to Tailwind configuration** in `@theme` block:

   ```css
   @theme inline {
     --color-my-new: var(--color-my-new-token);
   }
   ```

3. **Update TypeScript interfaces** if needed in `lib/theme/types.ts`

4. **Test across all usage scenarios** and update test pages

5. **Update this documentation** with the new token

### Component Development Standards

- **Always use semantic tokens** for theming
- **Include focus states** for all interactive elements
- **Add theme transitions** for smooth user experience
- **Test with screen readers** and keyboard navigation
- **Verify high contrast mode** compatibility
- **Respect motion preferences** in animations

## Current Status: Production Ready

The theme system is fully implemented and production-ready with:

- ✅ Complete component coverage
- ✅ Accessibility compliance (WCAG 2.1 AA)
- ✅ Performance optimization (<16ms switches)
- ✅ Cross-browser compatibility
- ✅ Comprehensive testing infrastructure
- ✅ Complete documentation and troubleshooting guide

The system provides users with a seamless, accessible theme experience while giving developers a scalable foundation for future enhancements.
