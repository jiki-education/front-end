# JavaScript Interpreter Evolution

## 2025-10-06: Add requireSemicolons Language Feature Flag

### Overview

Added a new language feature flag `requireSemicolons` to make semicolons optional in JavaScript code. When disabled, semicolons become optional at statement boundaries (end of line, end of file, closing braces).

### Motivation

Educational progression: Allow students to write simpler code initially (`move()\nmove()`) and introduce semicolons as a later concept. Aligns with many modern JavaScript practices where ASI (Automatic Semicolon Insertion) handles statement boundaries.

### Changes Applied

**1. LanguageFeatures Interface** (`src/javascript/interfaces.ts`):

- Added `requireSemicolons?: boolean` flag
- Default: `true` (semicolons required - backward compatible)
- When `false`: Semicolons optional at statement boundaries

**2. Parser consumeSemicolon Method** (`src/javascript/parser.ts:725-789`):

Updated logic to support optional semicolons:

```typescript
private consumeSemicolon(): Token {
  // If semicolon present, consume it
  if (this.match("SEMICOLON")) { ... }

  // Check flag (defaults to true)
  const requireSemicolons = this.languageFeatures.requireSemicolons ?? true;

  // If required, throw error (unless EOF)
  if (requireSemicolons) {
    if (!this.isAtEnd()) {
      this.error("MissingSemicolon", this.peek().location);
    }
    return this.previous();
  }

  // If optional, allow statement boundaries without semicolon
  const nextToken = this.peek();
  if (nextToken.type === "EOL" || "EOF" || "RIGHT_BRACE" || "RIGHT_PAREN") {
    return this.previous();
  }

  // Still require semicolon on same line
  this.error("MissingSemicolon", this.peek().location);
}
```

**3. Test Suite** (`tests/javascript/language-features/requireSemicolons.test.ts`):

Comprehensive tests covering:

- Default behavior (semicolons required)
- Optional semicolons with `requireSemicolons: false`
- Multiple statements on separate lines without semicolons
- Function calls, return, break, continue without semicolons
- Block statements without semicolons
- Still requiring semicolons on same line
- Explicit `requireSemicolons: true` behavior

### Behavior Details

**When `requireSemicolons: false`:**

- ✅ Allows: `move()\nmove()` (separate lines)
- ✅ Allows: `let x = 1\nlet y = 2` (separate lines)
- ✅ Allows: `if (true) { let x = 1\n}` (before closing brace)
- ❌ Requires: `let x = 1; let y = 2` (same line - semicolon still needed)
- ✅ Still accepts: `let x = 1;` (semicolons when provided)

**When `requireSemicolons: true` (default):**

- All semicolons required (current behavior maintained)
- Ensures backward compatibility

### Files Modified

- `src/javascript/interfaces.ts` - Added `requireSemicolons` flag
- `src/javascript/parser.ts` - Updated `consumeSemicolon()` logic
- `tests/javascript/language-features/requireSemicolons.test.ts` - New test suite

### Impact

- ✅ Backward compatible (defaults to `true`)
- ✅ All existing tests pass
- ✅ Enables educational progression
- ✅ Consistent with modern JavaScript practices

## 2025-10-06: Type System Refactoring to Union Types

### Overview

Completed major refactoring of JavaScript interpreter's type system to use union types instead of base interfaces, aligning with JikiScript's proven architecture and eliminating problematic type casts.

### Motivation

The PR review identified critical type safety issues with break/continue implementation using `as any` casts. Investigation revealed a fundamental architectural difference between JavaScript and JikiScript:

- **JavaScript (Before)**: Used base `EvaluationResult` interface with required `jikiObject` field
- **JikiScript**: Used union types with valueless statements having `jikiObject?: undefined`
- **Problem**: Break/Continue statements don't produce values, forcing use of `as any` to bypass type system

### Changes Applied

**1. Evaluation Result Type System** (`src/javascript/evaluation-result.ts`):

- **Before**: Base interface with required fields

  ```typescript
  export interface EvaluationResult {
    type: string;
    jikiObject: JikiObject;
    immutableJikiObject: JikiObject;
  }
  ```

- **After**: Union types with `never` for valueless statements

  ```typescript
  export interface EvaluationResultBreakStatement {
    type: "BreakStatement";
    jikiObject: never;
    immutableJikiObject: never;
  }

  export type EvaluationResultStatement =
    | EvaluationResultExpressionStatement
    | EvaluationResultVariableDeclaration
    | ...
    | EvaluationResultBreakStatement
    | EvaluationResultContinueStatement;

  export type EvaluationResult =
    | EvaluationResultStatement
    | EvaluationResultExpression;
  ```

**2. Executor Signatures** (`src/javascript/executor.ts`):

- Removed defensive `| null` typing from signatures:
  - `addSuccessFrame(result: EvaluationResult)` (was `EvaluationResult | null`)
  - `executeStatement(statement: Statement): void` (was `EvaluationResult | null`)
  - `addFrame(result?: EvaluationResult)` (was `result?: EvaluationResult | null`)

- Changed `evaluate()` return type to narrow union:
  - `evaluate(expression: Expression): EvaluationResultExpression` (was `EvaluationResult`)
  - Ensures expressions can't accidentally return statement results

