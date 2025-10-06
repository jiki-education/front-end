# JavaScript Interpreter

The JavaScript interpreter provides full ECMAScript execution within the Jiki educational environment, generating the same frame format as JikiScript for consistent UI visualization.

## Overview

This interpreter executes standard JavaScript code while producing educational frames that enable:

- **Step-by-step execution tracking**: Every expression and statement generates a frame
- **Variable state visualization**: Track how variables change through execution
- **Educational descriptions**: Plain-language explanations of JavaScript operations
- **Error context**: Detailed error information with educational feedback

## Architecture

The JavaScript interpreter follows the same pipeline as JikiScript and uses **shared components** for cross-interpreter consistency:

1. **Scanner**: Tokenizes JavaScript source code
2. **Parser**: Builds an Abstract Syntax Tree (AST)
3. **Executor**: Evaluates the AST and generates frames using shared frame system
4. **Describers**: Generate human-readable descriptions of execution steps

### Shared Components

The JavaScript interpreter leverages shared infrastructure from `src/shared/`:

- **`frames.ts`**: Unified frame system used by all interpreters for consistent UI integration
- **`jikiObject.ts`**: Abstract base class for all object representations

This ensures JavaScript execution frames are compatible with the same visualization tools used by JikiScript and future interpreters.

## Key Components

### Scanner

- Full JavaScript tokenization including keywords, operators, literals
- Support for comments, strings with escape sequences, numbers
- Location tracking for error reporting

### Parser

- Recursive descent parser for JavaScript syntax
- Expression and statement parsing
- Operator precedence handling
- Error recovery for educational feedback

### Executor

- Modular execution system with individual executors per expression type
- Environment-based variable scoping
- JSObject wrapping (extends shared JikiObject) for primitive tracking
- Frame generation using shared frame system at each execution step

### Describers

- Human-readable descriptions for each operation type
- Step-by-step explanations of complex expressions
- Educational context for errors and edge cases

## Frame Generation

The interpreter generates frames using the shared frame system from `src/shared/frames.ts`, ensuring compatibility with Jiki's UI and consistency across all interpreters:

```typescript
interface Frame {
  line: number;
  code: string;
  status: "SUCCESS" | "ERROR";
  result?: any;
  error?: any;
  time: number;
  timelineTime: number;
  description: string;
  context?: any;
  variables: Record<string, any>;
  data?: Record<string, any>;
}
```

JavaScript-specific extensions are handled through `frameDescribers.ts` which provides the `describeFrame()` function and interpreter-specific frame descriptions.

## Supported Features

### Current Implementation

- Arithmetic operations (+, -, \*, /, %)
- Unary operations (-, !, typeof)
- Update operations (++, -- in prefix and postfix forms)
- Comparison operators (<, >, <=, >=, ==, !=, ===, !==)
- Logical operators (&&, ||)
- Grouping expressions (parentheses)
- Literals (numbers, strings, booleans, null, undefined)
- Template literals with interpolation
- Comments (single-line and multi-line)
- Variable declarations with `let` keyword
- Variable access and assignment
- Block statements with lexical scoping
- Environment-based variable scoping with scope isolation
- Runtime errors for undefined variable references
- If/else statements with conditional execution
- For loops and while loops
- Arrays (lists) with:
  - Creation and index access
  - Property access (`.length`)
  - Method stubs (`.push`, `.pop`, etc. - return functions but not yet implemented)
  - Computed access restrictions (stdlib members require dot notation)
- Objects (dictionaries) with:
  - Literal syntax { key: value }
  - Property access (dot and bracket notation)
  - Property assignment
- Member access for arrays and objects
- **User-defined functions** (function declarations, return statements, closures)
- **External functions** (registered at initialization, receive ExecutionContext)
- **Standard library (stdlib)** with feature flag support

### Planned Features

- Additional variable declaration types (const, var)
- Full implementation of array methods (currently stubbed)
- Switch statements
- Do-while loops
- Arrow functions and function expressions
- Classes and prototypes
- Async/await
- Modules (import/export)

## Educational Features

### Descriptive Execution

Each operation generates a description explaining what's happening:

- "Evaluating binary expression: 2 + 3"
- "Comparing values: 5 > 3 evaluates to true"
- "Applying unary negation to 42"

### Progressive Complexity

The interpreter can be configured to enable/disable features based on learning level, similar to JikiScript's progressive syntax approach.

### Error Education

Errors include educational context:

- What went wrong
- Why it's an error
- How to fix it
- Related concepts to review

## Integration with Jiki

The JavaScript interpreter produces the same frame format as JikiScript, allowing:

- Consistent UI visualization across languages
- Language comparison for multi-language learning
- Shared educational tools and features
- Unified debugging experience
