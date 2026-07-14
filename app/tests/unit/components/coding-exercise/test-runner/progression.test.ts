import { evaluateProgression, zeroProgressionScores } from "@/components/coding-exercise/lib/test-runner/progression";
import type { TestResult, VisualTestResult } from "@/components/coding-exercise/lib/test-results-types";
import { createMockInterpretResult } from "@/tests/mocks";
import type { ExerciseDefinition, ProgressionTest, VisualExercise } from "@jiki/curriculum";

function createExercise(progressionTest?: ProgressionTest): ExerciseDefinition {
  return {
    type: "visual",
    slug: "fake-exercise",
    levelId: "level-1",
    scenarios: [],
    tasks: [],
    progressionTest
  } as unknown as ExerciseDefinition;
}

function createVisualTest(overrides?: Partial<VisualTestResult>): TestResult {
  return {
    type: "visual",
    slug: "scenario-1",
    name: "Scenario 1",
    status: "pass",
    expects: [],
    frames: [],
    logLines: [],
    lintErrors: [],
    view: {} as HTMLElement,
    animationTimeline: {} as VisualTestResult["animationTimeline"],
    exercise: { id: "primary" } as unknown as VisualExercise,
    result: createMockInterpretResult(),
    ...overrides
  };
}

function createIOTest(overrides?: Partial<Extract<TestResult, { type: "io" }>>): TestResult {
  return {
    type: "io",
    slug: "number-14",
    name: "Number 14",
    status: "pass",
    expects: [],
    functionName: "even_or_odd",
    args: [14],
    frames: [],
    logLines: [],
    lintErrors: [],
    result: createMockInterpretResult(),
    ...overrides
  };
}

