import { expect, test, describe } from "vitest";
import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

describe("String.includes() method", () => {
  test("returns true when substring is found", () => {
    const result = interpret(`
      let str = "hello world";
      let found = str.includes("world");
    `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(true);
  });

  test("returns false when substring is not found", () => {
    const result = interpret(`
      let str = "hello world";
      let found = str.includes("xyz");
    `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(false);
  });

  test("finds substring at beginning", () => {
    const result = interpret(`
      let str = "hello world";
      let found = str.includes("hello");
    `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(true);
  });

  test("finds substring at end", () => {
    const result = interpret(`
      let str = "hello world";
      let found = str.includes("rld");
    `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(true);
  });

  test("finds empty string", () => {
    const result = interpret(`
      let str = "hello";
      let found = str.includes("");
    `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(true);
  });

  test("is case-sensitive", () => {
    const result = interpret(`
      let str = "Hello World";
      let found = str.includes("hello");
    `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(false);
  });

  test("supports position parameter", () => {
    const result = interpret(`
      let str = "hello world";
      let found = str.includes("hello", 1);
    `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(false);
  });

  test("finds substring after position", () => {
    const result = interpret(`
      let str = "hello world";
      let found = str.includes("world", 6);
    `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(true);
  });

  test("supports negative position (treated as 0)", () => {
    const result = interpret(`
      let str = "hello world";
      let found = str.includes("hello", -5);
    `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(true);
  });

  test("truncates decimal position to integer", () => {
    const result = interpret(`
      let str = "hello world";
      let found = str.includes("world", 3.9);
    `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(true);
  });

  test("gives runtime error for missing searchString argument", () => {
    const result = interpret(`
      let str = "hello";
      str.includes();
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
      str.includes(123);
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
      str.includes("h", "0");
    `);
    expect(result.success).toBe(false);
    expect(result.error).toBe(null);
    const errorFrame = result.frames.find(f => f.status === "ERROR");
    expect(errorFrame).toBeDefined();
    expect((errorFrame as TestAugmentedFrame)?.error?.type).toBe("TypeError");
  });
});
