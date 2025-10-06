import { interpret } from "@python/interpreter";
import { PyString } from "@python/jikiObjects";

describe("string concepts", () => {
  describe("string literals", () => {
    test("double quoted string", () => {
      const { frames, error } = interpret('"hello"');
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject).toBeInstanceOf(PyString);
      expect(frames[0].result?.jikiObject.value).toBe("hello");
    });

    test("single quoted string", () => {
      const { frames, error } = interpret("'world'");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject).toBeInstanceOf(PyString);
      expect(frames[0].result?.jikiObject.value).toBe("world");
    });

    test("empty string", () => {
      const { frames, error } = interpret('""');
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe("");
    });

    test("string with spaces", () => {
      const { frames, error } = interpret('"hello world"');
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe("hello world");
    });

    test("string with numbers", () => {
      const { frames, error } = interpret('"abc123"');
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe("abc123");
    });

    test("string with special characters", () => {
      const { frames, error } = interpret('"hello@world.com"');
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe("hello@world.com");
    });
  });

  describe("string concatenation", () => {
    test("two strings", () => {
      const { frames, error } = interpret('"hello" + "world"');
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe("helloworld");
    });

    test("three strings", () => {
      const { frames, error } = interpret('"hello" + " " + "world"');
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe("hello world");
    });

    test("empty string concatenation", () => {
      const { frames, error } = interpret('"hello" + ""');
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe("hello");
    });

    test("single and double quotes mixed", () => {
      const { frames, error } = interpret('"hello" + \' \' + "world"');
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe("hello world");
    });

    test("complex string expression", () => {
      const { frames, error } = interpret('("hello" + " ") + "world"');
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe("hello world");
    });
  });

  describe("string comparison", () => {
    test("string equality - true", () => {
      const { frames, error } = interpret('"hello" == "hello"');
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(true);
    });

    test("string equality - false", () => {
      const { frames, error } = interpret('"hello" == "world"');
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(false);
    });

    test("string inequality - true", () => {
      const { frames, error } = interpret('"hello" != "world"');
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(true);
    });

    test("string inequality - false", () => {
      const { frames, error } = interpret('"hello" != "hello"');
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(false);
    });

    test("case sensitive comparison", () => {
      const { frames, error } = interpret('"Hello" == "hello"');
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(false);
    });
  });
});
