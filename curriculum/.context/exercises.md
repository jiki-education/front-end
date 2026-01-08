# Exercises

## Overview

Exercises are the core educational units in Jiki. Each exercise teaches a specific programming concept through interactive code execution. There are two types of exercises:

1. **Visual Exercises** - Interactive puzzles with animations and visual feedback (e.g., maze navigation)
2. **IO Exercises** - Function-based challenges that test return values (e.g., string manipulation)

## Exercise Types

### Visual Exercises

Visual exercises provide animations and visual feedback as students write code to control on-screen elements.

**Characteristics:**

- Extend `VisualExercise` class
- Define instance methods for available functions
- Generate animations during execution
- Maintain internal state (position, score, etc.)
- Render HTML views for visual representation
- Scenarios test final state after code execution

**Example:** Basic Movement - students write code to move a character through a maze

### IO Exercises

IO exercises test pure function logic by comparing return values against expected outputs.

**Characteristics:**

- Extend `IOExercise` class
- Use static properties (no instance needed)
- No animations or visual elements
- Test function return values directly
- Scenarios provide input/output pairs
- Often use level-provided stdlib functions

**Example:** Acronym - students write a function that converts phrases to acronyms

## Exercise Architecture

### Visual Exercise Class

See `src/Exercise.ts` for the complete `VisualExercise` class definition:

```typescript
export abstract class VisualExercise {
  animations: Animation[] = [];
  view: HTMLElement;
  protected abstract get slug(): string;

  abstract availableFunctions: Array<{
    name: string;
    func: (ctx: ExecutionContext) => void;
    description: string;
  }>;

  abstract getState(): Record<string, number | string | boolean>;
}
```

**Key Components:**

- `animations` - Array of visual feedback generated during execution
- `view` - HTML element containing the exercise's visual representation
- `availableFunctions` - Instance methods students can call (e.g., `move()`, `turnLeft()`)
- `getState()` - Returns current state for validation

### IO Exercise Class

See `src/Exercise.ts` for the complete `IOExercise` class definition:

```typescript
export abstract class IOExercise {
  static slug: string;
  static availableFunctions: Array<{
    name: string;
    func: (ctx: ExecutionContext, ...args: any[]) => any;
    description: string;
  }>;
}
```

**Key Components:**

- `slug` - Exercise identifier (static)
- `availableFunctions` - Usually empty (functions provided by level stdlib)
- No instance methods or state
- No animations or views

## Exercise Structure

Both exercise types follow the same file structure:

```
src/exercises/[exercise-name]/
├── index.ts              # Exercise definition (exports ExerciseDefinition)
├── Exercise.ts           # Exercise class (extends VisualExercise or IOExercise)
├── scenarios.ts          # Tasks and test scenarios
├── metadata.json         # Basic metadata (slug, title, instructions, etc.)
├── llm-metadata.ts       # AI assistant guidance
├── solution.jiki         # Jikiscript solution
├── solution.javascript   # JavaScript solution
├── solution.py           # Python solution
├── stub.jiki            # Jikiscript starter code
├── stub.javascript      # JavaScript starter code
└── stub.py              # Python starter code
```

## Creating a New Exercise

### Step 1: Determine Exercise Type

**Choose Visual Exercise if:**

- The concept benefits from visual feedback
- You need animations or DOM manipulation
- State changes over time during execution
- Multiple function calls build up a result

**Choose IO Exercise if:**

- Testing pure function logic
- Input → Output transformations
- String/number/data manipulation
- No need for visual representation

### Step 2: Create File Structure

Create the exercise directory and all required files:

```bash
mkdir -p src/exercises/[exercise-name]
cd src/exercises/[exercise-name]
touch index.ts Exercise.ts scenarios.ts metadata.json llm-metadata.ts
touch solution.{jiki,javascript,py} stub.{jiki,javascript,py}
```

### Step 3: Create metadata.json

Define basic exercise metadata:

```json
{
  "slug": "exercise-name",
  "title": "Exercise Title",
  "instructions": "Complete description of what students need to do...",
  "estimatedMinutes": 10,
  "levelId": "fundamentals",
  "hints": ["Helpful hint 1", "Helpful hint 2"]
}
```

### Step 4: Create Exercise Class

#### For Visual Exercises

