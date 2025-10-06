# Jiki Interpreter Evolution History

This document tracks the historical development, major changes, and architectural evolution of the Jiki interpreter ecosystem. It preserves point-in-time information that provides context for understanding how the system evolved but is not essential for current development.

## Major Architectural Changes

### October 2025: Removal of Executor Location Tracking

**Date**: 2025-10-03

**Problem**: All executors maintained a `private location: Location` field that was updated during statement execution to provide broad statement context for error frames. This created complexity and didn't provide the precision needed for educational error reporting.

**Solution**: Removed the `this.location` tracking field from all executors. Error frames now use precise error locations (`error.location`) that point to the exact sub-expression where errors occurred.

**Changes Made**:

1. **Executor Simplification**:
   - Removed `private location: Location` field from all executors (JikiScript, JavaScript, Python)
   - Removed location setting/resetting logic in `executeFrame()` wrapper
   - All error creation now relies on `error.location` for precise error reporting

2. **Location Parameter Standardization**:
   - Changed all location parameters from `Location | null` to non-nullable `Location`
   - Introduced `Location.unknown` as fallback for cases where location is unavailable
   - Simplified error handling code by removing null checks

3. **Improved Error Precision**:
   - Error frames now point to exact sub-expression where error occurred
   - More helpful for students understanding where in their code the problem exists
   - Reduced confusion from broad statement-level error locations

**Files Affected**:

- All executor files (`src/*/executor.ts`)
- Error handling modules across all interpreters
- Documentation in `.context/shared/interpreter-architecture.md`
- Documentation in `.context/shared/common-issues.md`

**Benefits**:

- **Simpler Code**: Removed state management complexity from executors
- **Better Precision**: Error locations now point to exact problem location
- **Clearer Intent**: Location handling is explicit, not implicit through state
- **Easier Maintenance**: Fewer moving parts in executor state management

**Migration Notes**: This change required updating approximately 50+ error creation call sites across all three interpreters to ensure proper location handling.

### January 2025: LogicError Pattern Standardization

**Date**: January 2025

**Problem**: Custom functions (stdlib and external) needed a way to throw educational, human-readable error messages that would be displayed directly to students without i18n translation. This was initially only implemented in JikiScript.

**Solution**: Standardized the LogicError pattern across all interpreters (JikiScript, JavaScript, Python):

**Implementation**:

1. Added `LogicError` class extending `Error` to each interpreter's error.ts
2. Added `"LogicErrorInExecution"` to RuntimeErrorType enum for each interpreter
3. Added `logicError(message: string)` method to each executor
4. Integrated `logicError` function into ExecutionContext for custom functions
5. Added catch handling in function/method call execution and statement execution
6. Special-cased error message handling to use direct message instead of translation

**Use Cases**:

- Type conversion failures (e.g., `toNumber("abc")`)
- Game logic violations (e.g., maze character walking off edge)
- Domain-specific constraints requiring specific feedback

**Example Usage**:

```typescript
function moveCharacter(ctx: ExecutionContext, direction: string) {
  if (isOffEdge(direction)) {
    ctx.logicError("You can't walk through walls! The character is at the edge of the maze.");
  }
  // ... normal logic
}
```

**Files Affected**:

- `.context/shared/interpreter-architecture.md` - Added Logic Error Pattern section
- `.context/jikiscript/architecture.md` - Documented JikiScript implementation
- `src/javascript/error.ts` - Added LogicError class
- `src/javascript/executor.ts` - Added logicError method and ExecutionContext integration
- `src/javascript/executor/executeCallExpression.ts` - Added LogicError catch handling
- `src/python/error.ts` - Added LogicError class
- `src/python/executor.ts` - Added logicError method and ExecutionContext integration
- `src/python/executor/executeCallExpression.ts` - Added LogicError catch handling
- `src/shared/interfaces.ts` - Added optional logicError to ExecutionContext interface
- `tests/javascript/external-functions.test.ts` - Added LogicError test
- `tests/python/external-functions.test.ts` - Added LogicError test

**Benefits**: Consistent error handling pattern across all interpreters, enables educational feedback for custom function logic violations, maintains JikiScript's existing implementation while extending to JS/Python.

### January 2025: Object Field Standardization

**Problem**: The three interpreters had inconsistent object field naming in their `EvaluationResult` types:

- JikiScript: Used `jikiObject: JikiObject` (consistent)
- JavaScript: Used `jikiObject: JikiObject` + `jsObject: JikiObject` (duplicate fields)
- Python: Used `jikiObject: JikiObject` + `pyObject: JikiObject` (duplicate fields)

**Solution**: All interpreters now use a single, standardized `jikiObject` field:

```typescript
type EvaluationResult = {
  type: string;
  jikiObject: JikiObject; // Single field for all interpreters
};
```

**Files Affected**:

- All `evaluation-result.ts` files in each interpreter
- All executor files in `src/*/executor/` directories
- All describer files that access object properties
- Object definition files (renamed: `jsObjects.ts` → `jikiObjects.ts`, `pyObjects.ts` → `jikiObjects.ts`, `jikiObjects.ts` → `objects.ts`)
- All test files that accessed `.jsObject` or `.pyObject` properties