describe("evaluateProgression", () => {
  it("emits only the v0 baseline when the exercise has no progression test", () => {
    const tests = [createVisualTest(), createVisualTest({ slug: "scenario-2", status: "fail" })];

    const scores = evaluateProgression(createExercise(undefined), "jikiscript", tests);

    expect(scores).toEqual({ v: 0, scenarios: 1 });
  });

  it("counts lint_warning tests as passing scenarios", () => {
    const tests = [createVisualTest({ status: "lint_warning" }), createVisualTest({ slug: "s2", status: "fail" })];

    const scores = evaluateProgression(createExercise(undefined), "jikiscript", tests);

    expect(scores.scenarios).toBe(1);
  });

  it("emits the free scenarios baseline before authored metrics", () => {
    const exercise = createExercise({
      version: 1,
      metrics: [{ name: "distance", maxScore: 10, points: 5, score: () => 10 }]
    });

    const scores = evaluateProgression(exercise, "jikiscript", [createVisualTest()]);

    expect(scores).toEqual({ v: 1, scenarios: 1, distance: 5 });
    expect(Object.keys(scores)).toEqual(["v", "scenarios", "distance"]);
  });

  it("passes the runs assembled from the tests' artifacts and the language to each metric", () => {
    const score = jest.fn().mockReturnValue(1);
    const exercise = createExercise({ version: 1, metrics: [{ name: "metric", maxScore: 1, points: 1, score }] });
    const test = createVisualTest({ slug: "roll-ball" });

    evaluateProgression(exercise, "python", [test]);

    const [runs, language] = score.mock.calls[0];
    expect(language).toBe("python");
    expect(runs.all).toHaveLength(1);
    expect(runs.bySlug("roll-ball")).toMatchObject({
      scenarioSlug: "roll-ball",
      passed: true,
      exercise: (test as VisualTestResult).exercise,
      result: (test as VisualTestResult).result
    });
    expect(runs.bySlug("missing")).toBeUndefined();
  });

  it("exposes IO tests' interpreter result and actual return value", () => {
    const score = jest.fn().mockReturnValue(0);
    const exercise = createExercise({ version: 1, metrics: [{ name: "metric", maxScore: 1, points: 1, score }] });
    const test = createIOTest({
      expects: [{ pass: true, actual: "Even" }] as Extract<TestResult, { type: "io" }>["expects"]
    });

    evaluateProgression(exercise, "javascript", [test]);

    const [runs] = score.mock.calls[0];
    expect(runs.bySlug("number-14")).toMatchObject({ scenarioSlug: "number-14", passed: true, actual: "Even" });
  });

  it("exposes isolated-check runs via all and the two-arg bySlug lookup", () => {
    const score = jest.fn().mockReturnValue(0);
    const exercise = createExercise({ version: 1, metrics: [{ name: "metric", maxScore: 1, points: 1, score }] });
    const isolatedExercise = { id: "isolated" } as unknown as VisualExercise;
    const isolatedResult = createMockInterpretResult();
    const test = createVisualTest({
      slug: "shape",
      isolatedRuns: [
        { checkSlug: "size-1", passed: false, exercise: isolatedExercise, result: isolatedResult },
        { passed: true, exercise: isolatedExercise, result: isolatedResult }
      ]
    });

    evaluateProgression(exercise, "jikiscript", [test]);

    const [runs] = score.mock.calls[0];
    expect(runs.all).toHaveLength(3);
    // One-arg lookup returns the primary run, never an isolated one.
    expect(runs.bySlug("shape").isolated).toBeUndefined();
    // Two-arg lookup returns the named isolated run.
    expect(runs.bySlug("shape", "size-1")).toMatchObject({
      scenarioSlug: "shape",
      isolated: true,
      checkSlug: "size-1",
      passed: false
    });
    expect(runs.bySlug("shape", "unknown")).toBeUndefined();
  });

  it("converts raw scores to integer points, keyed by the metric name verbatim", () => {
    const exercise = createExercise({
      version: 1,
      metrics: [
        { name: "distance", maxScore: 60, points: 5, score: () => 30 }, // 2.5 -> 3
        { name: "used_loop", maxScore: 1, points: 10, score: () => 1 }
      ]
    });

    const scores = evaluateProgression(exercise, "jikiscript", [createVisualTest()]);

    expect(scores).toEqual({ v: 1, scenarios: 1, distance: 3, used_loop: 10 });
  });

  it("clamps raw scores to 0..maxScore", () => {
    const exercise = createExercise({
      version: 1,
      metrics: [
        { name: "over", maxScore: 10, points: 5, score: () => 999 },
        { name: "under", maxScore: 10, points: 5, score: () => -7 }
      ]
    });

    const scores = evaluateProgression(exercise, "jikiscript", []);

    expect(scores).toEqual({ v: 1, scenarios: 0, over: 5, under: 0 });
  });

  it("scores 0 for a metric whose score function throws, without affecting others", () => {
    const exercise = createExercise({
      version: 1,
      metrics: [
        {
          name: "broken",
          maxScore: 1,
          points: 5,
          score: () => {
            throw new Error("boom");
          }
        },
        { name: "fine", maxScore: 1, points: 2, score: () => 1 }
      ]
    });

    const scores = evaluateProgression(exercise, "jikiscript", []);

    expect(scores).toEqual({ v: 1, scenarios: 0, broken: 0, fine: 2 });
  });

  it("scores 0 for non-finite raw scores and non-positive maxScores", () => {
    const exercise = createExercise({
      version: 1,
      metrics: [
        { name: "nan", maxScore: 1, points: 5, score: () => NaN },
        { name: "infinite", maxScore: 1, points: 5, score: () => Infinity },
        { name: "zero_max", maxScore: 0, points: 5, score: () => 1 }
      ]
    });

    const scores = evaluateProgression(exercise, "jikiscript", []);

    expect(scores).toEqual({ v: 1, scenarios: 0, nan: 0, infinite: 0, zero_max: 0 });
  });
});

describe("zeroProgressionScores", () => {
  it("zeroes the baseline and every authored metric", () => {
    const exercise = createExercise({
      version: 3,
      metrics: [
        { name: "distance", maxScore: 60, points: 5, score: () => 60 },
        { name: "used_loop", maxScore: 1, points: 10, score: () => 1 }
      ]
    });

    expect(zeroProgressionScores(exercise)).toEqual({ v: 3, scenarios: 0, distance: 0, used_loop: 0 });
  });

  it("emits the v0 baseline when the exercise has no progression test", () => {
    expect(zeroProgressionScores(createExercise(undefined))).toEqual({ v: 0, scenarios: 0 });
  });
});
