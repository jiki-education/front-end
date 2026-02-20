import { interpret } from "@javascript/interpreter";

describe("Footgun #8: Variable shadowing", () => {
  // In real JS: inner let x shadows outer let x silently
  // Jiki blocks shadowing by default with ShadowingDisabled

  test("shadowing in block scope is blocked", () => {
    const { frames } = interpret("let x = 5; { let x = 10 }");
    expect(frames[1].status).toBe("ERROR");
    expect(frames[1].error?.type).toBe("ShadowingDisabled");
  });

  test("nested shadowing is blocked", () => {
    const { frames } = interpret("let x = 1; { { let x = 2 } }");
    expect(frames[1].status).toBe("ERROR");
    expect(frames[1].error?.type).toBe("ShadowingDisabled");
  });

  test("shadowing in if body is blocked", () => {
    const { frames } = interpret("let x = 5; if (true) { let x = 10 }");
    expect(frames[2].status).toBe("ERROR");
    expect(frames[2].error?.type).toBe("ShadowingDisabled");
  });

  test("different variable names in nested scope work fine", () => {
    const { frames, error } = interpret("let x = 5; { let y = 10 }");
    expect(error).toBeNull();
    expect(frames[0].status).toBe("SUCCESS");
    expect(frames[1].status).toBe("SUCCESS");
  });
});
