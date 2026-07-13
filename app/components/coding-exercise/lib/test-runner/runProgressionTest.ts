import type { ExerciseDefinition, Language, ProgressionMetric, VisualExercise } from "@jiki/curriculum";
import { getLanguageFeatures } from "@jiki/curriculum";
import type { InterpretResult } from "@jiki/interpreters/shared";
import { getInterpreter } from "./getInterpreter";

// Scores keyed by snake_cased metric name, in integer points.
export interface ProgressionTestResult {
  version: number;
  scores: Record<string, number>;
}

/**
 * Runs the exercise's hidden progression test against the student's code.
 *
 * Executes the code once against a fresh exercise instance with the
 * progression test's setup - no animation timeline, view, or frames are
 * produced. Each metric's score function runs in its own try/catch (a throw
 * scores 0) and its result is clamped to 0..maxScore, then converted to
 * integer points weighted by the metric's `points`.
 *
 * - Syntax/compile error: all-zero scores.
 * - Runtime error: metrics are still evaluated against the halted exercise
 *   state (partial progress is the signal).
 *
 * Returns null if the exercise has no progression test.
 */
export async function runProgressionTest(
  studentCode: string,
  exercise: ExerciseDefinition,
  language: Language
): Promise<ProgressionTestResult | null> {
  if (exercise.type !== "visual" || !exercise.progressionTest) {
    return null;
  }

  const progressionTest = exercise.progressionTest;
  const interpreter = await getInterpreter(language);

  const levelFeatures = getLanguageFeatures(exercise.levelId, language);
  const languageFeatures = {
    timePerFrame: 1,
    ...levelFeatures,
    ...exercise.interpreterOptions
  };

  const exerciseInstance = new exercise.ExerciseClass();
  progressionTest.setup?.(exerciseInstance);

  const interpreterContext = {
    externalFunctions: exerciseInstance.getExternalFunctions(language),
    classes: exerciseInstance.getExternalClasses(language),
    languageFeatures
  };

  // Syntax/compile errors mean no progress can be measured: every metric is 0.
  const compilationResult = interpreter.compile(studentCode, interpreterContext);
  if (!compilationResult.success) {
    return zeroScores(progressionTest.version, progressionTest.metrics);
  }

  let result: InterpretResult;
  try {
    result = interpreter.interpret(studentCode, interpreterContext);
  } catch {
    return zeroScores(progressionTest.version, progressionTest.metrics);
  }

  // Runtime errors leave the exercise in a halted-but-meaningful state, so the
  // metrics are still evaluated against it.
  const scores: Record<string, number> = {};
  for (const metric of progressionTest.metrics) {
    scores[scoreKey(metric.name)] = scoreMetric(metric, exerciseInstance, result, language);
  }

  return { version: progressionTest.version, scores };
}

function zeroScores(version: number, metrics: ProgressionMetric[]): ProgressionTestResult {
  const scores: Record<string, number> = {};
  for (const metric of metrics) {
    scores[scoreKey(metric.name)] = 0;
  }
  return { version, scores };
}

// Metric names are short-dash identifiers (e.g. "used-loop"); the API stores
// scores in a jsonb column keyed by snake_cased metric name.
function scoreKey(name: string): string {
  return name.replace(/-/g, "_");
}

function scoreMetric(
  metric: ProgressionMetric,
  exercise: VisualExercise,
  result: InterpretResult,
  language: Language
): number {
  let raw: number;
  try {
    raw = metric.score(exercise, result, language);
  } catch {
    raw = 0;
  }
  if (!Number.isFinite(raw) || metric.maxScore <= 0) {
    return 0;
  }
  const clamped = Math.min(Math.max(raw, 0), metric.maxScore);
  return Math.round((metric.points * clamped) / metric.maxScore);
}
