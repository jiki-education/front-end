import { describe, test, expect } from "vitest";
import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

/**
 * Cross-validation tests for String search methods
 *
 * These tests compare the interpreter's output against native JavaScript behavior
 * to ensure exact compliance with the JavaScript specification.
 */

describe("Cross-validation: String search methods", () => {
  describe("indexOf()", () => {
    test("basic search", () => {
      const nativeResult = "hello world".indexOf("world");
      const result = interpret(`let idx = "hello world".indexOf("world");`);
      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.result?.jikiObject?.value).toBe(nativeResult);
    });

    test("not found", () => {
      const nativeResult = "hello world".indexOf("xyz");
      const result = interpret(`let idx = "hello world".indexOf("xyz");`);
      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.result?.jikiObject?.value).toBe(nativeResult);
    });

    test("with position parameter", () => {
      const nativeResult = "hello hello".indexOf("hello", 1);
      const result = interpret(`let idx = "hello hello".indexOf("hello", 1);`);
      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.result?.jikiObject?.value).toBe(nativeResult);
    });

    test("negative position", () => {
      const nativeResult = "hello world".indexOf("hello", -5);
      const result = interpret(`let idx = "hello world".indexOf("hello", -5);`);
      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.result?.jikiObject?.value).toBe(nativeResult);
    });

    test("empty string search", () => {
      const nativeResult = "hello".indexOf("");
      const result = interpret(`let idx = "hello".indexOf("");`);
      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.result?.jikiObject?.value).toBe(nativeResult);
    });
  });

  describe("lastIndexOf()", () => {
    test("basic search", () => {
      const nativeResult = "hello hello".lastIndexOf("hello");
      const result = interpret(`let idx = "hello hello".lastIndexOf("hello");`);
      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.result?.jikiObject?.value).toBe(nativeResult);
    });

    test("not found", () => {
      const nativeResult = "hello world".lastIndexOf("xyz");
      const result = interpret(`let idx = "hello world".lastIndexOf("xyz");`);
      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.result?.jikiObject?.value).toBe(nativeResult);
    });

    test("with position parameter", () => {
      const nativeResult = "abc abc abc".lastIndexOf("abc", 5);
      const result = interpret(`let idx = "abc abc abc".lastIndexOf("abc", 5);`);
      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.result?.jikiObject?.value).toBe(nativeResult);
    });

    test("negative position", () => {
      const nativeResult = "hello world".lastIndexOf("hello", -5);
      const result = interpret(`let idx = "hello world".lastIndexOf("hello", -5);`);
      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.result?.jikiObject?.value).toBe(nativeResult);
    });

    test("empty string search", () => {
      const nativeResult = "hello".lastIndexOf("");
      const result = interpret(`let idx = "hello".lastIndexOf("");`);
      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.result?.jikiObject?.value).toBe(nativeResult);
    });
  });

  describe("includes()", () => {
    test("found", () => {
      const nativeResult = "hello world".includes("world");
      const result = interpret(`let found = "hello world".includes("world");`);
      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.result?.jikiObject?.value).toBe(nativeResult);
    });

    test("not found", () => {
      const nativeResult = "hello world".includes("xyz");
      const result = interpret(`let found = "hello world".includes("xyz");`);
      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.result?.jikiObject?.value).toBe(nativeResult);
    });

    test("with position parameter", () => {
      const nativeResult = "hello world".includes("hello", 1);
      const result = interpret(`let found = "hello world".includes("hello", 1);`);
      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.result?.jikiObject?.value).toBe(nativeResult);
    });

    test("negative position", () => {
      const nativeResult = "hello world".includes("hello", -5);
      const result = interpret(`let found = "hello world".includes("hello", -5);`);
      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.result?.jikiObject?.value).toBe(nativeResult);
    });

    test("empty string search", () => {
      const nativeResult = "hello".includes("");
      const result = interpret(`let found = "hello".includes("");`);
      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.result?.jikiObject?.value).toBe(nativeResult);
    });
  });

  describe("startsWith()", () => {
    test("starts with substring", () => {
      const nativeResult = "hello world".startsWith("hello");
      const result = interpret(`let starts = "hello world".startsWith("hello");`);
      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.result?.jikiObject?.value).toBe(nativeResult);
    });

    test("does not start with substring", () => {
      const nativeResult = "hello world".startsWith("world");
      const result = interpret(`let starts = "hello world".startsWith("world");`);
      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.result?.jikiObject?.value).toBe(nativeResult);
    });

    test("with position parameter", () => {
      const nativeResult = "hello world".startsWith("world", 6);
      const result = interpret(`let starts = "hello world".startsWith("world", 6);`);
      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.result?.jikiObject?.value).toBe(nativeResult);
    });

    test("negative position", () => {
      const nativeResult = "hello world".startsWith("hello", -5);
      const result = interpret(`let starts = "hello world".startsWith("hello", -5);`);
      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.result?.jikiObject?.value).toBe(nativeResult);
    });

    test("empty string", () => {
      const nativeResult = "hello".startsWith("");
      const result = interpret(`let starts = "hello".startsWith("");`);
      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.result?.jikiObject?.value).toBe(nativeResult);
    });
  });

  describe("endsWith()", () => {
    test("ends with substring", () => {
      const nativeResult = "hello world".endsWith("world");
      const result = interpret(`let ends = "hello world".endsWith("world");`);
      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.result?.jikiObject?.value).toBe(nativeResult);
    });

    test("does not end with substring", () => {
      const nativeResult = "hello world".endsWith("hello");
      const result = interpret(`let ends = "hello world".endsWith("hello");`);
      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.result?.jikiObject?.value).toBe(nativeResult);
    });

    test("with length parameter", () => {
      const nativeResult = "hello world".endsWith("hello", 5);
      const result = interpret(`let ends = "hello world".endsWith("hello", 5);`);
      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.result?.jikiObject?.value).toBe(nativeResult);
    });

    test("negative length", () => {
      const nativeResult = "hello world".endsWith("hello", -5);
      const result = interpret(`let ends = "hello world".endsWith("hello", -5);`);
      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.result?.jikiObject?.value).toBe(nativeResult);
    });

    test("empty string", () => {
      const nativeResult = "hello".endsWith("");
      const result = interpret(`let ends = "hello".endsWith("");`);
      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.result?.jikiObject?.value).toBe(nativeResult);
    });
  });
});