**3. Break/Continue Executors**:

- Replaced `as any` casts with type-safe `executeFrame<T>()` pattern:

  ```typescript
  // Before:
  const result = { type: "BreakStatement" };
  executor.addSuccessFrame(statement.location, result as any, statement);

  // After:
  executor.executeFrame<EvaluationResultBreakStatement>(statement, () => {
    return { type: "BreakStatement" } as EvaluationResultBreakStatement;
  });
  ```

- Fixed `ContinueFlowControlError` constructor (removed unused `lexeme` parameter)

**4. Expression Executor Return Types**:

Updated all expression executors to return specific types instead of broad `EvaluationResult`:

- `executeLiteralExpression`: Returns `EvaluationResultLiteralExpression`
- `executeBinaryExpression`: Returns `EvaluationResultBinaryExpression`
- `executeUnaryExpression`: Returns `EvaluationResultUnaryExpression`
- `executeGroupingExpression`: Returns `EvaluationResultGroupingExpression`
- `executeArrayExpression`: Returns `EvaluationResultArrayExpression`

Helper functions also updated to use narrower types (e.g., `EvaluationResultExpression` instead of `EvaluationResult`)

**5. BlockStatement Handling**:

- Confirmed BlockStatements don't generate frames (just create scope)
- Removed premature `EvaluationResultBlockStatement` type that was added
- Removed BlockStatement case from frameDescribers
- Comment in executor confirms: "Block statements should not generate frames, just execute their contents"

### Files Modified

**Core Types**:

- `src/javascript/evaluation-result.ts` - Complete refactor to union types

**Executor**:

- `src/javascript/executor.ts` - Signature updates, added `EvaluationResultExpression` import
- `src/javascript/executor/executeBreakStatement.ts` - Type-safe frame generation
- `src/javascript/executor/executeContinueStatement.ts` - Type-safe frame generation, removed lexeme param
- `src/javascript/executor/executeBlockStatement.ts` - Simplified (no frame generation)

**Expression Executors** (return type updates):

- `executeLiteralExpression.ts`
- `executeBinaryExpression.ts`
- `executeUnaryExpression.ts`
- `executeGroupingExpression.ts`
- `executeArrayExpression.ts`

**Member Expression Handlers** (parameter type updates):

- `executeArrayMemberExpression.ts`
- `executeDictionaryMemberExpression.ts`
- `executeStdlibMemberExpression.ts`

**Describers**:

- `src/javascript/frameDescribers.ts` - Removed unused BlockStatement import and case
- `src/javascript/describers/describeSteps.ts` - Updated import paths
- `src/javascript/describers/describeTemplateLiteralExpression.ts` - Updated import paths

### Benefits Achieved

**Type Safety**:

- Eliminated all `as any` casts from break/continue implementation
- Compiler now enforces that valueless statements can't have `jikiObject` accessed
- Clear distinction between statements and expressions at type level

**Architecture Consistency**:

- JavaScript now matches JikiScript's union type pattern exactly
- Same approach to handling valueless statements
- Consistent across all three interpreters (JikiScript, JavaScript, Python)

**Maintainability**:

- Explicit types make code intent clearer
- Compiler catches more errors at build time
- Easier to understand which result types have values

**Code Quality**:

- No defensive `| null` typing needed
- Narrower types in expression evaluation
- Better IDE autocomplete and type checking

### Test Results

- All 2120 tests passing
- No regressions introduced
- TypeScript compilation with zero errors
- All functionality preserved while improving type safety

### Technical Notes

**Why `never` instead of `?: undefined`**:

While JikiScript uses `jikiObject?: undefined`, we chose `jikiObject: never` because:

- More explicit that field should never be accessed
- Compiler catches accidental access attempts
- Still requires `as EvaluationResultBreakStatement` cast in `executeFrame<T>()` callback
- Trade-off accepted for explicitness

**BlockStatement Frames**:

Initial implementation mistakenly added BlockStatement frames, causing test failures. Investigation confirmed:

- JikiScript doesn't generate BlockStatement frames
- Executor comment explicitly states this intent
- Block statements only create scope, statements inside generate frames
- Removed premature type and frame handling

### Impact

This refactoring establishes JavaScript interpreter on the same type-safe foundation as JikiScript:

- Eliminates last remaining `as any` casts from flow control
- Provides template for future valueless statement types
- Ensures long-term maintainability through stricter typing
- Maintains backward compatibility (all tests pass)

## 2025-10-06: Break and Continue Statements - Bug Fixes

### Overview

Fixed three critical issues in the initial break/continue implementation based on PR review feedback.

### Fixes Applied

**1. ContinueFlowControlError Constructor Inconsistency**

- **Issue**: `ContinueFlowControlError` took `location` and `lexeme` parameters, but `lexeme` was never used
- **Fix**: Removed unused `lexeme` parameter to match `BreakFlowControlError` pattern
- **Files**: `src/javascript/executor/executeContinueStatement.ts`

**2. Type Casting with `as any`**

