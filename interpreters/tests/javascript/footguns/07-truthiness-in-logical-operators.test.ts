import { interpret } from "@javascript/interpreter";

describe("Footgun #7: Truthiness in logical operators (&&, ||)", () => {
  // In real JS: 0 || "default" === "default", 5 && "hello" === "hello"
  // Jiki blocks non-boolean operands in && and || by default

  test("number && boolean is blocked", () => {
    const { frames } = interpret("5 && true");
    expect(frames[0].status).toBe("ERROR");
    expect(frames[0].error?.type).toBe("TruthinessDisabled");
  });

  test("boolean && string is blocked", () => {
    const { frames } = interpret('true && "hello"');
    expect(frames[0].status).toBe("ERROR");
    expect(frames[0].error?.type).toBe("TruthinessDisabled");
  });

  test("number || boolean is blocked", () => {
    const { frames } = interpret("0 || true");
    expect(frames[0].status).toBe("ERROR");
    expect(frames[0].error?.type).toBe("TruthinessDisabled");
  });

  test("null || boolean is blocked", () => {
    const { frames } = interpret("null || true");
    expect(frames[0].status).toBe("ERROR");
    expect(frames[0].error?.type).toBe("TruthinessDisabled");
  });

  test("boolean && boolean works", () => {
    const { frames, error } = interpret("true && false");
    expect(error).toBeNull();
    expect(frames[0].status).toBe("SUCCESS");
    expect(frames[0].result?.jikiObject.value).toBe(false);
  });

  test("boolean || boolean works", () => {
    const { frames, error } = interpret("false || true");
    expect(error).toBeNull();
    expect(frames[0].status).toBe("SUCCESS");
    expect(frames[0].result?.jikiObject.value).toBe(true);
  });
});
