import { describe, expect, test } from "vitest";
import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

describe.skip("charAt method (not yet implemented)", () => {
  test("returns character at positive index", () => {
    const result = interpret(`
        let str = "hello";
        str.charAt(0);
      `);

    expect(result.error).toBe(null);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe("h");
  });

  test("returns character at middle index", () => {
    const result = interpret(`
        let str = "hello";
        str.charAt(2);
      `);

    expect(result.error).toBe(null);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe("l");
  });

  test("returns character at last index", () => {
    const result = interpret(`
        let str = "hello";
        str.charAt(4);
      `);

    expect(result.error).toBe(null);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe("o");
  });

  test("supports negative indices", () => {
    const result = interpret(`
        let str = "hello";
        str.charAt(-1);
      `);

    expect(result.error).toBe(null);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe("o");
  });

  test("negative index from beginning", () => {
    const result = interpret(`
        let str = "hello";
        str.charAt(-5);
      `);

    expect(result.error).toBe(null);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe("h");
  });

  test("returns empty string for index out of bounds (positive)", () => {
    const result = interpret(`
        let str = "hello";
        str.charAt(10);
      `);

    expect(result.error).toBe(null);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe("");
  });

  test("returns empty string for index out of bounds (negative)", () => {
    const result = interpret(`
        let str = "hello";
        str.charAt(-10);
      `);

    expect(result.error).toBe(null);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe("");
  });

  test("gives runtime error for non-number argument", () => {
    const result = interpret(`
        let str = "hello";
        str.charAt("0");
      `);

    expect(result.success).toBe(false);
    expect(result.error).toBe(null);
    const errorFrame = result.frames.find(f => (f as TestAugmentedFrame).status === "ERROR");
    expect(errorFrame).toBeDefined();
    expect((errorFrame as TestAugmentedFrame)?.error?.type).toBe("TypeError");
    expect((errorFrame as TestAugmentedFrame)?.error?.message).toContain("expects a number argument");
  });

  test("gives runtime error for non-integer index", () => {
    const result = interpret(`
        let str = "hello";
        str.charAt(1.5);
      `);

    expect(result.success).toBe(false);
    expect(result.error).toBe(null);
    const errorFrame = result.frames.find(f => (f as TestAugmentedFrame).status === "ERROR");
    expect(errorFrame).toBeDefined();
    expect((errorFrame as TestAugmentedFrame)?.error?.type).toBe("TypeError");
    expect((errorFrame as TestAugmentedFrame)?.error?.message).toContain("expects an integer index");
  });

  test("gives runtime error for wrong number of arguments", () => {
    const result = interpret(`
        let str = "hello";
        str.charAt();
      `);

    expect(result.success).toBe(false);
    expect(result.error).toBe(null);
    const errorFrame = result.frames.find(f => (f as TestAugmentedFrame).status === "ERROR");
    expect(errorFrame).toBeDefined();
    expect((errorFrame as TestAugmentedFrame)?.error?.type).toBe("InvalidNumberOfArguments");
    expect((errorFrame as TestAugmentedFrame)?.error?.message).toContain("expected: 1");
    expect((errorFrame as TestAugmentedFrame)?.error?.message).toContain("got: 0");
  });

  test("gives runtime error for too many arguments", () => {
    const result = interpret(`
        let str = "hello";
        str.charAt(0, 1);
      `);

    expect(result.success).toBe(false);
    expect(result.error).toBe(null);
    const errorFrame = result.frames.find(f => (f as TestAugmentedFrame).status === "ERROR");
    expect(errorFrame).toBeDefined();
    expect((errorFrame as TestAugmentedFrame)?.error?.type).toBe("InvalidNumberOfArguments");
    expect((errorFrame as TestAugmentedFrame)?.error?.message).toContain("expected: 1");
    expect((errorFrame as TestAugmentedFrame)?.error?.message).toContain("got: 2");
  });
});

describe("unimplemented methods", () => {
  test("gives runtime error for charAt", () => {
    const result = interpret(`
        let str = "HELLO";
        str.charAt(0);
      `);

    expect(result.success).toBe(false);
    expect(result.error).toBe(null);
    const errorFrame = result.frames.find(f => (f as TestAugmentedFrame).status === "ERROR");
    expect(errorFrame).toBeDefined();
    expect((errorFrame as TestAugmentedFrame)?.error?.type).toBe("MethodNotYetImplemented");
    expect((errorFrame as TestAugmentedFrame)?.error?.context?.method).toBe("charAt");
  });
});