- **Issue**: Both executors used `addSuccessFrame(result as any)` to bypass type checking
- **Fix**: Replaced with `executeFrame<T>()` pattern following JikiScript's approach
- **Benefit**: Proper type safety without casts, consistent with return statement pattern
- **Files**: `executeBreakStatement.ts`, `executeContinueStatement.ts`

**3. Continue with Update Expression Verification**

- **Issue**: Need to verify `continue` executes update expression before next iteration in for loops
- **Fix**: Added comprehensive test that verifies update runs after continue
- **Test**: New test checks iteration count, accumulated values, and final loop variable value
- **Result**: Confirmed implementation is correct - update expression runs after continue

### Test Updates

**New Test** (`tests/javascript/concepts/break-continue.test.ts`):

- "continue executes update expression in for loop" - Verifies critical behavior:
  - `count` variable increments on every iteration (including when continue is called)
  - Loop variable `i` reaches final value, proving update expression executed
  - Accumulated value `x` correctly skips the continue iteration

**Test Count**: 9 tests total (was 8)

### Technical Details

**Before**:

```typescript
export class ContinueFlowControlError extends Error {
  constructor(public location: Location, public lexeme: string) { ... }
}

executor.addSuccessFrame(statement.location, result as any, statement);
throw new ContinueFlowControlError(statement.location, statement.keyword.lexeme);
```

**After**:

```typescript
export class ContinueFlowControlError extends Error {
  constructor(public location: Location) { ... }
}

executor.executeFrame<EvaluationResultContinueStatement>(statement, () => {
  return { type: "ContinueStatement" };
});
throw new ContinueFlowControlError(statement.location);
```

## 2025-10-06: Break and Continue Statements Implementation

### Overview

Implemented `break` and `continue` statements for JavaScript loops, enabling students to learn loop flow control with Jiki's frame-by-frame visualization.

### Core Implementation

**AST Nodes** (`src/javascript/statement.ts`):

- `BreakStatement`: Represents `break` statements with keyword token and location
- `ContinueStatement`: Represents `continue` statements with keyword token and location

**Flow Control Errors** (`src/javascript/executor/executeBreakStatement.ts`, `executeContinueStatement.ts`):

- `BreakFlowControlError`: Exception class for break flow control with location
- `ContinueFlowControlError`: Exception class for continue flow control with location
- Both use `executeFrame<T>()` pattern for type-safe frame generation

**Execution Modules**:

- `executeBreakStatement.ts`: Creates frame and throws `BreakFlowControlError`
- `executeContinueStatement.ts`: Creates frame and throws `ContinueFlowControlError`
- `executeLoop()`: Helper method that catches `BreakFlowControlError` to exit loops
- `executeLoopIteration()`: Helper method that catches `ContinueFlowControlError` to skip to next iteration

**Executor Updates** (`src/javascript/executor.ts`):

- Added `executeLoop()` and `executeLoopIteration()` helper methods
- Updated `executeForStatement` and `executeWhileStatement` to use flow control helpers
- Added break/continue handling in `withExecutionContext()` for top-level error detection
- Flow control errors bubble up through `executeStatement()` to loop handlers

**Parser Enhancements** (`src/javascript/parser.ts`):

- Added `breakStatement()` method for parsing `break` statements
- Added `continueStatement()` method for parsing `continue` statements
- Node restriction support via `checkNodeAllowed()`

**Scanner Updates** (`src/javascript/scanner.ts`):

- Removed `BREAK` and `CONTINUE` from unimplemented tokens list
- Tokens now fully operational

**Error Types**:

- Runtime: `BreakOutsideLoop`, `ContinueOutsideLoop`
- Syntax: `BreakStatementNotAllowed`, `ContinueStatementNotAllowed` (for node restrictions)

**Frame Generation**:

- Added `describeBreakStatement.ts` - "This line immediately exited the loop"
- Added `describeContinueStatement.ts` - "This line stopped running any more code in this iteration"

**Evaluation Results** (`src/javascript/evaluation-result.ts`):

- Added `EvaluationResultBreakStatement` type (no jikiObject needed)
- Added `EvaluationResultContinueStatement` type (no jikiObject needed)

### Flow Control Architecture

**Exception-Based Flow Control**:

1. Break/continue statements generate success frames
2. Throw flow control exception
3. Exception bubbles through `executeStatement()` calls (re-thrown)
4. Loop helpers (`executeLoop`, `executeLoopIteration`) catch and handle
5. If caught at top level, converted to error frame

**Loop Integration**:

- For loops: `executeLoop()` wraps entire while loop, `executeLoopIteration()` wraps body execution
- While loops: Same pattern as for loops
- Nested loops: Inner loop handlers catch first, outer loops unaffected

### Translation System

**Added translations** in `src/javascript/locales/en/translation.json` and `system/translation.json`:

- `BreakOutsideLoop`: "You used the 'break' keyword, but you're not inside a loop..."
- `ContinueOutsideLoop`: "You used the 'continue' keyword, but you're not inside a loop..."
- `BreakStatementNotAllowed`: "Break statements are not allowed at your current learning level"
- `ContinueStatementNotAllowed`: "Continue statements are not allowed at your current learning level"

### Test Coverage

