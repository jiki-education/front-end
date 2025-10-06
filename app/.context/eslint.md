# ESLint Configuration and Guidelines

## Important Rules

### Always Add Comments for ESLint Exceptions

**Whenever disabling an ESLint rule, you MUST add a comment explaining why.**

Examples:

```javascript
// ESLint doesn't realize lastFrame can be undefined when frames array is empty
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
const lastFrameTime = lastFrame ? lastFrame.time : 0;
```

```javascript
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
// ESLint thinks the type assertion is unnecessary but TypeScript needs it to access HTMLInputElement
// properties like min, max, and value. This is a known issue with @testing-library/react types.
```

```javascript
// eslint-disable-next-line react-hooks/exhaustive-deps
[orchestrator, timelineValue]; // timelineValue triggers recalculation of internal orchestrator state
```

## Common ESLint Issues and Solutions

### 1. @typescript-eslint/no-unnecessary-type-assertion

This rule triggers when ESLint thinks a type assertion doesn't change the type. However, sometimes TypeScript's type inference and ESLint's understanding differ, especially with:

- DOM elements from testing-library
- Complex generic types
- External library types

**Solution**: Add a comment explaining why the assertion is needed and disable the rule for that line/file.

### 2. @typescript-eslint/no-unnecessary-condition

This rule complains about conditions that appear always truthy/falsy based on static analysis. However, it may not understand:

- Array access that can return undefined
- Dynamic runtime conditions
- Defensive programming patterns

**Solution**: If the condition is genuinely needed for edge cases, add a comment and disable the rule.

### 3. react-hooks/exhaustive-deps

This rule ensures all dependencies are listed in React hooks. However, sometimes we intentionally exclude dependencies when:

- We want to trigger recalculation based on specific values
- The dependency is stable but contains changing internal state
- We're using a value to force re-execution without actually depending on it

**Solution**: Add a comment explaining the intentional exclusion and disable the rule.

## Before Fixing Lint Errors

1. **Understand the rule**: Read the ESLint documentation for the specific rule
2. **Check if it's a false positive**: Sometimes ESLint doesn't understand the full context
3. **Consider alternative approaches**: Can the code be refactored to avoid the issue?
4. **If disabling is necessary**: Always add a clear comment explaining why

## ESLint Configuration Files

- Main configuration: `/eslint.config.mjs`
- Test-specific overrides can be added to the config
- Project uses `@typescript-eslint` for TypeScript-specific rules
- Extends `next/core-web-vitals` for React and Next.js best practices
