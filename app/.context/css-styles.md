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
