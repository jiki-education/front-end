import type { Language } from "../../src/types";
import type { ProgressionMetrics, ScenarioRuns } from "../../src/exercises/types";

// Mirrors the app's progression evaluator: the fixed 10-point scenarios
// anchor over non-bonus primary runs, one integer-points key per metric
// (clamped to 0..maxScore, weighted by points), and a precomputed total.
export function runProgressionMirror(
  progression: ProgressionMetrics,
  runs: ScenarioRuns,
  language: Language
): { score: number; metrics: Record<string, number> } {
  const primaryNonBonus = runs.all.filter((run) => run.isolated !== true && run.bonus !== true);
  const passing = primaryNonBonus.filter((run) => run.passed).length;
  const metrics: Record<string, number> = {
    scenarios: primaryNonBonus.length === 0 ? 0 : Math.round((passing / primaryNonBonus.length) * 10)
  };

  for (const metric of progression.metrics) {
    let raw: number;
    try {
      raw = metric.score(runs, language);
    } catch {
      raw = 0;
    }
    const clamped = Math.min(Math.max(raw, 0), metric.maxScore);
    metrics[metric.name] = Math.round((metric.points * clamped) / metric.maxScore);
  }

  const score = Object.values(metrics).reduce((sum, value) => sum + value, 0);
  return { score, metrics };
}
