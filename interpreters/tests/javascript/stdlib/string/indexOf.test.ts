import { expect, test, describe } from "vitest";
import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

describe("String.indexOf() method", () => {
  test("finds substring at beginning", () => {
    const result = interpret(`
      let str = "hello world";
      let idx = str.indexOf("hello");
    `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(0);
  });

  test("finds substring in middle", () => {
    const result = interpret(`
      let str = "hello world";
      let idx = str.indexOf("lo");
    `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(3);
  });

  test("finds substring at end", () => {
    const result = interpret(`
      let str = "hello world";
      let idx = str.indexOf("world");
    `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(6);
  });

  test("returns -1 when substring not found", () => {
    const result = interpret(`
      let str = "hello world";
      let idx = str.indexOf("xyz");
    `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(-1);
  });

  test("finds empty string at position 0", () => {
    const result = interpret(`
      let str = "hello";
      let idx = str.indexOf("");
    `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(0);
  });

  test("is case-sensitive", () => {
    const result = interpret(`
      let str = "Hello World";
      let idx = str.indexOf("hello");
    `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(-1);
  });

  test("supports position parameter", () => {
    const result = interpret(`
      let str = "hello hello";
      let idx = str.indexOf("hello", 1);
    `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(6);
  });

  test("supports position at exact match location", () => {
    const result = interpret(`
      let str = "hello world";
      let idx = str.indexOf("world", 6);
    `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(6);
  });

  test("returns -1 when position is beyond match", () => {
    const result = interpret(`
      let str = "hello world";
      let idx = str.indexOf("hello", 1);
    `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(-1);
  });

  test("supports negative position (treated as 0)", () => {
    const result = interpret(`
      let str = "hello world";
      let idx = str.indexOf("hello", -5);
    `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(0);
  });

  test("supports position beyond string length", () => {
    const result = interpret(`
      let str = "hello";
      let idx = str.indexOf("hello", 100);
    `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(-1);
  });

  test("finds first occurrence when multiple exist", () => {
    const result = interpret(`
      let str = "abc abc abc";
      let idx = str.indexOf("abc");
    `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(0);
  });

  test("truncates decimal position to integer", () => {
    const result = interpret(`
      let str = "hello hello";
      let idx = str.indexOf("hello", 2.9);
    `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(6);
  });

  test("gives runtime error for missing searchString argument", () => {
    const result = interpret(`
      let str = "hello";
      str.indexOf();
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
      str.indexOf(123);
    `);
    expect(result.success).toBe(false);
    expect(result.error).toBe(null);
    const errorFrame = result.frames.find(f => f.status === "ERROR");
    expect(errorFrame).toBeDefined();
    expect((errorFrame as TestAugmentedFrame)?.error?.type).toBe("TypeError");
    expect((errorFrame as TestAugmentedFrame)?.error?.message).toContain("argName: searchString");
    expect((errorFrame as TestAugmentedFrame)?.error?.message).toContain("expected: string");
  });

  test("gives runtime error for non-number position", () => {
    const result = interpret(`
      let str = "hello";
      str.indexOf("h", "0");
    `);
    expect(result.success).toBe(false);
    expect(result.error).toBe(null);
    const errorFrame = result.frames.find(f => f.status === "ERROR");
    expect(errorFrame).toBeDefined();
    expect((errorFrame as TestAugmentedFrame)?.error?.type).toBe("TypeError");
    expect((errorFrame as TestAugmentedFrame)?.error?.message).toContain("argName: position");
    expect((errorFrame as TestAugmentedFrame)?.error?.message).toContain("expected: number");
  });

  test("gives runtime error for too many arguments", () => {
    const result = interpret(`
      let str = "hello";
      str.indexOf("h", 0, 5);
    `);
    expect(result.success).toBe(false);
    expect(result.error).toBe(null);
    const errorFrame = result.frames.find(f => f.status === "ERROR");
    expect(errorFrame).toBeDefined();
    expect((errorFrame as TestAugmentedFrame)?.error?.type).toBe("InvalidNumberOfArguments");
  });
});
