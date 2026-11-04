import type { ProgressionScores } from "@/lib/api/exerciseSubmissions";
import type { ExerciseDefinition, Language, ProgressionMetric, ScenarioRun } from "@jiki/curriculum";
import { createScenarioRuns } from "@jiki/curriculum";
import { bonusScenarioSlugs } from "../bonusScenarios";
import type { TestResult } from "../test-results-types";

// Evaluates the exercise's hidden progression calculator against the scenario
// runs that already happened - progression NEVER executes student code.
// See .context/coding-exercise/progression.md.
//
// Every run submits:
// - "v": the progression version (0 when the exercise defines none)
// - "score": the precomputed sum of every value in "metrics"
// - "metrics": the keyed breakdown - the framework "scenarios" anchor
//   (round(passing / total * 10) over non-bonus scenarios) plus one key per
//   authored metric (integer points, weighted against the anchor)
// e.g. {"v": 1, "score": 27, "metrics": {"scenarios": 10, "distance": 5, "used_loop": 10, "precision": 2}}

/**
 * Score the progression from the completed test results, whose attached run
 * artifacts (exercise instances, interpreter results, return values) form the
 * ScenarioRuns collection metrics read. Each metric's score function runs in
 * its own try/catch (a throw scores 0) and its result is clamped to
 * 0..maxScore, then converted to integer points weighted by the metric's
 * `points`.
 */
export function evaluateProgression(
  exercise: ExerciseDefinition,
  language: Language,
  tests: TestResult[]
): ProgressionScores {
  const bonusSlugs = bonusScenarioSlugs(exercise);
  const runs = tests.flatMap((test) => scenarioRunsFromTest(test, bonusSlugs));

  const metrics: Record<string, number> = {
    scenarios: scenariosBaseline(runs)
  };

  const metricDefinitions = exercise.progressionMetrics?.metrics ?? [];
  if (metricDefinitions.length > 0) {
    const scenarioRuns = createScenarioRuns(runs);
    for (const metric of metricDefinitions) {
      metrics[metric.name] = scoreMetric(metric, scenarioRuns, language);
    }
  }

  return {
    v: exercise.progressionMetrics?.version ?? 0,
    score: totalScore(metrics),
    metrics
  };
}

/**
 * The scores for a run where nothing executed (syntax/compile error): zero
 * baseline and zero for every authored metric.
 */
export function zeroProgressionScores(exercise: ExerciseDefinition): ProgressionScores {
  const metrics: Record<string, number> = { scenarios: 0 };
  for (const metric of exercise.progressionMetrics?.metrics ?? []) {
    metrics[metric.name] = 0;
  }
  return {
    v: exercise.progressionMetrics?.version ?? 0,
    score: 0,
    metrics
  };
}

// The fixed 10-point correctness anchor: solving the exercise is always worth
// 10, however many scenarios it happens to have. Bonus scenarios don't count
// toward it (in either direction).
function scenariosBaseline(runs: ScenarioRun[]): number {
  const primaryNonBonus = runs.filter((run) => run.isolated !== true && run.bonus !== true);
  if (primaryNonBonus.length === 0) {
    return 0;
  }
  const passing = primaryNonBonus.filter((run) => run.passed).length;
  return Math.round((passing / primaryNonBonus.length) * 10);
}

// Assemble the metric-facing ScenarioRun views from a test result's attached
// artifacts: the primary run, plus one entry per isolated-check re-run.
function scenarioRunsFromTest(test: TestResult, bonusSlugs: Set<string>): ScenarioRun[] {
  const passed = test.status === "pass" || test.status === "lint_warning";
  const bonus = bonusSlugs.has(test.slug);

  if (test.type === "visual") {
    return [
      { scenarioSlug: test.slug, passed, bonus, exercise: test.exercise, result: test.result },
      ...test.isolatedRuns.map((isolated) => ({
        scenarioSlug: test.slug,
        passed: isolated.passed,
        bonus,
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
      bonus,
      result: test.result ?? null,
      actual: test.expects[0]?.actual
    }
  ];
}

function totalScore(metrics: Record<string, number>): number {
  return Object.values(metrics).reduce((sum, value) => sum + value, 0);
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
