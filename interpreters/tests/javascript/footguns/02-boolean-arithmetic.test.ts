import { interpret } from "@javascript/interpreter";

describe("Footgun #2: Boolean arithmetic coercion", () => {
  // In real JS: true + true === 2, true + false === 1, false + false === 0
  // Jiki blocks this by default with TypeCoercionNotAllowed

  test("true + true is blocked", () => {
    const { frames } = interpret("true + true");
    expect(frames[0].status).toBe("ERROR");
    expect(frames[0].error?.type).toBe("TypeCoercionNotAllowed");
  });

  test("true + false is blocked", () => {
    const { frames } = interpret("true + false");
    expect(frames[0].status).toBe("ERROR");
    expect(frames[0].error?.type).toBe("TypeCoercionNotAllowed");
  });

  test("true - false is blocked", () => {
    const { frames } = interpret("true - false");
    expect(frames[0].status).toBe("ERROR");
    expect(frames[0].error?.type).toBe("TypeCoercionNotAllowed");
  });

  test("number + boolean is blocked", () => {
    const { frames } = interpret("5 + true");
    expect(frames[0].status).toBe("ERROR");
    expect(frames[0].error?.type).toBe("TypeCoercionNotAllowed");
  });

  test("number * boolean is blocked", () => {
    const { frames } = interpret("5 * false");
    expect(frames[0].status).toBe("ERROR");
    expect(frames[0].error?.type).toBe("TypeCoercionNotAllowed");
  });
});
