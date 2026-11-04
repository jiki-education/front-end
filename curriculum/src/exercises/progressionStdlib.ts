import type { InterpretResult } from "@jiki/interpreters";
import type { Language } from "../types";
import type { ProgressionMetric, ScenarioRun, ScenarioRuns } from "./types";

// Progression stdlib: metrics and helpers any exercise can import. Exercise
// progressionMetrics files contain ONLY what is unique to that exercise;
// anything two exercises would write identically belongs here.

export type FunctionCallLogEntry = InterpretResult["meta"]["functionCallLog"][number];

/**
 * Lines-of-code metric for exercises with a line-count bonus target. Scores 0
 * until the exercise is solved (every non-bonus scenario passing); from then
 * on, points scale up as the code shrinks toward `target` lines - full
 * points at or under the target. Pass a per-language record when the bonus
 * check's limit differs by language.
 */
export function locMetric({
  target,
  points
}: {
  target: number | Record<Language, number>;
  points: number;
}): ProgressionMetric {
  return {
    name: "loc",
    maxScore: 1,
    points,
    score: (runs, language) => {
      if (!runs.allPassed()) {
        return 0;
      }
      const linesOfCode = runs.anyResult()?.assertors.countLinesOfCode();
      if (linesOfCode === undefined || linesOfCode <= 0) {
        return 0;
      }
      const languageTarget = typeof target === "number" ? target : target[language];
      return Math.min(languageTarget / linesOfCode, 1);
    }
  };
}

// The first result whose code parsed. A parse-error result carries
// placeholder assertors that answer true to everything, so it can't be
// trusted. Runtime errors surface as frame errors and leave `result.error`
// empty, so their (real) assertors are still used. Every run parses the same
// code, so any parsed result serves for code-shape checks.
export function trustedResult(runs: ScenarioRuns): InterpretResult | undefined {
  return runs.all.find((run) => run.result !== null && !run.result.error)?.result ?? undefined;
}

// The primary runs: every scenario's own run, without isolated-check re-runs
// or bonus scenarios.
export function primaryRuns(runs: ScenarioRuns): ScenarioRun[] {
  return runs.all.filter((run) => run.isolated !== true && run.bonus !== true);
}

// The mean of a per-run score over the primary runs. A run scored as
// undefined is left out of the mean (for scenarios the score doesn't apply
// to). Returns 0 when no run is scored.
export function averageOverRuns(runs: ScenarioRuns, perRun: (run: ScenarioRun) => number | undefined): number {
  const scores = primaryRuns(runs)
    .map(perRun)
    .filter((score): score is number => score !== undefined);
  if (scores.length === 0) {
    return 0;
  }
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
}

// Loop statements emit one frame per iteration in every language. Python
// emits one extra frame as the loop starts, which is subtracted.
const LOOP_STATEMENTS = new Set(["ForOfStatement", "ForInStatement", "ForeachStatement"]);

// How many times a run's for-each loops iterated, summed across every such
// loop in the run.
export function loopIterations(run: ScenarioRun | undefined, language: Language): number {
  const frames = run?.result?.frames ?? [];
  const loopFrames = frames.filter((frame) => {
    const type = (frame.context as { type?: string } | undefined)?.type;
    return type !== undefined && LOOP_STATEMENTS.has(type);
  }).length;
  return language === "python" ? Math.max(loopFrames - 1, 0) : loopFrames;
}

// The array-append method in each language: push in JavaScript and
// Jikiscript, append in Python.
export const PUSH_METHODS = ["push", "append"];

// The runtime calls a run made to any of the given methods. JavaScript logs a
// method call as "<receiver>.<method>" (e.g. "null.push"), while Jikiscript and
// Python log the bare name, so both forms match.
export function methodCalls(run: ScenarioRun | undefined, methods: string[]): FunctionCallLogEntry[] {
  return (run?.result?.meta.functionCallLog ?? []).filter((entry) =>
    methods.some((method) => entry.name === method || entry.name.endsWith(`.${method}`))
  );
}

// A function name with underscores and dots removed and lowercased, so the
// snake_case and camelCase spellings of a name compare equal.
export function normalizeName(name: string): string {
  return name.replace(/[._]/g, "").toLowerCase();
}

