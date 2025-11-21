# CSS Styling Guidelines

## Three Styling Approaches

Jiki uses three different styling approaches depending on the use case:

### 1. Inline Tailwind

Using Tailwind utility classes directly in JSX for quick, one-off styling.

```tsx
<div className="flex items-center gap-4 p-6">
```

### 2. UI Kit (Global Styles)

Reusable component styles defined in `app/styles/` for common UI elements like buttons, forms, links, and navigation.

```tsx
<button className="ui-btn-large ui-btn-primary">
```

These are globally available styles that maintain consistency across the application.

### 3. CSS Modules

Component-specific styles in `.module.css` files placed alongside their components.

```tsx
import styles from "./MyComponent.module.css";
<div className={styles.container}>
```

**When to use which approach:** Ask the human when deciding which styling approach to use for a specific component or feature.

## CSS Module Naming Convention

**CRITICAL:** CSS Module class names MUST use **camelCase**, not kebab-case.

### Correct ✅

```css
.conceptCard {
  padding: 24px;
}

.mainContent {
  margin-left: 260px;
}

.breadcrumbItem {
  display: flex;
}
```

Usage in TypeScript:

```tsx
import styles from "./concepts.module.css";
<div className={styles.conceptCard}>  {/* TypeScript property access */}
<div className={styles.mainContent}>
<div className={styles.breadcrumbItem}>
```

### Incorrect ❌

```css
.concept-card {
  /* DON'T use kebab-case */
  padding: 24px;
}

.main-content {
  /* DON'T use kebab-case */
  margin-left: 260px;
}
```

### Why camelCase?

TypeScript imports require valid JavaScript property names. `styles.conceptCard` works, but `styles.concept-card` is a syntax error. While you can work around this with bracket notation (`styles['concept-card']`), this is verbose and loses TypeScript autocomplete benefits.

**Always use camelCase for CSS Module class names.**

## CSS Principles

### Nesting

We use CSS nesting to organize styles hierarchically. For element and class selectors, nest them directly without using the `&` symbol:

```css
.formContainer {
  width: 100%;
  max-width: 420px;

  header {
    margin-bottom: 40px;

    h1 {
      font-size: 48px;
      font-weight: 500;
      color: #1a365d;
    }

    p {
      font-size: 19px;
      color: #718096;
    }
  }
}
```

For pseudo-elements and pseudo-classes, use the `&` symbol:

```css
.divider {
  &::before,
  &::after {
    content: "";
  }
}
```

This creates a clear visual hierarchy and keeps related styles together.

### Semantic Elements

Use semantic HTML elements instead of generic `<div>` elements with custom classes:

- Use `<header>`, `<footer>`, `<nav>`, `<main>`, `<section>`, `<article>` where appropriate
- Use pseudo-elements (`::before`, `::after`) for decorative elements instead of empty divs

**Example:** Instead of:

```html
<div className="header">
  <div className="line"></div>
  <span>OR</span>
  <div className="line"></div>
</div>
```

Do this:

```html
<div className="{styles.divider}">OR</div>
```

With CSS:

```css
.divider {
  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: #e2e8f0;
  }
}
```

This reduces DOM clutter and makes the markup more semantic and maintainable.

**Reference:** See `components/auth/AuthForm.module.css` for examples of these principles in practice.

## Testing with CSS Modules

CSS Modules generate scoped, hashed class names at build time (e.g., `conceptCard_a1b2c3d4`). This means tests cannot use simple string class selectors.

### Correct Way ✅

Import the CSS module in your test and use pattern matching:

```tsx
import styles from "@/app/(external)/concepts/concepts.module.css";

// Query using the hashed class name from the styles object
expect(document.querySelector(`[class*="${styles.conceptsGrid}"]`)).toBeInTheDocument();

// For multiple elements
const cards = document.querySelectorAll(`[class*="${styles.conceptCard}"]`);
expect(cards.length).toBe(6);
```

### Incorrect Way ❌

```tsx
// DON'T use string class names - these won't match the hashed classes
expect(document.querySelector(".concepts-grid")).toBeInTheDocument(); // ❌ Won't work
expect(document.querySelector(".conceptCard")).toBeInTheDocument(); // ❌ Won't work
```

### Why Pattern Matching?

CSS Modules transform `.conceptCard` into something like `.conceptCard_a1b2c3d4`. The `[class*="${styles.conceptCard}"]` selector matches any element whose class attribute contains the hashed class name.

**Always import the CSS module in tests and use the styles object for queries.**
