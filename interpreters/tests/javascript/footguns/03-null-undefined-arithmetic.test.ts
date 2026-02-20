import { interpret } from "@javascript/interpreter";

describe("Footgun #3: null/undefined arithmetic coercion", () => {
  // In real JS: null + 1 === 1, undefined + 1 === NaN
  // Jiki blocks this by default with TypeCoercionNotAllowed

  test("null + number is blocked", () => {
    const { frames } = interpret("null + 1");
    expect(frames[0].status).toBe("ERROR");
    expect(frames[0].error?.type).toBe("TypeCoercionNotAllowed");
  });

  test("null - number is blocked", () => {
    const { frames } = interpret("null - 5");
    expect(frames[0].status).toBe("ERROR");
    expect(frames[0].error?.type).toBe("TypeCoercionNotAllowed");
  });

  test("null * number is blocked", () => {
    const { frames } = interpret("null * 3");
    expect(frames[0].status).toBe("ERROR");
    expect(frames[0].error?.type).toBe("TypeCoercionNotAllowed");
  });

  test("null + null is blocked", () => {
    const { frames } = interpret("null + null");
    expect(frames[0].status).toBe("ERROR");
    expect(frames[0].error?.type).toBe("TypeCoercionNotAllowed");
  });
});
