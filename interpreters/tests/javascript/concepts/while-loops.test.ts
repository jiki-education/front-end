import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";
describe("JavaScript while loops", () => {
  describe("basic while loop", () => {
    test("simple counting loop", () => {
      const code = `
        let i = 0;
        let sum = 0;
        while (i < 5) {
          sum = sum + i;
          i = i + 1;
        }
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.i.value).toBe(5);
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.sum.value).toBe(10); // 0+1+2+3+4
    });

    test("while loop that doesn't execute", () => {
      const code = `
        let count = 0;
        while (false) {
          count = count + 1;
        }
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.count.value).toBe(0);
    });

    test("while loop with complex condition", () => {
      const code = `
        let x = 10;
        let y = 5;
        let iterations = 0;
        while (x > y && y > 0) {
          x = x - 2;
          y = y - 1;
          iterations = iterations + 1;
        }
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.iterations.value).toBe(5);
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.x.value).toBe(0);
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.y.value).toBe(0);
    });

    test("while loop with variable update in condition", () => {
      const code = `
        let n = 5;
        let result = 1;
        while (n > 0) {
          result = result * n;
          n = n - 1;
        }
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.result.value).toBe(120); // 5!
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.n.value).toBe(0);
    });
  });

  describe("nested while loops", () => {
    test("simple nested while loops", () => {
      const code = `
        let i = 0;
        let total = 0;
        while (i < 3) {
          let j = 0;
          while (j < 2) {
            total = total + 1;
            j = j + 1;
          }
          i = i + 1;
        }
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.total.value).toBe(6); // 3 * 2
    });

    test("nested loops with interdependent conditions", () => {
      const code = `
        let outer = 5;
        let inner = 0;
        let count = 0;
        while (outer > 0) {
          inner = outer;
          while (inner > 0) {
            count = count + 1;
            inner = inner - 1;
          }
          outer = outer - 1;
        }
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.count.value).toBe(15); // 5+4+3+2+1
    });
  });

  describe("while loop with scope", () => {
    test("variables declared in while loop body have block scope", () => {
      const code = `
        let i = 0;
        let outer = 10;
        while (i < 2) {
          let inner = 20;
          outer = outer + inner;
          i = i + 1;
        }
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.outer.value).toBe(50); // 10 + 20 + 20
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.inner).toBeUndefined();
    });
  });

  describe("runtime errors", () => {
    test("non-boolean condition when truthiness is disabled", () => {
      const code = `
        let i = 5;
        while (i) {
          i = i - 1;
        }
      `;
      const { frames, error } = interpret(code, { languageFeatures: { allowTruthiness: false } });
      expect(error).toBeNull();
      // Should have an error frame for the non-boolean condition
      const errorFrame = frames.find(f => f.status === "ERROR");
      expect(errorFrame).toBeDefined();
      expect(errorFrame?.error?.type).toBe("TruthinessDisabled");
    });

    test("undefined variable in condition", () => {
      const code = `
        while (undefinedVar) {
          let x = 1;
        }
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const errorFrame = frames.find(f => f.status === "ERROR");
      expect(errorFrame).toBeDefined();
      expect(errorFrame?.error?.type).toBe("VariableNotDeclared");
    });
  });

  describe("while loop syntax errors", () => {
    test("missing parentheses after while", () => {
      const code = `
        let i = 0;
        while i < 5 {
          i = i + 1;
        }
      `;
      const { error } = interpret(code);
      expect(error).not.toBeNull();
      // Check if error is string or object
      if (error && typeof error === "string") {
        expect(error).toContain("MissingLeftParenthesisAfterIf");
      } else if (error) {
        expect((error as any).type || (error as any).message).toContain("MissingLeftParenthesisAfterIf");
      }
    });

    test("missing closing parenthesis", () => {
      const code = `
        let i = 0;
        while (i < 5 {
          i = i + 1;
        }
      `;
      const { error } = interpret(code);
      expect(error).not.toBeNull();
      // Check if error is string or object
      if (error && typeof error === "string") {
        expect(error).toContain("MissingRightParenthesisAfterExpression");
      } else if (error) {
        expect((error as any).type || (error as any).message).toContain("MissingRightParenthesisAfterExpression");
      }
    });

    test("missing condition", () => {
      const code = `
        let i = 0;
        while () {
          i = i + 1;
        }
      `;
      const { error } = interpret(code);
      expect(error).not.toBeNull();
    });

    test("missing body", () => {
      const code = `
        let i = 0;
        while (i < 5)
      `;
      const { error } = interpret(code);
      expect(error).not.toBeNull();
    });
  });
});
