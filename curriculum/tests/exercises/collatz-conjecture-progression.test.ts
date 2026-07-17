import { describe, expect, it } from "vitest";
import collatzExercise from "../../src/exercises/collatz-conjecture";
import { progressionMetrics } from "../../src/exercises/collatz-conjecture/progressionMetrics";
import solutionJavascript from "../../src/exercises/collatz-conjecture/solution.javascript?raw";
import solutionJiki from "../../src/exercises/collatz-conjecture/solution.jiki?raw";
import solutionPy from "../../src/exercises/collatz-conjecture/solution.py?raw";
import stubJavascript from "../../src/exercises/collatz-conjecture/stub.javascript?raw";
import stubJiki from "../../src/exercises/collatz-conjecture/stub.jiki?raw";
import stubPy from "../../src/exercises/collatz-conjecture/stub.py?raw";
import type { Language } from "../../src/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";
import { runProgressionMirror } from "./progressionMirror";

function runProgression(studentCode: string, language: Language) {
  const results = runExerciseTests(collatzExercise, studentCode, language);
  const runs = buildScenarioRuns(results, collatzExercise);
  return runProgressionMirror(progressionMetrics, runs, language);
}

const SOLUTIONS: Record<Language, string> = {
  jikiscript: solutionJiki,
  javascript: solutionJavascript,
  python: solutionPy
};

const STUBS: Record<Language, string> = {
  jikiscript: stubJiki,
  javascript: stubJavascript,
  python: stubPy
};

// Handles the halving rule but bails out on odd numbers.
const EVENS_ONLY_ATTEMPT = `function collatzSteps(number) {
  let idx = 0
  repeat() {
    if (number === 1) {
      return idx
    }
    if (number % 2 === 0) {
      number = number / 2
    } else {
      return idx
    }
    idx = idx + 1
  }
}`;

// Returns a number, but not the right one.
const WRONG_NUMBER_ATTEMPT = `function collatzSteps(number) {
  return number
}`;

describe("collatz-conjecture progression", () => {
  const languages: Language[] = ["jikiscript", "javascript", "python"];

  for (const language of languages) {
    it(`scores the full anchor plus both metrics for the ${language} solution`, () => {
      const scores = runProgression(SOLUTIONS[language], language);

      expect(scores).toEqual({
        score: 15,
        metrics: { scenarios: 10, uses_modulo: 3, returns_number: 2 }
      });
    });

    it(`scores 0 for the ${language} stub`, () => {
      const scores = runProgression(STUBS[language], language);

      expect(scores).toEqual({
        score: 0,
        metrics: { scenarios: 0, uses_modulo: 0, returns_number: 0 }
      });
    });
  }

  it("scores both metrics plus a partial anchor for an evens-only attempt", () => {
    const scores = runProgression(EVENS_ONLY_ATTEMPT, "javascript");

    // number-1 and number-16 (a pure power of two) pass: 2 of 4.
    expect(scores).toEqual({
      score: 10,
      metrics: { scenarios: 5, uses_modulo: 3, returns_number: 2 }
    });
  });

  it("scores only returns_number when the function returns the wrong number", () => {
    const scores = runProgression(WRONG_NUMBER_ATTEMPT, "javascript");

    expect(scores).toEqual({
      score: 2,
      metrics: { scenarios: 0, uses_modulo: 0, returns_number: 2 }
    });
  });
});
