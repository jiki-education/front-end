import { interpret } from "@javascript/interpreter";

describe("Footgun #6: Truthiness in conditions", () => {
  // In real JS: if(0), if(""), if(null) are all falsy, if([]) is truthy
  // Jiki blocks non-boolean values in conditions by default

  test("number in if condition is blocked", () => {
    const { frames } = interpret("if (0) { let x = 1 }");
    expect(frames[0].status).toBe("ERROR");
    expect(frames[0].error?.type).toBe("TruthinessDisabled");
  });

  test("non-zero number in if condition is blocked", () => {
    const { frames } = interpret("if (42) { let x = 1 }");
    expect(frames[0].status).toBe("ERROR");
    expect(frames[0].error?.type).toBe("TruthinessDisabled");
  });

  test("empty string in if condition is blocked", () => {
    const { frames } = interpret('if ("") { let x = 1 }');
    expect(frames[0].status).toBe("ERROR");
    expect(frames[0].error?.type).toBe("TruthinessDisabled");
  });

  test("non-empty string in if condition is blocked", () => {
    const { frames } = interpret('if ("hello") { let x = 1 }');
    expect(frames[0].status).toBe("ERROR");
    expect(frames[0].error?.type).toBe("TruthinessDisabled");
  });

  test("null in if condition is blocked", () => {
    const { frames } = interpret("if (null) { let x = 1 }");
    expect(frames[0].status).toBe("ERROR");
    expect(frames[0].error?.type).toBe("TruthinessDisabled");
  });

  test("undefined in if condition is blocked", () => {
    const { frames } = interpret("if (undefined) { let x = 1 }");
    expect(frames[0].status).toBe("ERROR");
    expect(frames[0].error?.type).toBe("TruthinessDisabled");
  });

  test("boolean true in if condition works", () => {
    const { frames, error } = interpret("if (true) { let x = 1 }");
    expect(error).toBeNull();
    expect(frames[0].status).toBe("SUCCESS");
  });

  test("boolean false in if condition works", () => {
    const { frames, error } = interpret("if (false) { let x = 1 }");
    expect(error).toBeNull();
    expect(frames[0].status).toBe("SUCCESS");
  });

  test("comparison expression in if condition works", () => {
    const { frames, error } = interpret("if (5 > 3) { let x = 1 }");
    expect(error).toBeNull();
    expect(frames[0].status).toBe("SUCCESS");
  });
});
