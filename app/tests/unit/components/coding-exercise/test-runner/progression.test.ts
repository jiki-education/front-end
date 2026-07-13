import { evaluateProgression, zeroProgressionScores } from "@/components/coding-exercise/lib/test-runner/progression";
import type { ExerciseDefinition, ProgressionTest, ScenarioRun } from "@jiki/curriculum";

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

function createRun(overrides?: Partial<ScenarioRun>): ScenarioRun {
  return {
    scenarioSlug: "scenario-1",
    passed: true,
    result: { frames: [] } as unknown as ScenarioRun["result"],
    ...overrides
  };
}

describe("evaluateProgression", () => {
  it("emits only the v0 baseline when the exercise has no progression test", () => {
    const scores = evaluateProgression(createExercise(undefined), "jikiscript", [createRun()], 2);

    expect(scores).toEqual({ v: 0, scenarios: 2 });
  });

  it("emits the free scenarios baseline before authored metrics", () => {
    const exercise = createExercise({
      version: 1,
      metrics: [{ name: "distance", maxScore: 10, points: 5, score: () => 10 }]
    });

    const scores = evaluateProgression(exercise, "jikiscript", [createRun()], 1);

    expect(scores).toEqual({ v: 1, scenarios: 1, distance: 5 });
    expect(Object.keys(scores)).toEqual(["v", "scenarios", "distance"]);
  });

  it("passes the scenario runs and language to each metric", () => {
    const score = jest.fn().mockReturnValue(1);
    const exercise = createExercise({ version: 1, metrics: [{ name: "metric", maxScore: 1, points: 1, score }] });
    const run = createRun({ scenarioSlug: "roll-ball" });

    evaluateProgression(exercise, "python", [run], 0);

    const [runs, language] = score.mock.calls[0];
    expect(language).toBe("python");
    expect(runs.all).toEqual([run]);
    expect(runs.bySlug("roll-ball")).toBe(run);
    expect(runs.bySlug("missing")).toBeUndefined();
  });

  it("excludes isolated runs from bySlug but keeps them in all", () => {
    const primary = createRun({ scenarioSlug: "shape" });
    const isolated = createRun({ scenarioSlug: "shape", isolated: true });
    const score = jest.fn().mockReturnValue(0);
    const exercise = createExercise({ version: 1, metrics: [{ name: "metric", maxScore: 1, points: 1, score }] });

    evaluateProgression(exercise, "jikiscript", [isolated, primary], 0);

    const [runs] = score.mock.calls[0];
    expect(runs.bySlug("shape")).toBe(primary);
    expect(runs.all).toEqual([isolated, primary]);
  });

  it("converts raw scores to integer points, keyed by snake_cased metric name", () => {
    const exercise = createExercise({
      version: 1,
      metrics: [
        { name: "distance", maxScore: 60, points: 5, score: () => 30 }, // 2.5 -> 3
        { name: "used-loop", maxScore: 1, points: 10, score: () => 1 }
      ]
    });

    const scores = evaluateProgression(exercise, "jikiscript", [createRun()], 1);

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

    const scores = evaluateProgression(exercise, "jikiscript", [], 0);

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

    const scores = evaluateProgression(exercise, "jikiscript", [], 0);

    expect(scores).toEqual({ v: 1, scenarios: 0, broken: 0, fine: 2 });
  });

  it("scores 0 for non-finite raw scores and non-positive maxScores", () => {
    const exercise = createExercise({
      version: 1,
      metrics: [
        { name: "nan", maxScore: 1, points: 5, score: () => NaN },
        { name: "infinite", maxScore: 1, points: 5, score: () => Infinity },
        { name: "zero-max", maxScore: 0, points: 5, score: () => 1 }
      ]
    });

    const scores = evaluateProgression(exercise, "jikiscript", [], 0);

    expect(scores).toEqual({ v: 1, scenarios: 0, nan: 0, infinite: 0, zero_max: 0 });
  });
});

describe("zeroProgressionScores", () => {
  it("zeroes the baseline and every authored metric", () => {
    const exercise = createExercise({
      version: 3,
      metrics: [
        { name: "distance", maxScore: 60, points: 5, score: () => 60 },
        { name: "used-loop", maxScore: 1, points: 10, score: () => 1 }
      ]
    });

    expect(zeroProgressionScores(exercise)).toEqual({ v: 3, scenarios: 0, distance: 0, used_loop: 0 });
  });

  it("emits the v0 baseline when the exercise has no progression test", () => {
    expect(zeroProgressionScores(createExercise(undefined))).toEqual({ v: 0, scenarios: 0 });
  });
});
