import { interpret } from "@javascript/interpreter";

describe("Footgun #26: typeof weirdness", () => {
  // In real JS: typeof null === "object" (historical bug)
  // typeof NaN === "number" (technically correct but confusing)
  // typeof [] === "object" (not "array")
  // typeof is not yet implemented in Jiki, but when it is, these should be handled

  test.skip("typeof null should not return 'object'", () => {
    const { frames } = interpret("typeof null");
    // When typeof is implemented, it should return "null" not "object"
    expect(frames[0].status).toBe("SUCCESS");
    expect(frames[0].result?.jikiObject.value).toBe("null");
  });

  test.skip("typeof array should return 'array' not 'object'", () => {
    const { frames } = interpret("typeof [1, 2, 3]");
    // When typeof is implemented, it should return "array" not "object"
    expect(frames[0].status).toBe("SUCCESS");
    expect(frames[0].result?.jikiObject.value).toBe("array");
  });

  test.skip("typeof undefined should return 'undefined'", () => {
    const { frames } = interpret("typeof undefined");
    expect(frames[0].status).toBe("SUCCESS");
    expect(frames[0].result?.jikiObject.value).toBe("undefined");
  });

  test.skip("typeof number should return 'number'", () => {
    const { frames } = interpret("typeof 42");
    expect(frames[0].status).toBe("SUCCESS");
    expect(frames[0].result?.jikiObject.value).toBe("number");
  });

  test.skip("typeof string should return 'string'", () => {
    const { frames } = interpret('typeof "hello"');
    expect(frames[0].status).toBe("SUCCESS");
    expect(frames[0].result?.jikiObject.value).toBe("string");
  });
});