**New Test Suite** (`tests/javascript/concepts/break-continue.test.ts`): 9 comprehensive tests

**Break Tests**:

- Break in for loop (exits early)
- Break in while loop (exits early)
- Break outside loop generates runtime error

**Continue Tests**:

- Continue in for loop (skips iterations)
- Continue executes update expression in for loop (verifies correct behavior)
- Continue in while loop (skips iterations)
- Continue outside loop generates runtime error

**Nested Loop Tests**:

- Break only exits inner loop
- Continue only affects inner loop

### Impact and Benefits

**Educational Value**:

- Students learn loop flow control with frame-by-frame visualization
- Clear error messages when break/continue used incorrectly
- Nested loop behavior shown visually

**Architecture Consistency**:

- Follows shared flow control pattern from JikiScript
- Parse errors as returned errors, runtime errors as frames
- Frame generation compatible with Jiki UI

**Test Results**:

- All 8 new tests passing
- No regressions in existing 300+ tests

## 2025-10-03: User-Defined Functions Implementation

### Overview

Implemented complete support for user-defined functions in JavaScript, including function declaration and return statements. This enables students to learn function concepts with Jiki's frame-by-frame visualization.

### Core Implementation

**AST Nodes** (`src/javascript/statement.ts`):

- `FunctionDeclaration`: Represents `function` statements with name, parameters, and body
- `ReturnStatement`: Represents `return` statements with optional expression
- `FunctionParameter`: Represents function parameter declarations

**Callables** (`src/javascript/functions.ts`):

- `JSUserDefinedFunction`: Extends `JSCallable` base class for user-defined functions
  - Stores function declaration AST
  - Provides `getDeclaration()` accessor for execution
  - Returns `<function name>` string representation
- `ReturnValue`: Exception class for unwinding call stack on return
  - Contains return value as JikiObject
  - Includes location for error reporting

**Execution Modules**:

- `executeFunctionDeclaration.ts`: Creates `JSUserDefinedFunction` and binds to environment
- `executeReturnStatement.ts`: Evaluates return value and throws `ReturnValue` exception
- `executeCallExpression.ts`: Enhanced to handle user-defined function calls:
  - Creates new environment chained to function's parent (closure support)
  - Binds parameters to argument values
  - Executes function body statements
  - Catches `ReturnValue` exceptions for return flow
  - Returns undefined for functions without explicit return

**Parser Enhancements** (`src/javascript/parser.ts`):

- Added `functionDeclaration()` method for parsing `function` statements
- Handles JavaScript syntax: `function name(params) { body }`
- Validates duplicate parameter names
- Added `returnStatement()` method for parsing `return` statements

**Error Types** (`src/javascript/error.ts`):

- Added function-specific errors: `MissingFunctionName`, `MissingLeftParenthesisAfterFunctionName`, `MissingParameterName`, `MissingRightParenthesisAfterParameters`, `MissingLeftBraceAfterFunctionSignature`, `DuplicateParameterName`, `ReturnOutsideFunction`

**Frame Generation**:

- Added `describeReturnStatement.ts` describer for educational frame descriptions
- Return statements generate frames showing return value or void return

**Evaluation Results** (`src/javascript/evaluation-result.ts`):

- Added `EvaluationResultReturnStatement` type with expression and jikiObject fields

### JavaScript-Specific Implementation Details

**Syntax Handling**:

- JavaScript uses `function name(params) {}` with braces
- Contrast with Python's `def name(params):` with indentation
- Parser consumes LEFT_BRACE after function signature
- Body statements parsed until matching RIGHT_BRACE

**Scope and Closures**:

- Functions create new environment chained to current environment
- Enables proper closure support and scope chain resolution
- Parameters bound to new environment before body execution
- Environment restored after function execution completes

**Return Behavior**:

- Explicit `return value` evaluates expression and returns as JikiObject
- Explicit `return` (no value) returns undefined
- Implicit return (reaching end of function) returns undefined
- All return paths use `ReturnValue` exception for stack unwinding

### Scanner Updates

**Removed from unimplemented tokens** (`src/javascript/scanner.ts`):

- `FUNCTION` token now fully implemented
- `RETURN` token now fully implemented

### Test Coverage

**New Test Suite** (`tests/javascript/functions.test.ts`): 17 comprehensive tests

**Basic Functionality**:

- Simple function definition and call
- Functions with single and multiple parameters
- Return value handling (explicit and implicit)
- Void functions without return statement

**Scope and Closures**:

- Variable access in function scope
- Closure over parent environment variables
- Parameter shadowing of outer variables

**Syntax Error Tests**:

- Missing function name after `function`
- Missing parentheses around parameters
- Missing braces around body
- Duplicate parameter names

**Runtime Error Tests**:

- Wrong number of arguments (too few, too many)
- Return statement outside function
- Undefined function calls

**Complex Scenarios**:

- Nested function calls
- Conditionals inside functions
- Multiple return paths in single function

### Translation System

**Added translations** in `src/javascript/locales/en/translation.json` and `system/translation.json`:

- All function-specific error messages with context placeholders
- Consistent with shared error format pattern

### Impact and Benefits

**Educational Value**:

