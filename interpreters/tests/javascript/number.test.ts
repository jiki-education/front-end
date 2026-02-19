import { describe, it, expect } from "vitest";
import { interpret } from "@javascript/interpreter";

describe("Number()", () => {
  it("converts an integer string to a number", () => {
    const result = interpret(`let x = Number("123");`);
    expect(result.success).toBe(true);
    expect((result.frames[0] as any).variables.x.value).toBe(123);
  });

  it("converts a float string to a number", () => {
    const result = interpret(`let x = Number("3.14");`);
    expect(result.success).toBe(true);
    expect((result.frames[0] as any).variables.x.value).toBe(3.14);
  });

  it("converts an empty string to 0", () => {
    const result = interpret(`let x = Number("");`);
    expect(result.success).toBe(true);
    expect((result.frames[0] as any).variables.x.value).toBe(0);
  });

  it("converts a non-numeric string to NaN", () => {
    const result = interpret(`let x = Number("abc");`);
    expect(result.success).toBe(true);
    expect((result.frames[0] as any).variables.x.value).toBeNaN();
  });

  it("passes through a number unchanged", () => {
    const result = interpret(`let x = Number(42);`);
    expect(result.success).toBe(true);
    expect((result.frames[0] as any).variables.x.value).toBe(42);
  });

  it("converts true to 1", () => {
    const result = interpret(`let x = Number(true);`);
    expect(result.success).toBe(true);
    expect((result.frames[0] as any).variables.x.value).toBe(1);
  });

  it("converts false to 0", () => {
    const result = interpret(`let x = Number(false);`);
    expect(result.success).toBe(true);
    expect((result.frames[0] as any).variables.x.value).toBe(0);
  });

  it("converts null to 0", () => {
    const result = interpret(`let x = Number(null);`);
    expect(result.success).toBe(true);
    expect((result.frames[0] as any).variables.x.value).toBe(0);
  });

  it("can be used in expressions", () => {
    const result = interpret(`let x = Number("10") + 5;`);
    expect(result.success).toBe(true);
    expect((result.frames[0] as any).variables.x.value).toBe(15);
  });

  it("can be used with variables", () => {
    const result = interpret(`
      let s = "42";
      let n = Number(s);
    `);
    expect(result.success).toBe(true);
    expect((result.frames[1] as any).variables.n.value).toBe(42);
  });
});

describe("Number() error handling", () => {
  it("throws error with no arguments", () => {
    const result = interpret(`Number();`);
    expect(result.success).toBe(false);
    expect(result.frames[0].status).toBe("ERROR");
    expect(result.frames[0].error?.type).toBe("InvalidNumberOfArguments");
  });

  it("throws error with too many arguments", () => {
    const result = interpret(`Number("1", "2");`);
    expect(result.success).toBe(false);
    expect(result.frames[0].status).toBe("ERROR");
    expect(result.frames[0].error?.type).toBe("InvalidNumberOfArguments");
  });
});
