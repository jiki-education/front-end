import { interpret } from "@javascript/interpreter";
import { JSString } from "@javascript/jikiObjects";

describe("strings interpreter", () => {
  describe("execute", () => {
    test("string literal", () => {
      const { frames, error } = interpret('"hello";');
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject).toBeInstanceOf(JSString);
      expect(frames[0].result?.jikiObject.value).toBe("hello");
    });

    test("empty string", () => {
      const { frames, error } = interpret('"";');
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe("");
    });

    test("string with escape sequences", () => {
      const { frames, error } = interpret('"hello\\nworld";');
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe("hello\nworld");
    });

    test("string concatenation", () => {
      const { frames, error } = interpret('"hello" + " " + "world";');
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe("hello world");
    });

    test("single quoted string", () => {
      const { frames, error } = interpret("'hello';");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe("hello");
    });
  });
});