- Students can learn function declaration and return statements
- Frame-by-frame visualization shows parameter binding and return flow
- Clear error messages guide students through syntax requirements

**Architecture Consistency**:

- Follows shared interpreter architecture patterns exactly
- Parse errors as returned errors, runtime errors as frames
- Frame generation compatible with Jiki UI

**Test Results**:

- All tests passing including 17 new function tests
- No regressions from implementation

### Parallel Implementation

This JavaScript implementation was developed in parallel with the Python user-defined functions implementation (same PR), sharing:

- Common architectural patterns (ReturnValue exception, environment chaining)
- Similar test structure and coverage
- Consistent error handling approach
- Aligned frame generation

### Future Enhancements

Potential additions for future development:

- Function expressions (`const fn = function() {}`)
- Arrow functions (`const fn = () => {}`)
- Default parameter values
- Rest parameters (`...args`)
- Destructuring parameters
- Async functions

This implementation establishes JavaScript functions as a core educational feature with complete visualization support and robust error handling.

## 2025-10-03: Removal of Executor Location Tracking

- **Removed**: `private location: Location` field from JavaScript executor
- **Change**: Error frames now use precise error locations (`error.location`) instead of broad statement locations
- **Implementation**:
  - Removed location tracking state from executor class
  - Removed location setting/resetting in `executeFrame()` wrapper
  - All error creation uses `error.location` for precise error reporting
  - Changed location parameters from `Location | null` to non-nullable `Location`
  - Introduced `Location.unknown` as fallback for unavailable locations
- **Benefits**:
  - Simpler executor state management
  - More precise error reporting pointing to exact sub-expressions
  - Clearer intent with explicit location handling
  - Reduced complexity in error handling code
- **Impact**: Updated approximately 20+ error creation sites across JavaScript executor modules

## 2025-10-03: Compile Function with CompilationResult Pattern

- **Added**: `compile()` function for parse-only validation
- **Implementation**:
  - New `compile()` function in `src/javascript/interpreter.ts`
  - Parses source code without executing it
  - Returns `{ success: true }` on successful compilation
  - Returns `{ success: false, error: SyntaxError }` on parse/syntax errors
- **Shared Types**:
  - Created `src/shared/errors.ts` with:
    - `SyntaxError` interface that all interpreter SyntaxError classes conform to
    - `CompilationResult` discriminated union type for type-safe error handling
  - Exported from main `src/index.ts` for cross-interpreter consistency
- **Benefits**:
  - Type-safe with discriminated union (`success` field)
  - Cleaner API than throwing exceptions or returning different types
  - Consistent structure across all three interpreters
  - Easy to use: `if (result.success) { ... } else { console.error(result.error) }`
- **Use Case**: Allows syntax validation before execution, useful for educational feedback

## 2025-09-24: Nested Objects and Lists Support

- **Added**: Full support for complex nested structures and multiline syntax
- **Parser Changes**:
  - Fixed `parseArray()` to skip EOL tokens after opening bracket, before elements, and before closing bracket
  - Mirrors the EOL handling in `parseDictionary()` for consistency
  - Enables multiline array literals and nested structures
- **Features**:
  - Complex nested patterns like `x[0].something[0]['foo'][5] = 'bar'`
  - Multiline arrays and objects work correctly
  - Deep nesting of arrays and objects
  - Mixed bracket and dot notation in nested structures
  - Dynamic property creation in nested structures
- **Test Coverage**: Comprehensive tests for nested patterns, deep nesting, multiline syntax, and real-world JSON-like structures

## 2025-09-24: Object Property Writing

- **Added**: Support for object property assignment via dot notation and bracket notation
- **Executor Changes**:
  - Extended `executeAssignmentExpression` to handle JSDictionary objects alongside arrays
  - Property keys are converted to strings matching JavaScript semantics
  - Support for both computed (bracket) and non-computed (dot) notation
  - Creates new properties if they don't exist
  - Overwrites existing properties with new values
- **Features**:
  - Dot notation assignment (`obj.name = "value"`)
  - Bracket notation with strings (`obj["name"] = "value"`)
  - Bracket notation with numbers (`obj[42] = "value"`)
  - Bracket notation with variables (`obj[key] = "value"`)
  - Bracket notation with expressions (`obj[prefix + "_id"] = value`)
  - Nested property assignment (`obj.user.profile.name = "new"`)
  - Mixed arrays and objects (`obj.list[0] = value`, `arr[0].prop = value`)
  - Property type changes when overwriting
- **Error Handling**:
  - TypeError when trying to set properties on primitives (number, boolean, string)
  - TypeError when trying to set properties on null or undefined
  - Maintains consistent error reporting with array assignment
- **Test Coverage**: Comprehensive tests for all assignment patterns, property creation, overwriting, and error cases

## 2025-09-24: Object Property Reading

- **Added**: Support for object property access via dot notation and bracket notation
- **Parser Changes**:
  - Enabled DOT token (removed from unimplemented list)
  - Extended `postfix()` to handle both dot notation (`obj.prop`) and bracket notation (`obj["prop"]`)
  - Added EOL token skipping in dictionary parsing for multiline objects
  - Dot notation creates non-computed MemberExpression with string literal
  - Bracket notation creates computed MemberExpression with evaluated expression
