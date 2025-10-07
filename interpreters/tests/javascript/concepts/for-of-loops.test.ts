import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

describe("JavaScript for...of loops", () => {
  describe("basic array iteration", () => {
    test("iterate over simple array", () => {
      const code = `
        let sum = 0;
        for (let num of [1, 2, 3]) {
          sum = sum + num;
        }
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.variables.sum.value).toBe(6);
    });

    test("iterate over array variable", () => {
      const code = `
        let numbers = [10, 20, 30];
        let total = 0;
        for (let n of numbers) {
          total = total + n;
        }
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.variables.total.value).toBe(60);
    });

    test("iterate with array modification inside loop", () => {
      const code = `
        let items = [1, 2, 3];
        let results = [];
        for (let item of items) {
          let doubled = item * 2;
          results = [doubled];
        }
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      // After last iteration, results should contain [6]
      expect(lastFrame.variables.results.value[0].value).toBe(6);
    });
  });

  describe("string iteration", () => {
    test("iterate over string characters", () => {
      const code = `
        let word = "abc";
        let count = 0;
        for (let char of word) {
          count = count + 1;
        }
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.variables.count.value).toBe(3);
    });

    test("access string characters in loop", () => {
      const code = `
        let result = "";
        for (let c of "hi") {
          result = c;
        }
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.variables.result.value).toBe("i");
    });
  });

  describe("empty iterables", () => {
    test("empty array produces no iterations", () => {
      const code = `
        let count = 0;
        for (let item of []) {
          count = count + 1;
        }
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.variables.count.value).toBe(0);
    });

    test("empty string produces no iterations", () => {
      const code = `
        let count = 0;
        for (let char of "") {
          count = count + 1;
        }
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.variables.count.value).toBe(0);
    });
  });

  describe("nested for...of loops", () => {
    test("nested array iteration", () => {
      const code = `
        let outer = [1, 2];
        let inner = [10, 20];
        let sum = 0;
        for (let o of outer) {
          for (let i of inner) {
            sum = sum + o + i;
          }
        }
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      // (1+10) + (1+20) + (2+10) + (2+20) = 11 + 21 + 12 + 22 = 66
      expect(lastFrame.variables.sum.value).toBe(66);
    });

    test("nested with different types", () => {
      const code = `
        let words = ["a", "b"];
        let count = 0;
        for (let word of words) {
          for (let char of word) {
            count = count + 1;
          }
        }
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.variables.count.value).toBe(2);
    });
  });

  describe("for...of with break", () => {
    test("break exits loop early", () => {
      const code = `
        let sum = 0;
        for (let num of [1, 2, 3, 4, 5]) {
          if (num === 3) {
            break;
          }
          sum = sum + num;
        }
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.variables.sum.value).toBe(3); // 1 + 2
    });
  });

  describe("for...of with continue", () => {
    test("continue skips current iteration", () => {
      const code = `
        let sum = 0;
        for (let num of [1, 2, 3, 4]) {
          if (num === 2) {
            continue;
          }
          sum = sum + num;
        }
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.variables.sum.value).toBe(8); // 1 + 3 + 4
    });
  });

  describe("loop variable scoping", () => {
    test("loop variable not accessible after loop", () => {
      const code = `
        let x = 10;
        for (let x of [1, 2, 3]) {
          let temp = x;
        }
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      // After loop, x should be 10 (outer scope)
      expect(lastFrame.variables.x.value).toBe(10);
      // temp should not exist outside loop
      expect(lastFrame.variables.temp).toBeUndefined();
    });

    test("variables declared in loop body are scoped to loop", () => {
      const code = `
        for (let num of [1, 2]) {
          let doubled = num * 2;
        }
        let x = 5;
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      // doubled should not exist outside loop
      expect(lastFrame.variables.doubled).toBeUndefined();
      expect(lastFrame.variables.x.value).toBe(5);
    });
  });

  describe("error handling", () => {
    test("error on non-iterable: number", () => {
      const code = `
        for (let item of 42) {
          let x = item;
        }
      `;
      const { frames, error, success } = interpret(code);
      expect(error).toBeNull();
      expect(success).toBe(false);
      expect(frames[frames.length - 1].status).toBe("ERROR");
      expect(frames[frames.length - 1].error?.message).toContain("ForOfLoopTargetNotIterable");
    });

    test("error on non-iterable: boolean", () => {
      const code = `
        for (let item of true) {
          let x = item;
        }
      `;
      const { frames, error, success } = interpret(code);
      expect(error).toBeNull();
      expect(success).toBe(false);
      expect(frames[frames.length - 1].status).toBe("ERROR");
      expect(frames[frames.length - 1].error?.message).toContain("ForOfLoopTargetNotIterable");
    });

    test("error on non-iterable: null", () => {
      const code = `
        for (let item of null) {
          let x = item;
        }
      `;
      const { frames, error, success } = interpret(code);
      expect(error).toBeNull();
      expect(success).toBe(false);
      expect(frames[frames.length - 1].status).toBe("ERROR");
      expect(frames[frames.length - 1].error?.message).toContain("ForOfLoopTargetNotIterable");
    });

    test("error on non-iterable: undefined", () => {
      const code = `
        let x = undefined;
        for (let item of x) {
          let y = item;
        }
      `;
      const { frames, error, success } = interpret(code);
      expect(error).toBeNull();
      expect(success).toBe(false);
      expect(frames[frames.length - 1].status).toBe("ERROR");
      expect(frames[frames.length - 1].error?.message).toContain("ForOfLoopTargetNotIterable");
    });

    test("error on non-iterable: object/dictionary", () => {
      const code = `
        let obj = { a: 1 };
        for (let item of obj) {
          let x = item;
        }
      `;
      const { frames, error, success } = interpret(code);
      expect(error).toBeNull();
      expect(success).toBe(false);
      expect(frames[frames.length - 1].status).toBe("ERROR");
      expect(frames[frames.length - 1].error?.message).toContain("ForOfLoopTargetNotIterable");
    });
  });

  describe("complex expressions", () => {
    test("iterate over expression result", () => {
      const code = `
        let a = [1, 2];
        let b = [3, 4];
        let sum = 0;
        for (let num of a) {
          sum = sum + num;
        }
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.variables.sum.value).toBe(3);
    });
  });
});
