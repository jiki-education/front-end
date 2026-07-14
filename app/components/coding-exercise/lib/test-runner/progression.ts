import type { ProgressionScores } from "@/lib/api/exerciseSubmissions";
import type { ExerciseDefinition, Language, ProgressionMetric, ScenarioRun } from "@jiki/curriculum";
import { createScenarioRuns } from "@jiki/curriculum";
import type { TestResult } from "../test-results-types";

// Evaluates the exercise's hidden progression test against the scenario runs
// that already happened - progression NEVER executes student code itself.
//
// Every run submits a scores object with two framework-provided keys plus one
// key per authored metric (metric names are snake_case identifiers, used
// verbatim as JSONB keys):
// - "v": the progression test version (0 when the exercise has none)
// - "scenarios": the free baseline - how many visible scenarios passed
// e.g. {"v": 1, "scenarios": 1, "distance": 5, "used_loop": 10, "precision": 0}

/**
 * Score the progression test from the completed test results, whose attached
 * run artifacts (exercise instances, interpreter results, return values) form
 * the ScenarioRuns collection metrics score against. Each metric's score
 * function runs in its own try/catch (a throw scores 0) and its result is
 * clamped to 0..maxScore, then converted to integer points weighted by the
 * metric's `points`.
 */
export function evaluateProgression(
  exercise: ExerciseDefinition,
  language: Language,
  tests: TestResult[]
): ProgressionScores {
  const scores: ProgressionScores = {
    v: exercise.progressionTest?.version ?? 0,
    scenarios: tests.filter((test) => test.status !== "fail").length
  };

  const progressionTest = exercise.progressionTest;
  if (!progressionTest) {
    return scores;
  }

  const scenarioRuns = createScenarioRuns(tests.flatMap(scenarioRunsFromTest));
  for (const metric of progressionTest.metrics) {
    scores[metric.name] = scoreMetric(metric, scenarioRuns, language);
  }
  return scores;
}

// Assemble the metric-facing ScenarioRun views from a test result's attached
// artifacts: the primary run, plus one entry per isolated-check re-run.
function scenarioRunsFromTest(test: TestResult): ScenarioRun[] {
  const passed = test.status !== "fail";

  if (test.type === "visual") {
    return [
      { scenarioSlug: test.slug, passed, exercise: test.exercise, result: test.result },
      ...(test.isolatedRuns ?? []).map((isolated) => ({
        scenarioSlug: test.slug,
        passed: isolated.passed,
        isolated: true,
        checkSlug: isolated.checkSlug,
        exercise: isolated.exercise,
        result: isolated.result
      }))
    ];
  }

  return [
    {
      scenarioSlug: test.slug,
      passed,
      result: test.result ?? null,
      actual: test.expects[0]?.actual
    }
  ];
}

/**
 * The scores for a run where nothing executed (syntax/compile error): zero
 * passing scenarios and zero for every authored metric.
 */
export function zeroProgressionScores(exercise: ExerciseDefinition): ProgressionScores {
  const scores: ProgressionScores = {
    v: exercise.progressionTest?.version ?? 0,
    scenarios: 0
  };
  for (const metric of exercise.progressionTest?.metrics ?? []) {
    scores[metric.name] = 0;
  }
  return scores;
}

function scoreMetric(
  metric: ProgressionMetric,
  runs: ReturnType<typeof createScenarioRuns>,
  language: Language
): number {
  let raw: number;
  try {
    raw = metric.score(runs, language);
  } catch {
    raw = 0;
  }
  if (!Number.isFinite(raw) || metric.maxScore <= 0) {
    return 0;
  }
  const clamped = Math.min(Math.max(raw, 0), metric.maxScore);
  return Math.round((metric.points * clamped) / metric.maxScore);
}
