import { expect, test, describe } from "vitest";
import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

describe("String.lastIndexOf() method", () => {
  test("finds last occurrence of substring", () => {
    const result = interpret(`
      let str = "hello hello";
      let idx = str.lastIndexOf("hello");
    `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(6);
  });

  test("finds substring at beginning", () => {
    const result = interpret(`
      let str = "hello world";
      let idx = str.lastIndexOf("hello");
    `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(0);
  });

  test("returns -1 when substring not found", () => {
    const result = interpret(`
      let str = "hello world";
      let idx = str.lastIndexOf("xyz");
    `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(-1);
  });

  test("supports position parameter", () => {
    const result = interpret(`
      let str = "abc abc abc";
      let idx = str.lastIndexOf("abc", 5);
    `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(4);
  });

  test("searches backwards from position", () => {
    const result = interpret(`
      let str = "hello hello hello";
      let idx = str.lastIndexOf("hello", 10);
    `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(6);
  });

  test("supports negative position", () => {
    const result = interpret(`
      let str = "hello world";
      let idx = str.lastIndexOf("hello", -5);
    `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(0);
  });

  test("finds empty string", () => {
    const result = interpret(`
      let str = "hello";
      let idx = str.lastIndexOf("");
    `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(5);
  });

  test("is case-sensitive", () => {
    const result = interpret(`
      let str = "Hello World";
      let idx = str.lastIndexOf("hello");
    `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(-1);
  });

  test("truncates decimal position to integer", () => {
    const result = interpret(`
      let str = "abc abc abc";
      let idx = str.lastIndexOf("abc", 5.9);
    `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(4);
  });

  test("gives runtime error for missing searchString argument", () => {
    const result = interpret(`
      let str = "hello";
      str.lastIndexOf();
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
      str.lastIndexOf(123);
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
      str.lastIndexOf("h", "0");
    `);
    expect(result.success).toBe(false);
    expect(result.error).toBe(null);
    const errorFrame = result.frames.find(f => f.status === "ERROR");
    expect(errorFrame).toBeDefined();
    expect((errorFrame as TestAugmentedFrame)?.error?.type).toBe("TypeError");
  });
});
