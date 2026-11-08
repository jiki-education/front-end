import { levenshtein } from "./levenshtein";

// Finds the candidate closest to a name the student typed but that doesn't exist,
// for "did you mean" errors. Names are compared case-insensitively, so a name that
// differs only in capitalisation (`turnright` vs `turnRight`) is always suggested.
// Beyond that, the allowed distance grows with the name's length (one edit per
// three characters, at most two), so short names like `x` never suggest `y`.
// Returns null when nothing is close enough. Ties go to the earliest candidate.
export function suggestSimilarName(name: string, candidates: Iterable<string>): string | null {
  const lowerName = name.toLowerCase();
  const maxDistance = Math.min(2, Math.floor(name.length / 3));

  let best: string | null = null;
  let bestDistance = Infinity;
  for (const candidate of candidates) {
    if (candidate === name) {
      continue;
    }
    const distance = levenshtein(lowerName, candidate.toLowerCase());
    if (distance <= maxDistance && distance < bestDistance) {
      best = candidate;
      bestDistance = distance;
    }
  }
  return best;
}
