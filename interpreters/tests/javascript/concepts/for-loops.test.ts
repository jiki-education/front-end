import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";
describe("JavaScript for loops", () => {
  describe("basic for loop", () => {
    test("simple counting loop", () => {
      const code = `
        let sum = 0;
        for (let i = 0; i < 5; i++) {
          sum = sum + i;
        }
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.sum.value).toBe(10); // 0+1+2+3+4
    });

    test("loop with existing variable", () => {
      const code = `
        let i = 10;
        let count = 0;
        for (i = 0; i < 3; i++) {
          count = count + 1;
        }
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.i.value).toBe(3);
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.count.value).toBe(3);
    });

    test("loop with decrement", () => {
      const code = `
        let sum = 0;
        for (let i = 5; i > 0; i--) {
          sum = sum + i;
        }
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.sum.value).toBe(15); // 5+4+3+2+1
    });
  });

  describe("for loop variations", () => {
    test("no init", () => {
      const code = `
        let i = 0;
        let count = 0;
        for (; i < 3; i++) {
          count = count + 1;
        }
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.count.value).toBe(3);
    });

    test("no condition (infinite loop prevention needed)", () => {
      // This would be an infinite loop - we'll skip this test for now
      // as we need break statements to make it work
    });

    test("no update", () => {
      const code = `
        let count = 0;
        for (let i = 0; i < 3;) {
          count = count + 1;
          i++;
        }
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.count.value).toBe(3);
    });
  });

  describe("nested for loops", () => {
    test("for in a block", () => {
      const code = `
        let count = 0;
        {
          for (let j = 0; j < 3; j++) {
            count = count + 1;
          }
        }
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      // expect((frames[frames.length - 1] as TestAugmentedFrame).variables.sum.value).toBe(6); // 3 * 2
    });

    test("simple nested loops", () => {
      const code = `
        let count = 0;
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            count = count + 1;
          }
        }
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      // expect((frames[frames.length - 1] as TestAugmentedFrame).variables.sum.value).toBe(6); // 3 * 2
    });

    test("nested loops with dependent conditions", () => {
      const code = `
        let count = 0;
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j <= i; j++) {
            count = count + 1;
          }
        }
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.count.value).toBe(6); // 1 + 2 + 3
    });
  });

  describe("for loop scoping", () => {
    test("loop variable is scoped to the loop", () => {
      const code = `
        let x = 10;
        for (let x = 0; x < 3; x++) {
          let foo = "bar";
        }
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      // After the loop, x should still be 10 (outer scope)
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.x.value).toBe(10);
    });

    test("variables declared in loop body are scoped to the loop", () => {
      const code = `
        let sum = 0;
        for (let i = 0; i < 3; i++) {
          let temp = i * 2;
          sum = sum + temp;
        }
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.sum.value).toBe(6); // 0 + 2 + 4
      // temp should not exist outside the loop
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.temp).toBeUndefined();
    });
  });

  describe("for loop with complex expressions", () => {
    test("arithmetic in condition", () => {
      const code = `
        let count = 0;
        for (let i = 0; i * 2 < 10; i++) {
          count = count + 1;
        }
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.count.value).toBe(5);
    });

    test("multiple updates using comma operator", () => {
      // Note: JavaScript doesn't support comma operator yet
      // This would require additional parser support
    });

    test("complex update expression", () => {
      const code = `
        let sum = 0;
        for (let i = 1; i <= 8; i = i * 2) {
          sum = sum + i;
        }
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      expect((frames[frames.length - 1] as TestAugmentedFrame).variables.sum.value).toBe(15); // 1 + 2 + 4 + 8
    });
  });
});
