import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

describe("JavaScript for...in loops", () => {
  describe("basic iteration", () => {
    test("iterates over dictionary keys", () => {
      const code = `
        let keys = ""
        let obj = { a: 1, b: 2, c: 3 }
        for (let k in obj) {
          keys = keys + k
        }
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.variables.keys?.value).toBe("abc");
    });

    test("iterates over dictionary keys with const", () => {
      const code = `
        let keys = ""
        let obj = { x: 10, y: 20 }
        for (const k in obj) {
          keys = keys + k
        }
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.variables.keys?.value).toBe("xy");
    });

    test("can access values using key", () => {
      const code = `
        let sum = 0
        let obj = { a: 10, b: 20, c: 30 }
        for (let k in obj) {
          sum = sum + obj[k]
        }
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.variables.sum?.value).toBe(60);
    });
  });

  describe("empty dictionary", () => {
    test("does not execute body for empty dictionary", () => {
      const code = `
        let count = 0
        for (let k in {}) {
          count = count + 1
        }
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.variables.count?.value).toBe(0);
    });
  });

  describe("with break and continue", () => {
    test("break exits loop early", () => {
      const code = `
        let keys = ""
        let obj = { a: 1, b: 2, c: 3 }
        for (let k in obj) {
          if (k === "b") {
            break
          }
          keys = keys + k
        }
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.variables.keys?.value).toBe("a");
    });

    test("continue skips iteration", () => {
      const code = `
        let keys = ""
        let obj = { a: 1, b: 2, c: 3 }
        for (let k in obj) {
          if (k === "b") {
            continue
          }
          keys = keys + k
        }
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.variables.keys?.value).toBe("ac");
    });
  });

  describe("with functions", () => {
    test("hasKey function using for...in", () => {
      const code = `
        function hasKey(dict, key) {
          for (const k in dict) {
            if (k === key) {
              return true
            }
          }
          return false
        }
        let result = hasKey({ name: "Alice", age: 30 }, "name")
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.variables.result?.value).toBe(true);
    });
  });

  describe("runtime errors", () => {
    test("errors when target is not a dictionary", () => {
      const { frames, error, success } = interpret("for (let k in 42) { }");
      expect(error).toBeNull();
      expect(success).toBe(false);
      expect(frames[frames.length - 1].status).toBe("ERROR");
      expect(frames[frames.length - 1].error?.message).toContain("ForInLoopTargetNotObject");
    });

    test("errors when target is an array", () => {
      const { frames, error, success } = interpret("for (let k in [1, 2, 3]) { }");
      expect(error).toBeNull();
      expect(success).toBe(false);
      expect(frames[frames.length - 1].status).toBe("ERROR");
      expect(frames[frames.length - 1].error?.message).toContain("ForInLoopTargetNotObject");
    });

    test("errors when target is a string", () => {
      const { frames, error, success } = interpret('for (let k in "hello") { }');
      expect(error).toBeNull();
      expect(success).toBe(false);
      expect(frames[frames.length - 1].status).toBe("ERROR");
      expect(frames[frames.length - 1].error?.message).toContain("ForInLoopTargetNotObject");
    });
  });
});
