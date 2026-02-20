import { interpret } from "@javascript/interpreter";

describe("Footgun #13: Floating point precision", () => {
  // In real JS: 0.1 + 0.2 === 0.30000000000000004
  // Jiki rounds arithmetic results to 5 decimal places

  test("0.1 + 0.2 equals 0.3 (rounded)", () => {
    const { frames, error } = interpret("0.1 + 0.2");
    expect(error).toBeNull();
    expect(frames[0].status).toBe("SUCCESS");
    expect(frames[0].result?.jikiObject.value).toBe(0.3);
  });

  test("0.1 + 0.7 equals 0.8 (rounded)", () => {
    const { frames, error } = interpret("0.1 + 0.7");
    expect(error).toBeNull();
    expect(frames[0].status).toBe("SUCCESS");
    expect(frames[0].result?.jikiObject.value).toBe(0.8);
  });

  test("0.2 + 0.4 equals 0.6 (rounded)", () => {
    const { frames, error } = interpret("0.2 + 0.4");
    expect(error).toBeNull();
    expect(frames[0].status).toBe("SUCCESS");
    expect(frames[0].result?.jikiObject.value).toBe(0.6);
  });

  test("1.0 / 3.0 is rounded to 5 decimal places", () => {
    const { frames, error } = interpret("1 / 3");
    expect(error).toBeNull();
    expect(frames[0].status).toBe("SUCCESS");
    expect(frames[0].result?.jikiObject.value).toBe(0.33333);
  });
});
