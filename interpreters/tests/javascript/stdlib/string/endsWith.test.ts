import { expect, test, describe } from "vitest";
import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

describe("String.endsWith() method", () => {
  test("returns true when string ends with substring", () => {
    const result = interpret(`
      let str = "hello world";
      let ends = str.endsWith("world");
    `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(true);
  });

  test("returns false when string does not end with substring", () => {
    const result = interpret(`
      let str = "hello world";
      let ends = str.endsWith("hello");
    `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(false);
  });

  test("returns true for empty string", () => {
    const result = interpret(`
      let str = "hello";
      let ends = str.endsWith("");
    `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(true);
  });

  test("is case-sensitive", () => {
    const result = interpret(`
      let str = "Hello World";
      let ends = str.endsWith("world");
    `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(false);
  });

  test("supports length parameter", () => {
    const result = interpret(`
      let str = "hello world";
      let ends = str.endsWith("hello", 5);
    `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(true);
  });

  test("checks substring at specific length position", () => {
    const result = interpret(`
      let str = "hello world";
      let ends = str.endsWith("lo", 5);
    `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(true);
  });

  test("returns false when length is before substring", () => {
    const result = interpret(`
      let str = "hello world";
      let ends = str.endsWith("world", 5);
    `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(false);
  });

  test("supports negative length (treated as 0)", () => {
    const result = interpret(`
      let str = "hello world";
      let ends = str.endsWith("hello", -5);
    `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(false);
  });

  test("supports length beyond string length", () => {
    const result = interpret(`
      let str = "hello";
      let ends = str.endsWith("hello", 100);
    `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(true);
  });

  test("truncates decimal length to integer", () => {
    const result = interpret(`
      let str = "hello world";
      let ends = str.endsWith("hello", 5.9);
    `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(true);
  });

  test("checks exact match up to length", () => {
    const result = interpret(`
      let str = "hello world";
      let ends = str.endsWith("ll", 4);
    `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(true);
  });

  test("gives runtime error for missing searchString argument", () => {
    const result = interpret(`
      let str = "hello";
      str.endsWith();
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
      str.endsWith(123);
    `);
    expect(result.success).toBe(false);
    expect(result.error).toBe(null);
    const errorFrame = result.frames.find(f => f.status === "ERROR");
    expect(errorFrame).toBeDefined();
    expect((errorFrame as TestAugmentedFrame)?.error?.type).toBe("TypeError");
  });

  test("gives runtime error for non-number length", () => {
    const result = interpret(`
      let str = "hello";
      str.endsWith("o", "5");
    `);
    expect(result.success).toBe(false);
    expect(result.error).toBe(null);
    const errorFrame = result.frames.find(f => f.status === "ERROR");
    expect(errorFrame).toBeDefined();
    expect((errorFrame as TestAugmentedFrame)?.error?.type).toBe("TypeError");
  });
});
