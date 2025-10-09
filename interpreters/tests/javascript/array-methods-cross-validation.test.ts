import { describe, test, expect } from "vitest";
import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

/**
 * Cross-validation tests: Compare interpreter behavior with native JavaScript
 * These tests ensure our implementations match JavaScript's actual behavior
 */
describe("Array methods cross-validation", () => {
  describe("splice() cross-validation", () => {
    test("removing elements matches native behavior", () => {
      const code = `
        let arr = [1, 2, 3, 4, 5];
        let deleted = arr.splice(2, 2);
      `;

      // Native JS
      const nativeArr = [1, 2, 3, 4, 5];
      const nativeDeleted = nativeArr.splice(2, 2);

      // Interpreter
      const result = interpret(code);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;

      expect(lastFrame.variables?.arr.value.map((v: { value: number }) => v.value)).toEqual(nativeArr);
      expect(lastFrame.result?.jikiObject?.value.map((v: { value: number }) => v.value)).toEqual(nativeDeleted);
    });

    test("inserting without removing matches native behavior", () => {
      const code = `
        let arr = [1, 2, 3];
        let deleted = arr.splice(1, 0, 10, 20);
      `;

      const nativeArr = [1, 2, 3];
      const nativeDeleted = nativeArr.splice(1, 0, 10, 20);

      const result = interpret(code);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;

      expect(lastFrame.variables?.arr.value.map((v: { value: number }) => v.value)).toEqual(nativeArr);
      expect(lastFrame.result?.jikiObject?.value.map((v: { value: number }) => v.value)).toEqual(nativeDeleted);
    });

    test("removing and inserting matches native behavior", () => {
      const code = `
        let arr = [1, 2, 3, 4];
        let deleted = arr.splice(1, 2, 10, 20);
      `;

      const nativeArr = [1, 2, 3, 4];
      const nativeDeleted = nativeArr.splice(1, 2, 10, 20);

      const result = interpret(code);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;

      expect(lastFrame.variables?.arr.value.map((v: { value: number }) => v.value)).toEqual(nativeArr);
      expect(lastFrame.result?.jikiObject?.value.map((v: { value: number }) => v.value)).toEqual(nativeDeleted);
    });
  });

  describe("sort() cross-validation", () => {
    test("sorting numbers matches native lexicographic behavior", () => {
      const code = `
        let arr = [10, 5, 40, 25, 100, 1];
        arr.sort();
      `;

      const nativeArr = [10, 5, 40, 25, 100, 1];
      nativeArr.sort();

      const result = interpret(code);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;

      expect(lastFrame.result?.jikiObject?.value.map((v: { value: number }) => v.value)).toEqual(nativeArr);
    });

    test("sorting strings matches native behavior", () => {
      const code = `
        let arr = ["zebra", "apple", "banana", "APPLE"];
        arr.sort();
      `;

      const nativeArr = ["zebra", "apple", "banana", "APPLE"];
      nativeArr.sort();

      const result = interpret(code);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;

      expect(lastFrame.result?.jikiObject?.value.map((v: { value: string }) => v.value)).toEqual(nativeArr);
    });

    test("sorting mixed values matches native behavior", () => {
      const code = `
        let arr = [3, 1, 4, 1, 5, 9];
        arr.sort();
      `;

      const nativeArr = [3, 1, 4, 1, 5, 9];
      nativeArr.sort();

      const result = interpret(code);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;

      expect(lastFrame.result?.jikiObject?.value.map((v: { value: number }) => v.value)).toEqual(nativeArr);
    });
  });

  describe("reverse() cross-validation", () => {
    test("reversing matches native behavior", () => {
      const code = `
        let arr = [1, 2, 3, 4, 5];
        arr.reverse();
      `;

      const nativeArr = [1, 2, 3, 4, 5];
      nativeArr.reverse();

      const result = interpret(code);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;

      expect(lastFrame.result?.jikiObject?.value.map((v: { value: number }) => v.value)).toEqual(nativeArr);
    });

    test("reversing strings matches native behavior", () => {
      const code = `
        let arr = ["a", "b", "c", "d"];
        arr.reverse();
      `;

      const nativeArr = ["a", "b", "c", "d"];
      nativeArr.reverse();

      const result = interpret(code);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;

      expect(lastFrame.result?.jikiObject?.value.map((v: { value: string }) => v.value)).toEqual(nativeArr);
    });
  });

  describe("fill() cross-validation", () => {
    test("filling entire array matches native behavior", () => {
      const code = `
        let arr = [1, 2, 3, 4];
        arr.fill(0);
      `;

      const nativeArr = [1, 2, 3, 4];
      nativeArr.fill(0);

      const result = interpret(code);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;

      expect(lastFrame.result?.jikiObject?.value.map((v: { value: number }) => v.value)).toEqual(nativeArr);
    });

    test("filling with start index matches native behavior", () => {
      const code = `
        let arr = [1, 2, 3, 4, 5];
        arr.fill(0, 2);
      `;

      const nativeArr = [1, 2, 3, 4, 5];
      nativeArr.fill(0, 2);

      const result = interpret(code);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;

      expect(lastFrame.result?.jikiObject?.value.map((v: { value: number }) => v.value)).toEqual(nativeArr);
    });

    test("filling with start and end indices matches native behavior", () => {
      const code = `
        let arr = [1, 2, 3, 4, 5];
        arr.fill(9, 1, 3);
      `;

      const nativeArr = [1, 2, 3, 4, 5];
      nativeArr.fill(9, 1, 3);

      const result = interpret(code);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;

      expect(lastFrame.result?.jikiObject?.value.map((v: { value: number }) => v.value)).toEqual(nativeArr);
    });
  });

  describe("lastIndexOf() cross-validation", () => {
    test("finding last occurrence matches native behavior", () => {
      const code = `
        let arr = [1, 2, 3, 2, 1];
        let idx = arr.lastIndexOf(2);
      `;

      const nativeArr = [1, 2, 3, 2, 1];
      const nativeIdx = nativeArr.lastIndexOf(2);

      const result = interpret(code);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;

      expect(lastFrame.result?.jikiObject?.value).toBe(nativeIdx);
    });

    test("not finding element matches native behavior", () => {
      const code = `
        let arr = [1, 2, 3];
        let idx = arr.lastIndexOf(99);
      `;

      const nativeArr = [1, 2, 3];
      const nativeIdx = nativeArr.lastIndexOf(99);

      const result = interpret(code);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;

      expect(lastFrame.result?.jikiObject?.value).toBe(nativeIdx);
    });

    test("fromIndex parameter matches native behavior", () => {
      const code = `
        let arr = [1, 2, 3, 2, 1];
        let idx = arr.lastIndexOf(2, 2);
      `;

      const nativeArr = [1, 2, 3, 2, 1];
      const nativeIdx = nativeArr.lastIndexOf(2, 2);

      const result = interpret(code);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;

      expect(lastFrame.result?.jikiObject?.value).toBe(nativeIdx);
    });

    test("negative fromIndex matches native behavior", () => {
      const code = `
        let arr = [1, 2, 3, 2, 1];
        let idx = arr.lastIndexOf(2, -2);
      `;

      const nativeArr = [1, 2, 3, 2, 1];
      const nativeIdx = nativeArr.lastIndexOf(2, -2);

      const result = interpret(code);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;

      expect(lastFrame.result?.jikiObject?.value).toBe(nativeIdx);
    });

    test("very negative fromIndex matches native behavior", () => {
      const code = `
        let arr = [1, 2, 3];
        let idx = arr.lastIndexOf(2, -10);
      `;

      const nativeArr = [1, 2, 3];
      const nativeIdx = nativeArr.lastIndexOf(2, -10);

      const result = interpret(code);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;

      expect(lastFrame.result?.jikiObject?.value).toBe(nativeIdx);
    });
  });

  describe("toString() cross-validation", () => {
    test("converting numbers array matches native behavior", () => {
      const code = `
        let arr = [1, 2, 3];
        let str = arr.toString();
      `;

      const nativeArr = [1, 2, 3];
      const nativeStr = nativeArr.toString();

      const result = interpret(code);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;

      expect(lastFrame.result?.jikiObject?.value).toBe(nativeStr);
    });

    test("converting strings array matches native behavior", () => {
      const code = `
        let arr = ["a", "b", "c"];
        let str = arr.toString();
      `;

      const nativeArr = ["a", "b", "c"];
      const nativeStr = nativeArr.toString();

      const result = interpret(code);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;

      expect(lastFrame.result?.jikiObject?.value).toBe(nativeStr);
    });

    test("converting empty array matches native behavior", () => {
      const code = `
        let arr = [];
        let str = arr.toString();
      `;

      const nativeArr: number[] = [];
      const nativeStr = nativeArr.toString();

      const result = interpret(code);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;

      expect(lastFrame.result?.jikiObject?.value).toBe(nativeStr);
    });

    test("converting single element array matches native behavior", () => {
      const code = `
        let arr = [42];
        let str = arr.toString();
      `;

      const nativeArr = [42];
      const nativeStr = nativeArr.toString();

      const result = interpret(code);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;

      expect(lastFrame.result?.jikiObject?.value).toBe(nativeStr);
    });
  });

  describe("Complex cross-validation scenarios", () => {
    test("chained operations match native behavior", () => {
      const code = `
        let arr = [3, 1, 4, 1, 5];
        arr.sort();
        arr.reverse();
        arr.fill(0, 2, 4);
      `;

      const nativeArr = [3, 1, 4, 1, 5];
      nativeArr.sort();
      nativeArr.reverse();
      nativeArr.fill(0, 2, 4);

      const result = interpret(code);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;

      expect(lastFrame.result?.jikiObject?.value.map((v: { value: number }) => v.value)).toEqual(nativeArr);
    });

    test("splice followed by sort matches native behavior", () => {
      const code = `
        let arr = [5, 2, 8, 1, 9];
        arr.splice(2, 1, 3, 4);
        arr.sort();
      `;

      const nativeArr = [5, 2, 8, 1, 9];
      nativeArr.splice(2, 1, 3, 4);
      nativeArr.sort();

      const result = interpret(code);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;

      expect(lastFrame.result?.jikiObject?.value.map((v: { value: number }) => v.value)).toEqual(nativeArr);
    });

    test("multiple operations preserve native semantics", () => {
      const code = `
        let arr = [1, 2, 3, 4, 5];
        arr.reverse();
        arr.fill(0, 1, 3);
        let str = arr.toString();
      `;

      const nativeArr = [1, 2, 3, 4, 5];
      nativeArr.reverse();
      nativeArr.fill(0, 1, 3);
      const nativeStr = nativeArr.toString();

      const result = interpret(code);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;

      expect(lastFrame.result?.jikiObject?.value).toBe(nativeStr);
      expect(lastFrame.variables?.arr.value.map((v: { value: number }) => v.value)).toEqual(nativeArr);
    });
  });
});