- **Executor Changes**:
  - Extended `executeMemberExpression` to handle JSDictionary objects
  - Converts property keys to strings (matching JavaScript semantics)
  - Returns `undefined` for missing properties (JS semantics)
  - Proper error handling for non-object/array property access
- **Error Handling**:
  - TypeError when accessing properties of primitives (number, boolean, string)
  - TypeError when accessing properties of null or undefined
  - Runtime errors properly captured in frames with `status: "ERROR"`
- **Features**:
  - Chained property access (`obj.user.profile.name`)
  - Mixed notation (`obj.data["items"]["item-1"]`)
  - Arrays in objects and objects in arrays
  - Dynamic property access with expressions (`obj[key]`, `obj[5+5]`)
- **Test Coverage**: Comprehensive tests for dot notation, bracket notation, mixed notation, edge cases, and error conditions

## 2025-09-23: Array Element Assignment

- **Added**: Full support for array element assignment (e.g., `arr[0] = value`)
- **Parser Changes**:
  - Modified `AssignmentExpression` to accept `MemberExpression` as target
  - Supports chained assignments like `arr[0][1] = value`
- **Executor Changes**:
  - Extended `executeAssignmentExpression` to handle member expression targets
  - Validates target is an array and index is a valid integer
  - Automatically extends arrays when assigning beyond current length (JS semantics)
  - Fills gaps with `undefined` when extending
- **Error Handling**:
  - TypeError for non-array targets or non-numeric indices
  - IndexOutOfRange for negative indices
  - Proper error frames for runtime errors
- **Reading Behavior**: Out-of-bounds reads return `undefined` (JS semantics)
- **Test Coverage**: Comprehensive tests for basic assignment, chaining, extension, and error cases

# JavaScript Interpreter Evolution History

This document tracks the historical development and changes specific to the JavaScript interpreter.

## List (Array) Index Reading Implementation (January 2025)

### Changes Made

Added support for array index reading (member access) without chaining:

**Features Added**:

- Array element access with bracket notation `arr[index]`
- Comprehensive bounds checking
- Type validation for indices (must be integer numbers)
- Proper error handling for runtime errors

**Implementation Details**:

1. **Expression Class** (`src/javascript/expression.ts`):
   - Added `MemberExpression` class for array indexing
   - Supports computed property access (bracket notation)
   - Future-ready for dot notation with `computed` flag

2. **Parser Updates** (`src/javascript/parser.ts`):
   - Modified `postfix()` method to handle `LEFT_BRACKET` after expressions
   - Parses array index access without chaining (single level only for now)
   - Proper error recovery with `MissingRightBracketInMemberAccess`

3. **Executor Module** (`src/javascript/executor/executeMemberExpression.ts`):
   - Validates object is array (JSList)
   - Validates property is number (JSNumber)
   - Checks for negative indices
   - Checks for out of bounds access
   - Validates indices are integers (not floats)
   - Returns element with proper cloning for immutability

4. **Evaluation Result** (`src/javascript/evaluation-result.ts`):
   - Added `EvaluationResultMemberExpression` type
   - Includes object and property evaluation results

5. **Describers** (`src/javascript/describers/describeMemberExpression.ts`):
   - Describes array access operations
   - Shows accessed index and resulting value

6. **Error Handling**:
   - `IndexOutOfRange`: For negative or out-of-bounds indices
   - `TypeError`: For non-numeric indices or non-array objects
   - All errors follow RuntimeError pattern for proper frame generation

**Tests**: Comprehensive test coverage in `tests/javascript/arrays.test.ts`

- Valid access cases (first, middle, last elements)
- Variable and expression indices
- Out of bounds errors (negative and too high)
- Non-numeric index errors (strings, floats)
- Non-array access errors

**Chaining Support Added**:

- Full support for chained array access (e.g., `arr[0][1]`, `matrix[i][j]`)
- Parser uses while loop to handle multiple consecutive bracket operations
- Works with nested arrays of any depth
- Supports variable and expression indices in chains

**Tests Added for Chaining**:

- 2D and 3D array access
- Variable indices in chains
- Expression indices in chains
- Error handling in chains (out of bounds, non-array access)
- Mixed data types in nested arrays

**Known Limitations**:

- Only bracket notation, no dot notation yet
- Array modification not implemented

**Next Steps**:

- Implement array element assignment
- Add dot notation for object property access

## Template Literals Implementation (January 2025)

### Changes Made

Added full support for JavaScript template literals (backtick strings with interpolation):

**Features Added**:

- Template literals with backticks `` `text` ``
- String interpolation with `${expression}`
- Multi-line template literals
- Dollar sign literals (e.g., `` `Price: $100` ``)

**Implementation Details**:

1. **Scanner Updates** (`src/javascript/scanner.ts`):
   - Removed `BACKTICK`, `DOLLAR_LEFT_BRACE`, and `TEMPLATE_LITERAL_TEXT` from unimplemented tokens
   - Fixed infinite loop bug when dollar sign appears without interpolation
   - Added logic to include standalone `$` characters in template text