// Every runtime call a run made to a function the student wrote other than
// `entryFunction` (matched in any spelling). JavaScript method calls are
// logged as "receiver.method", so dotted names are left out.
export function helperCallsIn(run: ScenarioRun | undefined, entryFunction: string): FunctionCallLogEntry[] {
  const entry = normalizeName(entryFunction);
  return (run?.result?.meta.functionCallLog ?? []).filter(
    (call) => !call.name.includes(".") && normalizeName(call.name) !== entry
  );
}

// helperCallsIn across every run.
export function helperCalls(runs: ScenarioRuns, entryFunction: string): FunctionCallLogEntry[] {
  return runs.all.flatMap((run) => helperCallsIn(run, entryFunction));
}

// True when a logged call took exactly `count` arguments, all strings.
export function takesStrings(entry: FunctionCallLogEntry, count: number): boolean {
  return entry.args.length === count && entry.args.every((arg) => typeof arg === "string");
}

// Call-log values are plain values in some interpreters and wrapped Jiki
// objects (with a `value` field) in others. This returns the plain value.
export function unwrap(value: unknown): unknown {
  if (typeof value === "object" && value !== null && "value" in value) {
    return (value as { value: unknown }).value;
  }
  return value;
}

// The letters of a string with everything else removed, for comparing text
// where a helper may keep or drop spaces, digits and punctuation.
export function lettersOnly(text: string): string {
  return text.replace(/[^a-zA-Z]/g, "");
}

// True when the longer string contains the shorter, for helpers that take a
// haystack and a needle in whichever order the student chose.
export function containsEitherWay(a: string, b: string): boolean {
  return a.length >= b.length ? a.includes(b) : b.includes(a);
}

// The share of items that are correct, averaged over the items where
// `isPositive` is true and those where it is false (each group counted only
// when it is non-empty), so a common case can't drown out a rare one.
// Returns 0 for no items.
export function balancedRate<T>(items: T[], isPositive: (item: T) => boolean, isCorrect: (item: T) => boolean): number {
  const rates = [true, false].flatMap((positive) => {
    const group = items.filter((item) => isPositive(item) === positive);
    return group.length === 0 ? [] : [group.filter(isCorrect).length / group.length];
  });
  return rates.length === 0 ? 0 : rates.reduce((sum, rate) => sum + rate, 0) / rates.length;
}

// 1 when both runs returned a boolean and the booleans differ. Two scenarios
// whose inputs differ in one detail and whose answers differ show the
// student's code reacts to that detail, which a constant answer can't fake.
export function answersDiffer(runs: ScenarioRuns, slugA: string, slugB: string): number {
  const a = runs.bySlug(slugA)?.actual;
  const b = runs.bySlug(slugB)?.actual;
  return typeof a === "boolean" && typeof b === "boolean" && a !== b ? 1 : 0;
}

// A number at the end of a string, ignoring trailing whitespace.
export const TRAILING_NUMBER = /(\d+)\s*$/;

// The number at the end of a returned value. A bare number counts as itself.
// Returns undefined when there is no such number.
export function trailingNumber(value: unknown): number | undefined {
  if (typeof value === "number") {
    return value;
  }
  if (typeof value !== "string") {
    return undefined;
  }
  const match = TRAILING_NUMBER.exec(value);
  return match ? Number(match[1]) : undefined;
}

// How far a returned string has moved from the input toward the expected
// output, from 0 (no closer than the input itself) to 1 (exactly right).
// Returns undefined when the input or expected value isn't a string, or when
// they are equal, since echoing the input would then pass without any work.
export function stringProgress(input: unknown, expected: unknown, actual: unknown): number | undefined {
  if (typeof input !== "string" || typeof expected !== "string" || input === expected) {
    return undefined;
  }
  if (typeof actual !== "string") {
    return 0;
  }
  const baseline = similarity(input, expected);
  return Math.max(0, (similarity(actual, expected) - baseline) / (1 - baseline));
}

// 2 * LCS / combined length: 1 for identical strings, 0 for nothing in common.
function similarity(a: string, b: string): number {
  if (a.length + b.length === 0) {
    return 1;
  }
  return (2 * longestCommonSubsequence(a, b)) / (a.length + b.length);
}

function longestCommonSubsequence(a: string, b: string): number {
  const previous = new Array<number>(b.length + 1).fill(0);
  for (let i = 1; i <= a.length; i++) {
    let diagonal = 0;
    for (let j = 1; j <= b.length; j++) {
      const above = previous[j];
      previous[j] = a[i - 1] === b[j - 1] ? diagonal + 1 : Math.max(previous[j], previous[j - 1]);
      diagonal = above;
    }
  }
  return previous[b.length];
}
