---
description: Create a new exercise stub with all required files
argument-hint: <slug> <base-class>
---

# Create New Exercise Stub

I'll help you create a new exercise with all the required files and registrations.

## Arguments

The arguments are: **$ARGUMENTS**

Expected format: `<slug> <base-class>`

- `slug`: The exercise slug (e.g., `number-game`)
- `base-class`: One of `io`, `visual`, `draw`, `space-invaders`

## Step 1: Parse Arguments

Parse the arguments to extract:

1. **slug**: The exercise slug (e.g., `number-game`)
2. **base-class**: The base class type (`io`, `visual`, `draw`, or `space-invaders`)

Derive from slug:

- **title**: Convert slug to title case (e.g., `number-game` → `Number Game`)
- **className**: Convert slug to PascalCase (e.g., `number-game` → `NumberGame`)
- **camelCaseName**: Convert slug to camelCase (e.g., `number-game` → `numberGame`)

## Step 2: Validate Base Class

Verify the base class is one of:

- `io` → Creates an IO exercise (tests function return values)
- `visual` → Creates a Visual exercise (with animations)
- `draw` → Creates a Draw exercise (extends DrawExercise)
- `space-invaders` → Creates a Space Invaders exercise (extends SpaceInvadersExercise)

If invalid, inform the user of valid options and stop.

## Step 3: Create Exercise Directory

```bash
mkdir -p src/exercises/<slug>
```

## Step 4: Create Files

Create the following files in `src/exercises/<slug>/`:

### 4.1: metadata.json

```json
{
  "slug": "<slug>",
  "title": "<Title>",
  "instructions": "TODO: Add exercise instructions here.",
  "estimatedMinutes": 10,
  "levelId": "everything",
  "hints": []
}
```

### 4.2: Exercise.ts

**For IO exercises (`io`):**

```typescript
import { IOExercise } from "../../IOExercise";
import metadata from "./metadata.json";

export default class <ClassName>Exercise extends IOExercise {
  static slug = metadata.slug;
  static availableFunctions = [];
}
```

**For Visual exercises (`visual`):**

```typescript
import { VisualExercise } from "../../VisualExercise";
import metadata from "./metadata.json";

export class <ClassName>Exercise extends VisualExercise {
  protected get slug() {
    return metadata.slug;
  }

  public getState() {
    return {};
  }

  public availableFunctions = [];
}
```

**For Draw exercises (`draw`):**

```typescript
import { DrawExercise } from "../../exercise-categories/draw";
import metadata from "./metadata.json";

export class <ClassName>Exercise extends DrawExercise {
  protected get slug() {
    return metadata.slug;
  }

  public get availableFunctions() {
    // Select only the drawing functions needed for this exercise
    // Available: rectangle, circle, ellipse, line, triangle, hsl, rgb, clear
    return [];
  }
}
```

**For Space Invaders exercises (`space-invaders`):**

```typescript
import SpaceInvadersExercise from "../../exercise-categories/space-invaders/SpaceInvadersExercise";
import metadata from "./metadata.json";

export class <ClassName>Exercise extends SpaceInvadersExercise {
  protected get slug() {
    return metadata.slug;
  }
}
```

### 4.3: scenarios.ts

**For IO exercises:**

```typescript
import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "task-1" as const,
    name: "TODO: Task name",
    description: "TODO: Task description",
    hints: [],
    requiredScenarios: ["scenario-1"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "scenario-1",
    name: "TODO: Scenario name",
    description: "TODO: Scenario description",
    taskId: "task-1",
    functionName: "todo",
    args: [],
    expected: ""
  }
];
```

**For Visual exercises:**

```typescript
import type { Task, VisualScenario } from "../types";
import type { <ClassName>Exercise } from "./Exercise";

export const tasks = [
  {
    id: "task-1" as const,
    name: "TODO: Task name",
    description: "TODO: Task description",
    hints: [],
    requiredScenarios: ["scenario-1"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "scenario-1",
    name: "TODO: Scenario name",
    description: "TODO: Scenario description",
    taskId: "task-1",
    expectations(exercise) {
      const ex = exercise as <ClassName>Exercise;
      return [
        {
          pass: true, // TODO: Add actual check
          errorHtml: "TODO: Error message"
        }
      ];
    }
  }
];
```

### 4.4: llm-metadata.ts

```typescript
import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    TODO: Add exercise description for LLM context.
  `,
  tasks: {
    "task-1": {
      description: `
        TODO: Add task-specific guidance for LLM.
      `
    }
  }
};
```

### 4.5: index.ts

**For IO exercises:**

```typescript
import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { IOExerciseDefinition, FunctionInfo } from "../types";

import solutionJavascript from "./solution.javascript";
import solutionPython from "./solution.py";
import solutionJikiscript from "./solution.jiki";
import stubJavascript from "./stub.javascript";
import stubPython from "./stub.py";
import stubJikiscript from "./stub.jiki";

const functions: FunctionInfo[] = [
  // TODO: Add available functions for this exercise
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

**For Visual exercises:**

```typescript
import { <ClassName>Exercise } from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseDefinition, FunctionInfo } from "../types";

import solutionJavascript from "./solution.javascript";
import solutionPython from "./solution.py";
import solutionJikiscript from "./solution.jiki";
import stubJavascript from "./stub.javascript";
import stubPython from "./stub.py";
import stubJikiscript from "./stub.jiki";

const functions: FunctionInfo[] = [
  // TODO: Add available functions for this exercise
];

const exerciseDefinition: VisualExerciseDefinition = {
  type: "visual",
  ...metadata,
  ExerciseClass: <ClassName>Exercise,
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

### 4.6: solution.jiki

```jikiscript
// TODO: Add Jikiscript solution
```

### 4.7: solution.javascript

```javascript
// TODO: Add JavaScript solution
```

### 4.8: solution.py

```python
# TODO: Add Python solution
```

### 4.9: stub.jiki

```jikiscript
// TODO: Add Jikiscript stub
```

### 4.10: stub.javascript

```javascript
// TODO: Add JavaScript stub
```

### 4.11: stub.py

```python
# TODO: Add Python stub
pass
```

## Step 5: Register Exercise

### 5.1: Add to src/exercises/index.ts

Add this line to the `exercises` object:

```typescript
"<slug>": () => import("./<slug>"),
```

### 5.2: Add to src/llm-metadata.ts

1. Add import at the top:

```typescript
import { llmMetadata as <camelCaseName>LLM } from "./exercises/<slug>/llm-metadata";
```

2. Add to the registry object:

```typescript
"<slug>": <camelCaseName>LLM,
```

## Step 6: Verify

Run typecheck to verify everything is set up correctly:

```bash
pnpm typecheck
```

## Summary

After completion, the following files will be created:

- `src/exercises/<slug>/metadata.json`
- `src/exercises/<slug>/Exercise.ts`
- `src/exercises/<slug>/scenarios.ts`
- `src/exercises/<slug>/llm-metadata.ts`
- `src/exercises/<slug>/index.ts`
- `src/exercises/<slug>/solution.jiki`
- `src/exercises/<slug>/solution.javascript`
- `src/exercises/<slug>/solution.py`
- `src/exercises/<slug>/stub.jiki`
- `src/exercises/<slug>/stub.javascript`
- `src/exercises/<slug>/stub.py`

And the exercise will be registered in:

- `src/exercises/index.ts`
- `src/llm-metadata.ts`

The exercise is now ready for implementation. Replace all `TODO` comments with actual content.
