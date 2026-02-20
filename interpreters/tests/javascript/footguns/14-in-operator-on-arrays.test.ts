import { interpret } from "@javascript/interpreter";

describe("Footgun #14: 'in' operator on arrays", () => {
  // In real JS: "0" in [10, 20] is true (checks indices, not values!)
  // Jiki blocks 'in' with arrays by default

  test("in operator with array is blocked by default", () => {
    const { frames } = interpret('"0" in [10, 20, 30]');
    expect(frames[0].status).toBe("ERROR");
    expect(frames[0].error?.type).toBe("InWithArrayNotAllowed");
  });

  test("in operator with dictionary works", () => {
    const { frames, error } = interpret('"name" in { name: "Alice" }');
    expect(error).toBeNull();
    expect(frames[0].status).toBe("SUCCESS");
    expect(frames[0].result?.jikiObject.value).toBe(true);
  });

  test("in operator with dictionary returns false for missing key", () => {
    const { frames, error } = interpret('"age" in { name: "Alice" }');
    expect(error).toBeNull();
    expect(frames[0].status).toBe("SUCCESS");
    expect(frames[0].result?.jikiObject.value).toBe(false);
  });
});
