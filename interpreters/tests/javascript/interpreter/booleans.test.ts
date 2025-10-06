import { interpret } from "@javascript/interpreter";
import { JSBoolean } from "@javascript/jikiObjects";

describe("booleans interpreter", () => {
  describe("execute", () => {
    test("true literal", () => {
      const { frames, error } = interpret("true;");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject).toBeInstanceOf(JSBoolean);
      expect(frames[0].result?.jikiObject.value).toBe(true);
    });

    test("false literal", () => {
      const { frames, error } = interpret("false;");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(false);
    });

    test("logical and - true", () => {
      const { frames, error } = interpret("true && true;");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(true);
    });

    test("logical and - false", () => {
      const { frames, error } = interpret("true && false;");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(false);
    });

    test("logical or - true", () => {
      const { frames, error } = interpret("false || true;");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(true);
    });

    test("logical or - false", () => {
      const { frames, error } = interpret("false || false;");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(false);
    });

    test("complex logical expression", () => {
      const { frames, error } = interpret("(true || false) && true;");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(true);
    });
  });
});
