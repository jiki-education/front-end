# Cross-Validation Testing

This directory contains tests that verify Jiki's JavaScript and Python interpreters match the behavior of native Node.js and Python implementations.

## Overview

Cross-validation tests ensure that our educational interpreters behave identically to real JavaScript and Python for the features we've implemented. This is critical for students learning these languages through Jiki.

## Structure

```
tests/cross-validation/
├── utils/
│   ├── native-executor.ts      # Execute code with native interpreters
│   ├── test-runner.ts          # Test framework for cross-validation
│   └── output-helpers.ts       # Extract and normalize outputs
├── python/
│   ├── core/                   # Core language features
│   │   └── basic-operations.test.ts
│   └── stdlib/                 # Standard library methods
│       ├── list-methods.test.ts
│       └── string-methods.test.ts
└── javascript/
    ├── core/                   # Core language features
    │   └── basic-operations.test.ts
    └── stdlib/                 # Standard library methods
        ├── array-methods.test.ts
        └── string-methods.test.ts
```

## Running Tests

```bash
# Run all cross-validation tests
pnpm test:cross

# Run Python tests only
pnpm test:cross:python

# Run JavaScript tests only
pnpm test:cross:js

# Run with regular test suite
pnpm test
```

## Adding New Tests

### For Python

Use the `testPython` helper function:

```typescript
import { testPython } from "../../utils/test-runner";

describe("Python feature", () => {
  testPython(
    "test name",
    `
    x = 5
    result = x * 2
  `,
    { expectedValue: 10 }
  );
});
```

### For JavaScript

Use the `testJavaScript` helper function:

```typescript
import { testJavaScript } from "../../utils/test-runner";

describe("JavaScript feature", () => {
  testJavaScript(
    "test name",
    `
    let x = 5;
    let result = x * 2;
  `,
    { expectedValue: 10 }
  );
});
```

### Test Options

Both test functions support these options:

- `expectedValue`: The expected final value
- `expectedOutput`: The expected console/print output
- `shouldError`: Whether the code should produce an error
- `only`: Run only this test
- `skip`: Skip this test

## What Gets Tested

### Core Language Features

- Arithmetic operations
- Variable declarations and assignments
- Boolean logic
- Comparison operators
- String operations
- List/Array operations
- Control flow (if statements, loops when implemented)

### Standard Library Methods

#### Python

- `list.index()` - Find element position
- `len()` - Get length of lists/strings
- `str.upper()` - Convert to uppercase
- `str.lower()` - Convert to lowercase

#### JavaScript

- `array.at()` - Access element by index
- `array.length` - Get array length
- `string.toUpperCase()` - Convert to uppercase
- `string.toLowerCase()` - Convert to lowercase
- `string.length` - Get string length

## How It Works

1. **Native Execution**: Code is executed using `child_process.spawn()` with native Python or Node.js
2. **Jiki Execution**: Same code is executed with our interpreters
3. **Output Comparison**: Results are normalized and compared
4. **Error Handling**: Both successful execution and errors are validated

## Debugging Failures

When tests fail, you'll see:

- The code that was executed
- Expected output/value
- Actual Jiki output
- Actual native output

Common issues:

- **Whitespace differences**: Handled by `normalizeOutput()`
- **Type differences**: Check that Jiki returns the same types as native
- **Error messages**: May differ in format but should have same meaning

## CI/CD Integration

Tests run automatically in CI with:

- Python 3.11
- Node.js 20
- Ubuntu latest

Python is installed via `actions/setup-python@v5` in the GitHub Actions workflow.

## Performance Considerations

Cross-validation tests spawn separate processes for each test, which adds overhead. Currently all tests run by default to establish a baseline. If performance becomes an issue, consider:

1. Running cross-validation tests separately from unit tests
2. Adding environment variables to control test execution
3. Caching native interpreter results for repeated test runs

## Future Enhancements

- [ ] Add support for `print()` and `console.log()` output comparison
- [ ] Test more complex features (functions, classes)
- [ ] Add error message format validation
- [ ] Support for async/await testing
- [ ] Performance benchmarking between Jiki and native
- [ ] Test coverage reporting for implemented features
