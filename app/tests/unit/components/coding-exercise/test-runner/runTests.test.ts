import { runTests } from "@/components/coding-exercise/lib/test-runner/runTests";
import { createMockExercise } from "@/tests/mocks/exercise";
import type { Scenario } from "@jiki/curriculum";
import { TestExercise, getLanguageFeatures } from "@jiki/curriculum";
import type { Interpreter } from "@/components/coding-exercise/lib/test-runner/getInterpreter";

// Create mock interpreters for each language
const mockJikiscript: Interpreter = {
  compile: jest.fn(),
  interpret: jest.fn(),
  evaluateFunction: jest.fn(),
  formatIdentifier: (name: string) => name
};

const mockJavascript: Interpreter = {
  compile: jest.fn(),
  interpret: jest.fn(),
  evaluateFunction: jest.fn(),
  formatIdentifier: (name: string) => name
};

const mockPython: Interpreter = {
  compile: jest.fn(),
  interpret: jest.fn(),
  evaluateFunction: jest.fn(),
  formatIdentifier: (name: string) => name
};

// Mock getInterpreter to return the appropriate mock
jest.mock("@/components/coding-exercise/lib/test-runner/getInterpreter", () => ({
  getInterpreter: jest.fn((language: string) => {
    switch (language) {
      case "jikiscript":
        return mockJikiscript;
      case "javascript":
        return mockJavascript;
      case "python":
        return mockPython;
      default:
        throw new Error(`Unknown language: ${language}`);
    }
  })
}));