2. **Expression Class** (`src/javascript/expression.ts`):
   - Added `TemplateLiteralExpression` class with `parts` array
   - Parts can be strings (literal text) or Expressions (interpolations)

3. **Parser Updates** (`src/javascript/parser.ts`):
   - Added `parseTemplateLiteral()` method
   - Integrated template literal parsing in `primary()` method
   - Handles nested expressions within `${}` interpolations

4. **Executor Module** (`src/javascript/executor/executeTemplateLiteralExpression.ts`):
   - Evaluates each interpolated expression
   - Converts all values to strings (following JavaScript semantics)
   - Returns combined string result

5. **Describers** (`src/javascript/describers/describeTemplateLiteralExpression.ts`):
   - Describes evaluation of interpolated expressions
   - Shows final combined string result

**Known Limitations**:

- Escape sequences in template literals not fully supported (e.g., `` \` ``)
- Complex escape handling may need future refinement

**Tests**: 24 out of 27 tests passing in `tests/javascript/template-literals.test.ts`

## Strict Equality Operators Implementation (January 2025)

### Changes Made

Added support for strict equality operators (`===` and `!==`) with an `enforceStrictEquality` language feature:

**Features Added**:

- `===` (strict equality - no type coercion)
- `!==` (strict inequality - no type coercion)
- `enforceStrictEquality` language feature (default: true)

**Implementation Details**:

1. **Scanner Updates** (`src/javascript/scanner.ts`):
   - Removed `STRICT_EQUAL` and `NOT_STRICT_EQUAL` from unimplemented tokens list
   - Tokens were already being properly tokenized

2. **Parser Updates** (`src/javascript/parser.ts`):
   - Updated `equality()` method to handle `STRICT_EQUAL` and `NOT_STRICT_EQUAL` tokens
   - Same precedence level as `EQUAL_EQUAL` and `NOT_EQUAL`

3. **Executor Updates**:
   - Added `enforceStrictEquality` to `LanguageFeatures` interface
   - Default set to `true` in executor constructor
   - Added `StrictEqualityRequired` runtime error type
   - Updated `executeBinaryExpression.ts`:
     - When `enforceStrictEquality` is true, using `==` or `!=` throws error
     - `===` and `!==` perform strict equality (no type coercion)
     - Error format: `"StrictEqualityRequired: operator: =="`

4. **Tests** (`tests/javascript/language-features/strictEquality.test.ts`):
   - Comprehensive test coverage for both feature states
   - Tests for strict equality with different types
   - Tests for error cases when loose equality is used with enforcement
   - Tests for both loose and strict equality when feature is disabled

**Rationale**: This feature helps students learn the importance of strict equality in JavaScript by making it the default behavior, while still allowing loose equality when explicitly enabled for educational progression.

## Comparison Operators Implementation (January 2025)

### Changes Made

Added full support for comparison and equality operators to the JavaScript interpreter:

**Operators Added**:

- `>` (greater than)
- `<` (less than)
- `>=` (greater than or equal)
- `<=` (less than or equal)
- `==` (equality with type coercion)
- `!=` (inequality with type coercion)

**Implementation Details**:

1. **Parser Updates** (`src/javascript/parser.ts`):
   - Added `comparison()` method between `addition()` and `equality()` in precedence chain
   - Added `equality()` method between `comparison()` and `logicalAnd()`
   - Proper operator precedence: multiplication → addition → comparison → equality → logical

2. **Executor Updates** (`src/javascript/executor/executeBinaryExpression.ts`):
   - Added cases for all comparison operators in `handleBinaryOperation()`
   - Added `verifyNumbersForComparison()` helper for type checking
   - Comparison operators (`>`, `<`, `>=`, `<=`) require numbers
   - Equality operators (`==`, `!=`) use JavaScript's type coercion

3. **Error Handling**:
   - Added `ComparisonRequiresNumber` runtime error type
   - Comparison operators throw error when used with non-numbers
   - Error format: `"ComparisonRequiresNumber: operator: >: left: string"`

4. **Tests** (`tests/javascript/concepts/comparison.test.ts`):
   - Comprehensive test coverage for all operators
   - Tests for numbers (integers, decimals, negatives)
   - Tests for error cases with non-numbers
   - Tests for operator precedence and complex expressions
   - Tests for equality with type coercion

**Note**: Type coercion for comparison operators will be controlled by feature flags in future updates.

## Major Architecture Alignment (January 2025)

### Background

The JavaScript interpreter was extensively refactored to align with JikiScript's proven architecture patterns, ensuring consistent behavior and UI compatibility across all interpreters.

### Key Changes Made

**Before (Divergent Architecture)**:

- Complex `executeStatementsWithFrames()` function in interpreter
- Manual frame creation scattered throughout interpreter.ts
- Runtime errors returned as `{ error: RuntimeError }`
- Frame management mixed with execution logic
- Inconsistent error handling between parse and runtime errors

**After (Aligned Architecture)**:

- Clean separation: interpreter handles parsing, executor handles execution
- Frame management encapsulated within executor using `addFrame()` methods
- Runtime errors become error frames with `status: "ERROR"`
- Consistent `executeFrame()` wrapper pattern for all operations
- Parse errors as returned errors, runtime errors as frames

### Specific Implementation Changes

**1. Executor (`src/javascript/executor.ts`)**:

- Added `addFrame()`, `addSuccessFrame()`, `addErrorFrame()` methods
- Added `executeFrame()` wrapper for consistent frame generation
- Added `withExecutionContext()` for proper error boundaries
- Now always returns `error: null` (runtime errors become frames)

**2. Interpreter (`src/javascript/interpreter.ts`)**:

- Simplified to single `interpret()` function
- Removed complex `executeStatementsWithFrames()`
- Only handles parse errors as returned errors
- Clean separation between compile and execute phases

**3. Parser (`src/javascript/parser.ts`)**:

- Fixed `consumeSemicolon()` to return token for location tracking
- Fixed ExpressionStatement location to include semicolon in span
- Improved statement location accuracy for error reporting

**4. Tests**:

- Updated error tests to expect error frames instead of returned errors
- Added system language configuration for consistent error messages
- Fixed test expectations to match new error handling pattern

### Impact of Changes

- **Consistency**: JavaScript now matches JikiScript's proven architecture exactly
- **Maintainability**: Clear separation of concerns, easier to extend
- **Testability**: 313 tests passing with improved error handling
- **UI Compatibility**: Proper frame generation ensures UI integration works correctly

## Object System Evolution

### January 2025: File Standardization

- **File Rename**: `jsObjects.ts` → `jikiObjects.ts` for consistency across all interpreters
- **Field Standardization**: Removed duplicate `jsObject` field from `EvaluationResult`, kept only standardized `jikiObject` field

**Before (Duplicate Fields)**:

```typescript
type EvaluationResult = {
  type: string;
  jikiObject: JikiObject;
  jsObject: JikiObject; // ❌ Duplicate field - removed
};
```

**After (Standardized)**:

```typescript
type EvaluationResult = {
  type: string;
  jikiObject: JikiObject; // ✅ Single, consistent field
};
```

### Benefits Achieved

- Eliminated confusion about which field to use
- Consistent with JikiScript and Python interpreters
- Simplified cross-interpreter functionality maintenance

## Language Features Implementation

### Progressive Development

JavaScript interpreter supports configurable language features for educational purposes:

**allowShadowing Feature**:

- Controls whether variables in inner scopes can shadow outer variables
- When `false`: Runtime error "ShadowingDisabled" for shadowing attempts
- When `true`: Normal JavaScript shadowing behavior
- Educational benefit: Helps students understand scoping without confusion

### Implementation Timeline

- Basic expressions and operators (arithmetic, logical, comparison)
- Variable declarations with `let` keyword
- Block statements with lexical scoping
- If/else statement support with comprehensive testing
- Variable assignment operations with scope validation

## Test Coverage Evolution

### Current Test Status

- **313 tests passing** covering comprehensive functionality
- **Syntax Error Tests**: Comprehensive error coverage for invalid syntax
- **Runtime Error Tests**: Variable scoping, type operations, and validation
- **Concept Tests**: Feature-specific testing for variables, blocks, arithmetic
- **Integration Tests**: End-to-end interpretation validation

### Testing Patterns Established

- System language configuration for error message consistency
- Frame-based error validation following shared architecture
- Modular test organization matching executor architecture

## Error System Development

### Error Type Coverage

- **13 Syntax Error types**: Basic parsing and lexical errors
- **4 Runtime Error types**: Variable access, type operations, unsupported features
- Consistent system message format: `"ErrorType: context: {{variable}}"`

### Translation System

- Self-contained translation system with system/en language support
- Educational error messages tailored to JavaScript syntax
- Independent from other interpreters while following shared conventions

## Modular Architecture Implementation

### Executor Pattern

JavaScript follows the established modular executor pattern:

- Individual executor modules for each AST node type
- Consistent interface: `(executor: Executor, node: ASTNode) → EvaluationResult`
- Easy extensibility for new JavaScript features
- Clear separation between execution logic and frame management

### Current Executor Coverage

**Expression Executors**:

- Literal, Binary, Unary, Grouping, Identifier, Assignment expressions

**Statement Executors**:

- Expression statements, Variable declarations, Block statements, If statements

## Historical Context

### Why JavaScript Alignment Was Necessary

- **UI Compatibility**: Ensure consistent frame generation across all interpreters
- **Maintainability**: Eliminate architectural divergence that made maintenance difficult
- **Educational Consistency**: Provide uniform learning experience
- **Testing Reliability**: Establish consistent error handling patterns

### Lessons from Refactoring

- Early alignment prevents architectural divergence
- Consistent error handling is critical for UI integration
- Test coverage must be maintained during refactoring
- Clear separation of concerns improves maintainability

### Current Status

JavaScript interpreter now serves as a reference implementation alongside JikiScript:

- Follows shared architecture patterns exactly
- Maintains JavaScript-specific functionality while ensuring cross-interpreter consistency
- Provides educational JavaScript experience with frame-by-frame visualization
- Supports progressive language learning with configurable features

This evolution establishes JavaScript as a core component of the Jiki educational ecosystem with full architectural consistency.
