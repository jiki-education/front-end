import { interpret } from "@javascript/interpreter";

describe("Footgun #5: Loose equality (== and !=)", () => {
  // In real JS: "" == 0 is true, null == undefined is true, "0" == false is true
  // Jiki blocks == (StrictEqualityRequired) and != (StrictInequalityRequired) at parse time

  test("== is blocked by default", () => {
    const { frames, error } = interpret('5 == "5"');
    expect(frames).toHaveLength(0);
    expect(error?.type).toBe("StrictEqualityRequired");
  });

  test("!= is blocked by default", () => {
    const { frames, error } = interpret('5 != "5"');
    expect(frames).toHaveLength(0);
    expect(error?.type).toBe("StrictInequalityRequired");
  });

  test('"" == 0 is blocked', () => {
    const { frames, error } = interpret('"" == 0');
    expect(frames).toHaveLength(0);
    expect(error?.type).toBe("StrictEqualityRequired");
  });

  test("null == undefined is blocked", () => {
    const { frames, error } = interpret("null == undefined");
    expect(frames).toHaveLength(0);
    expect(error?.type).toBe("StrictEqualityRequired");
  });

  test("=== works correctly for same types", () => {
    const { frames } = interpret("5 === 5");
    expect(frames[0].status).toBe("SUCCESS");
    expect(frames[0].result?.jikiObject.value).toBe(true);
  });

  test("=== correctly returns false for different types", () => {
    const { frames } = interpret('5 === "5"');
    expect(frames[0].status).toBe("SUCCESS");
    expect(frames[0].result?.jikiObject.value).toBe(false);
  });
});
