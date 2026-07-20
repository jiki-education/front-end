import type { IOExercise } from "../IOExercise";
import type { VisualExercise } from "../VisualExercise";
import type { LevelId } from "../levels";
import type { Change } from "diff";
import type { Language } from "../types";
import type { InterpretResult } from "@jiki/interpreters";

// Readonly range for protecting code regions from editing
export interface ReadonlyRange {
  fromLine: number; // 1-indexed line number
  toLine: number; // 1-indexed line number
  fromChar?: number; // 0-indexed char offset on fromLine (default: start of line)
  toChar?: number; // 0-indexed char offset on toLine (default: end of line)
}

// Core properties exported by exercise modules (shared, language/locale-independent)
interface BaseExerciseCore {
  slug: string;
  levelId: LevelId; // The level this exercise belongs to (determines allowed language features)

  // Core components
  tasks: readonly Task[];

  // Documentation
  functions: FunctionInfo[]; // Available functions for this exercise

  // Optional
  hints?: Hint[];
  conceptSlugs?: string[];
  readonlyRanges?: Partial<Record<Language, ReadonlyRange[]>>; // Per-language readonly code regions
  interpreterOptions?: InterpreterOptions; // Per-exercise interpreter overrides (e.g., loop iteration limits)
  disableLogTab?: boolean; // Hide the Log tab in the RHS panel for this exercise
}

// Per-exercise interpreter options (overrides defaults when passed to interpreter)
export interface InterpreterOptions {
  maxTotalLoopIterations?: number;
  repeatDelay?: number;
}

// Visual exercise core (from curriculum module)
export interface VisualExerciseCore extends BaseExerciseCore {
  type: "visual";
  ExerciseClass: new () => VisualExercise;
  scenarios: VisualScenario[];
}

// IO exercise core (from curriculum module)
export interface IOExerciseCore extends BaseExerciseCore {
  type: "io";
  ExerciseClass: new () => IOExercise;
  scenarios: IOScenario[];
}

// What curriculum modules export
export type ExerciseCore = VisualExerciseCore | IOExerciseCore;

// Content loaded from static files (locale/language-specific)
interface ExerciseContent {
  title: string;
  description: string;
  instructions: string;
  stubs: Record<Language, string>;
  solutions: Record<Language, string>;
}

// Full assembled definition (core + content, used by Orchestrator and downstream)
export interface VisualExerciseDefinition extends BaseExerciseCore, ExerciseContent {
  type: "visual";
  ExerciseClass: new () => VisualExercise;
  scenarios: VisualScenario[];
}

export interface IOExerciseDefinition extends BaseExerciseCore, ExerciseContent {
  type: "io";
  ExerciseClass: new () => IOExercise;
  scenarios: IOScenario[];
}

export type ExerciseDefinition = VisualExerciseDefinition | IOExerciseDefinition;

export interface FunctionInfo {
  name: string;
  description: string;
  signature: string;
  examples?: string[];
  category: string;
}

export interface Hint {
  question: string;
  answer: string;
}

export interface Task {
  id: string;
  name: string;
  description?: string;
  hints?: Hint[];
  requiredScenarios?: string[]; // Scenario slugs that must pass for task completion
  bonus?: boolean;
}

export interface VisualScenario {
  slug: string;
  name: string;
  description: string;
  taskId: string; // References the task this scenario belongs to
  setup?: (exercise: VisualExercise) => void;
  expectations: (exercise: VisualExercise) => VisualTestExpect[];
  codeChecks?: CodeCheck[]; // Optional code quality checks
  isolatedChecks?: IsolatedCheck[]; // Hidden re-runs with silent preset variables
  functionCall?: {
    name: string;
    args: IOValue[];
  };
  randomSeed?: number | true; // number = fixed seed, true = generate random seed each run
}

// Hidden re-run of the student's code with `secretConstants` injected.
// The runner re-parses the source, executes with these constants seeded in the global
// scope, and evaluates `expectations`. Nothing from the isolated run is rendered to the
// student; the returned expectations are spread into the scenario's overall expects
// array, so authors control whether to surface one consolidated failure or one per shape
// by what they return from `expectations`.
export interface IsolatedCheck {
  secretConstants: Record<string, number | string | boolean>;
  expectations: (exercise: VisualExercise) => VisualTestExpect[];
}

// Recursive type to support nested arrays and objects in IO scenarios
export type IOValue = string | number | boolean | null | undefined | IOValue[] | { [key: string]: IOValue };

// Expected value must be defined (no null/undefined)
export type IOExpectedValue = string | number | boolean | IOExpectedValue[] | { [key: string]: IOExpectedValue };

// Code quality check result
export interface CodeCheckExpect {
  pass: boolean;
  errorHtml?: string;
}

// Code check definition
export interface CodeCheck {
  pass: (result: InterpretResult, language: Language) => boolean;
  // Curriculum-owned i18n key + params, resolved by the runner against the
  // exercise's injected message dict (codeChecks have no exercise instance in
  // scope, so they can't call `t` themselves).
  errorKey: string;
  errorParams?: Record<string, unknown>;
}

export interface IOScenario {
  slug: string;
  name: string;
  description: string;
  taskId: string; // References the task this scenario belongs to
  functionName: string; // The function to call
  args: Array<IOValue>; // Arguments to pass to the function (supports arrays, null, undefined)
  expected: IOExpectedValue; // Expected return value (must be defined, supports arrays but not null/undefined)
  matcher?: "toBe" | "toEqual" | "toBeGreaterThan" | "toBeLessThan"; // Comparison method (defaults to toEqual)
  codeChecks?: CodeCheck[]; // Optional code quality checks
}

// Union type for all scenario types
export type Scenario = VisualScenario | IOScenario;

// Visual test expectation - for state checks in visual exercises
export interface VisualTestExpect {
  pass: boolean;
  errorHtml?: string;
}

// IO test expectation - for function return value checks
export interface IOTestExpect {
  pass: boolean;
  actual: IOValue;
  expected: IOExpectedValue;
  diff: Change[]; // Diff from 'diff' library
  matcher: string; // e.g., 'toBe', 'toEqual'
  codeRun?: string; // The function call that was executed, for display
  errorHtml?: string;
  codeCheckResults?: CodeCheckExpect[]; // Code quality check results (if any)
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
