import { describe, it, expect } from "vitest";
import { interpret } from "@javascript/interpreter";

describe("String()", () => {
  it("converts an integer to a string", () => {
    const result = interpret(`let x = String(42);`);
    expect(result.success).toBe(true);
    expect((result.frames[0] as any).variables.x.value).toBe("42");
  });

  it("converts a float to a string", () => {
    const result = interpret(`let x = String(3.14);`);
    expect(result.success).toBe(true);
    expect((result.frames[0] as any).variables.x.value).toBe("3.14");
  });

  it("passes through a string unchanged", () => {
    const result = interpret(`let x = String("hello");`);
    expect(result.success).toBe(true);
    expect((result.frames[0] as any).variables.x.value).toBe("hello");
  });

  it("converts true to 'true'", () => {
    const result = interpret(`let x = String(true);`);
    expect(result.success).toBe(true);
    expect((result.frames[0] as any).variables.x.value).toBe("true");
  });

  it("converts false to 'false'", () => {
    const result = interpret(`let x = String(false);`);
    expect(result.success).toBe(true);
    expect((result.frames[0] as any).variables.x.value).toBe("false");
  });

  it("converts null to 'null'", () => {
    const result = interpret(`let x = String(null);`);
    expect(result.success).toBe(true);
    expect((result.frames[0] as any).variables.x.value).toBe("null");
  });

  it("can be used in expressions", () => {
    const result = interpret(`let x = String(10) + "px";`);
    expect(result.success).toBe(true);
    expect((result.frames[0] as any).variables.x.value).toBe("10px");
  });

  it("can be used with variables", () => {
    const result = interpret(`
      let n = 42;
      let s = String(n);
    `);
    expect(result.success).toBe(true);
    expect((result.frames[1] as any).variables.s.value).toBe("42");
  });
});

describe("String() error handling", () => {
  it("throws error with no arguments", () => {
    const result = interpret(`String();`);
    expect(result.success).toBe(false);
    expect(result.frames[0].status).toBe("ERROR");
    expect(result.frames[0].error?.type).toBe("InvalidNumberOfArguments");
  });

  it("throws error with too many arguments", () => {
    const result = interpret(`String("a", "b");`);
    expect(result.success).toBe(false);
    expect(result.frames[0].status).toBe("ERROR");
    expect(result.frames[0].error?.type).toBe("InvalidNumberOfArguments");
  });
});
