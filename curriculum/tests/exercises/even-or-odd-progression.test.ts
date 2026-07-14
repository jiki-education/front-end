import { describe, expect, it } from "vitest";
import evenOrOddExercise from "../../src/exercises/even-or-odd";
import { progression } from "../../src/exercises/even-or-odd/progression";
import solutionJavascript from "../../src/exercises/even-or-odd/solution.javascript?raw";
import solutionJiki from "../../src/exercises/even-or-odd/solution.jiki?raw";
import solutionPy from "../../src/exercises/even-or-odd/solution.py?raw";
import stubJavascript from "../../src/exercises/even-or-odd/stub.javascript?raw";
import stubJiki from "../../src/exercises/even-or-odd/stub.jiki?raw";
import stubPy from "../../src/exercises/even-or-odd/stub.py?raw";
import type { Language } from "../../src/types";
import { buildScenarioRuns, runExerciseTests } from "../runScenarioTest";

// Bonus scenarios don't count toward the 10-point anchor.
const bonusTaskIds = new Set(evenOrOddExercise.tasks.filter((task) => task.bonus === true).map((task) => task.id));
const bonusSlugs = new Set(
  evenOrOddExercise.scenarios.filter((scenario) => bonusTaskIds.has(scenario.taskId)).map((scenario) => scenario.slug)
);

// Mirrors the app's progression evaluator: run the visible scenarios, compute
// the fixed 10-point scenarios anchor over the non-bonus scenarios, convert
// metric scores to points, and emit gauge values verbatim (omitted when
// undefined).
function runProgression(studentCode: string, language: Language): Record<string, number> {
  const results = runExerciseTests(evenOrOddExercise, studentCode, language);
  const runs = buildScenarioRuns(results);

  const nonBonus = results.filter((r) => !bonusSlugs.has(r.slug));
  const passing = nonBonus.filter((r) => r.status === "pass").length;
  const scores: Record<string, number> = {
    scenarios: Math.round((passing / nonBonus.length) * 10)
  };

  for (const metric of progression.metrics) {
    let raw: number;
    try {
      raw = metric.score(runs, language);
    } catch {
      raw = 0;
    }
    const clamped = Math.min(Math.max(raw, 0), metric.maxScore);
    scores[metric.name] = Math.round((metric.points * clamped) / metric.maxScore);
  }

  for (const gauge of progression.gauges ?? []) {
    const value = gauge.value(runs, language);
    if (value !== undefined) {
      scores[gauge.name] = value;
    }
  }

  return scores;
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

// Returns lowercase "even"/"odd" - behaviourally close but capitalisation matters.
const LOWERCASE_ATTEMPT = `function evenOrOdd(number) {
  if (number % 2 === 0) {
    return "even"
  }
  return "odd"
}`;

// Always returns "Even" - right for the even and zero scenarios, wrong for the odd ones.
const CONSTANT_ATTEMPT = `function evenOrOdd(number) {
  return "Even"
}`;

describe("even-or-odd progression", () => {
  const languages: Language[] = ["jikiscript", "javascript", "python"];

  for (const language of languages) {
    it(`scores the full anchor, uses_modulo, and a loc gauge for the ${language} solution`, () => {
      const scores = runProgression(SOLUTIONS[language], language);

      expect(scores.scenarios).toBe(10);
      expect(scores.uses_modulo).toBe(3);
      // The solutions fit the bonus's line limit, so the gauge is at or under it.
      expect(scores.loc).toBeGreaterThan(0);
      expect(scores.loc).toBeLessThanOrEqual(language === "python" ? 4 : 6);
    });

    it(`scores 0 with no loc gauge for the ${language} stub`, () => {
      const scores = runProgression(STUBS[language], language);

      expect(scores).toEqual({ scenarios: 0, uses_modulo: 0 });
      expect("loc" in scores).toBe(false);
    });
  }

  it('scores uses_modulo but no anchor or loc for lowercase "even"/"odd" (capitalisation matters)', () => {
    const scores = runProgression(LOWERCASE_ATTEMPT, "javascript");

    expect(scores).toEqual({ scenarios: 0, uses_modulo: 3 });
  });

  it("scores a partial anchor for a constant return, with no loc gauge", () => {
    const scores = runProgression(CONSTANT_ATTEMPT, "javascript");

    // The two even scenarios and zero pass: 3 of 5 non-bonus scenarios.
    expect(scores).toEqual({ scenarios: 6, uses_modulo: 0 });
  });
});
