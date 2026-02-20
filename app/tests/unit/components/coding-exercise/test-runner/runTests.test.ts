import { runTests } from "@/components/coding-exercise/lib/test-runner/runTests";
import { createMockExercise } from "@/tests/mocks/exercise";
import type { Scenario } from "@jiki/curriculum";
import { TestExercise } from "@jiki/curriculum";
import { javascript, jikiscript, python } from "@jiki/interpreters";

// Mock the interpreters module
jest.mock("@jiki/interpreters", () => ({
  jikiscript: {
    compile: jest.fn(),
    interpret: jest.fn(),
    formatIdentifier: (name: string) => name
  },
  javascript: {
    compile: jest.fn(),
    interpret: jest.fn(),
    formatIdentifier: (name: string) => name
  },
  python: {
    compile: jest.fn(),
    interpret: jest.fn(),
    formatIdentifier: (name: string) => name
  },
  TIME_SCALE_FACTOR: 1000
}));

// Mock the TestExercise
jest.mock("@jiki/curriculum", () => {
  const availableFunctions = [
    {
      name: "move",
      func: jest.fn()
    }
  ];
  return {
    TestExercise: jest.fn().mockImplementation(() => ({
      position: 100, // This will match the expectation for start-at-0
      animations: [],
      availableFunctions,
      getExternalFunctions: jest.fn().mockReturnValue(availableFunctions),
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
    expectations: jest.fn(() => [{ type: "visual" as const, pass: true, actual: 100, expected: 100, errorHtml: "" }])
  },
  {
    slug: "start-at-50",
    name: "Starting from position 50",
    description: "Move the character 5 times starting from position 50",
    taskId: "test-task",
    setup: jest.fn(),
    expectations: jest.fn(() => [{ type: "visual" as const, pass: true, actual: 150, expected: 150, errorHtml: "" }])
  }
];

// Mock the AnimationTimeline
jest.mock("@/components/coding-exercise/lib/AnimationTimeline", () => {
  return {
    AnimationTimeline: jest.fn().mockImplementation((_options) => ({
      duration: 0,
      populateTimeline: jest.fn().mockReturnThis()
    }))
  };
});

describe("runTests", () => {
  let testExercise: ReturnType<typeof createMockExercise>;

  beforeEach(() => {
    jest.clearAllMocks();
    testExercise = createMockExercise({
      ExerciseClass: TestExercise,
      scenarios: testScenarios as any
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
      const result = runTests(code, testExercise, "jikiscript");

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
      const result = runTests(code, testExercise, "jikiscript");

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
      const result = runTests(code, testExercise, "jikiscript");

      // Should have 2 test scenarios
      expect(result.tests).toHaveLength(2);
      expect(result.tests[0].slug).toBe("start-at-0");
      expect(result.tests[1].slug).toBe("start-at-50");

      // Both should pass with the mocked data
      expect(result.tests[0].status).toBe("pass");
      expect(result.tests[1].status).toBe("pass");
      expect(result.passed).toBe(true);
    });

    it("should set codeRun to the student code for each test", () => {
      const mockFrames = [{ time: 100000, timeInMs: 100, status: "SUCCESS", line: 1 }];

      (jikiscript.interpret as jest.Mock).mockReturnValue({
        frames: mockFrames,
        value: undefined,
        status: "SUCCESS"
      });

      const code = "for (let i = 0; i < 5; i++) {\n  move();\n}";
      const result = runTests(code, testExercise, "jikiscript");

      // Each test result should have codeRun set to the student code
      expect(result.tests[0].codeRun).toBe(code);
      expect(result.tests[1].codeRun).toBe(code);

      // Should not be hardcoded to "move()"
      expect(result.tests[0].codeRun).not.toBe("move()");
    });
  });

  describe("language selection", () => {
    const mockFrames = [
      { time: 100000, timeInMs: 100, status: "SUCCESS", line: 1 },
      { time: 200000, timeInMs: 200, status: "SUCCESS", line: 2 }
    ];

    beforeEach(() => {
      // Set up default successful compile and interpret for all interpreters
      const mockInterpretResult = {
        frames: mockFrames,
        value: undefined,
        status: "SUCCESS"
      };

      (jikiscript.compile as jest.Mock).mockReturnValue({ success: true });
      (jikiscript.interpret as jest.Mock).mockReturnValue(mockInterpretResult);

      (javascript.compile as jest.Mock).mockReturnValue({ success: true });
      (javascript.interpret as jest.Mock).mockReturnValue(mockInterpretResult);

      (python.compile as jest.Mock).mockReturnValue({ success: true });
      (python.interpret as jest.Mock).mockReturnValue(mockInterpretResult);
    });

    it("should use JavaScript interpreter when language is javascript", () => {
      const code = "move()";
      runTests(code, testExercise, "javascript");

      // JavaScript interpreter should be called
      expect(javascript.compile).toHaveBeenCalledWith(
        code,
        expect.objectContaining({
          externalFunctions: expect.any(Array),
          languageFeatures: expect.objectContaining({
            timePerFrame: 1
          })
        })
      );
      expect(javascript.interpret).toHaveBeenCalledWith(
        code,
        expect.objectContaining({
          externalFunctions: expect.any(Array),
          languageFeatures: expect.objectContaining({
            timePerFrame: 1
          })
        })
      );

      // Other interpreters should NOT be called
      expect(python.compile).not.toHaveBeenCalled();
      expect(python.interpret).not.toHaveBeenCalled();
      expect(jikiscript.compile).not.toHaveBeenCalled();
      expect(jikiscript.interpret).not.toHaveBeenCalled();
    });

    it("should use Python interpreter when language is python", () => {
      const code = "move()";
      runTests(code, testExercise, "python");

      // Python interpreter should be called
      expect(python.compile).toHaveBeenCalledWith(
        code,
        expect.objectContaining({
          externalFunctions: expect.any(Array),
          languageFeatures: expect.objectContaining({
            timePerFrame: 1
          })
        })
      );
      expect(python.interpret).toHaveBeenCalledWith(
        code,
        expect.objectContaining({
          externalFunctions: expect.any(Array),
          languageFeatures: expect.objectContaining({
            timePerFrame: 1
          })
        })
      );

      // Other interpreters should NOT be called
      expect(javascript.compile).not.toHaveBeenCalled();
      expect(javascript.interpret).not.toHaveBeenCalled();
      expect(jikiscript.compile).not.toHaveBeenCalled();
      expect(jikiscript.interpret).not.toHaveBeenCalled();
    });

    it("should use JikiScript interpreter when language is jikiscript", () => {
      const code = "move()";
      runTests(code, testExercise, "jikiscript");

      // JikiScript interpreter should be called
      expect(jikiscript.compile).toHaveBeenCalledWith(
        code,
        expect.objectContaining({
          externalFunctions: expect.any(Array),
          languageFeatures: expect.objectContaining({
            timePerFrame: 1
          })
        })
      );
      expect(jikiscript.interpret).toHaveBeenCalledWith(
        code,
        expect.objectContaining({
          externalFunctions: expect.any(Array),
          languageFeatures: expect.objectContaining({
            timePerFrame: 1
          })
        })
      );

      // Other interpreters should NOT be called
      expect(javascript.compile).not.toHaveBeenCalled();
      expect(javascript.interpret).not.toHaveBeenCalled();
      expect(python.compile).not.toHaveBeenCalled();
      expect(python.interpret).not.toHaveBeenCalled();
    });
  });
});
