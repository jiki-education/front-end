import type { VisualExercise, IOExercise } from "../Exercise";
import type { LevelId } from "../levels";

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
  tasks: Task[];

  // Optional
  hints?: string[];
  functions?: FunctionDoc[];
}

// Visual exercises with animations and state checking
export interface VisualExerciseDefinition extends BaseExerciseDefinition {
  type: "visual";
  ExerciseClass: new () => VisualExercise;
  scenarios: Scenario[];
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

export interface Scenario {
  slug: string;
  name: string;
  description: string;
  taskId: string; // References the task this scenario belongs to
  setup: (exercise: VisualExercise) => void;
  expectations: (exercise: VisualExercise) => TestExpect[];
}

export interface IOScenario {
  slug: string;
  name: string;
  description: string;
  taskId: string; // References the task this scenario belongs to
  functionName: string; // The function to call
  args: any[]; // Arguments to pass to the function
  expected: any; // Expected return value
  matcher?: "toBe" | "toEqual" | "toBeGreaterThan" | "toBeLessThan"; // Comparison method (defaults to toEqual)
}

export interface TestExpect {
  pass: boolean;
  actual: string | number | boolean;
  expected: string | number | boolean;
  errorHtml: string;
}

// Task Management Types
export interface TaskProgress {
  taskId: string;
  status: "not-started" | "in-progress" | "completed";
  passedScenarios: string[];
  totalScenarios: number;
  completedAt?: string;
}
