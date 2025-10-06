import { interpret } from "@javascript/interpreter";

describe("comprehensive interpreter", () => {
  describe("execute", () => {
    test("mixed data types", () => {
      const { frames, error } = interpret(`
        42;
        "hello";
        true;
      `);
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(3);
      expect(frames[0].result?.jikiObject.value).toBe(42);
      expect(frames[1].result?.jikiObject.value).toBe("hello");
      expect(frames[2].result?.jikiObject.value).toBe(true);
    });

    test("complex expression with all types", () => {
      const { frames, error } = interpret('("hello" + " world") + ("!" + "");');
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe("hello world!");
    });

    test("arithmetic and logical combined", () => {
      // With truthiness enabled to allow numbers in logical operations
      const { frames, error } = interpret("(1 + 2) && true;", { languageFeatures: { allowTruthiness: true } });
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(true); // JavaScript truthy behavior: 3 && true = true
    });

    test("nested grouping with mixed types", () => {
      const { frames, error } = interpret("((1 + 2) * 3) + 0;");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(9);
    });

    test("string and number operations", () => {
      // JavaScript allows this - should concatenate when type coercion is enabled
      const { frames, error } = interpret('"Count: " + (1 + 2);', { languageFeatures: { allowTypeCoercion: true } });
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe("Count: 3");
    });
  });
});
