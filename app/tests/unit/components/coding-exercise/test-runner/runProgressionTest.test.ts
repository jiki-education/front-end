import { runProgressionTest } from "@/components/coding-exercise/lib/test-runner/runProgressionTest";
import type { Interpreter } from "@/components/coding-exercise/lib/test-runner/getInterpreter";
import type { ExerciseDefinition, ProgressionTest } from "@jiki/curriculum";

const mockInterpreter: Interpreter = {
  compile: jest.fn(),
  interpret: jest.fn(),
  evaluateFunction: jest.fn(),
  formatIdentifier: (name: string) => name
};

jest.mock("@/components/coding-exercise/lib/test-runner/getInterpreter", () => ({
  getInterpreter: jest.fn(() => mockInterpreter)
}));

jest.mock("@jiki/curriculum", () => ({
  getLanguageFeatures: jest.fn().mockReturnValue({})
}));

class FakeExercise {
  ballX = 0;
  getExternalFunctions() {
    return [];
  }
  getExternalClasses() {
    return [];
  }
}

function createExercise(progressionTest?: ProgressionTest): ExerciseDefinition {
  return {
    type: "visual",
    slug: "fake-exercise",
    levelId: "level-1",
    ExerciseClass: FakeExercise,
    scenarios: [],
    tasks: [],
    progressionTest
  } as unknown as ExerciseDefinition;
}

function createProgressionTest(overrides?: Partial<ProgressionTest>): ProgressionTest {
  return {
    version: 1,
    metrics: [
      {
        name: "distance",
        maxScore: 60,
        points: 5,
        score: (exercise) => (exercise as unknown as FakeExercise).ballX
      },
      {
        name: "used-loop",
        maxScore: 1,
        points: 10,
        score: () => 1
      }
    ],
    ...overrides
  };
}

const mockInterpretResult = { frames: [], logLines: [], success: true, error: null };

describe("runProgressionTest", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (mockInterpreter.compile as jest.Mock).mockReturnValue({ success: true });
    (mockInterpreter.interpret as jest.Mock).mockReturnValue(mockInterpretResult);
  });

  it("returns null when the exercise has no progression test", async () => {
    const result = await runProgressionTest("roll()", createExercise(undefined), "jikiscript");
    expect(result).toBeNull();
    expect(mockInterpreter.interpret).not.toHaveBeenCalled();
  });

  it("returns null for io exercises", async () => {
    const exercise = { ...createExercise(createProgressionTest()), type: "io" } as unknown as ExerciseDefinition;
    const result = await runProgressionTest("roll()", exercise, "jikiscript");
    expect(result).toBeNull();
  });

  it("scores each metric in points, keyed by snake_cased metric name", async () => {
    const progressionTest = createProgressionTest({
      setup: (exercise) => {
        (exercise as unknown as FakeExercise).ballX = 30;
      }
    });

    const result = await runProgressionTest("roll()", createExercise(progressionTest), "jikiscript");

    // distance: 30/60 of 5 points => 2.5, rounded to 3. used-loop: 1/1 of 10 points.
    expect(result).toEqual({ version: 1, scores: { distance: 3, used_loop: 10 } });
  });

  it("clamps raw scores to 0..maxScore", async () => {
    const progressionTest = createProgressionTest({
      metrics: [
        { name: "over", maxScore: 10, points: 5, score: () => 999 },
        { name: "under", maxScore: 10, points: 5, score: () => -7 }
      ]
    });

    const result = await runProgressionTest("roll()", createExercise(progressionTest), "jikiscript");

    expect(result).toEqual({ version: 1, scores: { over: 5, under: 0 } });
  });

  it("scores 0 for a metric whose score function throws, without affecting others", async () => {
    const progressionTest = createProgressionTest({
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

    const result = await runProgressionTest("roll()", createExercise(progressionTest), "jikiscript");

    expect(result).toEqual({ version: 1, scores: { broken: 0, fine: 2 } });
  });

  it("scores 0 for non-finite raw scores", async () => {
    const progressionTest = createProgressionTest({
      metrics: [
        { name: "nan", maxScore: 1, points: 5, score: () => NaN },
        { name: "infinite", maxScore: 1, points: 5, score: () => Infinity }
      ]
    });

    const result = await runProgressionTest("roll()", createExercise(progressionTest), "jikiscript");

    expect(result).toEqual({ version: 1, scores: { nan: 0, infinite: 0 } });
  });

  it("returns all-zero scores when compilation fails", async () => {
    (mockInterpreter.compile as jest.Mock).mockReturnValue({ success: false, error: new Error("syntax") });

    const result = await runProgressionTest("rol(", createExercise(createProgressionTest()), "jikiscript");

    expect(result).toEqual({ version: 1, scores: { distance: 0, used_loop: 0 } });
    expect(mockInterpreter.interpret).not.toHaveBeenCalled();
  });

  it("returns all-zero scores when interpret throws", async () => {
    (mockInterpreter.interpret as jest.Mock).mockImplementation(() => {
      throw new Error("interpreter exploded");
    });

    const result = await runProgressionTest("roll()", createExercise(createProgressionTest()), "jikiscript");

    expect(result).toEqual({ version: 1, scores: { distance: 0, used_loop: 0 } });
  });

  it("still evaluates metrics against the halted exercise state on a runtime error", async () => {
    // Simulate a run that errored partway: interpret returns error frames but the
    // exercise instance has already been mutated by the partial run.
    (mockInterpreter.interpret as jest.Mock).mockReturnValue({
      ...mockInterpretResult,
      success: false,
      frames: [{ status: "ERROR" }]
    });
    const progressionTest = createProgressionTest({
      setup: (exercise) => {
        (exercise as unknown as FakeExercise).ballX = 12;
      }
    });

    const result = await runProgressionTest("roll()", createExercise(progressionTest), "jikiscript");

    // distance: 12/60 of 5 points => 1. used-loop still scores.
    expect(result).toEqual({ version: 1, scores: { distance: 1, used_loop: 10 } });
  });

  it("passes the progression test version through", async () => {
    const result = await runProgressionTest(
      "roll()",
      createExercise(createProgressionTest({ version: 7 })),
      "jikiscript"
    );

    expect(result?.version).toBe(7);
  });
});
