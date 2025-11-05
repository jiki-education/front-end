# Dark/Light Theme System - Complete Guide

## Overview

The Jiki frontend implements a comprehensive, scalable dark/light theme system built on CSS custom properties and React Context. This system provides seamless theme switching with excellent performance, accessibility, and developer experience.

## Architecture

### Core Components

1. **CSS Custom Properties** (`app/globals.css`)
   - Semantic color tokens for consistent theming
   - Light and dark theme variants
   - Accessibility support (high contrast, reduced motion)

2. **React Theme Provider** (`lib/theme/`)
   - Context-based theme management
   - localStorage persistence
   - System theme detection
   - TypeScript support

3. **Tailwind Integration** (`@theme` configuration)
   - Semantic utility classes
   - CSS custom property mapping
   - Backward compatibility

4. **CodeMirror Themes** (`components/coding-exercise/ui/codemirror/extensions/`)
   - Adaptive light/dark syntax highlighting
   - Runtime theme switching
   - Performance-optimized compartments

## Quick Start

### Using the Theme System

```tsx
import { useTheme } from "@/lib/theme";

function MyComponent() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <div className="bg-bg-primary text-text-primary">
      <p>Current theme: {theme}</p>
      <button onClick={() => setTheme("dark")}>Switch to Dark</button>
    </div>
  );
}
```

### Adding Theme Provider

```tsx
// app/layout.tsx
import { ThemeProvider } from "@/lib/theme";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

## Semantic Tokens

### Color Categories

#### Backgrounds

- `bg-bg-primary` - Main background color
- `bg-bg-secondary` - Secondary background (cards, sidebars)
- `bg-bg-tertiary` - Tertiary background (subtle highlights)
- `bg-surface-elevated` - Elevated surfaces (modals, dropdowns)

#### Text

- `text-text-primary` - Primary text (high contrast)
- `text-text-secondary` - Secondary text (medium contrast)
- `text-text-tertiary` - Tertiary text (lower contrast)
- `text-text-muted` - Muted text (subtle information)

#### Interactive Elements

- `bg-button-primary-bg` + `text-button-primary-text` - Primary buttons
- `bg-button-secondary-bg` + `text-button-secondary-text` - Secondary buttons
- `text-link-primary` + `hover:text-link-hover` - Links

#### Status Colors

- `bg-success-bg` + `text-success-text` + `border-success-border` - Success states
- `bg-error-bg` + `text-error-text` + `border-error-border` - Error states
- `bg-warning-bg` + `text-warning-text` + `border-warning-border` - Warning states
- `bg-info-bg` + `text-info-text` + `border-info-border` - Info states

#### Borders

- `border-border-primary` - Primary borders
- `border-border-secondary` - Secondary borders

### CSS Custom Properties

Direct CSS custom property usage for complex styling:

```css
.my-component {
  background: var(--color-background-primary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-primary);
  transition: background-color 0.3s ease;
}
```

## Theme Transitions

### Available Classes

```css
.theme-transition        /* 0.3s - Standard speed */
.theme-transition-fast   /* 0.15s - Quick interactions */
.theme-transition-slow   /* 0.5s - Complex elements */
```

### Usage Example

```tsx
<div className="bg-bg-primary theme-transition">
  <button className="bg-button-primary-bg theme-transition-fast">Click me</button>
</div>
```

## Accessibility Features

### Focus States

```tsx
// Use the focus-ring utility class
<button className="focus-ring">Accessible Button</button>

// Or focus-ring-inset for inset focus rings
<input className="focus-ring-inset" />
```

### Screen Reader Support

```tsx
// Use sr-only for screen reader only content
<span className="sr-only">Current theme: {theme}</span>
```

### High Contrast Mode

The system automatically adapts to high contrast preferences:

```css
@media (prefers-contrast: high) {
  :root {
    --color-border-primary: #000000;
    --color-text-secondary: var(--color-text-primary);
  }
}
```

### Reduced Motion

Animations are disabled for users who prefer reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  .theme-transition,
  .theme-transition-fast,
  .theme-transition-slow {
    transition: none;
  }
}
```

## CodeMirror Integration

### Adaptive Themes

```tsx
import { createAdaptiveTheme } from "@/components/coding-exercise/ui/codemirror/extensions";

// Create theme based on current mode
const theme = createAdaptiveTheme(isDark ? "dark" : "light");
```

### Runtime Theme Switching

```tsx
import { createThemeChangeEffect } from "@/components/coding-exercise/ui/codemirror/extensions";

// Switch editor theme
editor.dispatch({
  effects: createThemeChangeEffect(isDark)
});
```

