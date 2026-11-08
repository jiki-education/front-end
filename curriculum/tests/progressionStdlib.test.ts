import type { InterpretResult } from "@jiki/interpreters";
import { describe, expect, it } from "vitest";
import {
  answersDiffer,
  averageOverRuns,
  balancedRate,
  containsEitherWay,
  type FunctionCallLogEntry,
  helperCalls,
  helperCallsIn,
  lettersOnly,
  locMetric,
  loopIterations,
  methodCalls,
  normalizeName,
  primaryRuns,
  stringProgress,
  takesStrings,
  trailingNumber,
  trustedResult,
  unwrap
} from "../src/exercises/progressionStdlib";
import { createScenarioRuns } from "../src/exercises/scenarioRuns";
import type { ScenarioRun } from "../src/exercises/types";

interface FakeResult {
  error?: unknown;
  calls?: Array<Partial<FunctionCallLogEntry>>;
  frameTypes?: string[];
  linesOfCode?: number;
}

function fakeResult({ error = null, calls = [], frameTypes = [], linesOfCode = 0 }: FakeResult): InterpretResult {
  return {
    error,
    frames: frameTypes.map((type) => ({ context: { type } })),
    meta: { functionCallLog: calls.map((call) => ({ args: [], return: undefined, ...call })), statements: [] },
    assertors: { countLinesOfCode: () => linesOfCode }
  } as unknown as InterpretResult;
}

function run(overrides: Partial<ScenarioRun> = {}): ScenarioRun {
  return { scenarioSlug: "scenario", passed: true, result: null, ...overrides };
}

function call(name: string, args: unknown[] = [], returned?: unknown): Partial<FunctionCallLogEntry> {
  return { name, args, return: returned } as Partial<FunctionCallLogEntry>;
}

describe("locMetric", () => {
  const solved = (linesOfCode: number) => createScenarioRuns([run({ result: fakeResult({ linesOfCode }) })]);

  it("scores 0 until every non-bonus scenario passes", () => {
    const runs = createScenarioRuns([run({ passed: false, result: fakeResult({ linesOfCode: 1 }) })]);
    expect(locMetric({ target: 5, points: 2 }).score(runs, "javascript")).toBe(0);
  });

  it("scales toward a single target", () => {
    expect(locMetric({ target: 5, points: 2 }).score(solved(10), "javascript")).toBe(0.5);
    expect(locMetric({ target: 5, points: 2 }).score(solved(4), "python")).toBe(1);
  });

  it("reads a per-language target", () => {
    const metric = locMetric({ target: { javascript: 10, jikiscript: 8, python: 5 }, points: 2 });
    expect(metric.score(solved(10), "javascript")).toBe(1);
    expect(metric.score(solved(10), "jikiscript")).toBe(0.8);
    expect(metric.score(solved(10), "python")).toBe(0.5);
  });
});

describe("trustedResult", () => {
  it("skips parse-error results and null results", () => {
    const parsed = fakeResult({});
    const runs = createScenarioRuns([
      run({ result: null }),
      run({ result: fakeResult({ error: { type: "ParseError" } }) }),
      run({ result: parsed })
    ]);
    expect(trustedResult(runs)).toBe(parsed);
  });

  it("is undefined when nothing parsed", () => {
    expect(trustedResult(createScenarioRuns([run({ result: fakeResult({ error: {} }) })]))).toBeUndefined();
  });
});

describe("primaryRuns and averageOverRuns", () => {
  const primary = run({ scenarioSlug: "a" });
  const other = run({ scenarioSlug: "b" });
  const runs = createScenarioRuns([
    primary,
    other,
    run({ scenarioSlug: "a", isolated: true }),
    run({ scenarioSlug: "bonus", bonus: true })
  ]);

  it("keeps only primary, non-bonus runs", () => {
    expect(primaryRuns(runs)).toEqual([primary, other]);
  });

  it("averages over the scored runs and leaves undefined out", () => {
    expect(averageOverRuns(runs, (r) => (r.scenarioSlug === "a" ? 1 : 0))).toBe(0.5);
    expect(averageOverRuns(runs, (r) => (r.scenarioSlug === "a" ? 1 : undefined))).toBe(1);
    expect(averageOverRuns(runs, () => undefined)).toBe(0);
  });
});

describe("loopIterations", () => {
  const frameTypes = ["ForOfStatement", "ExpressionStatement", "ForOfStatement", "ForeachStatement"];

  it("counts loop-statement frames", () => {
    expect(loopIterations(run({ result: fakeResult({ frameTypes }) }), "javascript")).toBe(3);
  });

  it("drops Python's loop-start frame", () => {
    expect(loopIterations(run({ result: fakeResult({ frameTypes }) }), "python")).toBe(2);
    expect(loopIterations(run({ result: fakeResult({}) }), "python")).toBe(0);
  });

  it("is 0 without a run", () => {
    expect(loopIterations(undefined, "javascript")).toBe(0);
  });
});

