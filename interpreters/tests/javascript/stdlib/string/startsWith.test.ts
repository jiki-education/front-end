import { expect, test, describe } from "vitest";
import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

describe("String.startsWith() method", () => {
  test("returns true when string starts with substring", () => {
    const result = interpret(`
      let str = "hello world";
      let starts = str.startsWith("hello");
    `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(true);
  });

  test("returns false when string does not start with substring", () => {
    const result = interpret(`
      let str = "hello world";
      let starts = str.startsWith("world");
    `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(false);
  });

  test("returns true for empty string", () => {
    const result = interpret(`
      let str = "hello";
      let starts = str.startsWith("");
    `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(true);
  });

  test("is case-sensitive", () => {
    const result = interpret(`
      let str = "Hello World";
      let starts = str.startsWith("hello");
    `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(false);
  });

  test("supports position parameter", () => {
    const result = interpret(`
      let str = "hello world";
      let starts = str.startsWith("world", 6);
    `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(true);
  });

  test("returns false when position is beyond start of substring", () => {
    const result = interpret(`
      let str = "hello world";
      let starts = str.startsWith("hello", 1);
    `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(false);
  });

  test("supports negative position (treated as 0)", () => {
    const result = interpret(`
      let str = "hello world";
      let starts = str.startsWith("hello", -5);
    `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(true);
  });

  test("returns false when position is beyond string length", () => {
    const result = interpret(`
      let str = "hello";
      let starts = str.startsWith("hello", 100);
    `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(false);
  });

  test("truncates decimal position to integer", () => {
    const result = interpret(`
      let str = "hello world";
      let starts = str.startsWith("world", 6.9);
    `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(true);
  });

  test("checks exact match from position", () => {
    const result = interpret(`
      let str = "hello world";
      let starts = str.startsWith("wo", 6);
    `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(true);
  });

  test("gives runtime error for missing searchString argument", () => {
    const result = interpret(`
      let str = "hello";
      str.startsWith();
    `);
    expect(result.success).toBe(false);
    expect(result.error).toBe(null);
    const errorFrame = result.frames.find(f => f.status === "ERROR");
    expect(errorFrame).toBeDefined();
    expect((errorFrame as TestAugmentedFrame)?.error?.type).toBe("InvalidNumberOfArguments");
  });

  test("gives runtime error for non-string searchString", () => {
    const result = interpret(`
      let str = "hello";
      str.startsWith(123);
    `);
    expect(result.success).toBe(false);
    expect(result.error).toBe(null);
    const errorFrame = result.frames.find(f => f.status === "ERROR");
    expect(errorFrame).toBeDefined();
    expect((errorFrame as TestAugmentedFrame)?.error?.type).toBe("TypeError");
  });

  test("gives runtime error for non-number position", () => {
    const result = interpret(`
      let str = "hello";
      str.startsWith("h", "0");
    `);
    expect(result.success).toBe(false);
    expect(result.error).toBe(null);
    const errorFrame = result.frames.find(f => f.status === "ERROR");
    expect(errorFrame).toBeDefined();
    expect((errorFrame as TestAugmentedFrame)?.error?.type).toBe("TypeError");
  });
});
