import { runVisualScenario } from "@/components/coding-exercise/lib/test-runner/runVisualScenario";
import type { VisualScenario, VisualExercise, CodeCheck } from "@jiki/curriculum";
import { jikiscript } from "@jiki/interpreters";

// Mock the interpreters module
jest.mock("@jiki/interpreters", () => ({
  jikiscript: {
    interpret: jest.fn(),
    evaluateFunction: jest.fn()
  },
  javascript: {
    interpret: jest.fn(),
    evaluateFunction: jest.fn()
  },
  python: {
    interpret: jest.fn(),
    evaluateFunction: jest.fn()
  }
}));

// Mock the AnimationTimeline
jest.mock("@/components/coding-exercise/lib/AnimationTimeline", () => ({
  AnimationTimeline: jest.fn().mockImplementation(() => ({
    duration: 0,
    populateTimeline: jest.fn().mockReturnThis()
  }))
}));

// Create a mock exercise class
class MockExercise implements Partial<VisualExercise> {
  animations: any[] = [];
  availableFunctions = [{ name: "move", func: jest.fn(), description: "Move" }];
  state = { position: 100 };

  getView() {
    return document.createElement("div");
  }

  getState() {
    return this.state;
  }
}

describe("runVisualScenario", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock for interpreter
    (jikiscript.interpret as jest.Mock).mockReturnValue({
      frames: [{ time: 100, line: 1, status: "SUCCESS" }],
      logLines: [],
      meta: { sourceCode: "move()" }
    });
  });

  describe("basic visual scenario execution", () => {
    it("should pass when all expectations pass", () => {
      const scenario: VisualScenario = {
        slug: "basic-test",
        name: "Basic Test",
        description: "Test description",
        taskId: "task-1",
        setup: jest.fn(),
        expectations: jest.fn().mockReturnValue([{ pass: true, errorHtml: undefined }])
      };

      const result = runVisualScenario(scenario, "move()", MockExercise as any, "jikiscript");

      expect(result.status).toBe("pass");
      expect(result.expects).toHaveLength(1);
      expect(result.expects[0].pass).toBe(true);
    });

    it("should fail when any expectation fails", () => {
      const scenario: VisualScenario = {
        slug: "failing-test",
        name: "Failing Test",
        description: "Test description",
        taskId: "task-1",
        expectations: jest.fn().mockReturnValue([
          { pass: true, errorHtml: undefined },
          { pass: false, errorHtml: "Character not at goal" }
        ])
      };

      const result = runVisualScenario(scenario, "move()", MockExercise as any, "jikiscript");

      expect(result.status).toBe("fail");
      expect(result.expects).toHaveLength(2);
      expect(result.expects[1].pass).toBe(false);
      expect(result.expects[1].errorHtml).toBe("Character not at goal");
    });
  });

  describe("code checks", () => {
    it("should pass when functional expectations pass and all code checks pass", () => {
      const passingCodeCheck: CodeCheck = {
        pass: jest.fn().mockReturnValue(true),
        errorHtml: "This should not appear"
      };

      const scenario: VisualScenario = {
        slug: "with-code-check",
        name: "With Code Check",
        description: "Test with code check",
        taskId: "task-1",
        expectations: jest.fn().mockReturnValue([{ pass: true, errorHtml: undefined }]),
        codeChecks: [passingCodeCheck]
      };

      const result = runVisualScenario(scenario, "move()", MockExercise as any, "jikiscript");

      expect(result.status).toBe("pass");
      expect(result.expects).toHaveLength(2); // 1 functional + 1 code check
      expect(result.expects[0].pass).toBe(true);
      expect(result.expects[1].pass).toBe(true);
      expect(passingCodeCheck.pass).toHaveBeenCalled();
    });

    it("should fail when functional expectations pass but code check fails", () => {
      const failingCodeCheck: CodeCheck = {
        pass: jest.fn().mockReturnValue(false),
        errorHtml: "Your solution has more than 10 lines of code."
      };

      const scenario: VisualScenario = {
        slug: "failing-code-check",
        name: "Failing Code Check",
        description: "Test with failing code check",
        taskId: "task-1",
        expectations: jest.fn().mockReturnValue([{ pass: true, errorHtml: undefined }]),
        codeChecks: [failingCodeCheck]
      };

      const result = runVisualScenario(scenario, "verbose code here", MockExercise as any, "jikiscript");

      expect(result.status).toBe("fail");
      expect(result.expects).toHaveLength(2);
      expect(result.expects[0].pass).toBe(true); // Functional passed
      expect(result.expects[1].pass).toBe(false); // Code check failed
      expect(result.expects[1].errorHtml).toBe("Your solution has more than 10 lines of code.");
    });

    it("should fail when functional expectation fails (code check result included)", () => {
      const passingCodeCheck: CodeCheck = {
        pass: jest.fn().mockReturnValue(true),
        errorHtml: "Should not see this"
      };

      const scenario: VisualScenario = {
        slug: "functional-fail",
        name: "Functional Fail",
        description: "Functional test fails",
        taskId: "task-1",
        expectations: jest.fn().mockReturnValue([{ pass: false, errorHtml: "Character not at goal" }]),
        codeChecks: [passingCodeCheck]
      };

      const result = runVisualScenario(scenario, "bad code", MockExercise as any, "jikiscript");

      expect(result.status).toBe("fail");
      expect(result.expects).toHaveLength(2);
      expect(result.expects[0].pass).toBe(false);
      expect(result.expects[0].errorHtml).toBe("Character not at goal");
    });

    it("should handle multiple code checks", () => {
      const passingCheck: CodeCheck = {
        pass: jest.fn().mockReturnValue(true),
        errorHtml: "Passing check"
      };

      const failingCheck: CodeCheck = {
        pass: jest.fn().mockReturnValue(false),
        errorHtml: "First failing check"
      };

      const scenario: VisualScenario = {
        slug: "multiple-checks",
        name: "Multiple Checks",
        description: "Multiple code checks",
        taskId: "task-1",
        expectations: jest.fn().mockReturnValue([{ pass: true, errorHtml: undefined }]),
        codeChecks: [passingCheck, failingCheck]
      };

      const result = runVisualScenario(scenario, "code", MockExercise as any, "jikiscript");

      expect(result.status).toBe("fail");
      expect(result.expects).toHaveLength(3); // 1 functional + 2 code checks
      expect(result.expects[0].pass).toBe(true);
      expect(result.expects[1].pass).toBe(true);
      expect(result.expects[2].pass).toBe(false);
      expect(result.expects[2].errorHtml).toBe("First failing check");
    });

    it("should handle code check that throws an error", () => {
      const throwingCheck: CodeCheck = {
        pass: jest.fn().mockImplementation(() => {
          throw new Error("Check crashed!");
        }),
        errorHtml: "Normal error message"
      };

      const scenario: VisualScenario = {
        slug: "throwing-check",
        name: "Throwing Check",
        description: "Code check throws error",
        taskId: "task-1",
        expectations: jest.fn().mockReturnValue([{ pass: true, errorHtml: undefined }]),
        codeChecks: [throwingCheck]
      };

      const result = runVisualScenario(scenario, "code", MockExercise as any, "jikiscript");

      expect(result.status).toBe("fail");
      expect(result.expects).toHaveLength(2);
      expect(result.expects[1].pass).toBe(false);
      expect(result.expects[1].errorHtml).toBe("Code check error: Check crashed!");
    });
  });

  describe("frame errors", () => {
    it("should fail when any frame has ERROR status even if expectations pass", () => {
      (jikiscript.interpret as jest.Mock).mockReturnValue({
        frames: [
          { time: 100, line: 1, status: "SUCCESS" },
          { time: 200, line: 2, status: "SUCCESS" },
          { time: 300, line: 3, status: "ERROR", error: { message: "Timeout" } }
        ],
        logLines: [],
        meta: { sourceCode: "move()" }
      });

      const scenario: VisualScenario = {
        slug: "frame-error-test",
        name: "Frame Error Test",
        description: "Test with frame error",
        taskId: "task-1",
        expectations: jest.fn().mockReturnValue([{ pass: true, errorHtml: undefined }])
      };

      const result = runVisualScenario(scenario, "move()", MockExercise as any, "jikiscript");

      expect(result.status).toBe("fail");
      expect(result.expects[0].pass).toBe(true); // Expectations still pass
      expect(result.frames).toHaveLength(3);
      expect(result.frames[2].status).toBe("ERROR");
    });

    it("should pass when all frames have SUCCESS status and expectations pass", () => {
      (jikiscript.interpret as jest.Mock).mockReturnValue({
        frames: [
          { time: 100, line: 1, status: "SUCCESS" },
          { time: 200, line: 2, status: "SUCCESS" }
        ],
        logLines: [],
        meta: { sourceCode: "move()" }
      });

      const scenario: VisualScenario = {
        slug: "all-success-test",
        name: "All Success Test",
        description: "Test with all success frames",
        taskId: "task-1",
        expectations: jest.fn().mockReturnValue([{ pass: true, errorHtml: undefined }])
      };

      const result = runVisualScenario(scenario, "move()", MockExercise as any, "jikiscript");

      expect(result.status).toBe("pass");
    });

    it("should fail when frame has ERROR status even if code checks pass", () => {
      (jikiscript.interpret as jest.Mock).mockReturnValue({
        frames: [{ time: 100, line: 1, status: "ERROR", error: { message: "Infinite loop detected" } }],
        logLines: [],
        meta: { sourceCode: "move()" }
      });

      const passingCodeCheck: CodeCheck = {
        pass: jest.fn().mockReturnValue(true),
        errorHtml: "Should not appear"
      };

      const scenario: VisualScenario = {
        slug: "frame-error-with-code-check",
        name: "Frame Error With Code Check",
        description: "Test frame error with passing code check",
        taskId: "task-1",
        expectations: jest.fn().mockReturnValue([{ pass: true, errorHtml: undefined }]),
        codeChecks: [passingCodeCheck]
      };

      const result = runVisualScenario(scenario, "move()", MockExercise as any, "jikiscript");

      expect(result.status).toBe("fail");
    });
  });

  describe("randomSeed pass-through", () => {
    it("should pass randomSeed from scenario to interpreter context", () => {
      const scenario: VisualScenario = {
        slug: "seeded-test",
        name: "Seeded Test",
        description: "Test with random seed",
        taskId: "task-1",
        expectations: jest.fn().mockReturnValue([{ pass: true, errorHtml: undefined }]),
        randomSeed: 42
      };

      runVisualScenario(scenario, "move()", MockExercise as any, "jikiscript");

      expect(jikiscript.interpret).toHaveBeenCalledWith(
        "move()",
        expect.objectContaining({
          randomSeed: 42
        })
      );
    });

    it("should pass undefined randomSeed when not specified", () => {
      const scenario: VisualScenario = {
        slug: "no-seed-test",
        name: "No Seed Test",
        description: "Test without random seed",
        taskId: "task-1",
        expectations: jest.fn().mockReturnValue([{ pass: true, errorHtml: undefined }])
      };

      runVisualScenario(scenario, "move()", MockExercise as any, "jikiscript");

      expect(jikiscript.interpret).toHaveBeenCalledWith(
        "move()",
        expect.objectContaining({
          randomSeed: undefined
        })
      );
    });
  });

  describe("functionCall support", () => {
    it("should use evaluateFunction when scenario has functionCall", () => {
      (jikiscript.evaluateFunction as jest.Mock).mockReturnValue({
        frames: [{ time: 100, line: 1, status: "SUCCESS" }],
        logLines: [],
        meta: { sourceCode: "function draw() {}" }
      });

      const scenario: VisualScenario = {
        slug: "func-call-test",
        name: "Function Call Test",
        description: "Test with function call",
        taskId: "task-1",
        expectations: jest.fn().mockReturnValue([{ pass: true, errorHtml: undefined }]),
        functionCall: {
          name: "draw",
          args: [10, "red"]
        }
      };

      const result = runVisualScenario(scenario, "function draw() {}", MockExercise as any, "jikiscript");

      expect(jikiscript.evaluateFunction).toHaveBeenCalledWith(
        "function draw() {}",
        expect.objectContaining({
          externalFunctions: expect.any(Array),
          languageFeatures: { timePerFrame: 1 }
        }),
        "draw",
        10,
        "red"
      );
      expect(jikiscript.interpret).not.toHaveBeenCalled();
      expect(result.status).toBe("pass");
    });

    it("should use interpret when scenario has no functionCall", () => {
      const scenario: VisualScenario = {
        slug: "no-func-call",
        name: "No Function Call",
        description: "Test without function call",
        taskId: "task-1",
        expectations: jest.fn().mockReturnValue([{ pass: true, errorHtml: undefined }])
      };

      runVisualScenario(scenario, "move()", MockExercise as any, "jikiscript");

      expect(jikiscript.interpret).toHaveBeenCalled();
      expect(jikiscript.evaluateFunction).not.toHaveBeenCalled();
    });

    it("should pass randomSeed alongside functionCall", () => {
      (jikiscript.evaluateFunction as jest.Mock).mockReturnValue({
        frames: [{ time: 100, line: 1, status: "SUCCESS" }],
        logLines: [],
        meta: { sourceCode: "function draw() {}" }
      });

      const scenario: VisualScenario = {
        slug: "func-with-seed",
        name: "Function With Seed",
        description: "Test with function call and random seed",
        taskId: "task-1",
        expectations: jest.fn().mockReturnValue([{ pass: true, errorHtml: undefined }]),
        functionCall: {
          name: "draw",
          args: [5]
        },
        randomSeed: 99
      };

      runVisualScenario(scenario, "function draw() {}", MockExercise as any, "jikiscript");

      expect(jikiscript.evaluateFunction).toHaveBeenCalledWith(
        "function draw() {}",
        expect.objectContaining({
          randomSeed: 99
        }),
        "draw",
        5
      );
    });

    it("should handle functionCall with no args", () => {
      (jikiscript.evaluateFunction as jest.Mock).mockReturnValue({
        frames: [{ time: 100, line: 1, status: "SUCCESS" }],
        logLines: [],
        meta: { sourceCode: "function draw() {}" }
      });

      const scenario: VisualScenario = {
        slug: "func-no-args",
        name: "Function No Args",
        description: "Test with function call with no args",
        taskId: "task-1",
        expectations: jest.fn().mockReturnValue([{ pass: true, errorHtml: undefined }]),
        functionCall: {
          name: "draw",
          args: []
        }
      };

      runVisualScenario(scenario, "function draw() {}", MockExercise as any, "jikiscript");

      expect(jikiscript.evaluateFunction).toHaveBeenCalledWith(
        "function draw() {}",
        expect.objectContaining({
          externalFunctions: expect.any(Array)
        }),
        "draw"
      );
    });
  });

  describe("backward compatibility", () => {
    it("should work correctly when scenario has no code checks", () => {
      const scenario: VisualScenario = {
        slug: "no-checks",
        name: "No Checks",
        description: "Scenario without code checks",
        taskId: "task-1",
        expectations: jest.fn().mockReturnValue([{ pass: true, errorHtml: undefined }])
        // No codeChecks property
      };

      const result = runVisualScenario(scenario, "move()", MockExercise as any, "jikiscript");

      expect(result.status).toBe("pass");
      expect(result.expects).toHaveLength(1);
    });

    it("should work correctly when codeChecks is empty array", () => {
      const scenario: VisualScenario = {
        slug: "empty-checks",
        name: "Empty Checks",
        description: "Scenario with empty code checks array",
        taskId: "task-1",
        expectations: jest.fn().mockReturnValue([{ pass: true, errorHtml: undefined }]),
        codeChecks: []
      };

      const result = runVisualScenario(scenario, "move()", MockExercise as any, "jikiscript");

      expect(result.status).toBe("pass");
      expect(result.expects).toHaveLength(1);
    });
  });
});
