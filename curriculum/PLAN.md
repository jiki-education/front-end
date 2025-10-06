# Levels and Syllabus System Implementation Plan

This document outlines the implementation plan for adding a levels and syllabus system to Jiki, which will control which language features are available at each learning level.

## Overview

We're implementing a system where each Level defines:

- Which AST node types are allowed (e.g., `CallExpression`, `ForStatement`)
- Which language feature flags are enabled (e.g., `truthiness`, `typeCoercion`)
- A title and description for the learning level

These levels are organized into a syllabus that maps levels to lessons (exercises, tutorials, etc.).

---

## Part 1: Curriculum Side Implementation

### 1.1 Type Definitions

Create `src/levels/types.ts`:

```typescript
// Core level interface
export interface Level {
  id: string; // e.g., "fundamentals", "control-flow"
  title: string; // e.g., "Programming Fundamentals"
  description?: string; // What students learn at this level

  languageFeatures: {
    javascript?: JavaScriptFeatures;
    python?: PythonFeatures;
    jikiscript?: JikiScriptFeatures;
  };
}

// JavaScript-specific features
export interface JavaScriptFeatures {
  // AST node types that are allowed
  allowedNodes?: string[]; // e.g., ["CallExpression", "Literal", "Identifier"]

  // Feature flags (matching interpreter's LanguageFeatures)
  featureFlags?: {
    allowShadowing?: boolean;
    allowTruthiness?: boolean;
    requireVariableInstantiation?: boolean;
    allowTypeCoercion?: boolean;
    oneStatementPerLine?: boolean;
    enforceStrictEquality?: boolean;
  };
}

// Python features (for future use)
export interface PythonFeatures {
  allowedNodes?: string[];
  featureFlags?: {
    // Python-specific flags
  };
}

// JikiScript features
export interface JikiScriptFeatures {
  allowedTokens?: string[]; // Uses TokenType from jikiscript
  featureFlags?: {
    allowGlobals?: boolean;
    customFunctionDefinitionMode?: boolean;
    // ... other JikiScript-specific flags
  };
}
```

### 1.2 Level Definitions

Create individual level files in `src/levels/`:

**`src/levels/fundamentals.ts`:**

```typescript
export const fundamentalsLevel: Level = {
  id: "fundamentals",
  title: "Programming Fundamentals",
  description: "Learn the basics: function calls and literals",

  languageFeatures: {
    javascript: {
      allowedNodes: ["Program", "ExpressionStatement", "CallExpression", "Identifier", "Literal"],
      featureFlags: {
        allowTruthiness: false,
        allowTypeCoercion: false,
        enforceStrictEquality: true
      }
    }
  }
};
```

**`src/levels/variables.ts`:**

```typescript
export const variablesLevel: Level = {
  id: "variables",
  title: "Variables and Assignments",
  description: "Learn to declare and use variables",

  languageFeatures: {
    javascript: {
      allowedNodes: [
        // Everything from fundamentals plus:
        "VariableDeclaration",
        "VariableDeclarator",
        "AssignmentExpression",
        "BinaryExpression" // For basic math
      ],
      featureFlags: {
        allowShadowing: false,
        requireVariableInstantiation: true
      }
    }
  }
};
```

### 1.3 Level Registry

Create `src/levels/index.ts`:

```typescript
import { fundamentalsLevel } from "./fundamentals";
import { variablesLevel } from "./variables";
// ... import other levels

export * from "./types";

export const levels = {
  fundamentals: fundamentalsLevel,
  variables: variablesLevel
  // ... add more levels
} as const;

export type LevelId = keyof typeof levels;

// Helper to get level by ID
export function getLevel(id: LevelId): Level {
  return levels[id];
}

// Helper to get allowed nodes for a language
export function getAllowedNodes(
  levelId: LevelId,
  language: "javascript" | "python" | "jikiscript"
): string[] | undefined {
  const level = getLevel(levelId);
  const features = level.languageFeatures[language];

  if (language === "javascript" || language === "python") {
    return features?.allowedNodes;
  } else if (language === "jikiscript") {
    return features?.allowedTokens;
  }
}
```

### 1.4 Syllabus System

Create `src/syllabus/types.ts`:

