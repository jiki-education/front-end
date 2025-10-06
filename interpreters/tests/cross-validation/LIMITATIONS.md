# Current Limitations of Cross-Validation Testing

## Python Interpreter

### Missing `print()` function

The Python interpreter currently lacks a `print()` function, which means:

- We cannot compare output with native Python for most tests
- Tests are currently limited to checking that our interpreter produces correct values internally
- Once `print()` is implemented, all Python cross-validation tests will work properly

**To enable full Python cross-validation:**

1. Implement `print()` as a built-in function in the Python interpreter
2. Update tests to use `print()` statements
3. Compare printed output with native Python

### Test Status

- ❌ Basic operations tests (need print())
- ❌ Stdlib method tests (need print())
- ✅ Internal value validation (working)

## JavaScript Interpreter

### Missing `console.log()` function

The JavaScript interpreter currently lacks `console.log()`, which means:

- We cannot compare console output with native Node.js
- Tests must use expression statements with semicolons
- Expression values are captured but not printed

**To enable full JavaScript cross-validation:**

1. Implement `console` object with `log()` method
2. Update tests to use `console.log()` statements
3. Compare console output with native Node.js

### Test Status

- ⚠️ Basic operations tests (work with expression statements)
- ⚠️ Stdlib method tests (work with expression statements)
- ✅ Internal value validation (working)

## Temporary Workarounds

Until print/console.log are implemented:

1. **For Python:** Tests validate internal computation results only
2. **For JavaScript:** Tests use expression statements (with semicolons) and validate the final value
3. **Framework validation:** The `framework-validation.test.ts` file confirms the testing infrastructure works

## Future Improvements

1. **Implement print() for Python**
   - Add as built-in function
   - Capture output in frames
   - Enable full cross-validation

2. **Implement console.log() for JavaScript**
   - Add console object
   - Capture output in frames
   - Enable full cross-validation

3. **Enhanced Output Extraction**
   - Detect print/console.log frames
   - Extract output from those specific frames
   - Compare with native output

4. **Error Comparison**
   - Normalize error messages
   - Compare error types and contexts
   - Validate error handling matches native behavior
