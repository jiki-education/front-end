import {
  balancedRate,
  containsEitherWay,
  type FunctionCallLogEntry,
  helperCalls,
  lettersOnly,
  locMetric,
  takesStrings
} from "../progressionStdlib";
import type { ProgressionMetrics } from "../types";

// A naive "first character after a space" attempt already passes the
// all-capitalised scenarios. The rest (lowercase words, hyphens, underscores,
// emoji) need the two tools the student has to build by hand, since no string
// methods are allowed: uppercasing a letter and testing whether a character
// is a letter. These metrics grade those helpers before they are wired in
// correctly, found by the shape of their logged calls since students name
// them freely.

// The right answer for a letter-testing call.
function expectedLetterTest(entry: FunctionCallLogEntry): boolean {
  if (entry.args.length === 1) {
    return /^[a-zA-Z]$/.test(entry.args[0] as string);
  }
  // Haystack and needle may come in either order.
  return containsEitherWay(entry.args[0] as string, entry.args[1] as string);
}

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // The share of uppercasing calls (one string containing a lowercase
      // letter in, a string out) whose letters came back uppercased. Calls on
      // text with no lowercase letters are left out, since a helper that does
      // nothing would pass those.
      name: "uppercases_letters",
      maxScore: 1,
      points: 6,
      score: (runs) => {
        const calls = helperCalls(runs, "acronym").filter(
          (entry) => takesStrings(entry, 1) && /[a-z]/.test(entry.args[0] as string)
        );
        if (calls.length === 0) {
          return 0;
        }
        const correct = calls.filter(
          (entry) =>
            typeof entry.return === "string" &&
            lettersOnly(entry.return) === lettersOnly((entry.args[0] as string).toUpperCase())
        );
        return correct.length / calls.length;
      }
    },
    {
      // How often the letter-testing calls answered correctly. Two shapes
      // count: an is-it-a-letter helper (one character in, a boolean out) and
      // a contains helper searching an alphabet string (two strings in, a
      // boolean out, as in the reference solution).
      name: "letter_tests_correct",
      maxScore: 1,
      points: 4,
      score: (runs) => {
        const calls = helperCalls(runs, "acronym").filter(
          (entry) =>
            typeof entry.return === "boolean" &&
            ((takesStrings(entry, 1) && [...(entry.args[0] as string)].length === 1) || takesStrings(entry, 2))
        );
        if (calls.length === 0) {
          return 0;
        }
        // Averaged over the true and false cases separately, so the common
        // answer can't drown out the rare one.
        return balancedRate(calls, expectedLetterTest, (entry) => entry.return === expectedLetterTest(entry));
      }
    },
    // Matches the solve-tightly bonus target, which differs per language.
    locMetric({ target: { javascript: 46, jikiscript: 44, python: 33 }, points: 2 })
  ]
};
