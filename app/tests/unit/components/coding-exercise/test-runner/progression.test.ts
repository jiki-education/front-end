import { evaluateProgression, zeroProgressionScores } from "@/components/coding-exercise/lib/test-runner/progression";
import type { TestResult, VisualTestResult } from "@/components/coding-exercise/lib/test-results-types";
import { createMockInterpretResult } from "@/tests/mocks";
import type { ExerciseDefinition, Progression, VisualExercise } from "@jiki/curriculum";

function createExercise(progression?: Progression): ExerciseDefinition {
  return {
    type: "visual",
    slug: "fake-exercise",
    levelId: "level-1",
    scenarios: [],
    tasks: [],
    progression
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
    isolatedRuns: [],
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
  it("emits only the v0 baseline when the exercise has no progression", () => {
    const tests = [createVisualTest(), createVisualTest({ slug: "scenario-2", status: "fail" })];

    const scores = evaluateProgression(createExercise(undefined), "jikiscript", tests);

    // The baseline is a fixed 10-point anchor: 1 of 2 scenarios passing.
    expect(scores).toEqual({ v: 0, scenarios: 5 });
  });

  it("counts lint_warning tests as passing scenarios", () => {
    const tests = [createVisualTest({ status: "lint_warning" }), createVisualTest({ slug: "s2", status: "fail" })];

    const scores = evaluateProgression(createExercise(undefined), "jikiscript", tests);

    expect(scores.scenarios).toBe(5);
  });

  it("does not count idle tests as passing", () => {
    const tests = [createVisualTest({ status: "idle" })];

    const scores = evaluateProgression(createExercise(undefined), "jikiscript", tests);

    expect(scores.scenarios).toBe(0);
  });

  it("excludes bonus scenarios from the baseline entirely", () => {
    const exercise = {
      ...createExercise(undefined),
      tasks: [
        { id: "main", name: "Main" },
        { id: "extra", name: "Extra", bonus: true }
      ],
      scenarios: [
        { slug: "scenario-1", taskId: "main" },
        { slug: "bonus-1", taskId: "extra" }
      ]
    } as unknown as ExerciseDefinition;
    const tests = [createVisualTest({ slug: "scenario-1" }), createVisualTest({ slug: "bonus-1", status: "fail" })];

    const scores = evaluateProgression(exercise, "jikiscript", tests);

    // The failing bonus scenario affects neither numerator nor denominator.
    expect(scores.scenarios).toBe(10);
  });

  it("scores a 0 baseline when there are no non-bonus tests", () => {
    const scores = evaluateProgression(createExercise(undefined), "jikiscript", []);

    expect(scores.scenarios).toBe(0);
  });

  it("emits the free scenarios baseline before authored metrics", () => {
    const exercise = createExercise({
      version: 1,
      metrics: [{ name: "distance", maxScore: 10, points: 5, score: () => 10 }]
    });

    const scores = evaluateProgression(exercise, "jikiscript", [createVisualTest()]);

    expect(scores).toEqual({ v: 1, scenarios: 10, distance: 5 });
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

    expect(scores).toEqual({ v: 1, scenarios: 10, distance: 3, used_loop: 10 });
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

describe("evaluateProgression gauges", () => {
  it("emits gauge values verbatim (raw value, not points)", () => {
    const exercise = createExercise({
      version: 1,
      metrics: [],
      gauges: [{ name: "loc", value: () => 7 }]
    });

    const scores = evaluateProgression(exercise, "javascript", [createVisualTest()]);

    expect(scores).toEqual({ v: 1, scenarios: 10, loc: 7 });
  });

  it("omits the key entirely when a gauge returns undefined", () => {
    const exercise = createExercise({
      version: 1,
      metrics: [],
      gauges: [{ name: "loc", value: () => undefined }]
    });

    const scores = evaluateProgression(exercise, "javascript", [createVisualTest()]);

    expect(scores).toEqual({ v: 1, scenarios: 10 });
    expect("loc" in scores).toBe(false);
  });

  it("omits the key when a gauge throws or returns a non-finite number", () => {
    const exercise = createExercise({
      version: 1,
      metrics: [],
      gauges: [
        {
          name: "broken",
          value: () => {
            throw new Error("boom");
          }
        },
        { name: "infinite", value: () => Infinity }
      ]
    });

    const scores = evaluateProgression(exercise, "javascript", [createVisualTest()]);

    expect(scores).toEqual({ v: 1, scenarios: 10 });
  });

  it("passes the scenario runs and language to gauges", () => {
    const value = jest.fn().mockReturnValue(3);
    const exercise = createExercise({ version: 1, metrics: [], gauges: [{ name: "loc", value }] });
    const test = createVisualTest({ slug: "roll-ball" });

    evaluateProgression(exercise, "python", [test]);

    const [runs, language] = value.mock.calls[0];
    expect(language).toBe("python");
    expect(runs.bySlug("roll-ball")).toBeDefined();
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

  it("emits the v0 baseline when the exercise has no progression", () => {
    expect(zeroProgressionScores(createExercise(undefined))).toEqual({ v: 0, scenarios: 0 });
  });

  it("omits gauges entirely (nothing ran, nothing to observe)", () => {
    const exercise = createExercise({
      version: 1,
      metrics: [{ name: "distance", maxScore: 60, points: 5, score: () => 60 }],
      gauges: [{ name: "loc", value: () => 7 }]
    });

    expect(zeroProgressionScores(exercise)).toEqual({ v: 1, scenarios: 0, distance: 0 });
  });
});
