import { interpret } from "@javascript/interpreter";

describe("Footgun #29: Unary negation on non-numbers", () => {
  // In real JS: -"5" === -5, -true === -1, -null === -0, -undefined === NaN
  // Jiki blocks this with TypeCoercionNotAllowed
  // But also: -(-5) should work, and negating a number variable should work

  test.skip("negating a string should be blocked", () => {
    const { frames } = interpret('-"5"');
    expect(frames[0].status).toBe("ERROR");
    expect(frames[0].error?.type).toBe("TypeCoercionNotAllowed");
  });

  test.skip("negating a boolean should be blocked", () => {
    const { frames } = interpret("-true");
    expect(frames[0].status).toBe("ERROR");
    expect(frames[0].error?.type).toBe("TypeCoercionNotAllowed");
  });

  test.skip("negating null should be blocked", () => {
    const { frames } = interpret("-null");
    expect(frames[0].status).toBe("ERROR");
    expect(frames[0].error?.type).toBe("TypeCoercionNotAllowed");
  });

  test.skip("negating a number works", () => {
    const { frames, error } = interpret("-5");
    expect(error).toBeNull();
    expect(frames[0].status).toBe("SUCCESS");
    expect(frames[0].result?.jikiObject.value).toBe(-5);
  });

  test.skip("double negation works", () => {
    const { frames, error } = interpret("-(-5)");
    expect(error).toBeNull();
    expect(frames[0].status).toBe("SUCCESS");
    expect(frames[0].result?.jikiObject.value).toBe(5);
  });
});
