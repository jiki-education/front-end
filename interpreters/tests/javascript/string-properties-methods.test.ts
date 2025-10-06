import { describe, expect, test } from "vitest";
import { interpret } from "../../src/javascript/interpreter";

// Type for frames augmented in test environment
interface TestAugmentedFrame {
  status: "SUCCESS" | "ERROR";
  result?: any;
  variables?: Record<string, any>;
  description?: string;
  error?: {
    type: string;
    message?: string;
    context?: any;
  };
}

describe("String properties", () => {
  describe("length property", () => {
    test("returns correct length for simple string", () => {
      const result = interpret(`
        let str = "hello";
        str.length;
      `);

      expect(result.error).toBe(null);
      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.value).toBe(5);
    });

    test("returns 0 for empty string", () => {
      const result = interpret(`
        let str = "";
        str.length;
      `);

      expect(result.error).toBe(null);
      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.value).toBe(0);
    });

    test("works with string containing spaces", () => {
      const result = interpret(`
        let str = "hello world";
        str.length;
      `);

      expect(result.error).toBe(null);
      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.value).toBe(11);
    });

    test("works with string containing special characters", () => {
      const result = interpret(`
        let str = "hello\\nworld";
        str.length;
      `);

      expect(result.error).toBe(null);
      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.value).toBe(11); // \n counts as 1 character
    });

    test("gives runtime error when using computed access for length", () => {
      const result = interpret(`
        let str = "hello";
        str["length"];
      `);

      expect(result.success).toBe(false);
      expect(result.error).toBe(null);
      const errorFrame = result.frames.find(f => (f as TestAugmentedFrame).status === "ERROR");
      expect(errorFrame).toBeDefined();
      expect((errorFrame as TestAugmentedFrame)?.error?.message).toBe(
        "TypeError: message: Cannot use computed property access for stdlib members"
      );
    });

    test("gives runtime error for unknown property", () => {
      const result = interpret(`
        let str = "hello";
        str.unknownProperty;
      `);

      expect(result.success).toBe(false);
      expect(result.error).toBe(null);
      const errorFrame = result.frames.find(f => (f as TestAugmentedFrame).status === "ERROR");
      expect(errorFrame).toBeDefined();
      expect((errorFrame as TestAugmentedFrame)?.error?.type).toBe("PropertyNotFound");
      expect((errorFrame as TestAugmentedFrame)?.error?.context?.property).toBe("unknownProperty");
    });
  });
});

describe("String methods", () => {
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

    test("gives runtime error for indexOf", () => {
      const result = interpret(`
        let str = "hello";
        str.indexOf("l");
      `);

      expect(result.success).toBe(false);
      expect(result.error).toBe(null);
      const errorFrame = result.frames.find(f => (f as TestAugmentedFrame).status === "ERROR");
      expect(errorFrame).toBeDefined();
      expect((errorFrame as TestAugmentedFrame)?.error?.type).toBe("MethodNotYetImplemented");
      expect((errorFrame as TestAugmentedFrame)?.error?.context?.method).toBe("indexOf");
    });
  });

  describe("computed access", () => {
    test("gives runtime error when using computed access for methods", () => {
      const result = interpret(`
        let str = "hello";
        str["charAt"];
      `);

      expect(result.success).toBe(false);
      expect(result.error).toBe(null);
      const errorFrame = result.frames.find(f => (f as TestAugmentedFrame).status === "ERROR");
      expect(errorFrame).toBeDefined();
      expect((errorFrame as TestAugmentedFrame)?.error?.message).toBe(
        "TypeError: message: Cannot use computed property access for stdlib members"
      );
    });
  });
});

describe("String stdlib with language features", () => {
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
});
