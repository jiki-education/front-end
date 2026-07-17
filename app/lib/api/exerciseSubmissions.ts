import { api } from "./client";

// Hidden progression scores for a single run: the progression version, the
// precomputed total, and the keyed breakdown - the framework "scenarios"
// anchor plus one snake_case key per authored metric, e.g.
// { v: 1, score: 27, metrics: { scenarios: 10, distance: 5, used_loop: 10, precision: 2 } }.
export interface ProgressionScores {
  v: number;
  score: number;
  metrics: Record<string, number>;
}

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
