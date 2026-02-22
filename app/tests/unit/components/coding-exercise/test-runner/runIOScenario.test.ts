import { runIOScenario } from "@/components/coding-exercise/lib/test-runner/runIOScenario";
import type { IOScenario, CodeCheck } from "@jiki/curriculum";
import { jikiscript } from "@jiki/interpreters";

// Mock the interpreters module
jest.mock("@jiki/interpreters", () => ({
  jikiscript: {
    evaluateFunction: jest.fn(),
    formatIdentifier: (name: string) => name
  },
  javascript: {
    evaluateFunction: jest.fn(),
    formatIdentifier: (name: string) => name
  },
  python: {
    evaluateFunction: jest.fn(),
    formatIdentifier: (name: string) => name
  }
}));

describe("runIOScenario", () => {
  const mockAvailableFunctions: Array<{ name: string; func: any; description: string }> = [];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("basic IO scenario execution", () => {
    it("should pass when actual matches expected", () => {
      (jikiscript.evaluateFunction as jest.Mock).mockReturnValue({
        value: "HW",
        error: null,
        frames: [],
        logLines: [],
        meta: { sourceCode: 'function acronym() { return "HW"; }' }
      });

      const scenario: IOScenario = {
        slug: "basic-test",
        name: "Basic Test",
        description: "Test description",
        taskId: "task-1",
        functionName: "acronym",
        args: ["Hello World"],
        expected: "HW"
      };

      const result = runIOScenario(
        scenario,
        "function acronym() { return 'HW'; }",
        mockAvailableFunctions,
        "jikiscript"
      );

      expect(result.status).toBe("pass");
      expect(result.expects[0].pass).toBe(true);
      expect(result.expects[0].actual).toBe("HW");
      expect(result.expects[0].expected).toBe("HW");
    });

    it("should fail when actual does not match expected", () => {
      (jikiscript.evaluateFunction as jest.Mock).mockReturnValue({
        value: "WRONG",
        error: null,
        frames: [],
        logLines: [],
        meta: { sourceCode: 'function acronym() { return "WRONG"; }' }
      });

      const scenario: IOScenario = {
        slug: "failing-test",
        name: "Failing Test",
        description: "Test description",
        taskId: "task-1",
        functionName: "acronym",
        args: ["Hello World"],
        expected: "HW"
      };

      const result = runIOScenario(
        scenario,
        "function acronym() { return 'WRONG'; }",
        mockAvailableFunctions,
        "jikiscript"
      );

      expect(result.status).toBe("fail");
      expect(result.expects[0].pass).toBe(false);
      expect(result.expects[0].actual).toBe("WRONG");
    });
  });

  describe("code checks", () => {
    it("should pass when functional test passes and all code checks pass", () => {
      const mockMeta = {
        sourceCode: 'function acronym() { return "HW"; }',
        functionCallLog: {},
        statements: []
      };

      (jikiscript.evaluateFunction as jest.Mock).mockReturnValue({
        value: "HW",
        error: null,
        frames: [],
        logLines: [],
        meta: mockMeta
      });

      const passingCodeCheck: CodeCheck = {
        pass: jest.fn().mockReturnValue(true),
        errorHtml: "This should not appear"
      };

      const scenario: IOScenario = {
        slug: "with-code-check",
        name: "With Code Check",
        description: "Test with code check",
        taskId: "task-1",
        functionName: "acronym",
        args: ["Hello World"],
        expected: "HW",
        codeChecks: [passingCodeCheck]
      };

      const result = runIOScenario(
        scenario,
        "function acronym() { return 'HW'; }",
        mockAvailableFunctions,
        "jikiscript"
      );

      expect(result.status).toBe("pass");
      expect(result.expects[0].pass).toBe(true);
      expect(result.expects[0].errorHtml).toBeUndefined();
      expect(passingCodeCheck.pass).toHaveBeenCalled();
    });

    it("should fail when functional test passes but code check fails", () => {
      const mockMeta = {
        sourceCode: 'function acronym() {\n  // lots of code\n  return "HW";\n}',
        functionCallLog: {},
        statements: []
      };

      (jikiscript.evaluateFunction as jest.Mock).mockReturnValue({
        value: "HW",
        error: null,
        frames: [],
        logLines: [],
        meta: mockMeta
      });

      const failingCodeCheck: CodeCheck = {
        pass: jest.fn().mockReturnValue(false),
        errorHtml: "Your solution has more than 22 lines of code."
      };

      const scenario: IOScenario = {
        slug: "failing-code-check",
        name: "Failing Code Check",
        description: "Test with failing code check",
        taskId: "task-1",
        functionName: "acronym",
        args: ["Hello World"],
        expected: "HW",
        codeChecks: [failingCodeCheck]
      };

      const result = runIOScenario(scenario, "verbose code here", mockAvailableFunctions, "jikiscript");

      expect(result.status).toBe("fail");
      expect(result.expects[0].pass).toBe(false);
      expect(result.expects[0].errorHtml).toBe("Your solution has more than 22 lines of code.");
      expect(result.expects[0].codeCheckResults).toBeDefined();
      expect(result.expects[0].codeCheckResults![0].pass).toBe(false);
    });

    it("should show functional error when functional test fails (even if code check also fails)", () => {
      (jikiscript.evaluateFunction as jest.Mock).mockReturnValue({
        value: "WRONG",
        error: null,
        frames: [],
        logLines: [],
        meta: { sourceCode: "code", functionCallLog: {}, statements: [] }
      });

      const failingCodeCheck: CodeCheck = {
        pass: jest.fn().mockReturnValue(false),
        errorHtml: "Code check error - should not see this"
      };

      const scenario: IOScenario = {
        slug: "both-fail",
        name: "Both Fail",
        description: "Both functional and code check fail",
        taskId: "task-1",
        functionName: "acronym",
        args: ["Hello World"],
        expected: "HW",
        codeChecks: [failingCodeCheck]
      };

      const result = runIOScenario(scenario, "bad code", mockAvailableFunctions, "jikiscript");

      expect(result.status).toBe("fail");
      expect(result.expects[0].pass).toBe(false);
      // Should NOT show the code check error since functional test failed
      expect(result.expects[0].errorHtml).toBeUndefined();
    });

    it("should handle multiple code checks and show first failing error", () => {
      (jikiscript.evaluateFunction as jest.Mock).mockReturnValue({
        value: "HW",
        error: null,
        frames: [],
        logLines: [],
        meta: { sourceCode: "code", functionCallLog: {}, statements: [] }
      });

      const passingCheck: CodeCheck = {
        pass: jest.fn().mockReturnValue(true),
        errorHtml: "Passing check error"
      };

      const firstFailingCheck: CodeCheck = {
        pass: jest.fn().mockReturnValue(false),
        errorHtml: "First failing check error"
      };

      const secondFailingCheck: CodeCheck = {
        pass: jest.fn().mockReturnValue(false),
        errorHtml: "Second failing check error"
      };

      const scenario: IOScenario = {
        slug: "multiple-checks",
        name: "Multiple Checks",
        description: "Multiple code checks",
        taskId: "task-1",
        functionName: "acronym",
        args: ["Hello World"],
        expected: "HW",
        codeChecks: [passingCheck, firstFailingCheck, secondFailingCheck]
      };

      const result = runIOScenario(scenario, "code", mockAvailableFunctions, "jikiscript");

      expect(result.status).toBe("fail");
      expect(result.expects[0].errorHtml).toBe("First failing check error");
      expect(result.expects[0].codeCheckResults).toHaveLength(3);
      expect(result.expects[0].codeCheckResults![0].pass).toBe(true);
      expect(result.expects[0].codeCheckResults![1].pass).toBe(false);
      expect(result.expects[0].codeCheckResults![2].pass).toBe(false);
    });

    it("should handle code check that throws an error", () => {
      (jikiscript.evaluateFunction as jest.Mock).mockReturnValue({
        value: "HW",
        error: null,
        frames: [],
        logLines: [],
        meta: { sourceCode: "code", functionCallLog: {}, statements: [] }
      });

      const throwingCheck: CodeCheck = {
        pass: jest.fn().mockImplementation(() => {
          throw new Error("Check crashed!");
        }),
        errorHtml: "Normal error message"
      };

      const scenario: IOScenario = {
        slug: "throwing-check",
        name: "Throwing Check",
        description: "Code check throws error",
        taskId: "task-1",
        functionName: "acronym",
        args: ["Hello World"],
        expected: "HW",
        codeChecks: [throwingCheck]
      };

      const result = runIOScenario(scenario, "code", mockAvailableFunctions, "jikiscript");

      expect(result.status).toBe("fail");
      expect(result.expects[0].pass).toBe(false);
      expect(result.expects[0].errorHtml).toBe("Code check error: Check crashed!");
    });

    it("should not run code checks if no interpretResult (catch block)", () => {
      (jikiscript.evaluateFunction as jest.Mock).mockImplementation(() => {
        throw new Error("Interpreter crashed!");
      });

      const codeCheck: CodeCheck = {
        pass: jest.fn().mockReturnValue(true),
        errorHtml: "Should not run"
      };

      const scenario: IOScenario = {
        slug: "interpreter-crash",
        name: "Interpreter Crash",
        description: "Interpreter throws",
        taskId: "task-1",
        functionName: "acronym",
        args: ["Hello World"],
        expected: "HW",
        codeChecks: [codeCheck]
      };

      const result = runIOScenario(scenario, "bad syntax", mockAvailableFunctions, "jikiscript");

      expect(result.status).toBe("fail");
      expect(result.expects[0].errorHtml).toContain("Interpreter crashed!");
      // Code check should NOT have been called since interpretResult is undefined
      expect(codeCheck.pass).not.toHaveBeenCalled();
    });
  });

  describe("frame errors", () => {
    it("should fail when any frame has ERROR status even if functional test passes", () => {
      (jikiscript.evaluateFunction as jest.Mock).mockReturnValue({
        value: "HW",
        error: null,
        frames: [
          { time: 100, line: 1, status: "SUCCESS" },
          { time: 200, line: 2, status: "ERROR", error: { message: "Timeout" } }
        ],
        logLines: [],
        meta: { sourceCode: "function acronym() { return 'HW'; }" }
      });

      const scenario: IOScenario = {
        slug: "frame-error-test",
        name: "Frame Error Test",
        description: "Test with frame error",
        taskId: "task-1",
        functionName: "acronym",
        args: ["Hello World"],
        expected: "HW"
      };

      const result = runIOScenario(scenario, "code", mockAvailableFunctions, "jikiscript");

      expect(result.status).toBe("fail");
      expect(result.expects[0].actual).toBe("HW"); // Functional result is correct
      expect(result.frames).toHaveLength(2);
      expect(result.frames[1].status).toBe("ERROR");
    });

    it("should pass when all frames have SUCCESS status and functional test passes", () => {
      (jikiscript.evaluateFunction as jest.Mock).mockReturnValue({
        value: "HW",
        error: null,
        frames: [
          { time: 100, line: 1, status: "SUCCESS" },
          { time: 200, line: 2, status: "SUCCESS" }
        ],
        logLines: [],
        meta: { sourceCode: "function acronym() { return 'HW'; }" }
      });

      const scenario: IOScenario = {
        slug: "all-success-test",
        name: "All Success Test",
        description: "Test with all success frames",
        taskId: "task-1",
        functionName: "acronym",
        args: ["Hello World"],
        expected: "HW"
      };

      const result = runIOScenario(scenario, "code", mockAvailableFunctions, "jikiscript");

      expect(result.status).toBe("pass");
    });

    it("should fail when frame has ERROR status even if code checks pass", () => {
      (jikiscript.evaluateFunction as jest.Mock).mockReturnValue({
        value: "HW",
        error: null,
        frames: [{ time: 100, line: 1, status: "ERROR", error: { message: "Infinite loop" } }],
        logLines: [],
        meta: { sourceCode: "code" }
      });

      const passingCodeCheck: CodeCheck = {
        pass: jest.fn().mockReturnValue(true),
        errorHtml: "Should not appear"
      };

      const scenario: IOScenario = {
        slug: "frame-error-with-code-check",
        name: "Frame Error With Code Check",
        description: "Test frame error with passing code check",
        taskId: "task-1",
        functionName: "acronym",
        args: ["Hello World"],
        expected: "HW",
        codeChecks: [passingCodeCheck]
      };

      const result = runIOScenario(scenario, "code", mockAvailableFunctions, "jikiscript");

      expect(result.status).toBe("fail");
    });
  });

  describe("backward compatibility", () => {
    it("should work correctly when scenario has no code checks", () => {
      (jikiscript.evaluateFunction as jest.Mock).mockReturnValue({
        value: "HW",
        error: null,
        frames: [{ time: 100, line: 1, status: "SUCCESS" }],
        logLines: [{ time: 50, output: "log message" }],
        meta: { sourceCode: "code" }
      });

      const scenario: IOScenario = {
        slug: "no-checks",
        name: "No Checks",
        description: "Scenario without code checks",
        taskId: "task-1",
        functionName: "acronym",
        args: ["Hello World"],
        expected: "HW"
        // No codeChecks property
      };

      const result = runIOScenario(scenario, "code", mockAvailableFunctions, "jikiscript");

      expect(result.status).toBe("pass");
      expect(result.expects[0].pass).toBe(true);
      expect(result.expects[0].codeCheckResults).toBeUndefined();
      expect(result.frames).toHaveLength(1);
      expect(result.logLines).toHaveLength(1);
    });

    it("should work correctly when codeChecks is empty array", () => {
      (jikiscript.evaluateFunction as jest.Mock).mockReturnValue({
        value: "HW",
        error: null,
        frames: [],
        logLines: [],
        meta: { sourceCode: "code" }
      });

      const scenario: IOScenario = {
        slug: "empty-checks",
        name: "Empty Checks",
        description: "Scenario with empty code checks array",
        taskId: "task-1",
        functionName: "acronym",
        args: ["Hello World"],
        expected: "HW",
        codeChecks: []
      };

      const result = runIOScenario(scenario, "code", mockAvailableFunctions, "jikiscript");

      expect(result.status).toBe("pass");
      expect(result.expects[0].pass).toBe(true);
      expect(result.expects[0].codeCheckResults).toBeUndefined();
    });
  });
});
