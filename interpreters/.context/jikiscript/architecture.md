# JikiScript Architecture

The JikiScript interpreter follows a traditional compiler pipeline with educational enhancements at each stage.

## Pipeline Overview

```
Source Code → Scanner → Parser → Executor → Frames/UI
```

## Core Components

### 1. Scanner (`scanner.ts`)

- **Role**: Lexical analysis - converts source code into tokens
- **Input**: Raw JikiScript source code string
- **Output**: Array of tokens (identifiers, operators, keywords, literals)
- **Educational Features**:
  - Language feature filtering (can disable certain syntax)
  - Friendly syntax error messages
  - Token location tracking for error reporting

### 2. Parser (`parser.ts`)

- **Role**: Syntax analysis - builds Abstract Syntax Tree (AST)
- **Input**: Token stream from Scanner
- **Output**: AST of Expressions and Statements
- **Educational Features**:
  - Configurable syntax rules based on enabled language features
  - Rich error context and suggestions
  - Location tracking for debugging

### 3. Executor (`executor.ts` + `executor/`)

- **Role**: Interprets AST and generates execution frames
- **Input**: AST from Parser
- **Output**: Execution frames with variable states and descriptions

Uses modular architecture with specialized executors for each AST node type. Main Executor delegates to individual executor modules using visitor pattern. Includes Environment for scoping, ExecutionContext for runtime state, and Frame Generation.

#### Performance Optimizations

**Lazy Description Generation**: Frames include a `generateDescription()` function instead of pre-computed descriptions. This defers the expensive string generation until actually needed by the UI, resulting in ~9x performance improvement for large programs.

**Immutable Object Cloning**: JikiObjects support an `immutableJikiObject` field that provides a point-in-time immutable copy for frame generation. This avoids expensive deep cloning of objects during execution while maintaining correct state snapshots.

### 4. Support Systems

**AST Components**: Expressions (values/computations) and Statements (actions/control flow). Each type has dedicated executor and describer.

**Objects**: All extend shared `JikiObject` base class with JikiScript-specific types.

**Frame System**: Uses shared framework with JikiScript-specific educational descriptions for UI integration.

**Describers**: Generate human-readable explanations with localized educational context.

## Execution Flow

1. **Scanning**: Break source code into meaningful tokens
2. **Parsing**: Build AST respecting enabled language features
3. **Execution**: Walk AST while generating frames:
   - Track variable changes in Environment
   - Generate descriptive text for each step
   - Capture execution state at each frame
   - Handle educational error reporting
4. **Frame Output**: Provide structured data for Jiki UI consumption

## Educational Integration Points

- **Language Features**: Progressive syntax enabling/disabling
- **Error Handling**: Student-friendly error messages with suggestions
- **Execution Descriptions**: Plain-language explanations of code behavior
- **Variable Tracking**: Detailed state snapshots for debugging
- **Frame Generation**: Timeline data for interactive scrubbing

## Error Handling

### Logic Errors

JikiScript implements the **LogicError pattern** to allow custom functions (stdlib or external) to provide educational feedback when logic constraints are violated.

**Implementation Details:**

- **Class**: `LogicError` extends `Error` (src/jikiscript/error.ts:222)
- **Runtime Error Type**: `"LogicErrorInExecution"` (error.ts:138)
- **Executor Method**: `logicError(message: string)` throws LogicError (executor.ts:223-225)
- **ExecutionContext**: Includes `logicError` function for custom functions (executor.ts:1277)

**Catch Locations:**

- `executeGetterExpression.ts:38-40` - Property getters
- `executeMethodCallExpression.ts:61-63` - Method calls
- `executeChangePropertyStatement.ts:38-40` - Property setters
- `executeFunctionCallExpression.ts:92-94` - Function calls
- `executor.ts:1038-1040` - Statement execution wrapper

**Error Message Handling**: When `"LogicErrorInExecution"` is caught, the error message is used directly (no i18n translation) in executor.ts:1302-1303

**Example Usage** (from stdlib.ts:134-138):

```typescript
function toNumber(executionCtx: ExecutionContext, str: JikiString): Number {
  const num = Number(str.value);
  if (isNaN(num)) {
    executionCtx.logicError(
      `Could not convert the string to a number. Does <code>${JSON.stringify(
        str.value
      )}</code> look like a valid number?`
    );
  }
  return new Number(num);
}
```
