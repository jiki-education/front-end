import type { IOExercise, VisualExercise } from "../Exercise";
import type { LevelId } from "../levels";
import type { Change } from "diff";

// Base properties shared by all exercise definitions
interface BaseExerciseDefinition {
  // From metadata.json
  slug: string;
  title: string;
  instructions: string;
  estimatedMinutes: number;
  levelId: LevelId; // The level this exercise belongs to (determines allowed language features)

  // Core components
  initialCode: string;
  tasks: readonly Task[];

  // Optional
  hints?: string[];
  functions?: FunctionDoc[];
}

// Visual exercises with animations and state checking
export interface VisualExerciseDefinition extends BaseExerciseDefinition {
  type: "visual";
  ExerciseClass: new () => VisualExercise;
  scenarios: VisualScenario[];
}

// IO exercises that test function return values
export interface IOExerciseDefinition extends BaseExerciseDefinition {
  type: "io";
  ExerciseClass: typeof IOExercise;
  scenarios: IOScenario[];
}

// Discriminated union of exercise types
export type ExerciseDefinition = VisualExerciseDefinition | IOExerciseDefinition;

export interface FunctionDoc {
  name: string;
  description: string;
  usage: string;
}

export interface Task {
  id: string;
  name: string;
  description?: string;
  hints?: string[];
  requiredScenarios?: string[]; // Scenario slugs that must pass for task completion
  bonus?: boolean;
}

export interface VisualScenario {
  slug: string;
  name: string;
  description: string;
  taskId: string; // References the task this scenario belongs to
  setup: (exercise: VisualExercise) => void;
  expectations: (exercise: VisualExercise) => VisualTestExpect[];
}

export interface IOScenario {
  slug: string;
  name: string;
  description: string;
  taskId: string; // References the task this scenario belongs to
  functionName: string; // The function to call
  args: Array<string | number | boolean | null | undefined>; // Arguments to pass to the function
  expected: string | number | boolean; // Expected return value (must be defined)
  matcher?: "toBe" | "toEqual" | "toBeGreaterThan" | "toBeLessThan"; // Comparison method (defaults to toEqual)
}

// Union type for all scenario types
export type Scenario = VisualScenario | IOScenario;

// Visual test expectation - for state checks in visual exercises
export interface VisualTestExpect {
  type: "visual";
  pass: boolean;
  actual: string | number | boolean;
  expected?: string | number | boolean;
  errorHtml?: string;
  codeRun?: string;
}

// IO test expectation - for function return value checks
export interface IOTestExpect {
  type: "io";
  pass: boolean;
  actual: string | number | boolean | null | undefined;
  expected: string | number | boolean; // Expected value is always defined
  diff: Change[]; // Diff from 'diff' library
  matcher: string; // e.g., 'toBe', 'toEqual'
  codeRun?: string;
  errorHtml?: string;
}

// Union type for all test expectations
export type TestExpect = VisualTestExpect | IOTestExpect;

// Task Management Types
export interface TaskProgress {
  taskId: string;
  status: "not-started" | "in-progress" | "completed";
  passedScenarios: string[];
  totalScenarios: number;
  completedAt?: string;
}
