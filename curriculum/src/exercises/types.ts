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
  progressionMetrics?: ProgressionMetrics; // Hidden progression calculator evaluated against the scenario runs
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
  ExerciseClass: typeof IOExercise;
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
  ExerciseClass: typeof IOExercise;
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
  slug?: string; // name the check when progression metrics need to target its run (e.g. "size-1")
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
  errorHtml?: string;
}

// Artifacts from one scenario run, made available to progression metrics.
// Progression tests never execute student code themselves - they evaluate the
// runs the visible scenarios already performed.
export interface ScenarioRun {
  scenarioSlug: string;
  passed: boolean;
  bonus?: boolean; // true when the scenario belongs to a bonus task
  isolated?: boolean; // true for a hidden isolated-check re-run of the scenario
  checkSlug?: string; // the isolated check's slug, when it has one
  exercise?: VisualExercise; // visual runs only: the (possibly halted) exercise instance
  result: InterpretResult | null; // null when the interpreter threw before producing a result
  actual?: IOValue; // IO runs only: the function's return value
}

// The collection of scenario runs a progression metric scores against.
// bySlug(scenarioSlug) returns the scenario's primary (non-isolated) run;
// bySlug(scenarioSlug, checkSlug) returns the named isolated-check run.
// allPassed() is true when every non-bonus primary run passed (i.e. the
// exercise is solved); anyResult() returns the first available
// InterpretResult (code-shape assertors reflect the parsed code, so any
// run's result serves).
export interface ScenarioRuns {
  all: ScenarioRun[];
  bySlug: (scenarioSlug: string, checkSlug?: string) => ScenarioRun | undefined;
  allPassed: () => boolean;
  anyResult: () => InterpretResult | undefined;
}

// Hidden progression metric - measures partial progress toward a solution
// from the scenario runs that already happened. The score function returns a
// value in the metric's natural units (steps, cells, 0/1 booleans); the
// evaluator clamps it to 0..maxScore and converts it to integer points
// weighted by `points` (the metric's worth relative to the fixed 10 points
// full scenario correctness is worth).
//
// Authoring notes (see app/.context/coding-exercise/progression.md):
// - Names are snake_case identifiers (JSONB keys on submissions, verbatim)
//   and must be unique across metrics and the reserved "scenarios" key -
//   a curriculum test enforces this.
// - Coupling to scenarios is by slug; the "solution scores full marks"
//   curriculum test is what catches drift when scenarios change.
// - Metrics on scenarios with randomSeed must be seed-agnostic.
// - Bump the progression version when metrics or scenarios change.
export interface ProgressionMetric {
  name: string; // snake_case identifier, e.g. "distance", "used_loop"
  maxScore: number; // natural units the score fn returns in
  points: number; // worth relative to the 10-point scenarios anchor
  score: (runs: ScenarioRuns, language: Language) => number; // returns 0..maxScore, evaluator clamps
}

// Hidden progression calculator - evaluated silently against the visible
// scenario runs to measure how far a student has got. Never shown to the
// student; scores are submitted per run.
//
// Exercise progressionMetrics files contain ONLY what is unique to that
// exercise; anything two exercises would write identically belongs in the
// progression stdlib (see progressionStdlib.ts, e.g. locMetric).
export interface ProgressionMetrics {
  version: number; // bump when the metric list or the scenarios change (encoding guard)
  metrics: ProgressionMetric[];
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