## Component Migration Guide

### Step 1: Identify Hardcoded Colors

Look for patterns like:

- `bg-white`, `bg-gray-*`, `text-black`, `text-gray-*`
- `border-gray-*`, `border-blue-*`
- Hardcoded hex colors in CSS

### Step 2: Replace with Semantic Tokens

```tsx
// Before
<div className="bg-white text-gray-900 border-gray-200">

// After
<div className="bg-bg-primary text-text-primary border-border-primary">
```

### Step 3: Add Transitions (Optional)

```tsx
// Add smooth theme transitions
<div className="bg-bg-primary text-text-primary theme-transition">
```

### Step 4: Enhance Accessibility

```tsx
// Add focus states
<button className="bg-button-primary-bg focus-ring">
```

## Testing

### Theme Test Page

Visit `/dev/theme-test` to visually test:

- All semantic tokens in light and dark modes
- Theme switching functionality
- Animation demonstrations

### Accessibility Test Page

Visit `/dev/accessibility-test` to verify:

- Contrast ratios (WCAG compliance)
- Focus states and keyboard navigation
- Screen reader support
- High contrast mode adaptation

### Performance Test Page

Visit `/dev/performance-test` to monitor:

- Theme switch performance metrics
- Memory usage
- Browser compatibility
- Stress testing

## Performance Considerations

### Optimal Performance

- **CSS Custom Properties**: Fastest theme switching method
- **Minimal JavaScript**: Theme logic is CSS-driven
- **Efficient Transitions**: Only animate necessary properties
- **Compartmentalized Updates**: CodeMirror themes use compartments

### Performance Targets

- Theme switch: < 16ms (for 60fps smoothness)
- Memory stable: No memory leaks during switching
- Transition smooth: 300ms standard transition duration

### Browser Support

| Feature                | Chrome | Firefox | Safari | Edge |
| ---------------------- | ------ | ------- | ------ | ---- |
| CSS Custom Properties  | ✅     | ✅      | ✅     | ✅   |
| prefers-color-scheme   | ✅     | ✅      | ✅     | ✅   |
| prefers-contrast       | ✅     | ✅      | ✅     | ✅   |
| prefers-reduced-motion | ✅     | ✅      | ✅     | ✅   |

## Troubleshooting

### Common Issues

1. **Theme not persisting**
   - Check localStorage is available
   - Verify ThemeProvider wraps your app

2. **Colors not updating**
   - Ensure using semantic tokens, not hardcoded colors
   - Check CSS custom properties are properly defined

3. **Transitions too slow/fast**
   - Use appropriate transition class
   - Check for prefers-reduced-motion override

4. **Focus states not visible**
   - Add `focus-ring` class to interactive elements
   - Verify focus-visible support

### Debug Mode

Enable debug logging:

```tsx
// In development
console.log("Current theme:", theme);
console.log("Resolved theme:", resolvedTheme);
```

## API Reference

### useTheme Hook

```typescript
interface ThemeContextType {
  theme: "light" | "dark" | "system";
  resolvedTheme: "light" | "dark";
  setTheme: (theme: "light" | "dark" | "system") => void;
}
```

### ThemeProvider Props

```typescript
interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: "light" | "dark" | "system";
}
```

### CSS Custom Properties

All theme tokens are available as CSS custom properties:

```css
/* Backgrounds */
var(--color-background-primary)
var(--color-background-secondary)
var(--color-background-tertiary)

/* Text */
var(--color-text-primary)
var(--color-text-secondary)
var(--color-text-tertiary)
var(--color-text-muted)

/* Interactive */
var(--color-button-primary-bg)
var(--color-button-primary-text)
var(--color-link-primary)
var(--color-link-hover)

/* Status */
var(--color-success-bg)
var(--color-error-bg)
var(--color-warning-bg)
var(--color-info-bg)

/* Borders */
var(--color-border-primary)
var(--color-border-secondary)
```

## Contributing

### Adding New Tokens

1. Define in both light and dark themes in `globals.css`
2. Add to Tailwind `@theme` configuration
3. Update this documentation
4. Test across all themes

### Component Guidelines

- Always use semantic tokens
- Include focus states
- Add appropriate transitions
- Test with screen readers
- Verify high contrast support

### Code Review Checklist

- [ ] Uses semantic tokens (no hardcoded colors)
- [ ] Includes focus states for interactive elements
- [ ] Proper accessibility attributes
- [ ] Tested in both light and dark themes
- [ ] Smooth transitions where appropriate
- [ ] No performance regressions
