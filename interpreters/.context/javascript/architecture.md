# JavaScript Interpreter Architecture

Follows shared interpreter architecture with JavaScript-specific implementations.

## Component Details

### 1. Scanner (`src/javascript/scanner.ts`)

Tokenizes JavaScript source code into a stream of tokens.

**Responsibilities:**

- Lexical analysis of JavaScript syntax
- Token generation with location tracking
- Comment handling (preserved for educational context)
- String parsing with escape sequences
- Number parsing (integers and decimals)
- Keyword and identifier recognition

Supports single/two-character tokens, literals, keywords, and identifiers.

### 2. Parser (`src/javascript/parser.ts`)

Builds an Abstract Syntax Tree (AST) from tokens using recursive descent parsing.

**AST Nodes**: Literals, binary/unary expressions, grouping, identifiers, assignments, expression statements, variable declarations, block statements, if statements, for statements, while statements, template literals, arrays, dictionaries, member access, function calls.

Standard operator precedence from grouping through assignment.

### 3. Executor (`src/javascript/executor.ts`)

Evaluates the AST and generates execution frames.

Modular executor architecture with dedicated modules for each AST node type. Main executor coordinates specialized executor functions with consistent interfaces.

**Member Expression Execution:**

The executor uses a dispatch pattern for member expressions:

- `executeMemberExpression`: Main entry point that dispatches based on object type
- `executeArrayMemberExpression`: Handles array-specific member access
  - Dot notation (arr.length) delegates to stdlib
  - Bracket notation with numbers handles array indexing
  - Bracket notation with strings for stdlib members throws TypeError
- `executeDictionaryMemberExpression`: Handles dictionary property access
- `executeStdlibMemberExpression`: Handles stdlib properties and methods
  - Uses guard pattern for validation (guardObjectHasStdLibMethods, guardPropertyIsString, etc.)
  - Enforces dot notation only for stdlib members (no computed access)
  - Handles feature flags and stub methods

**External Functions**: The executor supports registration and invocation of external functions through:

- Registration at interpreter initialization via `externalFunctions` array
- Storage in a Map for fast lookup by name
- Execution through CallExpression with ExecutionContext passed as first parameter
- Automatic conversion between JavaScript values and JikiObjects

**Performance Optimizations:**

- **Lazy description generation**: Frames include a `generateDescription()` function instead of pre-computed descriptions, deferring expensive string generation until needed
- **Test-only augmentation**: In test environments (`NODE_ENV=test`), frames are augmented with `variables` and `description` fields for backward compatibility

### 4. Describers (`src/javascript/describers/`)

Generate human-readable descriptions for all execution steps including arithmetic operations, variable declarations, and control flow.

### 5. Environment (`src/javascript/environment.ts`)

Nested environment chain supporting lexical scoping, variable declaration, access, updates, and scope isolation with automatic block cleanup.

**Key Responsibilities:**

- Stores variables as JikiObject instances in a Map
- Chains to parent environment for lexical scope resolution
- Enforces language features (e.g., shadowing rules)
- Provides unique ID for debugging/tracking

**Shadowing Enforcement:**
The Environment enforces `allowShadowing` language feature directly in the `define()` method:

- When `allowShadowing: false`, checks if variable name exists in any enclosing scope
- Uses `isDefinedInEnclosingScope()` to recursively walk parent chain
- Throws `ShadowingDisabled` RuntimeError with variable name and location
- Applies uniformly to ALL variable definitions: `let` declarations, function parameters, function names

This centralized approach ensures consistent behavior across:

- Block-level `let` declarations
- Function parameter binding
- Function name declarations
- External function registration (uses `Location.unknown`)

**Methods:**

- `define(name, value, location)`: Add variable, enforce shadowing rules
- `get(name)`: Retrieve variable, walk scope chain
- `update(name, value)`: Update existing variable
- `isDefinedInEnclosingScope(name)`: Check if name exists in parent scopes
- `getAllVariables()`: Collect all variables for frame generation

### 6. JikiObjects (`src/javascript/jsObjects/`)

Wrapper objects extending shared `JikiObject` base class. Each type is now in its own file under `jsObjects/` directory. Supports JSNumber, JSString, JSBoolean, JSNull, JSUndefined, JSArray, JSDictionary, and JSStdLibFunction with consistent cross-interpreter compatibility.

**Key features:**

- All objects implement `clone()` method (required by base class)
- Primitive types return `self` from `clone()` since they're immutable
- JSArray implements deep cloning for proper immutability in frames
- Evaluation results include `immutableJikiObject` field for consistency with JikiScript
- Describers use `immutableJikiObject` for accessing values

**Collections:**

- **JSArray**: Represents JavaScript arrays, called "lists" in user-facing messages for consistency
  - Stores array of JikiObjects
  - Implements deep cloning via `clone()` method
  - Formatted as `[ elem1, elem2, ... ]` or `[]` for empty
  - Supports property access via stdlib (e.g., `.length`)
  - Prepared for method support (e.g., `.at()` when CallExpression is implemented)

### 7. Standard Library (`src/javascript/stdlib/`)

**Modular Stdlib Architecture** (Restructured 2025-01)

Provides built-in properties and methods for JavaScript types with feature flag support:

- **Type-Based Organization**: Each JavaScript type has its own directory (`array/`, `string/`, etc.)
- **Method-Per-File Pattern**: Each method/property is in its own file for maintainability
  - Example: `array/length.ts`, `array/at.ts`, `string/toUpperCase.ts`, `string/toLowerCase.ts`
