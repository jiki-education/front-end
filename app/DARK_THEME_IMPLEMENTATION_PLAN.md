# Dark/Light Theme Implementation Plan - Jiki Frontend

## Current State Analysis

**Styling Architecture:**

- **Tailwind CSS v4** with inline `@theme` configuration
- **CSS Custom Properties** defined in `:root` for colors and design tokens
- **CodeMirror** has separate theme system using `@uiw/codemirror-themes`
- **Mixed approach**: Custom CSS variables + Tailwind utilities + component-specific styles
- **Commented out dark mode** in globals.css (`@media (prefers-color-scheme: dark)`)

## Scalable Dark/Light Theme System Design

### 1. **CSS Custom Properties Foundation (Recommended)**

**Strategy**: Extend the existing CSS custom properties approach with semantic color tokens

```css
/* globals.css - Enhanced approach */
:root {
  /* Semantic color tokens */
  --color-background-primary: #ffffff;
  --color-background-secondary: #f8f9fa;
  --color-text-primary: #171717;
  --color-text-secondary: #6b7280;
  --color-border-primary: #e5e7eb;
  --color-surface-elevated: #ffffff;

  /* Component-specific tokens */
  --color-button-primary-bg: #7029f5;
  --color-button-primary-text: #ffffff;
  --color-success-bg: #edfff6;
  --color-success-text: #006032;

  /* Keep existing design system tokens */
  --color-bootcamp-purple: #7029f5;
  /* ... existing tokens ... */
}

[data-theme="dark"] {
  --color-background-primary: #0a0a0a;
  --color-background-secondary: #1a1a1a;
  --color-text-primary: #ededed;
  --color-text-secondary: #9ca3af;
  --color-border-primary: #374151;
  --color-surface-elevated: #1f2937;

  --color-button-primary-bg: #8b5cf6;
  --color-success-bg: #065f46;
  --color-success-text: #34d399;
}
```

### 2. **Tailwind CSS v4 Integration**

**Update `@theme` configuration** to use semantic tokens:

```css
@theme inline {
  /* Map semantic tokens to Tailwind */
  --color-bg-primary: var(--color-background-primary);
  --color-bg-secondary: var(--color-background-secondary);
  --color-text-primary: var(--color-text-primary);
  --color-text-secondary: var(--color-text-secondary);
  --color-border-primary: var(--color-border-primary);

  /* Maintain existing tokens for backward compatibility */
  --color-bootcamp-purple: var(--color-bootcamp-purple);
  /* ... existing design tokens ... */
}
```

### 3. **Theme Management System**

**Client-side theme provider** using React Context + localStorage:

```typescript
// lib/theme/ThemeProvider.tsx
interface ThemeContextType {
  theme: "light" | "dark" | "system";
  resolvedTheme: "light" | "dark";
  setTheme: (theme: "light" | "dark" | "system") => void;
}

// Hooks into:
// 1. localStorage for persistence
// 2. prefers-color-scheme media query
// 3. Document attribute management
```

### 4. **CodeMirror Theme Integration**

**Extend existing CodeMirror theme system**:

```typescript
// components/coding-exercise/ui/codemirror/extensions/theme-adapter.ts
export const createAdaptiveTheme = (variant: "light" | "dark") => {
  const settings = variant === "dark" ? DARK_EDITOR_COLORS : EDITOR_COLORS;
  const styles = variant === "dark" ? darkStyles : lightStyles;

  return createTheme({
    theme: variant,
    settings,
    styles
  });
};
```

### 5. **Component Migration Strategy**

**Gradual migration** using utility classes:

```tsx
// Instead of: className="bg-gray-100 text-gray-900"
// Use: className="bg-bg-secondary text-text-primary"

// For complex components:
<div className="bg-bg-primary border border-border-primary">
  <button className="bg-button-primary-bg text-button-primary-text">Click me</button>
</div>
```

## Implementation Plan

### **Phase 1: Foundation** (1-2 days)

1. **Create semantic color token system** in `globals.css`
2. **Build ThemeProvider** with React Context + localStorage
3. **Add theme toggle component** to header/navigation
4. **Update Tailwind configuration** to use semantic tokens

### **Phase 2: Core Components** (2-3 days)

5. **Migrate layout components** (header, footer, main containers)
6. **Update CodeMirror theme system** for dark mode support
7. **Migrate coding exercise components** (high visibility)
8. **Test responsive behavior** across themes

### **Phase 3: Comprehensive Migration** (3-4 days)

9. **Migrate remaining components** using semantic tokens
10. **Add theme-aware animations** and transitions
11. **Update custom CSS** for complex components
12. **Performance optimization** and bundle analysis

### **Phase 4: Polish & Testing** (1-2 days)

13. **Cross-browser testing** (Safari, Firefox, Chrome)
14. **Accessibility audit** (contrast ratios, focus states)
15. **Performance testing** and optimization
16. **Documentation** and style guide updates

## Technical Advantages

**Scalability**:

- Easy to add new themes (high contrast, blue light reduction)
- Component-level theme overrides possible
- Design system maintains consistency

**Performance**:

- CSS custom properties are efficient
- No JavaScript theme switching overhead
- Server-side rendering compatible

**Developer Experience**:

- IntelliSense support for semantic tokens
- Clear separation of concerns
- Backward compatibility maintained

**Maintainability**:

- Single source of truth for color values
- Easy bulk theme updates
- Type-safe theme definitions possible

## Architecture Benefits

This approach leverages the existing Tailwind v4 + CSS custom properties foundation while adding a scalable theme management layer that integrates seamlessly with the current architecture.

### Key Design Decisions

1. **CSS Custom Properties over CSS-in-JS**: Maintains performance and SSR compatibility
2. **Semantic Tokens**: Provides abstraction layer for easier maintenance
3. **Gradual Migration**: Allows incremental implementation without breaking changes
4. **CodeMirror Integration**: Ensures editor themes stay synchronized
5. **System Theme Support**: Respects user's OS preferences

### Files That Will Need Updates

- `app/globals.css` - Core theme definitions
- `app/layout.tsx` - ThemeProvider integration
- `components/coding-exercise/ui/codemirror/extensions/js-theme.ts` - Dark theme support
- `lib/theme/` - New theme management system
- Various component files - Gradual migration to semantic tokens

### Testing Strategy

- **Visual regression testing** across themes
- **Accessibility testing** for contrast compliance
- **Performance monitoring** during theme switches
- **Cross-browser compatibility** verification
