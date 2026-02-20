import { interpret } from "@javascript/interpreter";

describe("Footgun #4: Unary plus type coercion", () => {
  // In real JS: +"hello" === NaN, +true === 1, +false === 0, +null === 0
  // Jiki blocks this by default with TypeCoercionNotAllowed

  test("unary + on string is blocked", () => {
    const { frames } = interpret('+"hello"');
    expect(frames[0].status).toBe("ERROR");
    expect(frames[0].error?.type).toBe("TypeCoercionNotAllowed");
  });

  test("unary + on boolean is blocked", () => {
    const { frames } = interpret("+true");
    expect(frames[0].status).toBe("ERROR");
    expect(frames[0].error?.type).toBe("TypeCoercionNotAllowed");
  });

  test("unary + on null is blocked", () => {
    const { frames } = interpret("+null");
    expect(frames[0].status).toBe("ERROR");
    expect(frames[0].error?.type).toBe("TypeCoercionNotAllowed");
  });

  test("unary + on number is allowed", () => {
    const { frames } = interpret("+5");
    expect(frames[0].status).toBe("SUCCESS");
    expect(frames[0].result?.jikiObject.value).toBe(5);
  });
});
