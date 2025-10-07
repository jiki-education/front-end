# Python Interpreter Evolution History

This document tracks the historical development and changes specific to the Python interpreter.

## 2025-10-07: Improved Error Handling for Unclosed Function Calls

### Overview

Enhanced Python parser to provide specific, educational error messages when function call parentheses are not closed, fixing a critical bug where errors pointed to the wrong line number.

### Problem Identified

When parsing `move()\nmove(\nmove()`, the Python parser would:

1. Report generic `MissingExpression` error (not specific)
2. **Point to line 3 instead of line 2** where the error actually is
3. Provide no context about which function or what went wrong

**Root Cause**: When `finishCallExpression` called `this.expression()` after an unclosed `(`, the expression parser would consume the NEWLINE and advance to the next line. When parsing failed, `peek().location` pointed to line 3, not line 2 where the unclosed parenthesis actually was.

### Changes Applied

**1. New Error Type** (`src/python/error.ts`):

- Added `MissingRightParenthesisAfterFunctionCall` error type
- Replaces generic `MissingExpression` in function call contexts

**2. Parser Enhancement** (`src/python/parser.ts` lines 728-759):

- Early detection: Checks for NEWLINE or EOF immediately after opening `(`
- Extracts function name from callee for error context
- Reports error at **callee.location** (not `peek().location`)
- This ensures error points to line 2 (the function with unclosed paren), not line 3

**3. Translation Updates**:

- `en/translation.json`: "Did you forget the closing parenthesis ')' when calling the {{function}} function?"
- `system/translation.json`: "MissingRightParenthesisAfterFunctionCall: function: {{function}}"

**4. Comprehensive Test Suite** (`tests/python/syntaxErrors.test.ts`):

- 14 new tests covering all edge cases
- Single line, multi-line, nested calls
- Various function names and argument patterns

### Technical Details

**Why the Line Number Was Wrong**:

For code `move()\nmove(\nmove()`:

1. Parser enters `finishCallExpression` for line 2's `move(`
2. Sees no RIGHT_PAREN, calls `this.expression()` to parse arguments
3. `expression()` eventually consumes NEWLINE and advances to line 3
4. Tries to parse line 3's `move()` as an argument expression
5. Parsing fails somewhere on line 3
6. `consume("RIGHT_PAREN")` uses `peek().location` which points to line 3

**The Fix**:

Check for NEWLINE/EOF immediately after `(` and report error at `callee.location` (line 2), before calling `expression()`.

### Impact

**Before**:

```python
move()
move(
move()
→ Error: MissingExpression (line 3 ❌, generic, no context)
```

**After**:

```python
move()
move(
move()
→ Error: MissingRightParenthesisAfterFunctionCall (line 2 ✓, function: "move")
```

### Test Results

- All 546 Python tests passing
- 14 new syntax error tests added
- Error quality now matches JikiScript and JavaScript

### Educational Benefits

- Students get clear, actionable error messages
- **Error points to correct line** where the problem actually is
- Function name in context helps identify which call has the issue
- Consistent error quality across all three interpreters

## 2025-10-05: Builtin Functions - print() Implementation

### Overview

Implemented `print()` as the first global builtin function in Python. This establishes the infrastructure for all future builtin functions (e.g., `len()`, `range()`, etc.) and provides students with essential output functionality.

### Implementation Details

**Builtin Functions Architecture** (`src/python/stdlib/builtin/`):

