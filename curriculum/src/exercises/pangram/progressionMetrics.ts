import { balancedRate, type FunctionCallLogEntry, helperCalls, lettersOnly, takesStrings } from "../progressionStdlib";
import type { ProgressionMetrics } from "../types";

// Students arrive with their lower-pangram code, which already passes every
// scenario except the mixed-case one, so the baseline barely moves. The work
// of this exercise is building case conversion by hand (no string methods
// exist at this level). These metrics grade the two helpers the instructions
// steer toward, found by the shape of their logged calls since students name
// them freely.

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // The headline concept: a hand-written toLowerCase that works. Scores
      // the share of its calls on text containing uppercase letters that came
      // back correctly lowercased. Calls on already-lowercase text are left
      // out, since a helper that does nothing would pass those.
      name: "lowercases_text",
      maxScore: 1,
      points: 8,
      score: (runs) => {
        const calls = helperCalls(runs, "isPangram").filter(
          (entry) => takesStrings(entry, 1) && /[A-Z]/.test(entry.args[0] as string)
        );
        if (calls.length === 0) {
          return 0;
        }
        // Compares letters only, so the helper may keep or drop spaces, digits
        // and punctuation (the reference solution drops them).
        const correct = calls.filter(
          (entry) =>
            typeof entry.return === "string" &&
            lettersOnly(entry.return) === lettersOnly((entry.args[0] as string).toLowerCase())
        );
        return correct.length / calls.length;
      }
    },
    {
      // The stepping stone: a working indexOf, which maps an uppercase letter
      // to its lowercase partner by position. Scores how often its calls
      // returned the right position (or -1 when absent). Jikiscript positions
      // count from 1.
      name: "index_of_correct",
      maxScore: 1,
      points: 3,
      score: (runs, language) => {
        const calls = helperCalls(runs, "isPangram").filter(
          (entry) => takesStrings(entry, 2) && typeof entry.return === "number"
        );
        if (calls.length === 0) {
          return 0;
        }
        const expectedPosition = (entry: FunctionCallLogEntry): number => {
          const [a, b] = entry.args as [string, string];
          // Haystack and needle may come in either order.
          const position = a.length >= b.length ? a.indexOf(b) : b.indexOf(a);
          return position === -1 ? -1 : language === "jikiscript" ? position + 1 : position;
        };
        // Averaged over the found and not-found cases separately, so the
        // common case can't drown out the rare one.
        return balancedRate(
          calls,
          (entry) => expectedPosition(entry) !== -1,
          (entry) => entry.return === expectedPosition(entry)
        );
      }
    }
  ]
};
