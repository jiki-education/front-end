import { describe, expect, test } from "vitest";
import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

test("restricts length property when not allowed", () => {
  const result = interpret(
    `
      let str = "hello";
      str.length;
    `,
    {
      languageFeatures: {
        allowedStdlib: {
          string: {
            properties: [], // No properties allowed
            methods: ["charAt"],
          },
        },
      },
    }
  );

  expect(result.success).toBe(false);
  expect(result.error).toBe(null);
  const errorFrame = result.frames.find(f => (f as TestAugmentedFrame).status === "ERROR");
  expect(errorFrame).toBeDefined();
  expect((errorFrame as TestAugmentedFrame)?.error?.type).toBe("MethodNotYetAvailable");
  expect((errorFrame as TestAugmentedFrame)?.error?.context?.method).toBe("length");
});

test("restricts charAt method when not allowed", () => {
  const result = interpret(
    `
      let str = "hello";
      str.charAt(0);
    `,
    {
      languageFeatures: {
        allowedStdlib: {
          string: {
            properties: ["length"],
            methods: [], // No methods allowed
          },
        },
      },
    }
  );

  expect(result.success).toBe(false);
  expect(result.error).toBe(null);
  const errorFrame = result.frames.find(f => (f as TestAugmentedFrame).status === "ERROR");
  expect(errorFrame).toBeDefined();
  expect((errorFrame as TestAugmentedFrame)?.error?.type).toBe("MethodNotYetAvailable");
  expect((errorFrame as TestAugmentedFrame)?.error?.context?.method).toBe("charAt");
});

test("allows length when included in feature flags", () => {
  const result = interpret(
    `
      let str = "hello";
      str.length;
    `,
    {
      languageFeatures: {
        allowedStdlib: {
          string: {
            properties: ["length"], // length is allowed
            methods: [],
          },
        },
      },
    }
  );

  expect(result.error).toBe(null);
  expect(result.success).toBe(true);
  const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
  expect(lastFrame.status).toBe("SUCCESS");
  expect(lastFrame.result?.jikiObject?.value).toBe(5);
});

test("allows toLowerCase when included in feature flags", () => {
  const result = interpret(
    `
      let str = "HELLO";
      str.toLowerCase();
    `,
    {
      languageFeatures: {
        allowedStdlib: {
          string: {
            properties: [],
            methods: ["toLowerCase"], // toLowerCase is allowed
          },
        },
      },
    }
  );

  expect(result.error).toBe(null);
  expect(result.success).toBe(true);
  const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
  expect(lastFrame.status).toBe("SUCCESS");
  expect(lastFrame.result?.jikiObject?.value).toBe("hello");
});

test("allows all string features when no restrictions", () => {
  const result = interpret(`
      let str = "HELLO";
      let len = str.length;
      let lower = str.toLowerCase();
    `);

  expect(result.error).toBe(null);
  expect(result.success).toBe(true);
});