- **Index Aggregators**: Each type directory has an `index.ts` that exports all methods/properties
- **Main Registry**: `stdlib/index.ts` provides the central registry and helper functions

**Current Implementation**:

**Arrays** (`src/javascript/stdlib/array/`):

- Properties:
  - `length`: Returns the number of elements in the array
- Implemented Methods:
  - `at(index)`: Returns element at index (supports negative indices)
  - `push(...elements)`: Adds one or more elements to the end, returns new length
  - `pop()`: Removes and returns the last element
  - `shift()`: Removes and returns the first element
  - `unshift(...elements)`: Adds one or more elements to the beginning, returns new length

**Strings** (`src/javascript/stdlib/string/`):

- Properties:
  - `length`: Returns the number of characters in the string
- Implemented Methods:
  - `toUpperCase()`: Returns uppercase version of the string
  - `toLowerCase()`: Returns lowercase version of the string
- Stubbed Methods (throw MethodNotYetImplemented when called):
  - All standard JS array methods not yet implemented: `indexOf`, `includes`, `slice`, `concat`, `join`, `forEach`, `map`, `filter`, `reduce`, etc.
  - Stub methods still return function objects for correct semantics

**Access Patterns**:

- **Dot notation required**: Stdlib members must be accessed via dot notation (`arr.length`)
- **Computed access forbidden**: Using brackets for stdlib members (`arr["length"]`) throws TypeError
- **Array indexing**: Numeric bracket access (`arr[0]`) works for array elements only

**Feature Flag System**:

- Methods and properties can be restricted via `allowedStdlib` in LanguageFeatures
- Four error states:
  - `PropertyNotFound`: Completely unknown property/method
  - `MethodNotYetImplemented`: Known method but not yet built (stub) - thrown when stub is called
  - `MethodNotYetAvailable`: Built method disabled by feature flags
  - `TypeError`: Computed property access for stdlib members

The stdlib system uses an ExecutionContext pattern for consistency with JikiScript patterns.

### 8. Language Features System (`src/javascript/interfaces.ts`)

Configurable language features:

- `allowShadowing`: Controls variable shadowing behavior in nested scopes (default: false)
- `allowTruthiness`: Controls whether non-boolean values can be used in conditions (default: false)
- `requireVariableInstantiation`: Controls whether variables must be initialized when declared (default: true)
- `allowTypeCoercion`: Controls whether type coercion is allowed in operations (default: false)
- `oneStatementPerLine`: Controls whether multiple statements are allowed on a single line (default: false)

### 9. Frame System

Uses unified frame system with JavaScript-specific extensions for educational descriptions.

### 10. AST Node Restrictions System

Supports configurable AST node-level restrictions via `allowedNodes` in LanguageFeatures:

- `allowedNodes: null | undefined` - All nodes allowed (default behavior)
- `allowedNodes: []` - No nodes allowed (maximum restriction)
- `allowedNodes: ["NodeType", ...]` - Only specified nodes allowed

**IMPORTANT: When Adding New AST Node Types**

When implementing support for a new AST node type, you MUST:

1. **Update NodeType**: Add the new node type to the `NodeType` union in `src/javascript/interfaces.ts`
2. **Add Error Type**: Add `<NodeName>NotAllowed` to `SyntaxErrorType` in `src/javascript/error.ts`
3. **Update Parser**: Add `checkNodeAllowed()` call in the relevant parsing method in `src/javascript/parser.ts`
4. **Add Safety Check**: Executor already has generic checks, but verify it handles the new node
5. **Add Tests**: Add test cases for the new node in `tests/javascript/language-features/allowedNodes.test.ts`
6. **Update PLAN.md**: Add the new node type to the "Supported AST Node Types" section

This ensures the node restriction system remains complete and consistent.

## Loop Constructs

### For Loops

- Full C-style for loop with init, condition, and update expressions
- Creates new scope for loop variables
- Each component (init, condition, update) generates its own frame
- Supports all variations: empty init, missing condition, no update

### For...of Loops

- Modern JavaScript iteration over arrays and strings
- Syntax: `for (let variable of iterable) { ... }`
- Only supports `let` declarations (not `const` or bare identifiers)
- Creates new scope for loop variable
- Validates iterable is JSArray or JSString (runtime error otherwise)
- Generates frames for each iteration showing current element
- Handles empty iterables (single frame, no iterations)
- Supports `break` and `continue` statements
- String characters automatically converted to JSString objects

### While Loops

- Standard while loop with condition expression
- Creates new scope for loop body
- Condition evaluated before each iteration
- Generates frame for condition evaluation
- Respects truthiness language feature flag

## Error Handling

Follows shared error pattern: parse errors returned as `error`, runtime errors become error frames. Includes variable, shadowing, and operation errors.

## External Functions

The JavaScript interpreter supports external functions that can be called from JavaScript code:

```typescript
interface ExternalFunction {
  name: string; // Function name used in JavaScript code
  func: Function; // The actual function implementation
  description: string; // Human-readable description for educational feedback
  arity?: Arity; // Optional arity constraints (number or [min, max])
}
```

External functions:

- Receive `ExecutionContext` as the first parameter
- Receive JavaScript values (not JikiObjects) as arguments
- Return JavaScript values that are automatically wrapped as JikiObjects
- Are registered at interpreter initialization
- Can be used in any expression context
- Support variable arity with `[min, max]` ranges

## Extensibility

Modular architecture supports easy extension of expressions, operators, statements, and language features.

Comprehensive testing across scanner, parser, executor, describers, integration, errors, concepts, and scoping.
