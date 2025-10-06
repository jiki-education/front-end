# Levels

## Overview

Levels define language features available at each learning stage in Jiki. Each level specifies which AST nodes and feature flags are allowed, controlling the complexity of code students can write. This allows for a gradual introduction of programming concepts without overwhelming beginners.

**Note**: Levels in this curriculum repository provide **frontend-specific metadata** about language features. The actual syllabus structure (lessons, ordering, progression) is managed by the API in `curriculum.json`.

## Level System Architecture

### Core Concepts

1. **Allowed Nodes**: Which AST (Abstract Syntax Tree) node types can be used
2. **Feature Flags**: Language behavior controls (e.g., type coercion, truthiness)
3. **Progressive Enablement**: Each level builds upon the previous one
4. **Language Support**: JavaScript and Python

### Type Structure

```typescript
interface Level {
  id: string; // Unique identifier
  title: string; // Display name
  description?: string; // What students learn
  languageFeatures: {
    javascript?: JavaScriptFeatures;
    python?: PythonFeatures;
  };
}

interface JavaScriptFeatures {
  allowedNodes?: javascript.NodeType[]; // From @jiki/interpreters
  featureFlags?: {
    allowShadowing?: boolean;
    allowTruthiness?: boolean;
    requireVariableInstantiation?: boolean;
    allowTypeCoercion?: boolean;
    enforceStrictEquality?: boolean;
  };
}

interface PythonFeatures {
  allowedNodes?: python.NodeType[]; // From @jiki/interpreters
  featureFlags?: {
    allowTruthiness?: boolean;
    allowTypeCoercion?: boolean;
    // Python-specific flags added as needed
  };
}
```

## Current Levels

### 1. Fundamentals

- **Focus**: Basic function calls and literal values
- **Allowed Nodes**:
  - `ExpressionStatement`
  - `LiteralExpression`
  - `IdentifierExpression`
  - `MemberExpression`
- **Restrictions**: No variables, no control flow, no complex operations
- **Example Code**: `console.log("Hello")`, `moveRight()`

### 2. Variables

- **Focus**: Variable declaration and basic operations
- **New Nodes**:
  - `VariableDeclaration`
  - `AssignmentExpression`
  - `BinaryExpression`
  - `UpdateExpression`
- **Example Code**: `let x = 5`, `x = x + 1`, `y++`

### 3. Control Flow (Planned)

- **Focus**: Conditionals and loops
- **New Nodes**:
  - `IfStatement`
  - `ForStatement`
  - `WhileStatement`
  - `BlockStatement`
- **Example Code**: `if (x > 0)`, `for (let i = 0; i < 10; i++)`

## Feature Flags

### Language Feature Flags

#### JavaScript

- **allowShadowing**: Can variables shadow outer scope variables?
- **allowTruthiness**: Can non-boolean values be used in conditions?
- **requireVariableInstantiation**: Must variables be declared before use?
- **allowTypeCoercion**: Can types be automatically converted?
- **enforceStrictEquality**: Must `===` be used instead of `==`?

#### Python

- **allowTruthiness**: Can non-boolean values be used in conditions?
- **allowTypeCoercion**: Can types be automatically converted?
- Additional Python-specific flags will be added as the interpreter evolves

### Design Philosophy

Early levels are restrictive to:

1. Prevent confusing behaviors (e.g., type coercion)
2. Encourage good practices (e.g., strict equality)
3. Reduce cognitive load for beginners
4. Provide clear error messages

## Integration with Interpreters

The curriculum imports `NodeType` definitions from `@jiki/interpreters`:

```typescript
import type { javascript, python } from "@jiki/interpreters";

// Use interpreter's canonical NodeType
javascript: {
  allowedNodes: javascript.NodeType[]
}

python: {
  allowedNodes: python.NodeType[]
}
```

This ensures type safety and consistency between what the curriculum allows and what the interpreter can execute.

## Adding a New Level

### Step 1: Define the Level

```typescript
// src/levels/functions.ts
import type { Level } from "./types";

export const functionsLevel: Level = {
  id: "functions",
  title: "Functions and Methods",
  description: "Learn to define and call your own functions",

  languageFeatures: {
    javascript: {
      allowedNodes: [
        // Include all previous nodes
        ...variablesLevel.allowedNodes,
        // Add function-specific nodes
        "FunctionDeclaration",
        "FunctionExpression",
        "ReturnStatement",
        "CallExpression"
      ],
      featureFlags: {
        ...variablesLevel.featureFlags,
        allowFunctionHoisting: true
      }
    },
    python: {
      allowedNodes: [
        // Python equivalents of JavaScript nodes
        "Module",
        "FunctionDef",
        "Call",
        "Return"
      ],
      featureFlags: {
        allowTruthiness: false,
        allowTypeCoercion: false
      }
    }
  }
};
```

### Step 2: Register the Level

```typescript
// src/levels/index.ts
import { functionsLevel } from "./functions";

export const levels = [
  fundamentalsLevel,
  variablesLevel,
  functionsLevel // Add here
  // ...
] as const;
```

### Step 3: Update Tests

Ensure the new level:

- Includes all nodes from previous levels
- Maintains appropriate restrictions
- Has consistent feature flags

## Level Progression Rules

1. **Superset Principle**: Each level includes everything from previous levels
2. **No Regression**: Feature restrictions shouldn't become stricter
3. **Clear Boundaries**: Each level should introduce a coherent set of features
4. **Testable**: All allowed nodes should have corresponding exercises

## Using Levels in Exercises

Exercises can check the current level to adapt behavior:

```typescript
class ConditionalExercise extends Exercise {
  constructor(level: Level) {
    super();

    // Only allow certain functions based on level
    if (level.languageFeatures.javascript?.allowedNodes?.includes("IfStatement")) {
      this.availableFunctions.push({
        name: "checkCondition",
        func: this.checkCondition,
        description: "Check if a condition is true"
      });
    }
  }
}
```

## Testing Levels

Level tests verify:

- Node progression (each level extends previous)
- Feature flag consistency
- Type safety with interpreter types
- No dangerous features enabled early

See `tests/levels/` for comprehensive test examples.

## Future Enhancements

- **Dynamic Level Detection**: Automatically suggest level based on code complexity
- **Custom Levels**: Allow instructors to create custom progressions
- **Language Parity**: Continue ensuring JavaScript and Python levels align
- **Skill Trees**: Non-linear progression paths
- **Language-Specific Features**: Add unique language features (e.g., Python list comprehensions, JavaScript async/await)
