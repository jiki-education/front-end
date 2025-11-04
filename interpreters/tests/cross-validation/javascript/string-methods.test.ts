/**
 * Cross-validation tests for string methods
 * These tests verify that our JavaScript interpreter matches native JavaScript behavior
 */

import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

describe("JavaScript string methods cross-validation", () => {
  describe("concat()", () => {
    test("concatenates two strings", () => {
      const nativeResult = "hello".concat(" ", "world");

      const code = `let result = "hello".concat(" ", "world");`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;

      expect(lastFrame.variables.result.value).toBe(nativeResult);
    });

    test("concatenates multiple strings", () => {
      const nativeResult = "a".concat("b", "c", "d", "e");

      const code = `let result = "a".concat("b", "c", "d", "e");`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;

      expect(lastFrame.variables.result.value).toBe(nativeResult);
    });

    test("concatenates with no arguments", () => {
      const nativeResult = "hello".concat();

      const code = `let result = "hello".concat();`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;

      expect(lastFrame.variables.result.value).toBe(nativeResult);
    });
  });

  describe("repeat()", () => {
    test("repeats string multiple times", () => {
      const nativeResult = "abc".repeat(3);

      const code = `let result = "abc".repeat(3);`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;

      expect(lastFrame.variables.result.value).toBe(nativeResult);
    });

    test("repeats string zero times", () => {
      const nativeResult = "abc".repeat(0);

      const code = `let result = "abc".repeat(0);`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;

      expect(lastFrame.variables.result.value).toBe(nativeResult);
    });

    test("repeats empty string", () => {
      const nativeResult = "".repeat(5);

      const code = `let result = "".repeat(5);`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;

      expect(lastFrame.variables.result.value).toBe(nativeResult);
    });

    test("truncates fractional count (3.7 becomes 3)", () => {
      const nativeResult = "abc".repeat(3.7);

      const code = `let result = "abc".repeat(3.7);`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;

      expect(lastFrame.variables.result.value).toBe(nativeResult);
      expect(lastFrame.variables.result.value).toBe("abcabcabc");
    });
  });

  describe("replace()", () => {
    test("replaces first occurrence", () => {
      const nativeResult = "hello world world".replace("world", "there");

      const code = `let result = "hello world world".replace("world", "there");`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;

      expect(lastFrame.variables.result.value).toBe(nativeResult);
    });

    test("replaces with empty string", () => {
      const nativeResult = "hello world".replace("world", "");

      const code = `let result = "hello world".replace("world", "");`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;

      expect(lastFrame.variables.result.value).toBe(nativeResult);
    });

    test("no match returns original string", () => {
      const nativeResult = "hello".replace("xyz", "abc");

      const code = `let result = "hello".replace("xyz", "abc");`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;

      expect(lastFrame.variables.result.value).toBe(nativeResult);
    });
  });

  describe("replaceAll()", () => {
    test("replaces all occurrences", () => {
      const nativeResult = "hello world world".replaceAll("world", "there");

      const code = `let result = "hello world world".replaceAll("world", "there");`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;

      expect(lastFrame.variables.result.value).toBe(nativeResult);
    });

    test("replaces all with empty string", () => {
      const nativeResult = "a-b-c-d".replaceAll("-", "");

      const code = `let result = "a-b-c-d".replaceAll("-", "");`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;

      expect(lastFrame.variables.result.value).toBe(nativeResult);
    });

    test("no match returns original string", () => {
      const nativeResult = "hello".replaceAll("xyz", "abc");

      const code = `let result = "hello".replaceAll("xyz", "abc");`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;

      expect(lastFrame.variables.result.value).toBe(nativeResult);
    });
  });

  describe("split()", () => {
    test("splits string by separator", () => {
      const nativeResult = "a,b,c".split(",");

      const code = `let result = "a,b,c".split(",");`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;

      // Map JSArray of JSStrings to array of native strings for comparison
      const resultArray = lastFrame.variables.result.value.map((item: any) => item.value);
      expect(resultArray).toEqual(nativeResult);
    });

    test("splits with limit", () => {
      const nativeResult = "a,b,c,d,e".split(",", 3);

      const code = `let result = "a,b,c,d,e".split(",", 3);`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;

      // Map JSArray of JSStrings to array of native strings for comparison
      const resultArray = lastFrame.variables.result.value.map((item: any) => item.value);
      expect(resultArray).toEqual(nativeResult);
    });

    test("splits by empty string", () => {
      const nativeResult = "hello".split("");

      const code = `let result = "hello".split("");`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;

      // Map JSArray of JSStrings to array of native strings for comparison
      const resultArray = lastFrame.variables.result.value.map((item: any) => item.value);
      expect(resultArray).toEqual(nativeResult);
    });

    test("no separator found", () => {
      const nativeResult = "hello".split(",");

      const code = `let result = "hello".split(",");`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;

      // Map JSArray of JSStrings to array of native strings for comparison
      const resultArray = lastFrame.variables.result.value.map((item: any) => item.value);
      expect(resultArray).toEqual(nativeResult);
    });

    test("limit of 0 returns empty array", () => {
      const nativeResult = "a,b,c".split(",", 0);

      const code = `let result = "a,b,c".split(",", 0);`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;

      const resultArray = lastFrame.variables.result.value.map((item: any) => item.value);
      expect(resultArray).toEqual(nativeResult);
      expect(resultArray).toEqual([]);
    });

    test("truncates fractional limit (1.7 becomes 1)", () => {
      const nativeResult = "a,b,c".split(",", 1.7);

      const code = `let result = "a,b,c".split(",", 1.7);`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;

      const resultArray = lastFrame.variables.result.value.map((item: any) => item.value);
      expect(resultArray).toEqual(nativeResult);
      expect(resultArray).toEqual(["a"]);
    });
  });

  describe("trim()", () => {
    test("removes whitespace from both ends", () => {
      const nativeResult = "  hello  ".trim();

      const code = `let result = "  hello  ".trim();`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;

      expect(lastFrame.variables.result.value).toBe(nativeResult);
    });

    test("removes tabs and newlines", () => {
      const nativeResult = "\t\n hello \n\t".trim();

      const code = `let result = "\t\n hello \n\t".trim();`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;

      expect(lastFrame.variables.result.value).toBe(nativeResult);
    });

    test("no whitespace to remove", () => {
      const nativeResult = "hello".trim();

      const code = `let result = "hello".trim();`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;

      expect(lastFrame.variables.result.value).toBe(nativeResult);
    });
  });

  describe("trimStart()", () => {
    test("removes whitespace from start", () => {
      const nativeResult = "  hello  ".trimStart();

      const code = `let result = "  hello  ".trimStart();`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;

      expect(lastFrame.variables.result.value).toBe(nativeResult);
    });

    test("removes tabs and newlines from start", () => {
      const nativeResult = "\t\n hello \n\t".trimStart();

      const code = `let result = "\t\n hello \n\t".trimStart();`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;

      expect(lastFrame.variables.result.value).toBe(nativeResult);
    });
  });

  describe("trimEnd()", () => {
    test("removes whitespace from end", () => {
      const nativeResult = "  hello  ".trimEnd();

      const code = `let result = "  hello  ".trimEnd();`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;

      expect(lastFrame.variables.result.value).toBe(nativeResult);
    });

    test("removes tabs and newlines from end", () => {
      const nativeResult = "\t\n hello \n\t".trimEnd();

      const code = `let result = "\t\n hello \n\t".trimEnd();`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;

      expect(lastFrame.variables.result.value).toBe(nativeResult);
    });
  });

  describe("padStart()", () => {
    test("pads to target length with spaces", () => {
      const nativeResult = "5".padStart(3);

      const code = `let result = "5".padStart(3);`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;

      expect(lastFrame.variables.result.value).toBe(nativeResult);
    });

    test("pads with custom fill string", () => {
      const nativeResult = "5".padStart(3, "0");

      const code = `let result = "5".padStart(3, "0");`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;

      expect(lastFrame.variables.result.value).toBe(nativeResult);
    });

    test("pads with multi-character fill string", () => {
      const nativeResult = "abc".padStart(10, "foo");

      const code = `let result = "abc".padStart(10, "foo");`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;

      expect(lastFrame.variables.result.value).toBe(nativeResult);
    });

    test("no padding when already at target length", () => {
      const nativeResult = "hello".padStart(5);

      const code = `let result = "hello".padStart(5);`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;

      expect(lastFrame.variables.result.value).toBe(nativeResult);
    });

    test("negative target length returns original string", () => {
      const nativeResult = "hello".padStart(-5, "x");

      const code = `let result = "hello".padStart(-5, "x");`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;

      expect(lastFrame.variables.result.value).toBe(nativeResult);
      expect(lastFrame.variables.result.value).toBe("hello");
    });

    test("truncates fractional target length (3.7 becomes 3)", () => {
      const nativeResult = "hello".padStart(3.7, "x");

      const code = `let result = "hello".padStart(3.7, "x");`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;

      expect(lastFrame.variables.result.value).toBe(nativeResult);
      expect(lastFrame.variables.result.value).toBe("hello");
    });
  });

  describe("padEnd()", () => {
    test("pads to target length with spaces", () => {
      const nativeResult = "5".padEnd(3);

      const code = `let result = "5".padEnd(3);`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;

      expect(lastFrame.variables.result.value).toBe(nativeResult);
    });

    test("pads with custom fill string", () => {
      const nativeResult = "5".padEnd(3, "0");

      const code = `let result = "5".padEnd(3, "0");`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;

      expect(lastFrame.variables.result.value).toBe(nativeResult);
    });

    test("pads with multi-character fill string", () => {
      const nativeResult = "abc".padEnd(10, "foo");

      const code = `let result = "abc".padEnd(10, "foo");`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;

      expect(lastFrame.variables.result.value).toBe(nativeResult);
    });

    test("no padding when already at target length", () => {
      const nativeResult = "hello".padEnd(5);

      const code = `let result = "hello".padEnd(5);`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;

      expect(lastFrame.variables.result.value).toBe(nativeResult);
    });

    test("negative target length returns original string", () => {
      const nativeResult = "hello".padEnd(-5, "x");

      const code = `let result = "hello".padEnd(-5, "x");`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;

      expect(lastFrame.variables.result.value).toBe(nativeResult);
      expect(lastFrame.variables.result.value).toBe("hello");
    });

    test("truncates fractional target length (3.7 becomes 3)", () => {
      const nativeResult = "hello".padEnd(3.7, "x");

      const code = `let result = "hello".padEnd(3.7, "x");`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;

      expect(lastFrame.variables.result.value).toBe(nativeResult);
      expect(lastFrame.variables.result.value).toBe("hello");
    });
  });
});