```typescript
import { type ExecutionContext } from "@jiki/interpreters";
import { VisualExercise } from "../../Exercise";
import metadata from "./metadata.json";

export default class MyExercise extends VisualExercise {
  protected get slug() {
    return metadata.slug;
  }

  // Internal state
  private position = 0;

  // Available functions (defined in snake_case)
  availableFunctions = [
    {
      name: "move_forward",
      func: this.moveForward.bind(this),
      description: "Move the character forward"
    }
  ];

  private moveForward(ctx: ExecutionContext) {
    this.position += 10;

    // Generate animation
    this.animations.push({
      targets: `#${this.view.id} .character`,
      offset: ctx.getCurrentTimeInMs(),
      duration: 100,
      transformations: { left: this.position }
    });

    ctx.fastForward(100);
  }

  getState() {
    return { position: this.position };
  }

  protected populateView() {
    // Create HTML elements for visual representation
  }
}
```

#### For IO Exercises

```typescript
import { IOExercise } from "../../Exercise";
import metadata from "./metadata.json";

export default class MyExercise extends IOExercise {
  static slug = metadata.slug;

  // Usually empty - functions provided by level stdlib
  static availableFunctions = [];
}
```

### Step 5: Define Tasks and Scenarios

#### For Visual Exercises

```typescript
import type { Task, VisualScenario } from "../types";
import type MyExercise from "./Exercise";

export const tasks = [
  {
    id: "task-1" as const,
    name: "Task name",
    description: "What students need to accomplish",
    hints: ["Hint 1", "Hint 2"],
    requiredScenarios: ["scenario-1", "scenario-2"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "scenario-1",
    name: "Scenario name",
    description: "What this scenario tests",
    taskId: "task-1",

    setup(exercise) {
      // Configure initial state
      (exercise as MyExercise).setStartPosition(0);
    },

    expectations(exercise) {
      const ex = exercise as MyExercise;
      return [
        {
          pass: ex.position === 100,
          errorHtml: "Expected position to be 100, but got " + ex.position
        }
      ];
    }
  }
];
```

#### For IO Exercises

```typescript
import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "task-1" as const,
    name: "Task name",
    description: "What students need to accomplish",
    hints: ["Hint 1", "Hint 2"],
    requiredScenarios: ["scenario-1", "scenario-2"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "scenario-1",
    name: "Test case name",
    description: "What this test validates",
    taskId: "task-1",
    functionName: "my_function",
    args: ["input string", 42],
    expected: "expected output",
    matcher: "toEqual" // optional, defaults to toEqual
  }
];
```

### Step 6: Create Solutions and Stubs

Create solution and stub files for all three languages. See `.context/language-conversion.md` for detailed syntax conversion guide.

**File naming:**

- `solution.jiki` - Jikiscript solution
- `solution.javascript` - JavaScript solution
- `solution.py` - Python solution
- `stub.jiki` - Jikiscript starter
- `stub.javascript` - JavaScript starter
- `stub.py` - Python starter

**Naming conventions:**

- Functions: `snake_case` in Jiki/Python → `camelCase` in JavaScript
- Variables: `snake_case` in Jiki/Python → `camelCase` in JavaScript

### Step 7: Create LLM Metadata

Provide guidance for AI assistants helping students:

```typescript
import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    What this exercise teaches and key concepts.
  `,
  tasks: {
    "task-1": {
      description: `
        What students should learn, common mistakes,
        and teaching guidance for this task.
      `
    }
  }
};
```

### Step 8: Create index.ts

Export the complete exercise definition:

#### For Visual Exercises

```typescript
import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseDefinition, FunctionDoc } from "../types";

import solutionJavascript from "./solution.javascript";
import solutionPython from "./solution.py";
import solutionJikiscript from "./solution.jiki";
import stubJavascript from "./stub.javascript";
import stubPython from "./stub.py";
import stubJikiscript from "./stub.jiki";

const functions: FunctionDoc[] = [
  {
    name: "moveForward()",
    description: "Move the character forward one step",
    usage: "moveForward();"
  }
];

const exerciseDefinition: VisualExerciseDefinition = {
  type: "visual",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  solutions: {
    javascript: solutionJavascript,
    python: solutionPython,
    jikiscript: solutionJikiscript
  },
  stubs: {
    javascript: stubJavascript,
    python: stubPython,
    jikiscript: stubJikiscript
  }
};

export default exerciseDefinition;
```

#### For IO Exercises

