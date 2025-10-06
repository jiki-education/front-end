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

  // Language-specific solutions (jikiscript is required)
  solutions: {
    jikiscript: string;
    javascript?: string;
    python?: string;
  };
}

export interface Task {
  id: string;
  name: string;
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
