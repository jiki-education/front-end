import { interpret } from "@javascript/interpreter";

describe("Footgun #1: String + Number type coercion", () => {
  // In real JS: "5" + 3 === "53", 1 + "a" === "1a"
  // Jiki blocks this by default with TypeCoercionNotAllowed

  test("string + number is blocked", () => {
    const { frames } = interpret('"5" + 3');
    expect(frames[0].status).toBe("ERROR");
    expect(frames[0].error?.type).toBe("TypeCoercionNotAllowed");
  });

  test("number + string is blocked", () => {
    const { frames } = interpret('3 + "5"');
    expect(frames[0].status).toBe("ERROR");
    expect(frames[0].error?.type).toBe("TypeCoercionNotAllowed");
  });

  test('"a" + 1 is blocked', () => {
    const { frames } = interpret('"a" + 1');
    expect(frames[0].status).toBe("ERROR");
    expect(frames[0].error?.type).toBe("TypeCoercionNotAllowed");
  });

  test("string - number is blocked", () => {
    const { frames } = interpret('"10" - 5');
    expect(frames[0].status).toBe("ERROR");
    expect(frames[0].error?.type).toBe("TypeCoercionNotAllowed");
  });

  test("string * number is blocked", () => {
    const { frames } = interpret('"2" * 3');
    expect(frames[0].status).toBe("ERROR");
    expect(frames[0].error?.type).toBe("TypeCoercionNotAllowed");
  });

  test("string / number is blocked", () => {
    const { frames } = interpret('"10" / 2');
    expect(frames[0].status).toBe("ERROR");
    expect(frames[0].error?.type).toBe("TypeCoercionNotAllowed");
  });
});
