# Python Interpreter Architecture

Follows shared interpreter architecture with Python-specific implementations.

## Component Details

### 1. Scanner (`src/python/scanner.ts`)

Tokenizes Python source code into a stream of tokens.

**Responsibilities:**

- Lexical analysis of Python syntax
- Token generation with location tracking
- Comment handling (preserved for educational context)
- String parsing with Python-specific features (single/double quotes, triple quotes)
- Number parsing (integers, floats, scientific notation)
- Keyword and identifier recognition

Supports Python tokens including single/multi-character operators, literals, keywords, and identifiers.

### 2. Parser (`src/python/parser.ts`)

Builds an Abstract Syntax Tree (AST) from tokens using recursive descent parsing.

**AST Nodes**: Literals, binary/unary expressions, grouping, identifiers, list expressions, subscript expressions, expression/assignment statements, if/elif/else statements, for-in statements, while statements, break/continue statements, indented block statements.

Python-specific operator precedence from grouping through logical OR, including power operator.

### 3. Executor (`src/python/executor.ts`)

Evaluates the AST and generates execution frames.

Modular executor architecture with dedicated modules for each AST node type. Main executor coordinates specialized executor functions with consistent interfaces.

**Performance Optimizations:**

- **Lazy description generation**: Frames include a `generateDescription()` function instead of pre-computed descriptions, deferring expensive string generation until needed
- **Test-only augmentation**: In test environments (`NODE_ENV=test`), frames are augmented with `variables` and `description` fields for backward compatibility

### 4. Frame Describers (`src/python/frameDescribers.ts` & `src/python/describers/`)

**Modular Description System** (Aligned with JavaScript pattern as of 2025-01)

- **Central Dispatcher**: `frameDescribers.ts` acts as the main dispatch system for frame descriptions
- **Individual Describers**: Each AST node type has its own describer file in `src/python/describers/`
- **Description Format**: Returns structured `Description` objects with:
  - `result`: HTML-formatted summary of what happened
  - `steps`: Array of HTML-formatted step-by-step explanations
- **Lazy Generation**: Descriptions are generated on-demand via `generateDescription()` functions

### 5. Standard Library (`src/python/stdlib/`)

**Modular Stdlib Architecture** (Implemented 2025-01)

- **Type-Based Organization**: Each Python type has its own directory (`list/`, `string/`, etc.)
- **Method-Per-File Pattern**: Each method/property is in its own file for maintainability
  - Example: `list/__len__.ts`, `list/index_method.ts`, `string/upper.ts`, `string/lower.ts`
- **Index Aggregators**: Each type directory has an `index.ts` that exports all methods/properties
- **Main Registry**: `stdlib/index.ts` provides the central registry and helper functions
- **Current Implementation**:
  - **Lists**: `__len__()` method, `index()` method
  - **Strings**: `upper()` method, `lower()` method
  - Other methods stubbed with "MethodNotYetImplemented" errors
- **Error Handling**: `StdlibError` class for stdlib-specific errors with proper type safety
- **Immutable State**: Always uses `immutableJikiObject` for consistent point-in-time snapshots

**Describer Files**:

- `describeAssignmentStatement.ts` - Variable assignments and list element assignments
- `describeExpressionStatement.ts` - Expression evaluation descriptions
- `describeIfStatement.ts` - Conditional execution descriptions
- `describeBlockStatement.ts` - Block statement descriptions
- `describeForInStatement.ts` - For loop iteration descriptions
- `describeWhileStatement.ts` - While loop condition evaluation and iteration descriptions
- `describeBreakStatement.ts` - Loop break descriptions
- `describeContinueStatement.ts` - Loop continue descriptions
- `describeBinaryExpression.ts` - Binary operations with short-circuit support
- `describeUnaryExpression.ts` - Unary operations (negation, NOT)
- `describeSubscriptExpression.ts` - List/string indexing descriptions
- `describeSteps.ts` - Helper for describing expression evaluation steps
- `helpers.ts` - Formatting utilities for Python objects

### 5. Environment (`src/python/environment.ts`)

Python-specific scoping with LEGB rule (Local, Enclosing, Global, Built-in) and function-level variable scoping.

**Key Responsibilities:**

- Stores variables as JikiObject instances in a Map
- Chains to parent environment for lexical scope resolution (enables closures)
- Provides unique ID for debugging/tracking
- No shadowing restrictions (shadowing is natural Python behavior)

**Methods:**

- `define(name, value)`: Add variable to current scope (no location needed - no shadowing checks)
- `get(name)`: Retrieve variable, walk scope chain (LEGB order)
- `update(name, value)`: Update existing variable in appropriate scope
- `getAllVariables()`: Collect all variables for frame generation

**Differences from JavaScript:**

- No `LanguageFeatures` parameter (Python has fewer configurable restrictions)
- No `location` parameter in `define()` (no shadowing enforcement needed)
- Shadowing is always allowed (matches standard Python semantics)
- Function parameters can shadow outer variables without error

### 6. JikiObjects (`src/python/jikiObjects.ts`)

Wrapper objects extending shared `JikiObject` base class. Supports PyNumber, PyString, PyBoolean, PyNone, and PyList with Python-specific features like int/float distinction and truthiness rules.

**Key features:**

- All objects implement `clone()` method (required by base class)
- Primitive types return `self` from `clone()` since they're immutable
- PyList implements deep cloning for mutable collection behavior
- Evaluation results include `immutableJikiObject` field for consistency with JikiScript
- Python-specific features: `isInteger()` for numbers, `repr()` for strings, True/False formatting

**Collection Types:**

- **PyList**: Mutable ordered collection with deep cloning support. Handles heterogeneous types and nested lists. String representation uses Python format (single quotes for strings). Supports creation, logging, index access (including negative indices), and element assignment.

### 7. Frame System

Uses unified frame system with Python-specific extensions for educational descriptions.

## Error Handling

Parse errors with Python syntax context and runtime errors including undefined variables, type errors, and division by zero with educational messaging.

## Python-Specific Features

**Numbers**: Integer/float distinction, scientific notation, division behavior
**Strings**: Single/double/triple quotes, escape sequences, Unicode support
**Boolean Operations**: Full support for `not`, `and`, and `or` operators with Python truthiness rules
**Language Features**:

- `allowTruthiness` (default: false) - Controls whether non-boolean values can be used in boolean contexts (if statements, logical operators)
- `allowTypeCoercion` (default: false) - Controls type coercion in arithmetic and other operations

## Extensibility

Modular architecture supports easy extension of Python expressions, operators, statements, and language features.

Comprehensive testing across scanner, parser, executor, concepts, syntax errors, and integration with Python-specific validation.
