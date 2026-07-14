import type { ProgressionScores } from "@/lib/api/exerciseSubmissions";
import type { ExerciseDefinition, Language, ProgressionGauge, ProgressionMetric, ScenarioRun } from "@jiki/curriculum";
import { createScenarioRuns } from "@jiki/curriculum";
import { bonusScenarioSlugs } from "../bonusScenarios";
import type { TestResult } from "../test-results-types";

// Evaluates the exercise's hidden progression calculator against the scenario
// runs that already happened - progression NEVER executes student code.
// See .context/coding-exercise/progression.md.
//
// Every run submits a keyed scores object:
// - "v": the progression version (0 when the exercise defines none)
// - "scenarios": the framework baseline - a fixed 10-point anchor,
//   round(passing / total * 10) over the non-bonus scenarios
// - one key per authored metric: integer points, weighted against the anchor
// - one key per authored gauge: the raw observed value, omitted when the
//   gauge returns undefined; excluded from any tally semantics
// e.g. {"v": 1, "scenarios": 10, "used_loop": 10, "distance": 5, "loc": 6}

/**
 * Score the progression from the completed test results, whose attached run
 * artifacts (exercise instances, interpreter results, return values) form the
 * ScenarioRuns collection metrics and gauges read. Each metric's score
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
    v: exercise.progression?.version ?? 0,
    scenarios: scenariosBaseline(exercise, tests)
  };

  const progression = exercise.progression;
  if (!progression) {
    return scores;
  }

  const scenarioRuns = createScenarioRuns(tests.flatMap(scenarioRunsFromTest));
  for (const metric of progression.metrics) {
    scores[metric.name] = scoreMetric(metric, scenarioRuns, language);
  }
  for (const gauge of progression.gauges ?? []) {
    const value = readGauge(gauge, scenarioRuns, language);
    if (value !== undefined) {
      scores[gauge.name] = value;
    }
  }
  return scores;
}

// The fixed 10-point correctness anchor: solving the exercise is always worth
// 10, however many scenarios it happens to have. Bonus scenarios don't count
// toward it (in either direction).
function scenariosBaseline(exercise: ExerciseDefinition, tests: TestResult[]): number {
  const bonusSlugs = bonusScenarioSlugs(exercise);
  const nonBonusTests = tests.filter((test) => !bonusSlugs.has(test.slug));
  if (nonBonusTests.length === 0) {
    return 0;
  }
  const passing = nonBonusTests.filter((test) => test.status === "pass" || test.status === "lint_warning").length;
  return Math.round((passing / nonBonusTests.length) * 10);
}

// Assemble the metric-facing ScenarioRun views from a test result's attached
// artifacts: the primary run, plus one entry per isolated-check re-run.
function scenarioRunsFromTest(test: TestResult): ScenarioRun[] {
  const passed = test.status !== "fail";

  if (test.type === "visual") {
    return [
      { scenarioSlug: test.slug, passed, exercise: test.exercise, result: test.result },
      ...test.isolatedRuns.map((isolated) => ({
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
 * baseline, zero for every authored metric, and no gauges (there is nothing
 * to observe).
 */
export function zeroProgressionScores(exercise: ExerciseDefinition): ProgressionScores {
  const scores: ProgressionScores = {
    v: exercise.progression?.version ?? 0,
    scenarios: 0
  };
  for (const metric of exercise.progression?.metrics ?? []) {
    scores[metric.name] = 0;
  }
  return scores;
}

// A gauge's value is emitted verbatim; undefined (or a throw, or a
// non-finite number) omits the key for this run.
function readGauge(
  gauge: ProgressionGauge,
  runs: ReturnType<typeof createScenarioRuns>,
  language: Language
): number | undefined {
  let value: number | undefined;
  try {
    value = gauge.value(runs, language);
  } catch {
    return undefined;
  }
  if (value === undefined || !Number.isFinite(value)) {
    return undefined;
  }
  return value;
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