// Mock the TestExercise and getLanguageFeatures
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
      getExternalClasses: jest.fn().mockReturnValue([]),
      setStartPosition: jest.fn(),
      setCounter: jest.fn(),
      getState: jest.fn().mockReturnValue({ position: 100 }),
      getView: jest.fn().mockReturnValue(document.createElement("div"))
    })),
    getLanguageFeatures: jest.fn().mockReturnValue({})
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
    (mockJikiscript.compile as jest.Mock).mockReturnValue({ success: true });
  });

  describe("initial scrubber time", () => {
    it("should set initial time to first frame's time, not 0", async () => {
      // Mock frames with first frame at 100000 microseconds
      const mockFrames = [
        { time: 100000, timeInMs: 100, status: "SUCCESS", line: 1 },
        { time: 200000, timeInMs: 200, status: "SUCCESS", line: 2 },
        { time: 300000, timeInMs: 300, status: "SUCCESS", line: 3 }
      ];

      (mockJikiscript.interpret as jest.Mock).mockReturnValue({
        frames: mockFrames,
        value: undefined,
        status: "SUCCESS"
      });

      const code = "move()\nmove()\nmove()";
      const result = await runTests(code, testExercise, "jikiscript");

      // Check that tests have frames
      expect(result.tests[0].frames[0].time).toBe(100000);
      expect(result.tests[1].frames[0].time).toBe(100000);
    });

    it("should handle empty frames array", async () => {
      (mockJikiscript.interpret as jest.Mock).mockReturnValue({
        frames: [],
        value: undefined,
        status: "SUCCESS"
      });

      const code = "";
      const result = await runTests(code, testExercise, "jikiscript");

      // Should have empty frames array
      expect(result.tests[0].frames).toEqual([]);
    });
  });

  describe("test execution", () => {
    it("should run all scenarios and return correct status", async () => {
      const mockFrames = [
        { time: 100000, timeInMs: 100, status: "SUCCESS", line: 1 },
        { time: 200000, timeInMs: 200, status: "SUCCESS", line: 2 }
      ];

      (mockJikiscript.interpret as jest.Mock).mockReturnValue({
        frames: mockFrames,
        value: undefined,
        status: "SUCCESS"
      });

      const code = "move()\nmove()";
      const result = await runTests(code, testExercise, "jikiscript");

      // Should have 2 test scenarios
      expect(result.tests).toHaveLength(2);
      expect(result.tests[0].slug).toBe("start-at-0");
      expect(result.tests[1].slug).toBe("start-at-50");

      // Both should pass with the mocked data
      expect(result.tests[0].status).toBe("pass");
      expect(result.tests[1].status).toBe("pass");
      expect(result.passed).toBe(true);
    });

    it("should set codeRun to the student code for each test", async () => {
      const mockFrames = [{ time: 100000, timeInMs: 100, status: "SUCCESS", line: 1 }];

      (mockJikiscript.interpret as jest.Mock).mockReturnValue({
        frames: mockFrames,
        value: undefined,
        status: "SUCCESS"
      });

      const code = "for (let i = 0; i < 5; i++) {\n  move();\n}";
      const result = await runTests(code, testExercise, "jikiscript");

      // Each test result should have codeRun set to the student code
      expect(result.tests[0].codeRun).toBe(code);
      expect(result.tests[1].codeRun).toBe(code);

      // Should not be hardcoded to "move()"
      expect(result.tests[0].codeRun).not.toBe("move()");
    });
  });

  describe("level features integration", () => {
    const mockGetLanguageFeatures = getLanguageFeatures as jest.Mock;

    it("should pass level language features to compile", async () => {
      mockGetLanguageFeatures.mockReturnValue({
        enforceFormatting: true,
        oneStatementPerLine: true,
        allowedNodes: ["ExpressionStatement", "CallExpression"]
      });

      (mockJikiscript.compile as jest.Mock).mockReturnValue({ success: true });
      (mockJikiscript.interpret as jest.Mock).mockReturnValue({
        frames: [{ time: 100000, timeInMs: 100, status: "SUCCESS", line: 1 }],
        value: undefined,
        status: "SUCCESS"
      });

      const code = "move()";
      await runTests(code, testExercise, "jikiscript");

      expect(mockJikiscript.compile).toHaveBeenCalledWith(
        code,
        expect.objectContaining({
          languageFeatures: expect.objectContaining({
            timePerFrame: 1,
            enforceFormatting: true,
            oneStatementPerLine: true,
            allowedNodes: ["ExpressionStatement", "CallExpression"]
          })
        })
      );

      // Reset mock
      mockGetLanguageFeatures.mockReturnValue({});
    });

    it("should allow exercise interpreterOptions to override level features", async () => {
      mockGetLanguageFeatures.mockReturnValue({
        maxTotalLoopIterations: 1000
      });

      const exerciseWithOptions = createMockExercise({
        interpreterOptions: { maxTotalLoopIterations: 500 }
      });

      (mockJikiscript.compile as jest.Mock).mockReturnValue({ success: true });
      (mockJikiscript.interpret as jest.Mock).mockReturnValue({
        frames: [{ time: 100000, timeInMs: 100, status: "SUCCESS", line: 1 }],
        value: undefined,
        status: "SUCCESS"
      });

      const code = "move()";
      await runTests(code, exerciseWithOptions, "jikiscript");

      expect(mockJikiscript.compile).toHaveBeenCalledWith(
        code,
        expect.objectContaining({
          languageFeatures: expect.objectContaining({
            maxTotalLoopIterations: 500
          })
        })
      );

      // Reset mock
      mockGetLanguageFeatures.mockReturnValue({});
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

      (mockJikiscript.compile as jest.Mock).mockReturnValue({ success: true });
      (mockJikiscript.interpret as jest.Mock).mockReturnValue(mockInterpretResult);

      (mockJavascript.compile as jest.Mock).mockReturnValue({ success: true });
      (mockJavascript.interpret as jest.Mock).mockReturnValue(mockInterpretResult);

      (mockPython.compile as jest.Mock).mockReturnValue({ success: true });
      (mockPython.interpret as jest.Mock).mockReturnValue(mockInterpretResult);
    });

    it("should use JavaScript interpreter when language is javascript", async () => {
      const code = "move()";
      await runTests(code, testExercise, "javascript");

      // JavaScript interpreter should be called
      expect(mockJavascript.compile).toHaveBeenCalledWith(
        code,
        expect.objectContaining({
          externalFunctions: expect.any(Array),
          languageFeatures: expect.objectContaining({
            timePerFrame: 1
          })
        })
      );
      expect(mockJavascript.interpret).toHaveBeenCalledWith(
        code,
        expect.objectContaining({
          externalFunctions: expect.any(Array),
          languageFeatures: expect.objectContaining({
            timePerFrame: 1
          })
        })
      );

      // Other interpreters should NOT be called
      expect(mockPython.compile).not.toHaveBeenCalled();
      expect(mockPython.interpret).not.toHaveBeenCalled();
      expect(mockJikiscript.compile).not.toHaveBeenCalled();
      expect(mockJikiscript.interpret).not.toHaveBeenCalled();
    });

    it("should use Python interpreter when language is python", async () => {
      const code = "move()";
      await runTests(code, testExercise, "python");

      // Python interpreter should be called
      expect(mockPython.compile).toHaveBeenCalledWith(
        code,
        expect.objectContaining({
          externalFunctions: expect.any(Array),
          languageFeatures: expect.objectContaining({
            timePerFrame: 1
          })
        })
      );
      expect(mockPython.interpret).toHaveBeenCalledWith(
        code,
        expect.objectContaining({
          externalFunctions: expect.any(Array),
          languageFeatures: expect.objectContaining({
            timePerFrame: 1
          })
        })
      );

      // Other interpreters should NOT be called
      expect(mockJavascript.compile).not.toHaveBeenCalled();
      expect(mockJavascript.interpret).not.toHaveBeenCalled();
      expect(mockJikiscript.compile).not.toHaveBeenCalled();
      expect(mockJikiscript.interpret).not.toHaveBeenCalled();
    });

    it("should use JikiScript interpreter when language is jikiscript", async () => {
      const code = "move()";
      await runTests(code, testExercise, "jikiscript");

      // JikiScript interpreter should be called
      expect(mockJikiscript.compile).toHaveBeenCalledWith(
        code,
        expect.objectContaining({
          externalFunctions: expect.any(Array),
          languageFeatures: expect.objectContaining({
            timePerFrame: 1
          })
        })
      );
      expect(mockJikiscript.interpret).toHaveBeenCalledWith(
        code,
        expect.objectContaining({
          externalFunctions: expect.any(Array),
          languageFeatures: expect.objectContaining({
            timePerFrame: 1
          })
        })
      );

      // Other interpreters should NOT be called
      expect(mockJavascript.compile).not.toHaveBeenCalled();
      expect(mockJavascript.interpret).not.toHaveBeenCalled();
      expect(mockPython.compile).not.toHaveBeenCalled();
      expect(mockPython.interpret).not.toHaveBeenCalled();
    });
  });
});