- Created new `builtin/` directory under stdlib for global functions
- `print.ts`: Defines the `print` builtin function
  - Accepts variable arguments: `arity: [0, Infinity]`
  - Returns `PyNone` (Python's `None`)
  - Includes optional `getOutput()` function for describers
  - Converts all arguments to strings and joins with spaces (Python default behavior)
- `builtin/index.ts`: Exports builtin functions registry

**BuiltinFunction Interface**:

```typescript
interface BuiltinFunction {
  arity: number | [number, number];
  call: (ctx: ExecutionContext, args: JikiObject[]) => JikiObject;
  description: string;
  getOutput?: (args: JikiObject[]) => string; // For functions like print()
}
```

**Executor Integration** (`src/python/executor.ts`):

- Added automatic registration of builtin functions in constructor
- Builtins wrapped as `PyStdLibFunction` objects for consistency
- Registered in global environment before external functions
- Supports attaching `getOutput` function to function objects for describers

**Describer Enhancement** (`src/python/describers/describeCallExpression.ts`):

- Special case handling for `print()` to show output clearly
- Describes what was printed, not just what arguments were passed
- Examples:
  - `print()` → "printed a blank line"
  - `print("Hello")` → "printed `Hello`"
  - `print("Hello", "World")` → "printed `Hello World`"

**Testing** (`tests/python/builtin.test.ts`):

- 13 comprehensive tests covering all print() use cases
- Tests various argument types: strings, numbers, booleans, None, lists
- Tests multiple arguments and expression evaluation
- Validates description output format

### Technical Decisions

1. **PyStdLibFunction vs PyCallable**: Used `PyStdLibFunction` for consistency with stdlib methods rather than creating a new callable type
2. **Output Storage**: Used `getOutput()` function approach rather than frame data to keep describers pure
3. **Module Organization**: Created `builtin/` subdirectory to clearly separate global functions from type-specific methods

### Future Extensibility

This implementation provides the pattern for adding more builtin functions:

- `len()` - returns length of sequences
- `range()` - generates number sequences for loops
- `type()` - returns type of object
- `str()`, `int()`, `float()` - type conversion functions

## 2025-10-03: User-Defined Functions Implementation

### Overview

Implemented complete support for user-defined functions in Python, including function declaration (`def`) and return statements. This enables students to learn function concepts with Jiki's frame-by-frame visualization.

### Core Implementation

**AST Nodes** (`src/python/statement.ts`):

- `FunctionDeclaration`: Represents `def` statements with name, parameters, and body
- `ReturnStatement`: Represents `return` statements with optional expression
- `FunctionParameter`: Represents function parameter declarations

**Callables** (`src/python/functions.ts`):

- `PyUserDefinedFunction`: Extends `PyCallable` base class for user-defined functions
  - Stores function declaration AST
  - Provides `getDeclaration()` accessor for execution
  - Returns `<function name>` string representation
- `ReturnValue`: Exception class for unwinding call stack on return
  - Contains return value as JikiObject
  - Includes location for error reporting

**Execution Modules**:

- `executeFunctionDeclaration.ts`: Creates `PyUserDefinedFunction` and binds to environment
- `executeReturnStatement.ts`: Evaluates return value and throws `ReturnValue` exception
- `executeCallExpression.ts`: Enhanced to handle user-defined function calls:
  - Creates new environment chained to function's parent (closure support)
  - Binds parameters to argument values
  - Executes function body statements
  - Catches `ReturnValue` exceptions for return flow
  - Returns None for functions without explicit return

**Parser Enhancements** (`src/python/parser.ts`):

- Added `functionDeclaration()` method for parsing `def` statements
- Handles Python syntax: `def name(params): NEWLINE INDENT body DEDENT`
- Validates duplicate parameter names
- Added `returnStatement()` method for parsing `return` statements
- **Critical Fix**: Refactored entire parser error handling system to match JikiScript canonical pattern:
  - `consume()` signature changed from `(TokenType, string)` to `(TokenType, SyntaxErrorType, context?)`
  - `error()` now uses `translate()` for i18n instead of hardcoding "ParseError"
  - Updated all 17+ `consume()` calls throughout parser
  - Fixed broken parser error reporting that was masking specific error types

**Error Types** (`src/python/error.ts`):

- Added function-specific errors: `MissingFunctionName`, `MissingLeftParenthesisAfterFunctionName`, `MissingParameterName`, `MissingRightParenthesisAfterParameters`, `MissingColonAfterFunctionSignature`, `DuplicateParameterName`, `ReturnOutsideFunction`
- Added generic parser errors: `MissingExpression`, `MissingIdentifier`, `MissingIn`, `MissingColon`, `MissingIndent`, `IndentationError`

**Frame Generation**:

- Added `describeReturnStatement.ts` describer for educational frame descriptions
- Return statements generate frames showing return value or void return

**Evaluation Results** (`src/python/evaluation-result.ts`):

- Added `EvaluationResultReturnStatement` type with expression and jikiObject fields

### Python-Specific Implementation Details

**Syntax Handling**:

- Python uses `def name(params):` followed by NEWLINE INDENT body DEDENT
- Contrast with JavaScript's `function name(params) {}` with braces
- Parser consumes COLON after function signature
- Parser handles optional NEWLINE before indented body block

**Scope and Closures**:

- Functions create new environment chained to current environment
- Enables proper closure support and LEGB scope resolution
- Parameters bound to new environment before body execution
- Environment restored after function execution completes

**Return Behavior**:

- Explicit `return value` evaluates expression and returns as JikiObject
- Explicit `return` (no value) returns None
- Implicit return (reaching end of function) returns None
- All return paths use `ReturnValue` exception for stack unwinding

### Breaking Changes and Test Updates

**Parser Error Refactor Impact**:

- All existing parser tests expecting error message strings updated to expect error types
- Updated 4 tests in `tests/python/parser/for.test.ts` to expect error types
- Updated 3 tests in `tests/python/parser/if.test.ts` to expect error types
- Updated 5 tests in `tests/python/syntaxErrors/variables.test.ts` to expect error types

**Scanner Test Updates**:

- Removed `def` and `return` from unimplemented token tests
- Commented out function definition test (def is now implemented)

### Test Coverage

**New Test Suite** (`tests/python/functions.test.ts`): 16 comprehensive tests

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

- Missing function name after `def`
- Missing parentheses around parameters
- Missing colon after function signature
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

**Added translations** in `src/python/locales/en/translation.json` and `system/translation.json`:

- All function-specific error messages with context placeholders
- Generic parser error messages for improved error reporting
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

**Code Quality**:

- Parser error handling now matches canonical JikiScript pattern
- Improved error specificity (no more generic "ParseError")
- Better maintainability through consistent error handling

**Test Results**:

- All 1927 tests passing | 49 skipped
- Python functions: 16/16 tests passing
- No regressions from parser refactor

### Future Enhancements

Potential additions for future development:

- Default parameter values
- Keyword arguments
- Variable-length argument lists (\*args)
- Keyword argument dictionaries (\*\*kwargs)
- Lambda expressions
- Decorators

This implementation establishes Python functions as a core educational feature with complete visualization support and robust error handling.

## 2025-10-03: Removal of Executor Location Tracking

- **Removed**: `private location: Location` field from Python executor
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
- **Impact**: Updated approximately 15+ error creation sites across Python executor modules

## 2025-10-03: Compile Function with CompilationResult Pattern

- **Added**: `compile()` function for parse-only validation
- **Implementation**:
  - New `compile()` function in `src/python/interpreter.ts`
  - Parses source code without executing it
  - Returns `{ success: true }` on successful compilation
  - Returns `{ success: false, error: SyntaxError }` on parse/syntax errors
  - Clean API: `compile(sourceCode, context)` with no fileName parameter
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
- **API Symmetry**: Perfect API consistency across all three interpreters (JikiScript, JavaScript, Python)
- **Test Coverage**: 22 comprehensive tests covering success cases, syntax errors, language features, and edge cases

## 2025-10-03: fileName Parameter Removal

- **Removed**: Unnecessary `fileName` parameter from Python interpreter pipeline
- **Changes Made**:
  - Removed `fileName` parameter from `Scanner` constructor
  - Removed `fileName` parameter from `Parser` constructor
  - Removed `fileName` parameter from `interpret()` function
  - Updated all parser tests to remove fileName argument
- **Rationale**:
  - No functional need for fileName in parsing or execution
  - Improved API symmetry with JavaScript and JikiScript
  - Simplified API surface
  - Reduced complexity without losing functionality
- **Impact**:
  - All 1899 tests passing
  - Cleaner, more consistent API across interpreters
  - Simplified constructor signatures throughout the pipeline

## Modular Description System Implementation (January 2025)

### Background

The Python interpreter's description system was refactored from a monolithic approach to a modular architecture matching the JavaScript interpreter pattern, improving maintainability and educational value.

### Changes Made

**Before**:

- Single `generateDescription()` method in executor.ts with 80+ lines of switch statements
- Hardcoded string concatenations for descriptions
- Mixed concerns between execution and description generation
- No structured format for educational content

**After**:

- Modular describer system with central dispatcher (`frameDescribers.ts`)
- Individual describer files for each AST node type in `src/python/describers/`
- Structured `Description` objects with HTML-formatted result and steps
- Clean separation of concerns between execution and description
- Consistent use of `immutableJikiObject` for point-in-time state snapshots
- Lazy description generation for performance optimization

### Impact

- **Performance**: ~9x improvement through lazy description generation
- **Maintainability**: Each describer is isolated and testable
- **Educational Value**: Structured HTML output with clear "What happened" and "Steps Python Took" sections
- **Consistency**: Aligned with JavaScript interpreter patterns for UI compatibility

## Major Architecture Alignment (January 2025)

### Background

The Python interpreter was extensively refactored to align with the shared architecture patterns established by JikiScript and JavaScript, ensuring consistent behavior across all interpreters.

### Key Changes Made

**Before (Old Architecture)**:

- Manual frame creation scattered throughout interpreter.ts
- Runtime errors returned as `{ error: RuntimeError }`
- Complex frame generation logic mixed with execution logic
- Inconsistent error handling between parse and runtime errors

**After (Aligned Architecture)**:

- Clean separation: interpreter handles parsing, executor handles execution
- Frame management encapsulated within executor using `addFrame()` methods
- Runtime errors become error frames with `status: "ERROR"`
- Consistent `executeFrame()` wrapper pattern for all operations
- Parse errors as returned errors, runtime errors as frames

### Specific Implementation Changes

**1. Executor (`src/python/executor.ts`)**:

- Added `addFrame()`, `addSuccessFrame()`, `addErrorFrame()` methods
- Added `executeFrame()` wrapper for consistent frame generation
- Added `withExecutionContext()` for proper error boundaries
- Now always returns `error: null` (runtime errors become frames)

**2. Interpreter (`src/python/interpreter.ts`)**:

- Simplified to single `interpret()` function
- Removed manual frame creation logic
- Only handles parse errors as returned errors
- Clean separation between compile and execute phases

**3. System Messages (`src/python/locales/system/translation.json`)**:

- Updated error message format to match shared pattern
- Changed from `"Undefined variable '{{name}}'"` to `"UndefinedVariable: name: {{name}}"`

**4. Tests**:

- Updated error tests to expect error frames instead of returned errors
- Maintained system language configuration for consistent error messages
- Fixed test expectations to match new error handling pattern

### Impact of Changes

- **Consistency**: Python now matches JikiScript and JavaScript architecture exactly
- **UI Compatibility**: Proper frame generation ensures seamless UI integration
- **Testability**: All 128 Python tests passing with improved error handling
- **Maintainability**: Clear separation of concerns, easier to extend

## Object System Evolution

### January 2025: File Standardization

- **File Rename**: `pyObjects.ts` → `jikiObjects.ts` for consistency across all interpreters
- **Field Standardization**: Removed duplicate `pyObject` field from `EvaluationResult`, kept only standardized `jikiObject` field

**Before (Duplicate Fields)**:

```typescript
type EvaluationResult = {
  type: string;
  jikiObject: JikiObject;
  pyObject: JikiObject; // ❌ Duplicate field - removed
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
- Consistent with JikiScript and JavaScript interpreters
- Simplified cross-interpreter functionality maintenance

## Implementation Status Evolution

### Core Features Implemented

**Fully Functional Status**: Core Python features implemented and tested

**Current Implementation Coverage**:

- **Numeric Literals**: Integer and floating-point numbers with scientific notation
- **Boolean Literals**: True/False values with logical operations
- **String Literals**: Single and double quoted strings with concatenation
- **Arithmetic Operations**: All Python operators (+, -, \*, /, //, %, \*\*)
- **Comparison Operations**: All comparison operators (>, >=, <, <=, ==, !=)
- **Logical Operations**: Python logical operators (and, or, not)
- **Grouping Expressions**: Parentheses for precedence control
- **Variable System**: Assignment (x = value) and access with proper scoping
- **Unary Negation**: Negation operator (-) for numbers and expressions
- **Control Flow**: Complete if/elif/else statement support with proper indentation
- **Code Blocks**: Python-style indented blocks with 4-space enforcement
- **Runtime Error Handling**: Undefined variable detection and educational messages
- **Scanner**: Complete tokenization including INDENT/DEDENT tokens
- **Parser**: Recursive parser with Python operator precedence
- **Executor**: Modular execution system
- **PyObjects**: Python-specific objects (PyNumber, PyString, PyBoolean)
- **Frame Generation**: Educational step-by-step execution visualization

## Test Coverage Evolution

### Historical Test Numbers

- **158 tests passing** with comprehensive coverage including control flow
- **Concept Tests**: 158 comprehensive tests covering all implemented features
  - Numbers: 5 tests for integer, float, and scientific notation parsing
  - Booleans: 18 tests for True/False literals and logical operations
  - Strings: 16 tests for single/double quotes and concatenation
  - Operations: 30 tests for arithmetic, comparison, logical, and precedence
  - Variables: 22 tests for assignment, access, reassignment, and complex expressions
  - Negation: 17 tests for basic negation, nested negation, and precedence rules
  - If Statements: 30 tests for if/elif/else parsing and execution with indentation
- **Syntax Error Tests**: 14 tests for undefined variables and invalid assignments
- **Parser Tests**: 13 tests for if statement parsing including error cases
- **Integration Tests**: End-to-end Python interpretation
- **Error Tests**: Proper error handling with Python-specific messages

## Python-Specific Features Development

### Indentation Handling

Python's error system includes specific error types for indentation:

- `IndentationError`: General indentation problems
- `UnexpectedIndentation`: Incorrect indentation structure
- 4-space enforcement for educational consistency

### Variable Scoping Implementation

Python implements LEGB (Local, Enclosing, Global, Built-in) scope resolution pattern for future function support.

### Python Syntax Support

- **Operator Precedence**: Python-specific precedence including power operator (\*\*)
- **Python Keywords**: and, or, not, True, False, None
- **Indented Blocks**: Python-style code blocks with proper tokenization

## Modular Architecture Implementation

### Executor Pattern

Python follows the established modular executor pattern:

- Individual executor modules for each AST node type
- Consistent interface: `(executor: Executor, node: ASTNode) → EvaluationResult`
- Complete coverage of implemented language constructs

**Current Executor Coverage**:
**Expression Executors**: Literal, Binary, Unary, Grouping, Identifier expressions
**Statement Executors**: Expression statements, Assignment statements, If statements, Block statements

## Error System Development

### Error Type Coverage

- **12 Syntax Error types**: Python-specific parsing and lexical errors
- **4 Runtime Error types**: Variable access, type operations, undefined variables
- Python-specific indentation error handling
- System message format: `"ErrorType: context: {{variable}}"` or `"Undefined variable '{{name}}'"`

### Translation System

- Self-contained translation system with system/en language support
- Python-specific error messages tailored to Python syntax and conventions
- Independent architecture while following shared naming conventions

## Historical Context

### Why Python Architecture Alignment Was Necessary

- **UI Compatibility**: Ensure consistent frame generation across all interpreters
- **Maintainability**: Eliminate architectural divergence
- **Educational Consistency**: Provide uniform learning experience across languages
- **Testing Reliability**: Establish consistent error handling patterns

### Lessons from Development

- Modular architecture enables rapid feature implementation
- Consistent error handling is critical for educational effectiveness
- Python-specific features (indentation, keywords) require specialized handling
- Cross-interpreter standardization improves maintainability

### Current Status

Python interpreter now serves as the third major interpreter in the Jiki ecosystem:

- Follows shared architecture patterns exactly
- Implements Python-specific syntax and semantics correctly
- Provides educational Python experience with frame-by-frame visualization
- Supports comprehensive Python language features for educational use

### Future Development

**Planned Features**:

- Loops (while, for statements)
- Functions and advanced scoping
- Data structures (lists, dictionaries, tuples)

This evolution establishes Python as a fully integrated component of the Jiki educational ecosystem with complete architectural consistency and comprehensive Python language support.

## Type Coercion Language Feature (January 2025)

### Implementation Overview

Added `allowTypeCoercion` language feature flag to control type coercion behavior in arithmetic operations.

### Feature Details

**Default Behavior (allowTypeCoercion: false)**:

- Only allows operations between same types (string + string, number + number)
- String multiplication works with numbers (`"hi" * 3 = "hihihi"`)
- Boolean arithmetic operations throw `TypeCoercionNotAllowed` errors
- Matches educational mode to prevent confusing implicit conversions

**When Enabled (allowTypeCoercion: true)**:

- Allows Python-style boolean coercion (True = 1, False = 0)
- String + number still throws error (Python doesn't coerce)
- String repetition continues to work (`"hi" * 3`)
- Matches standard Python behavior for most operations

### Implementation Changes

**1. Binary Expression Handler Refactor**:

- Split large `handleBinaryOperation` function into individual handlers
- `handlePlusOperation`, `handleMinusOperation`, `handleMultiplyOperation`, etc.
- Improved maintainability and readability

**2. Python-Specific Behaviors**:

- String repetition supported even with type coercion disabled
- String + number operations never allowed (matches Python)
- Boolean arithmetic allowed only when type coercion is enabled

**3. Error Handling**:

- Added `TypeCoercionNotAllowed` to runtime error types
- Comprehensive error messages with operator and type context
- Consistent with existing error format patterns

**4. String Multiplication Support**:

- `"hello" * 3` produces `"hellohellohello"`
- `3 * "hello"` also works (Python allows both forms)
- Works in both allowTypeCoercion modes (Python native feature)

### Test Coverage

**54 comprehensive tests** covering:

- Type coercion disabled (default): All mixed-type operations throw errors
- Type coercion enabled: Boolean arithmetic works, string+number still errors
- String repetition: Works in both modes
- Complex expressions: Proper error propagation
- Variable interactions: Type checking with stored values

### Technical Details

**Modular Implementation**:

- Each operator handled by dedicated function
- Type checking before operation execution
- Consistent error message formatting
- Proper Python semantics preservation

**Python Compliance**:

- Follows Python's type coercion rules exactly
- String + number never works (unlike JavaScript)
- Boolean treated as integer when coercion enabled
- String repetition as native Python feature

This implementation provides educational control over type coercion while maintaining Python semantic accuracy.