```typescript
export interface Syllabus {
  title: string;
  description?: string;
  levelProgression: LevelProgression[];
}

export interface LevelProgression {
  levelId: string; // References Level.id
  lessons: Lesson[];
}

export type LessonType = "exercise" | "tutorial" | "challenge" | "assessment";

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;

  // Type-specific properties
  exerciseSlug?: string; // For exercise type
  tutorialContent?: string; // For tutorial type
  // ... other type-specific fields
}
```

Create `src/syllabus/syllabus.ts`:

```typescript
export const mainSyllabus: Syllabus = {
  title: "Introduction to Programming",
  description: "Learn programming from the ground up",

  levelProgression: [
    {
      levelId: "fundamentals",
      lessons: [
        {
          id: "intro-functions",
          title: "Your First Function Call",
          type: "exercise",
          exerciseSlug: "basic-movement"
        },
        {
          id: "multiple-calls",
          title: "Calling Functions Multiple Times",
          type: "exercise",
          exerciseSlug: "repeated-movement"
        }
      ]
    },
    {
      levelId: "variables",
      lessons: [
        {
          id: "intro-variables",
          title: "Introduction to Variables",
          type: "tutorial",
          tutorialContent: "Variables let you store values..."
        },
        {
          id: "using-variables",
          title: "Using Variables in Functions",
          type: "exercise",
          exerciseSlug: "variable-movement"
        }
      ]
    }
  ]
};
```

### 1.5 Main Exports

Update `src/index.ts`:

```typescript
// Existing exports
export { exercises, type ExerciseSlug } from "./exercises";
export type { ExerciseDefinition, Task, Scenario, TestExpect } from "./exercises/types";
export { Exercise, type Animation } from "./Exercise";

// New exports for levels and syllabus
export { levels, getLevel, getAllowedNodes, type Level, type LevelId } from "./levels";
export { mainSyllabus, type Syllabus, type Lesson, type LessonType } from "./syllabus";
```

---

## Part 2: Interpreter Side Implementation

### 2.1 Extend LanguageFeatures Interface

Update `interpreters/src/javascript/interfaces.ts`:

```typescript
export interface LanguageFeatures {
  // Existing flags
  excludeList?: string[];
  includeList?: string[];
  allowShadowing?: boolean;
  allowTruthiness?: boolean;
  requireVariableInstantiation?: boolean;
  allowTypeCoercion?: boolean;
  oneStatementPerLine?: boolean;
  enforceStrictEquality?: boolean;

  // NEW: Node-level control
  allowedNodes?: string[]; // AST node types that are allowed
}
```

### 2.2 Parser Helper Method

Update `interpreters/src/javascript/parser.ts`:

```typescript
export class Parser {
  private languageFeatures: LanguageFeatures;

  constructor(sourceCode: string, languageFeatures?: LanguageFeatures) {
    this.languageFeatures = languageFeatures || {};
    // ... existing constructor code
  }

  // NEW: Helper method to check if a node type is allowed
  private isNodeAllowed(nodeType: string): boolean {
    // If no allowedNodes specified, all nodes are allowed (backward compatibility)
    if (!this.languageFeatures.allowedNodes) {
      return true;
    }

    return this.languageFeatures.allowedNodes.includes(nodeType);
  }

  // NEW: Helper to throw error for disallowed node
  private throwNodeNotAllowedError(nodeType: string, friendlyName: string) {
    throw new SyntaxError(
      `${friendlyName} are not available at this level. ` + `Complete earlier lessons to unlock this feature.`,
      this.current.line,
      this.current.column
    );
  }

  // Example usage in existing parser methods:

  private forStatement(): Statement {
    // Check if for loops are allowed
    if (!this.isNodeAllowed("ForStatement")) {
      this.throwNodeNotAllowedError("ForStatement", "For loops");
    }

    // ... existing for statement parsing logic
  }

  private variableDeclaration(): Statement {
    // Check if variable declarations are allowed
    if (!this.isNodeAllowed("VariableDeclaration")) {
      this.throwNodeNotAllowedError("VariableDeclaration", "Variable declarations");
    }

    // ... existing variable declaration parsing logic
  }

  private ifStatement(): Statement {
    // Check if if statements are allowed
    if (!this.isNodeAllowed("IfStatement")) {
      this.throwNodeNotAllowedError("IfStatement", "If statements");
    }

    // ... existing if statement parsing logic
  }
}
```

