import { describe, it, expect } from "vitest";
import { interpret } from "@javascript/interpreter";

describe("Object.keys()", () => {
  it("returns keys of a dictionary", () => {
    const result = interpret(`let keys = Object.keys({a: 1, b: 2});`);
    expect(result.success).toBe(true);
    const keys = (result.frames[0] as any).variables.keys;
    expect(keys.value.map((k: any) => k.value)).toEqual(["a", "b"]);
  });

  it("returns empty array for empty dictionary", () => {
    const result = interpret(`let keys = Object.keys({});`);
    expect(result.success).toBe(true);
    const keys = (result.frames[0] as any).variables.keys;
    expect(keys.value).toEqual([]);
  });

  it("works with a variable dictionary", () => {
    const result = interpret(`
      let obj = {x: 10, y: 20, z: 30};
      let keys = Object.keys(obj);
    `);
    expect(result.success).toBe(true);
    const keys = (result.frames[1] as any).variables.keys;
    expect(keys.value.map((k: any) => k.value)).toEqual(["x", "y", "z"]);
  });

  it("returns string keys for dictionaries with string values", () => {
    const result = interpret(`let keys = Object.keys({name: "Alice", age: 30});`);
    expect(result.success).toBe(true);
    const keys = (result.frames[0] as any).variables.keys;
    expect(keys.value.map((k: any) => k.value)).toEqual(["name", "age"]);
  });

  it("errors when called with non-object argument", () => {
    const result = interpret(`Object.keys(42);`);
    expect(result.success).toBe(false);
    expect(result.frames[0].status).toBe("ERROR");
  });

  it("errors when called with no arguments", () => {
    const result = interpret(`Object.keys();`);
    expect(result.success).toBe(false);
    expect(result.frames[0].status).toBe("ERROR");
  });
});

describe("Object builtin", () => {
  it("throws error for non-existent methods", () => {
    const result = interpret(`Object.notAMethod();`);
    expect(result.success).toBe(false);
    expect(result.frames[0].status).toBe("ERROR");
    expect(result.frames[0].error?.type).toBe("PropertyNotFound");
  });

  it("is blocked by allowedGlobals", () => {
    const result = interpret(`let keys = Object.keys({a: 1});`, {
      languageFeatures: { allowedGlobals: ["console"] },
    });
    expect(result.success).toBe(false);
    expect(result.frames[0].status).toBe("ERROR");
    expect(result.frames[0].error?.type).toBe("VariableNotDeclared");
  });
});
