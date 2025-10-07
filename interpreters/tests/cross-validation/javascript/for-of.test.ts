/**
 * Cross-validation tests for for...of loops
 * These tests verify that our JavaScript interpreter matches native JavaScript behavior
 */

import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

describe("JavaScript for...of cross-validation", () => {
  test("array iteration matches native behavior", () => {
    // Native JavaScript
    const nativeResult = (() => {
      let sum = 0;
      for (let num of [1, 2, 3, 4, 5]) {
        sum = sum + num;
      }
      return sum;
    })();

    // Our interpreter
    const code = `
      let sum = 0;
      for (let num of [1, 2, 3, 4, 5]) {
        sum = sum + num;
      }
    `;
    const { frames, error } = interpret(code);
    expect(error).toBeNull();
    const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;

    expect(lastFrame.variables.sum.value).toBe(nativeResult);
  });

  test("string iteration matches native behavior", () => {
    // Native JavaScript
    const nativeResult = (() => {
      let chars = "";
      for (let c of "hello") {
        chars = chars + c + "-";
      }
      return chars;
    })();

    // Our interpreter
    const code = `
      let chars = "";
      for (let c of "hello") {
        chars = chars + c + "-";
      }
    `;
    const { frames, error } = interpret(code);
    expect(error).toBeNull();
    const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;

    expect(lastFrame.variables.chars.value).toBe(nativeResult);
  });

  test("empty array matches native behavior", () => {
    // Native JavaScript
    const nativeResult = (() => {
      let count = 0;
      for (let item of []) {
        count = count + 1;
      }
      return count;
    })();

    // Our interpreter
    const code = `
      let count = 0;
      for (let item of []) {
        count = count + 1;
      }
    `;
    const { frames, error } = interpret(code);
    expect(error).toBeNull();
    const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;

    expect(lastFrame.variables.count.value).toBe(nativeResult);
  });

  test("break behavior matches native", () => {
    // Native JavaScript
    const nativeResult = (() => {
      let sum = 0;
      for (let num of [1, 2, 3, 4, 5]) {
        if (num === 3) {
          break;
        }
        sum = sum + num;
      }
      return sum;
    })();

    // Our interpreter
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

    expect(lastFrame.variables.sum.value).toBe(nativeResult);
  });

  test("continue behavior matches native", () => {
    // Native JavaScript
    const nativeResult = (() => {
      let sum = 0;
      for (let num of [1, 2, 3, 4, 5]) {
        if (num === 3) {
          continue;
        }
        sum = sum + num;
      }
      return sum;
    })();

    // Our interpreter
    const code = `
      let sum = 0;
      for (let num of [1, 2, 3, 4, 5]) {
        if (num === 3) {
          continue;
        }
        sum = sum + num;
      }
    `;
    const { frames, error } = interpret(code);
    expect(error).toBeNull();
    const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;

    expect(lastFrame.variables.sum.value).toBe(nativeResult);
  });

  test("nested loops match native behavior", () => {
    // Native JavaScript
    const nativeResult = (() => {
      let result = 0;
      for (let a of [1, 2]) {
        for (let b of [10, 20]) {
          result = result + a * b;
        }
      }
      return result;
    })();

    // Our interpreter
    const code = `
      let result = 0;
      for (let a of [1, 2]) {
        for (let b of [10, 20]) {
          result = result + a * b;
        }
      }
    `;
    const { frames, error } = interpret(code);
    expect(error).toBeNull();
    const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;

    expect(lastFrame.variables.result.value).toBe(nativeResult);
  });

  test("loop variable scoping matches native", () => {
    // Native JavaScript
    const nativeResult = (() => {
      let x = 100;
      for (let x of [1, 2, 3]) {
        // x in loop shadows outer x
      }
      return x; // Should be 100 (outer x)
    })();

    // Our interpreter
    const code = `
      let x = 100;
      for (let x of [1, 2, 3]) {
        let temp = x;
      }
    `;
    const { frames, error } = interpret(code);
    expect(error).toBeNull();
    const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;

    expect(lastFrame.variables.x.value).toBe(nativeResult);
  });

  test("complex array expressions match native", () => {
    // Native JavaScript
    const nativeResult = (() => {
      let product = 1;
      for (let n of [2, 3, 4]) {
        product = product * n;
      }
      return product;
    })();

    // Our interpreter
    const code = `
      let product = 1;
      for (let n of [2, 3, 4]) {
        product = product * n;
      }
    `;
    const { frames, error } = interpret(code);
    expect(error).toBeNull();
    const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;

    expect(lastFrame.variables.product.value).toBe(nativeResult);
  });

  test("const in for...of with array matches native behavior", () => {
    // Native JavaScript
    const nativeResult = (() => {
      let sum = 0;
      for (const num of [1, 2, 3, 4, 5]) {
        sum = sum + num;
      }
      return sum;
    })();

    // Our interpreter
    const code = `
      let sum = 0;
      for (const num of [1, 2, 3, 4, 5]) {
        sum = sum + num;
      }
    `;
    const { frames, error } = interpret(code);
    expect(error).toBeNull();
    const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;

    expect(lastFrame.variables.sum.value).toBe(nativeResult);
  });

  test("const in for...of with string matches native behavior", () => {
    // Native JavaScript
    const nativeResult = (() => {
      let result = "";
      for (const char of "abc") {
        result = result + char;
      }
      return result;
    })();

    // Our interpreter
    const code = `
      let result = "";
      for (const char of "abc") {
        result = result + char;
      }
    `;
    const { frames, error } = interpret(code);
    expect(error).toBeNull();
    const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;

    expect(lastFrame.variables.result.value).toBe(nativeResult);
  });
});
