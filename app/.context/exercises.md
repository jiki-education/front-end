# Exercise System

The exercise system provides a structured way to create and manage coding exercises in Jiki.

## Navigation

- **Context Root**: [.context/README.md](./README.md)
- **Related**:
  - [Complex Exercise System](./coding-exercise/README.md) - Exercise execution environment
  - [Orchestrator Pattern](./coding-exercise/orchestrator-pattern.md) - How exercises are managed

## Directory Structure

Exercises live in `components/exercises/` with the following structure:

```
components/exercises/
├── index.ts                 # Exercise registry with dynamic imports
├── types.ts                 # Shared type definitions
└── [exercise-slug]/         # Individual exercise directory
    ├── index.ts            # Main export (ExerciseDefinition)
    ├── Exercise.ts         # Exercise class implementation
    ├── scenarios.ts        # Tasks and test scenarios
    └── metadata.json       # Exercise metadata and content
```

## Core Types

### ExerciseDefinition

The main interface that defines an exercise:

```typescript
export interface ExerciseDefinition {
  slug: string; // Unique identifier (e.g., "basic-movement")
  title: string; // Display title
  instructions: string; // User-facing instructions
  estimatedMinutes: number; // Time estimate
  initialCode: string; // Starting code template
  ExerciseClass: new () => Exercise; // Exercise implementation
  tasks: Task[]; // Exercise tasks
  scenarios: Scenario[]; // Test scenarios
  hints?: string[]; // Optional hints
  solution?: string; // Optional solution
}
```

### Task

Represents a specific task within an exercise:

```typescript
export interface Task {
  id: string; // Unique task identifier
  name: string; // Display name
  bonus: boolean; // Whether this is a bonus task
}
```

### Scenario

Defines a test scenario for an exercise:

```typescript
export interface Scenario {
  id: string;
  slug: string;
  name: string;
  description: string;
  taskId: string; // References the task this scenario belongs to
  setup: (exercise: any) => void;
  expectations: (exercise: any) => TestExpect[];
}
```

## Creating a New Exercise

### 1. Create Exercise Directory

Create a new directory under `components/exercises/` with your exercise slug:

```
components/exercises/your-exercise-slug/
```

### 2. Define Metadata (metadata.json)

Create `metadata.json` with all static content:

```json
{
  "slug": "your-exercise-slug",
  "title": "Your Exercise Title",
  "instructions": "Clear instructions for the user",
  "estimatedMinutes": 10,
  "initialCode": "// Starting code template\n",
  "hints": ["First hint", "Second hint"],
  "solution": "// Complete solution\n"
}
```

### 3. Implement Exercise Class (Exercise.ts)

Create the exercise implementation extending the base Exercise class:

```typescript
import { Exercise } from "@/components/coding-exercise/lib/mock-exercise/Exercise";

export default class YourExercise extends Exercise {
  // Exercise-specific properties
  private someProperty = 0;

  // Implement required methods
  getState(): Record<string, any> {
    return {
      someProperty: this.someProperty
    };
  }

  // Exercise-specific methods
  doSomething() {
    this.someProperty++;
  }

  // Optional: populate the view with custom HTML
  protected populateView() {
    // Add elements to this.view
  }
}
```

### 4. Define Tasks and Scenarios (scenarios.ts)

Define the tasks and test scenarios:

```typescript
import type { Task, Scenario } from "../types";
import type YourExercise from "./Exercise";

export const tasks: Task[] = [
  {
    id: "main-task",
    name: "Main Task",
    bonus: false
  }
];

export const scenarios: Scenario[] = [
  {
    id: "scenario-1",
    slug: "scenario-1",
    name: "First Scenario",
    description: "Test description",
    taskId: "main-task",
    setup: (exercise: YourExercise) => {
      // Set up initial state
    },
    expectations: (exercise: YourExercise) => {
      return [
        {
          passed: exercise.someProperty === expectedValue,
          actual: exercise.someProperty,
          expected: expectedValue,
          errorHtml: `Expected ${expectedValue}, got ${exercise.someProperty}`
        }
      ];
    }
  }
];
```

### 5. Export Exercise Definition (index.ts)

Combine everything into an ExerciseDefinition:

```typescript
import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { ExerciseDefinition } from "../types";

const exerciseDefinition: ExerciseDefinition = {
  ...metadata, // Spreads all fields from metadata.json
  ExerciseClass,
  tasks,
  scenarios
};

export default exerciseDefinition;
```

### 6. Register in Exercise Index

Add your exercise to `components/exercises/index.ts`:

```typescript
export const exercises = {
  "your-exercise-slug": () => import("./your-exercise-slug")
  // ... other exercises
} as const;
```

## Usage in Components

Exercises are loaded asynchronously and passed to the Orchestrator:

```typescript
// In CodingExercise component
const [orchestrator, setOrchestrator] = useState<Orchestrator | null>(null);

useEffect(() => {
  const loadExercise = async () => {
    const loader = exercises[exerciseSlug];
    const exercise = (await loader()).default;
    setOrchestrator(new Orchestrator(exercise));
  };
  void loadExercise();
}, [exerciseSlug]);
```

## Best Practices

1. **Keep metadata in JSON**: All static content should be in `metadata.json` for easy editing
2. **Type safety**: Use TypeScript interfaces for all exercise data
3. **Clear naming**: Use descriptive slugs and IDs that match the exercise purpose
4. **Comprehensive tests**: Include multiple scenarios covering edge cases
5. **User-friendly content**: Write clear instructions, helpful hints, and complete solutions
6. **Separation of concerns**: Keep exercise logic in the Exercise class, test logic in scenarios

## Example Exercise

See `components/exercises/basic-movement/` for a complete example of an exercise implementation.