**Benefits**: Consistency across all interpreters, elimination of potential confusion, easier cross-interpreter maintenance.

### January 2025: JavaScript & Python Architecture Alignment

**Background**: JavaScript and Python interpreters were refactored to align with JikiScript's proven architecture patterns.

**JavaScript Changes**:

- Removed complex `executeStatementsWithFrames()` function
- Added proper `addFrame()`, `addSuccessFrame()`, `addErrorFrame()` methods to executor
- Fixed `consumeSemicolon()` to return token for location tracking
- Updated 313 tests to expect error frames instead of returned errors

**Python Changes**:

- Simplified interpreter to single `interpret()` function
- Added `executeFrame()` wrapper pattern
- Updated system messages from `"Undefined variable '{{name}}'"` to `"UndefinedVariable: name: {{name}}"`
- 128 tests passing with improved error handling

### Shared Components Creation

**Timeline**: During JikiScript and JavaScript development

**Components Created**:

- `src/shared/frames.ts`: Unified frame system
- `src/shared/jikiObject.ts`: Abstract base class for all objects

**Migration Process**:

1. Analyzed common patterns between JikiScript and JavaScript
2. Created abstractions and shared base classes
3. Updated interpreters to extend shared components
4. Maintained compatibility and test coverage
5. Added JavaScript `describeFrame` functionality

## Error System Evolution

### JikiScript: Foundation Implementation

- Established definitive error naming standard with 178+ error types
- Created comprehensive translation system with system/en language support
- Implemented most granular error identification across all interpreters

### Cross-Interpreter Standardization

- JavaScript and Python adopted JikiScript's error naming patterns
- All interpreters now use consistent system message format
- Error translation structure standardized across all interpreters

## Testing Evolution

### Test Coverage Growth

- **JikiScript**: 178+ error types with comprehensive test coverage
- **JavaScript**: 313 tests covering modular executor architecture
- **Python**: 158 tests including complex control flow (if/elif/else)

### Testing Pattern Standardization

- System language configuration for consistent error message testing
- Shared testing utilities across interpreters
- Frame-based error validation patterns

## File Organization Changes

### File Renames (January 2025)

- `src/javascript/jsObjects.ts` → `src/javascript/jikiObjects.ts`
- `src/python/pyObjects.ts` → `src/python/jikiObjects.ts`
- `src/jikiscript/jikiObjects.ts` → `src/jikiscript/objects.ts`

### Documentation Reorganization

- Consolidated shared architecture documentation
- Created interpreter-specific architecture documents
- Established evolution tracking (this document)

## Migration Checklist (Historical Reference)

When updating an interpreter to follow shared architecture:

- [ ] Executor returns `error: null` for runtime errors
- [ ] Runtime errors become error frames with `status: "ERROR"`
- [ ] Parse errors are returned as `error` with empty frames
- [ ] Statement locations include full statement span
- [ ] Error tests use system language configuration
- [ ] Error messages use system format
- [ ] Frame structure matches shared interface
- [ ] All objects extend shared JikiObject base class
- [ ] Tests follow consistent patterns

## Historical Context

### Why These Changes Were Made

- **UI Compatibility**: Ensuring all interpreters generate compatible frame formats
- **Maintainability**: Reducing code duplication and standardizing patterns
- **Educational Consistency**: Providing uniform learning experience across languages
- **Testing Reliability**: Establishing consistent test patterns and error handling

### Lessons Learned

- Early standardization of shared components prevents divergent architectures
- Consistent error handling is critical for UI integration
- Test coverage must be maintained during architectural refactoring
- Point-in-time documentation should be separated from current architecture guides

This historical context helps understand architectural decisions but is not required for current development. Current patterns are documented in the main architecture files.

## 2025-01-28: External Functions and Success Flag Standardization

### Changes Made

1. **External Function Support Enhancement**
   - Added `PyCallable` and `JSCallable` classes extending JikiObject
   - External functions now stored as callable objects in environment
   - Removed separate external function registries
   - Added `FunctionExecutionError` for when external functions throw
   - Added comprehensive tests for error scenarios

2. **Success Flag Standardization**
   - Fixed JavaScript executor to return `success: false` when error frames exist
   - Previously JavaScript always returned `success: true` regardless of errors
   - Now both Python and JavaScript use: `success: !this.frames.find(f => f.status === "ERROR")`
   - Updated ~20 test files to expect correct success values

3. **Test Setup Simplification**
   - Global test setup (`tests/setup.ts`) already sets all interpreters to "system" language
   - Removed redundant `changeLanguage("system")` calls from individual test files
   - This simplifies test maintenance and reduces boilerplate

### Impact

These changes ensure consistent behavior between JavaScript and Python interpreters, particularly around error handling and external function integration. The success flag fix was critical for proper UI integration, as the UI relies on this flag to determine if execution completed successfully.
