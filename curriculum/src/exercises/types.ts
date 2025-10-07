import type { Exercise } from "../Exercise";
import type { LevelId } from "../levels";

export interface ExerciseDefinition {
  // From metadata.json
  slug: string;
  title: string;
  instructions: string;
  estimatedMinutes: number;
  levelId: LevelId; // The level this exercise belongs to (determines allowed language features)

  // Core components
  initialCode: string;
  ExerciseClass: new () => Exercise;
  tasks: Task[];
  scenarios: Scenario[];

  // Optional
  hints?: string[];
  functions?: FunctionDoc[];
}

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
  setup: (exercise: Exercise) => void;
  expectations: (exercise: Exercise) => TestExpect[];
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
  completedAt?: Date;
}
