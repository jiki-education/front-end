import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

const generateEchosContext = (echos: any[]) => {
  return {
    externalFunctions: [
      {
        name: "echo",
        func: (_: any, n: any) => {
          echos.push(n.value.toString());
        },
        description: "",
      },
    ],
  };
};

describe("JavaScript repeat loops", () => {
  describe("basic repeat", () => {
    test("executes body the specified number of times", () => {
      const echos: string[] = [];
      const { frames, error } = interpret(
        `
        repeat(3) {
          echo("a")
        }
        `,
        generateEchosContext(echos)
      );
      expect(error).toBeNull();
      expect(frames[frames.length - 1].status).toBe("SUCCESS");
      expect(echos).toEqual(["a", "a", "a"]);
    });

    test("repeat with variable mutation", () => {
      const code = `
        let count = 0
        repeat(5) {
          count = count + 1
        }
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.count.value).toBe(5);
    });

    test("repeat with expression count", () => {
      const echos: string[] = [];
      const code = `
        let n = 2
        repeat(n + 1) {
          echo("b")
        }
      `;
      const { frames, error } = interpret(code, generateEchosContext(echos));
      expect(error).toBeNull();
      expect(echos).toEqual(["b", "b", "b"]);
    });
  });

  describe("zero iterations", () => {
    test("body does not execute when count is 0", () => {
      const echos: string[] = [];
      const { frames, error } = interpret(
        `
        repeat(0) {
          echo("a")
        }
        `,
        generateEchosContext(echos)
      );
      expect(error).toBeNull();
      expect(echos).toEqual([]);
      // Should still generate a frame for the repeat statement
      expect(frames.length).toBeGreaterThan(0);
    });
  });

  describe("break and continue", () => {
    test("break exits the loop early", () => {
      const code = `
        let count = 0
        repeat(5) {
          count = count + 1
          if (count === 3) {
            break
          }
        }
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.count.value).toBe(3);
    });

    test("continue skips to next iteration", () => {
      const echos: string[] = [];
      const code = `
        let i = 0
        repeat(5) {
          i = i + 1
          if (i === 3) {
            continue
          }
          echo(i)
        }
      `;
      const { frames, error } = interpret(code, generateEchosContext(echos));
      expect(error).toBeNull();
      expect(echos).toEqual(["1", "2", "4", "5"]);
    });
  });

  describe("scoping", () => {
    test("variables declared inside repeat have block scope", () => {
      const code = `
        let outer = 0
        repeat(3) {
          let inner = 10
          outer = outer + inner
        }
        let after = outer
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.variables.outer.value).toBe(30);
      expect(lastFrame.variables.after.value).toBe(30);
      expect(lastFrame.variables.inner).toBeUndefined();
    });
  });

  describe("nested repeats", () => {
    test("nested repeat loops work correctly", () => {
      const code = `
        let total = 0
        repeat(3) {
          repeat(2) {
            total = total + 1
          }
        }
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.total.value).toBe(6);
    });
  });

  describe("runtime errors", () => {
    test("non-number count", () => {
      const code = `repeat("hello") { let x = 1 }`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const errorFrame = frames.find(f => f.status === "ERROR");
      expect(errorFrame).toBeDefined();
      expect(errorFrame?.error?.type).toBe("RepeatCountMustBeNumber");
    });

    test("negative count", () => {
      const code = `repeat(-1) { let x = 1 }`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const errorFrame = frames.find(f => f.status === "ERROR");
      expect(errorFrame).toBeDefined();
      expect(errorFrame?.error?.type).toBe("RepeatCountMustBeNonNegative");
    });

    test("count exceeds max iterations", () => {
      const code = `repeat(100) { let x = 1 }`;
      const { frames, error } = interpret(code, {
        languageFeatures: { maxTotalLoopIterations: 10 },
      });
      expect(error).toBeNull();
      const errorFrame = frames.find(f => f.status === "ERROR");
      expect(errorFrame).toBeDefined();
      expect(errorFrame?.error?.type).toBe("RepeatCountTooHigh");
    });

    test("boolean count", () => {
      const code = `repeat(true) { let x = 1 }`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const errorFrame = frames.find(f => f.status === "ERROR");
      expect(errorFrame).toBeDefined();
      expect(errorFrame?.error?.type).toBe("RepeatCountMustBeNumber");
    });
  });

  describe("syntax errors", () => {
    test("missing opening parenthesis", () => {
      const code = `repeat 5) { let x = 1 }`;
      const { error } = interpret(code);
      expect(error).not.toBeNull();
    });

    test("missing closing parenthesis", () => {
      const code = `repeat(5 { let x = 1 }`;
      const { error } = interpret(code);
      expect(error).not.toBeNull();
    });
  });

  describe("allowedNodes restriction", () => {
    test("repeat is blocked when not in allowedNodes", () => {
      const code = `repeat(3) { let x = 1 }`;
      const { error } = interpret(code, {
        languageFeatures: {
          allowedNodes: ["VariableDeclaration", "ExpressionStatement"],
        },
      });
      expect(error).not.toBeNull();
    });
  });

  describe("descriptions", () => {
    test("generates description for repeat iteration", () => {
      const code = `
        repeat(2) {
          let x = 1
        }
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      // Find a repeat frame
      const repeatFrame = frames.find(
        f => (f as TestAugmentedFrame).description && (f as TestAugmentedFrame).description.includes("repeat")
      );
      expect(repeatFrame).toBeDefined();
    });

    test("generates description for zero iterations", () => {
      const code = `repeat(0) { let x = 1 }`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const repeatFrame = frames.find(
        f => (f as TestAugmentedFrame).description && (f as TestAugmentedFrame).description.includes("0")
      );
      expect(repeatFrame).toBeDefined();
    });
  });
});
