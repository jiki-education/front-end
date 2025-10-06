# Cross-Validation Testing System

## Overview

Cross-validation tests verify that our interpreter implementations produce the same output as native language execution. This ensures our educational interpreters accurately represent real language behavior.

## Architecture

### Test Runner (`tests/cross-validation/utils/test-runner.ts`)

The test runner provides language-specific test functions that:

1. Execute code in both the Jiki interpreter and native runtime
2. Automatically wrap code with output statements (`console.log()` for JS, `print()` for Python)
3. Compare outputs to ensure they match
4. Extract values from `logLines` for assertions

### Test Structure

Tests are organized by language and category:

```
tests/cross-validation/
├── javascript/
│   ├── core/
│   │   └── basic-operations.test.ts
│   └── stdlib/
│       ├── array-methods.test.ts
│       └── string-methods.test.ts
├── python/
│   ├── core/
│   │   └── basic-operations.test.ts
│   └── stdlib/
│       ├── list-methods.test.ts
│       └── string-methods.test.ts
└── utils/
    ├── test-runner.ts
    ├── native-executor.ts
    └── output-helpers.ts
```

## Writing Cross-Validation Tests

### JavaScript Tests

```typescript
import { testJavaScript } from "../../utils/test-runner";

describe("Feature name", () => {
  testJavaScript("test name", "let result = 2 + 3;", {
    expectedValue: 5,
  });
});
```

### Python Tests

```typescript
import { testPython } from "../../utils/test-runner";

describe("Feature name", () => {
  testPython("test name", "2 + 3", {
    expectedValue: 5,
  });
});
```

### How It Works

1. **Code Wrapping**: The test runner automatically wraps your code:
   - JavaScript: Adds `console.log(result)` after execution
   - Python: Wraps expression in `print()` or adds `print(result)` after statements

2. **Native Execution**: Code runs in actual JavaScript/Python environments

3. **Jiki Execution**: Code runs through our interpreter

4. **Output Comparison**: Both outputs are compared after parsing

## Prerequisites for Cross-Validation

### JavaScript

**Required:**

- `console.log()` support (builtin object with log method)
- `logLines` in InterpretResult

**Feature Constraints:**

- Only use implemented features in tests
- Tests using `const`, `var`, `%`, `**`, `NaN`, `Infinity`, or `==`/`!=` will fail until those features are implemented
- Use `let` for variable declarations

### Python

**Required:**

- `print()` support (builtin function)
- `logLines` in InterpretResult

**Feature Constraints:**

- Only use implemented features in tests
- Most Python operators are implemented (%, \*\*, //, etc.)

## When to Add Cross-Validation Tests

Add cross-validation tests when:

- Implementing new operators or expressions
- Adding builtin functions or methods
- Implementing language features that have equivalent native behavior
- Adding stdlib functions (array/list methods, string methods, etc.)

**Do NOT** add cross-validation tests for:

- Jiki-specific educational features (language feature flags, progressive syntax)
- Frame generation or UI-specific functionality
- Error messages or custom error types

## Maintenance

### Keeping Tests in Sync

When features are added or removed:

1. Update cross-validation tests to only use implemented features
2. Convert incompatible syntax (e.g., `const` → `let` until `const` is implemented)
3. Remove tests for features that aren't implemented yet
4. Add them back when the feature is implemented

### Example: Adding `const` Support

When implementing `const`:

1. Update JavaScript scanner/parser to handle `const`
2. Add interpreter support
3. Convert `let` back to `const` in cross-validation tests where appropriate
4. Run tests to verify native parity

## Benefits

- **Accuracy**: Ensures our interpreters match real language behavior
- **Regression Prevention**: Catches unintended behavioral changes
- **Documentation**: Tests serve as examples of correct behavior
- **Confidence**: Validates that educational explanations match reality

## Common Issues

### Tests Failing Due to Unimplemented Features

**Problem**: Tests use features not yet implemented (e.g., `const`, `%`, `**`)

**Solution**:

- Remove tests for unimplemented features OR
- Convert syntax to use implemented alternatives (e.g., `const` → `let`)
- Add tests back when features are implemented

### Output Mismatch

**Problem**: Jiki output doesn't match native output

**Solution**:

- Check `toString()` implementations on JikiObjects/PyObjects
- Verify operator precedence matches native
- Ensure type coercion follows language rules

### Missing logLines

**Problem**: Tests fail because logLines is empty

**Solution**:

- Verify `console.log()` / `print()` is properly implemented
- Check that `logLines` is included in InterpretResult
- Ensure `ctx.log()` is called from builtin functions

## Related Documentation

- [Interpreter Architecture](.shared/interpreter-architecture.md) - Shared patterns
- [Common Issues](.shared/common-issues.md) - Troubleshooting guide
- Test Runner README: `tests/cross-validation/README.md`
