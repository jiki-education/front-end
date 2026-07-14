import { api } from "./client";

// Hidden progression test scores for a single run: the progression test
// version, the free "scenarios" baseline, plus integer points keyed by
// snake_case metric name,
// e.g. { v: 1, scenarios: 1, distance: 5, used_loop: 10, precision: 0 }.
export type ProgressionScores = { v: number } & Record<string, number>;

/**
 * Attach the hidden progression scores for a run to its submission.
 * Submission uuids are globally unique, so no lesson/challenge context is
 * needed. Telemetry decoration: fire-and-forget, never surfaced to the
 * student.
 */
export async function updateExerciseSubmissionProgression(
  uuid: string,
  progressionScores: ProgressionScores
): Promise<void> {
  await api.patch(`/internal/exercise_submissions/${uuid}`, {
    progression_scores: progressionScores
  });
}
