import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";
describe("JavaScript increment and decrement operators", () => {
  describe("prefix increment", () => {
    test("increments variable and returns new value", () => {
      const code = `
        let x = 5;
        let y = ++x;
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.x.value).toBe(6);
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.y.value).toBe(6);
    });

    test("works with zero", () => {
      const code = `
        let x = 0;
        let y = ++x;
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.x.value).toBe(1);
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.y.value).toBe(1);
    });

    test("works with negative numbers", () => {
      const code = `
        let x = -5;
        let y = ++x;
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.x.value).toBe(-4);
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.y.value).toBe(-4);
    });
  });

  describe("postfix increment", () => {
    test("increments variable but returns old value", () => {
      const code = `
        let x = 5;
        let y = x++;
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.x.value).toBe(6);
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.y.value).toBe(5);
    });

    test("multiple postfix increments", () => {
      const code = `
        let x = 0;
        x++;
        x++;
        x++;
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.x.value).toBe(3);
    });
  });

  describe("prefix decrement", () => {
    test("decrements variable and returns new value", () => {
      const code = `
        let x = 5;
        let y = --x;
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.x.value).toBe(4);
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.y.value).toBe(4);
    });

    test("works with zero", () => {
      const code = `
        let x = 0;
        let y = --x;
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.x.value).toBe(-1);
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.y.value).toBe(-1);
    });
  });

  describe("postfix decrement", () => {
    test("decrements variable but returns old value", () => {
      const code = `
        let x = 5;
        let y = x--;
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.x.value).toBe(4);
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.y.value).toBe(5);
    });
  });

  describe("complex expressions", () => {
    test("increment in arithmetic expression", () => {
      const code = `
        let x = 5;
        let y = ++x * 2;
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.x.value).toBe(6);
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.y.value).toBe(12);
    });

    test("postfix in arithmetic expression", () => {
      const code = `
        let x = 5;
        let y = x++ * 2;
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.x.value).toBe(6);
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.y.value).toBe(10);
    });

    test("mix of operations", () => {
      const code = `
        let a = 10;
        let b = 5;
        let c = ++a + b--;
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.a.value).toBe(11);
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.b.value).toBe(4);
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.c.value).toBe(16); // 11 + 5
    });
  });

  describe("error cases", () => {
    test("cannot increment undefined variable", () => {
      const code = `++x;`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      expect(frames.length).toBeGreaterThan(0);
      expect(frames[0].status).toBe("ERROR");
      expect(frames[0].error?.type).toBe("VariableNotDeclared");
    });

    test("cannot increment non-numeric value", () => {
      const code = `
        let x = "hello";
        ++x;
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      expect(frames.length).toBeGreaterThan(0);
      expect(frames[frames.length - 1].status).toBe("ERROR");
      expect(frames[frames.length - 1].error?.type).toBe("InvalidUnaryExpression");
    });

    test("cannot increment boolean", () => {
      const code = `
        let x = true;
        x++;
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      expect(frames.length).toBeGreaterThan(0);
      expect(frames[frames.length - 1].status).toBe("ERROR");
      expect(frames[frames.length - 1].error?.type).toBe("InvalidUnaryExpression");
    });
  });
});
