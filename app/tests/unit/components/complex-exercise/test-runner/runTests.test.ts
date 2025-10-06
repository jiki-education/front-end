import { runTests } from "@/components/complex-exercise/lib/test-runner/runTests";
import { jikiscript } from "@jiki/interpreters";
import { createTestExercise } from "@/tests/mocks/createTestExercise";
import type { Scenario } from "@jiki/curriculum";
import { TestExercise } from "@jiki/curriculum";

// Mock the interpreters module
jest.mock("@jiki/interpreters", () => ({
  jikiscript: {
    compile: jest.fn(),
    interpret: jest.fn()
  },
  TIME_SCALE_FACTOR: 1000
}));

// Mock the TestExercise
jest.mock("@jiki/curriculum", () => {
  return {
    TestExercise: jest.fn().mockImplementation(() => ({
      position: 100, // This will match the expectation for start-at-0
      animations: [],
      availableFunctions: [
        {
          name: "move",
          func: jest.fn()
        }
      ],
      setStartPosition: jest.fn(),
      getState: jest.fn().mockReturnValue({ position: 100 }),
      getView: jest.fn().mockReturnValue(document.createElement("div"))
    }))
  };
});

// Create test scenarios
const testScenarios: Scenario[] = [
  {
    slug: "start-at-0",
    name: "Starting from position 0",
    description: "Move the character 5 times starting from position 0",
    taskId: "test-task",
    setup: jest.fn(),
    expectations: jest.fn(() => [{ pass: true, actual: 100, expected: 100, errorHtml: "" }])
  },
  {
    slug: "start-at-50",
    name: "Starting from position 50",
    description: "Move the character 5 times starting from position 50",
    taskId: "test-task",
    setup: jest.fn(),
    expectations: jest.fn(() => [{ pass: true, actual: 150, expected: 150, errorHtml: "" }])
  }
];

// Mock the AnimationTimeline
jest.mock("@/components/complex-exercise/lib/AnimationTimeline", () => {
  return {
    AnimationTimeline: jest.fn().mockImplementation((_options) => ({
      duration: 0,
      populateTimeline: jest.fn().mockReturnThis()
    }))
  };
});

describe("runTests", () => {
  let testExercise: ReturnType<typeof createTestExercise>;

  beforeEach(() => {
    jest.clearAllMocks();
    testExercise = createTestExercise({
      ExerciseClass: TestExercise,
      scenarios: testScenarios
    });

    // Default compile mock returns success
    (jikiscript.compile as jest.Mock).mockReturnValue({ success: true });
  });

  describe("initial scrubber time", () => {
    it("should set initial time to first frame's time, not 0", () => {
      // Mock frames with first frame at 100000 microseconds
      const mockFrames = [
        { time: 100000, timeInMs: 100, status: "SUCCESS", line: 1 },
        { time: 200000, timeInMs: 200, status: "SUCCESS", line: 2 },
        { time: 300000, timeInMs: 300, status: "SUCCESS", line: 3 }
      ];

      (jikiscript.interpret as jest.Mock).mockReturnValue({
        frames: mockFrames,
        value: undefined,
        status: "SUCCESS"
      });

      const code = "move()\nmove()\nmove()";
      const result = runTests(code, testExercise);

      // Check that tests have frames
      expect(result.tests[0].frames[0].time).toBe(100000);
      expect(result.tests[1].frames[0].time).toBe(100000);
    });

    it("should handle empty frames array", () => {
      (jikiscript.interpret as jest.Mock).mockReturnValue({
        frames: [],
        value: undefined,
        status: "SUCCESS"
      });

      const code = "";
      const result = runTests(code, testExercise);

      // Should have empty frames array
      expect(result.tests[0].frames).toEqual([]);
    });
  });

  describe("test execution", () => {
    it("should run all scenarios and return correct status", () => {
      const mockFrames = [
        { time: 100000, timeInMs: 100, status: "SUCCESS", line: 1 },
        { time: 200000, timeInMs: 200, status: "SUCCESS", line: 2 }
      ];

      (jikiscript.interpret as jest.Mock).mockReturnValue({
        frames: mockFrames,
        value: undefined,
        status: "SUCCESS"
      });

      const code = "move()\nmove()";
      const result = runTests(code, testExercise);

      // Should have 2 test scenarios
      expect(result.tests).toHaveLength(2);
      expect(result.tests[0].slug).toBe("start-at-0");
      expect(result.tests[1].slug).toBe("start-at-50");

      // Both should pass with the mocked data
      expect(result.tests[0].status).toBe("pass");
      expect(result.tests[1].status).toBe("pass");
      expect(result.status).toBe("pass");
    });

    it("should set codeRun to the student code for each test", () => {
      const mockFrames = [{ time: 100000, timeInMs: 100, status: "SUCCESS", line: 1 }];

      (jikiscript.interpret as jest.Mock).mockReturnValue({
        frames: mockFrames,
        value: undefined,
        status: "SUCCESS"
      });

      const code = "for (let i = 0; i < 5; i++) {\n  move();\n}";
      const result = runTests(code, testExercise);

      // Each test result should have codeRun set to the student code
      expect(result.tests[0].codeRun).toBe(code);
      expect(result.tests[1].codeRun).toBe(code);

      // Should not be hardcoded to "move()"
      expect(result.tests[0].codeRun).not.toBe("move()");
    });
  });
});
