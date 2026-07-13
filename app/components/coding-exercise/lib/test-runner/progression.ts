import type { ProgressionScores } from "@/lib/api/lessons";
import type { ExerciseDefinition, Language, ProgressionMetric, ScenarioRun } from "@jiki/curriculum";
import { createScenarioRuns } from "@jiki/curriculum";

// Evaluates the exercise's hidden progression test against the scenario runs
// that already happened - progression NEVER executes student code itself.
//
// Every run submits a scores object with two framework-provided keys plus one
// key per authored metric (snake_cased metric name):
// - "v": the progression test version (0 when the exercise has none)
// - "scenarios": the free baseline - how many visible scenarios passed
// e.g. {"v": 1, "scenarios": 1, "distance": 5, "used_loop": 10, "precision": 0}

/**
 * Score the progression test from the completed scenario runs. Each metric's
 * score function runs in its own try/catch (a throw scores 0) and its result
 * is clamped to 0..maxScore, then converted to integer points weighted by the
 * metric's `points`. The run artifacts are released after this returns - they
 * never reach the store or the UI.
 */
export function evaluateProgression(
  exercise: ExerciseDefinition,
  language: Language,
  runs: ScenarioRun[],
  passingScenarioCount: number
): ProgressionScores {
  const scores: ProgressionScores = {
    v: exercise.progressionTest?.version ?? 0,
    scenarios: passingScenarioCount
  };

  const progressionTest = exercise.progressionTest;
  if (!progressionTest) {
    return scores;
  }

  const scenarioRuns = createScenarioRuns(runs);
  for (const metric of progressionTest.metrics) {
    scores[scoreKey(metric.name)] = scoreMetric(metric, scenarioRuns, language);
  }
  return scores;
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
    scores[scoreKey(metric.name)] = 0;
  }
  return scores;
}

// Metric names are short-dash identifiers (e.g. "used-loop"); the API stores
// scores keyed by snake_cased metric name.
function scoreKey(name: string): string {
  return name.replace(/-/g, "_");
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
