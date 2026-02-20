import { interpret } from "@javascript/interpreter";

describe("Footgun #30: Logical NOT (!) on non-booleans", () => {
  // In real JS: !0 === true, !"" === true, ![] === false, !null === true
  // This relies on truthiness coercion which Jiki blocks by default
  // But ! is currently allowed on all types - should it be restricted?

  test.skip("!0 should be blocked (truthiness coercion)", () => {
    const { frames } = interpret("!0");
    // 0 is falsy in JS, so !0 is true
    // But this relies on truthiness which should be blocked
    expect(frames[0].status).toBe("ERROR");
    expect(frames[0].error?.type).toBe("TruthinessDisabled");
  });

  test.skip('!"" should be blocked (truthiness coercion)', () => {
    const { frames } = interpret('!""');
    expect(frames[0].status).toBe("ERROR");
    expect(frames[0].error?.type).toBe("TruthinessDisabled");
  });

  test.skip("!null should be blocked (truthiness coercion)", () => {
    const { frames } = interpret("!null");
    expect(frames[0].status).toBe("ERROR");
    expect(frames[0].error?.type).toBe("TruthinessDisabled");
  });

  test.skip("![] should be blocked (truthiness coercion)", () => {
    const { frames } = interpret("![]");
    // In real JS: ![] === false (arrays are truthy)
    // This is extremely confusing for beginners
    expect(frames[0].status).toBe("ERROR");
    expect(frames[0].error?.type).toBe("TruthinessDisabled");
  });

  test.skip("!true should work (already boolean)", () => {
    const { frames, error } = interpret("!true");
    expect(error).toBeNull();
    expect(frames[0].status).toBe("SUCCESS");
    expect(frames[0].result?.jikiObject.value).toBe(false);
  });

  test.skip("!false should work (already boolean)", () => {
    const { frames, error } = interpret("!false");
    expect(error).toBeNull();
    expect(frames[0].status).toBe("SUCCESS");
    expect(frames[0].result?.jikiObject.value).toBe(true);
  });
});
