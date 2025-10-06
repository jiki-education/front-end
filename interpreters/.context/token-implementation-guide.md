# Token Implementation Guide

## Overview

When implementing new tokens for JavaScript or Python interpreters, follow this systematic approach to ensure consistency and proper test coverage.

## Token Implementation Process

### 1. Scanner Tests

The scanner test files contain both implemented and unimplemented tokens:

- **JavaScript**: `tests/javascript/scanner.test.ts`
- **Python**: `tests/python/scanner.test.ts`

Unimplemented tokens are:

- **Commented out** in the main test arrays (single-character, two-character operators, keywords)
- **Tested for UnimplementedToken errors** in a dedicated section at the end of the file

### 2. Implementation Steps

When implementing a new token:

1. **Scanner Implementation**
   - Add the token handling in the scanner's `scanToken()` method
   - Remove the UnimplementedToken error for that token
   - Ensure proper tokenization logic

2. **Update Tests**
   - **Uncomment** the token from the commented-out test arrays in the scanner test file
   - **Remove** the corresponding test from the "Unimplemented Tokens" section
   - The token should now pass the standard scanner tests

3. **Parser/Executor** (if applicable)
   - Implement parsing logic if the token requires it
   - Add executor support for the token's functionality
   - Create appropriate describers for educational output

### 3. Example: Implementing the DOT (.) Token

```typescript
// Before: In scanner.test.ts
describe("single-character", () => {
  test.each([
    // [".', "DOT"], // Unimplemented
  ])...
});

// And in Unimplemented Tokens section:
{ code: "obj.prop", token: ".", type: "DOT" },

// After implementation:
describe("single-character", () => {
  test.each([
    [".", "DOT"], // Now uncommented and active
  ])...
});
// Remove the DOT test from Unimplemented Tokens section
```

### 4. Test Organization

- **Implemented tokens**: Tested in the main test arrays
- **Unimplemented tokens**: Listed in the "Unimplemented Tokens" section with error tests
- **Comments**: Each commented-out token should have `// Unimplemented` comment

### 5. Important Notes

- Never delete tests - move them between sections
- Always ensure the UnimplementedToken error is properly handled until implementation
- Run full test suite after changes to ensure no regressions
- Update both translation files when adding new error messages

## Current Status

Check the scanner test files to see which tokens are currently implemented vs unimplemented:

- Implemented tokens are active in the test arrays
- Unimplemented tokens are commented out with `// Unimplemented` markers