```typescript
import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { IOExerciseDefinition, FunctionDoc } from "../types";

import solutionJavascript from "./solution.javascript";
import solutionPython from "./solution.py";
import solutionJikiscript from "./solution.jiki";
import stubJavascript from "./stub.javascript";
import stubPython from "./stub.py";
import stubJikiscript from "./stub.jiki";

const functions: FunctionDoc[] = [
  {
    name: "concatenate(a, b)",
    description: "Combine strings (provided by level stdlib)",
    usage: 'concatenate("hello", "world")'
  }
];

const exerciseDefinition: IOExerciseDefinition = {
  type: "io",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  solutions: {
    javascript: solutionJavascript,
    python: solutionPython,
    jikiscript: solutionJikiscript
  },
  stubs: {
    javascript: stubJavascript,
    python: stubPython,
    jikiscript: stubJikiscript
  }
};

export default exerciseDefinition;
```

### Step 9: Register the Exercise

Add to `src/exercises/index.ts`:

```typescript
export const exercises = {
  "basic-movement": () => import("./basic-movement"),
  "my-exercise": () => import("./my-exercise") // Add your exercise
  // ...
} as const;
```

## Animation System (Visual Exercises Only)

Visual exercises generate animations that the frontend converts to anime.js timelines.

### Animation Interface

```typescript
export interface Animation {
  targets: string; // CSS selector
  offset: number; // Time offset in ms
  duration?: number; // Animation duration
  easing?: string; // Easing function
  transformations: {
    left?: number;
    top?: number;
    translateX?: number;
    translateY?: number;
    rotate?: number;
    scale?: number;
    opacity?: number;
    gridRow?: number;
    gridColumn?: number;
  };
}
```

### Animation Best Practices

1. **Use ExecutionContext for timing**: `offset: ctx.getCurrentTimeInMs()`
2. **Fast-forward execution time**: `ctx.fastForward(durationMs)`
3. **Use semantic selectors**: `#${this.view.id} .character`
4. **Include appropriate durations**: Balance speed and visibility
5. **Maintain state consistency**: Visual state should match internal state

### Example Animation

```typescript
this.animations.push({
  targets: `#${this.view.id} .player`,
  offset: ctx.getCurrentTimeInMs(),
  duration: 200,
  easing: "easeInOutQuad",
  transformations: {
    translateX: this.playerX,
    translateY: this.playerY,
    rotate: this.playerRotation
  }
});

ctx.fastForward(200);
```

## Exercise Design Principles

### Educational Goals

- **Clear Learning Objectives**: Each exercise teaches specific concepts
- **Progressive Difficulty**: Build on previous knowledge
- **Immediate Feedback**: Show results of code execution
- **Exploration Friendly**: Allow students to experiment safely

### Technical Guidelines

- **Minimal State**: Keep state simple and focused
- **Pure Functions**: Functions should be predictable
- **Error Recovery**: Handle edge cases gracefully
- **Performance**: Optimize for smooth execution
- **Multi-language Support**: Ensure parity across JavaScript, Python, and Jikiscript

## Naming Conventions

Functions are defined in `snake_case` and automatically converted for each language:

- **Jiki/Python**: `move_forward()`, `turn_left()` (as defined)
- **JavaScript**: `moveForward()`, `turnLeft()` (auto-converted to camelCase)

The interpreter handles this conversion automatically - you only need to define functions once in snake_case.

## Example Exercises

### Visual Exercise: Basic Movement

- **Type**: Visual
- **Concepts**: Function calls, sequential execution
- **Available functions**: `move()` - Move character forward
- **State**: `position` - Current character position
- **Goal**: Navigate to a target position by calling move() multiple times
- **Scenarios**: Test different starting positions

### IO Exercise: Acronym

- **Type**: IO
- **Concepts**: String manipulation, iteration, character extraction
- **Available functions**: None (uses level stdlib: `concatenate`, `to_upper_case`)
- **Goal**: Convert phrase to acronym (first letter of each word, uppercase)
- **Scenarios**: Test various phrases with different punctuation

## Integration with Frontend

The frontend:

1. Imports exercise definitions from this package
2. Instantiates exercises (visual only) or uses static class (IO)
3. Provides available functions to the code editor
4. Executes student code with the exercise context
5. Renders animations (visual) or compares return values (IO)

## Testing Exercises

Include tests for:

- Function behavior
- State management (visual exercises)
- Animation generation (visual exercises)
- Return value validation (IO exercises)
- Edge cases
- Scenario variations

See `tests/exercises/` for examples.

## Type Safety

All exercises use TypeScript for type safety:

- `ExerciseDefinition` - Discriminated union of Visual and IO
- `VisualScenario` - Scenarios for visual exercises
- `IOScenario` - Scenarios for IO exercises
- `Task` - Task structure with required scenarios
- `Animation` - Animation interface for visual feedback

The type system ensures compile-time validation of:

- Exercise structure
- Scenario compatibility
- Function signatures
- State types
