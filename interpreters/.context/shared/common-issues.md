# Common Development Issues

This document outlines the most common mistakes developers make when working on the Jiki interpreter system.

## Critical Architecture Violations

### ❌ Runtime Errors as Returned Errors

**WRONG**: Returning runtime errors as `error` in the result breaks UI compatibility.

**✅ CORRECT**: Parse errors are returned as `error`, runtime errors become error frames with `status: "ERROR"`.

### ❌ Manual Frame Creation in Interpreter

**WRONG**: Creating frames manually in interpreter.ts instead of letting the executor handle frame creation internally.

**✅ CORRECT**: Executor handles all frame creation using `addFrame()` methods.

### ❌ Missing executeFrame() Wrapper

**WRONG**: Direct execution without using `executeFrame()` wrapper for consistent frame generation.

**✅ CORRECT**: All execution must use `executeFrame()` wrapper.

### ❌ Success Flag Always True

**WRONG**: Hardcoding `success: true` in executor result regardless of error frames.

**✅ CORRECT**: Set `success: !this.frames.find(f => f.status === "ERROR")` - success is false if any error frames exist.

## Error Message Format Issues

### ❌ Wrong System Message Format

**WRONG**: Expecting localized messages like "The variable 'x' has not been declared" in tests.

**✅ CORRECT**: System message format `"ErrorType: context: value"` (e.g., `"VariableNotDeclared: name: x"`).

### ❌ Missing Language Configuration in Tests

**WRONG**: Adding `changeLanguage("system")` in individual test files when it's already configured globally.

**✅ CORRECT**: Global test setup (`tests/setup.ts`) already sets all interpreters to use "system" language. Individual test files DO NOT need to call `changeLanguage("system")`.

## Location Tracking Problems

### ❌ Incomplete Statement Locations

**WRONG**: Statement locations that don't include full statement span (missing semicolons, keywords, etc.).

**✅ CORRECT**: Statement locations MUST span the entire statement (including semicolons, keywords).

### ❌ Nullable Location Parameters

**WRONG**: Using `Location | null` or optional location parameters without proper handling.

**✅ CORRECT**: All location parameters should be non-nullable `Location`. Use `Location.unknown` as fallback when location is unavailable.

## Language Features Integration

### ❌ Language Features Only in Executor

**WRONG**: Checking language features only in the executor, not in parser for syntax-level features.

**✅ CORRECT**: Parser needs access to language features for syntax decisions (e.g., `requireVariableInstantiation`). Pass features to both parser and executor.

### ❌ Wrong Error Handling in Parser

**WRONG**: Using `this.error(token, errorType)` with wrong argument order.

**✅ CORRECT**: Parser's error method signature is `error(type: SyntaxErrorType, location: Location, context?: any)`.

## Describer Type Issues

### ❌ Using String[] Instead of string[]

**WRONG**: Returning `String[]` (capital S) from describers causes TypeScript errors.

**✅ CORRECT**: Use `string[]` (lowercase) for TypeScript primitive types.

## Import Path Guidelines

### ❌ Using Relative Imports in Tests

**WRONG**: Using relative paths to import from src directories.

```typescript
import { interpret } from "../../src/javascript/interpreter";
import type { TestAugmentedFrame } from "../../../src/shared/frames";
```

**✅ CORRECT**: Always use TypeScript path aliases in test files.

```typescript
import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";
```

**Available aliases:**

- `@jikiscript/*` → `src/jikiscript/*`
- `@javascript/*` → `src/javascript/*`
- `@python/*` → `src/python/*`
- `@shared/*` → `src/shared/*`
- `@utils/*` → `src/utils/*`

**Benefits:**

- Cleaner, more readable imports
- Imports don't break when files are moved
- Consistent with production code patterns
- Easier to refactor

**Any deviation from the shared architecture WILL break UI compatibility!**
