import { interpret } from "@javascript/interpreter";

describe("Footgun #5: Loose equality (== and !=)", () => {
  // In real JS: "" == 0 is true, null == undefined is true, "0" == false is true
  // Jiki blocks == and != by default with StrictEqualityRequired

  test("== is blocked by default", () => {
    const { frames } = interpret('5 == "5"');
    expect(frames[0].status).toBe("ERROR");
    expect(frames[0].error?.type).toBe("StrictEqualityRequired");
  });

  test("!= is blocked by default", () => {
    const { frames } = interpret('5 != "5"');
    expect(frames[0].status).toBe("ERROR");
    expect(frames[0].error?.type).toBe("StrictEqualityRequired");
  });

  test('"" == 0 is blocked', () => {
    const { frames } = interpret('"" == 0');
    expect(frames[0].status).toBe("ERROR");
    expect(frames[0].error?.type).toBe("StrictEqualityRequired");
  });

  test("null == undefined is blocked", () => {
    const { frames } = interpret("null == undefined");
    expect(frames[0].status).toBe("ERROR");
    expect(frames[0].error?.type).toBe("StrictEqualityRequired");
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