### 2.3 Executor Safety Checks

Update `interpreters/src/javascript/executor.ts`:

```typescript
export class Executor {
  private languageFeatures: LanguageFeatures;

  // NEW: Helper method for executor-level checking
  private assertNodeAllowed(nodeType: string, friendlyName?: string): void {
    if (this.languageFeatures.allowedNodes && !this.languageFeatures.allowedNodes.includes(nodeType)) {
      throw new RuntimeError(
        `${friendlyName || nodeType} cannot be executed at this level`
        // ... location info
      );
    }
  }

  public execute(statement: Statement): EvaluationResult {
    // Safety check before execution
    this.assertNodeAllowed(statement.type, this.getStatementFriendlyName(statement.type));

    switch (statement.type) {
      case "ForStatement":
        return this.executeForStatement(statement);
      case "IfStatement":
        return this.executeIfStatement(statement);
      // ... etc
    }
  }

  // Helper to get user-friendly names
  private getStatementFriendlyName(type: string): string {
    const friendlyNames: Record<string, string> = {
      ForStatement: "For loops",
      IfStatement: "If statements",
      VariableDeclaration: "Variable declarations",
      FunctionDeclaration: "Function declarations"
      // ... add more mappings
    };

    return friendlyNames[type] || type;
  }
}
```

### 2.4 Integration with Curriculum

When the frontend calls the interpreter, it will pass the level's language features:

```typescript
// In frontend code:
import { interpret } from "@jiki/interpreters/javascript";
import { getLevel } from "@jiki/curriculum";

const level = getLevel("fundamentals");
const result = interpret(userCode, {
  allowedNodes: level.languageFeatures.javascript?.allowedNodes,
  ...level.languageFeatures.javascript?.featureFlags
});
```

---

## Implementation Order

1. **Phase 1 - Curriculum Types and Structure**
   - Create level type definitions
   - Create initial level definitions (fundamentals, variables)
   - Create syllabus structure
   - Update exports

2. **Phase 2 - Interpreter Integration**
   - Extend LanguageFeatures interface
   - Add parser helper methods
   - Add node checking in parser methods
   - Add executor safety checks

3. **Phase 3 - Testing**
   - Test that disallowed nodes throw appropriate errors
   - Test backward compatibility (no allowedNodes = everything allowed)
   - Test level progression

4. **Phase 4 - Frontend Integration**
   - Pass level features to interpreter
   - Display appropriate error messages
   - Show level progression in UI

---

## Node Type Reference

Common JavaScript AST node types to control:

**Fundamentals:**

- `Program`, `ExpressionStatement`, `CallExpression`, `Identifier`, `Literal`

**Variables:**

- `VariableDeclaration`, `VariableDeclarator`, `AssignmentExpression`

**Operators:**

- `BinaryExpression`, `UnaryExpression`, `UpdateExpression`, `LogicalExpression`

**Control Flow:**

- `IfStatement`, `ConditionalExpression` (ternary)

**Loops:**

- `ForStatement`, `WhileStatement`, `DoWhileStatement`, `BreakStatement`, `ContinueStatement`

**Functions:**

- `FunctionDeclaration`, `FunctionExpression`, `ArrowFunctionExpression`, `ReturnStatement`

**Objects/Arrays:**

- `ObjectExpression`, `ArrayExpression`, `MemberExpression`

**Advanced:**

- `ClassDeclaration`, `NewExpression`, `ThisExpression`, `SpreadElement`

---

## Error Messages

Error messages should be helpful and guide learners:

**Parser errors:**

```
"For loops are not available at this level. Complete the 'Control Flow' lessons to unlock this feature."
```

**Executor errors (safety net):**

```
"This feature cannot be executed at the current level."
```

---

## Benefits

1. **Progressive Learning**: Students can't accidentally use features they haven't learned
2. **Clear Progression**: Each level unlocks specific capabilities
3. **Better Error Messages**: Context-aware messages guide learning
4. **Flexibility**: Easy to add new levels or adjust existing ones
5. **Language Agnostic**: System works for JavaScript, Python, and JikiScript