describe("methodCalls", () => {
  it("matches bare and receiver-prefixed method names", () => {
    const calls = [call("null.push"), call("push"), call("append"), call("pusher"), call("x.pushed")];
    const matched = methodCalls(run({ result: fakeResult({ calls }) }), ["push", "append"]);
    expect(matched.map((entry) => entry.name)).toEqual(["null.push", "push", "append"]);
  });
});

describe("helper calls", () => {
  const calls = [call("isPangram"), call("is_pangram"), call("null.includes"), call("contains"), call("has_letter")];
  const helperRun = run({ result: fakeResult({ calls }) });

  it("normalizes names across spellings", () => {
    expect(normalizeName("is_pangram")).toBe(normalizeName("isPangram"));
  });

  it("leaves out the entry function and method calls", () => {
    expect(helperCallsIn(helperRun, "isPangram").map((entry) => entry.name)).toEqual(["contains", "has_letter"]);
  });

  it("collects across every run", () => {
    expect(helperCalls(createScenarioRuns([helperRun, helperRun]), "isPangram")).toHaveLength(4);
  });

  it("checks string arguments", () => {
    expect(takesStrings(call("f", ["a", "b"]) as FunctionCallLogEntry, 2)).toBe(true);
    expect(takesStrings(call("f", ["a", 1]) as FunctionCallLogEntry, 2)).toBe(false);
    expect(takesStrings(call("f", ["a"]) as FunctionCallLogEntry, 2)).toBe(false);
  });
});

describe("string helpers", () => {
  it("unwraps Jiki objects", () => {
    expect(unwrap({ value: 3 })).toBe(3);
    expect(unwrap(3)).toBe(3);
    expect(unwrap(null)).toBe(null);
  });

  it("keeps only letters", () => {
    expect(lettersOnly("a-B c1!")).toBe("aBc");
  });

  it("searches either way round", () => {
    expect(containsEitherWay("abc", "b")).toBe(true);
    expect(containsEitherWay("b", "abc")).toBe(true);
    expect(containsEitherWay("abc", "z")).toBe(false);
  });

  it("reads a trailing number", () => {
    expect(trailingNumber("That will cost $36")).toBe(36);
    expect(trailingNumber("Position 4  ")).toBe(4);
    expect(trailingNumber(7)).toBe(7);
    expect(trailingNumber("no number")).toBeUndefined();
    expect(trailingNumber(undefined)).toBeUndefined();
  });
});

describe("balancedRate", () => {
  it("averages the positive and negative groups separately", () => {
    // Three positives all right, one negative wrong.
    const items = [
      { positive: true, correct: true },
      { positive: true, correct: true },
      { positive: true, correct: true },
      { positive: false, correct: false }
    ];
    expect(
      balancedRate(
        items,
        (item) => item.positive,
        (item) => item.correct
      )
    ).toBe(0.5);
  });

  it("uses only the groups that have items", () => {
    expect(
      balancedRate(
        [1, 2],
        () => true,
        (n) => n === 1
      )
    ).toBe(0.5);
    expect(
      balancedRate(
        [],
        () => true,
        () => true
      )
    ).toBe(0);
  });
});

describe("answersDiffer", () => {
  it("is 1 only for two differing booleans", () => {
    const runsWith = (a: unknown, b: unknown) =>
      createScenarioRuns([
        run({ scenarioSlug: "a", actual: a as boolean }),
        run({ scenarioSlug: "b", actual: b as boolean })
      ]);
    expect(answersDiffer(runsWith(true, false), "a", "b")).toBe(1);
    expect(answersDiffer(runsWith(false, false), "a", "b")).toBe(0);
    expect(answersDiffer(runsWith(true, "false"), "a", "b")).toBe(0);
  });
});

describe("stringProgress", () => {
  it("is 1 for the expected output and 0 for echoing the input", () => {
    expect(stringProgress("abc", "xyz", "xyz")).toBe(1);
    expect(stringProgress("abc", "xyz", "abc")).toBe(0);
  });

  it("scores partial progress between the two", () => {
    const progress = stringProgress("abcd", "wxyz", "wxcd") ?? -1;
    expect(progress).toBeGreaterThan(0);
    expect(progress).toBeLessThan(1);
  });

  it("is 0 for a non-string answer", () => {
    expect(stringProgress("abc", "xyz", 3)).toBe(0);
  });

  it("is undefined when the expected output equals the input", () => {
    expect(stringProgress("aaa", "aaa", "aaa")).toBeUndefined();
    expect(stringProgress(1, "aaa", "aaa")).toBeUndefined();
  });
});
