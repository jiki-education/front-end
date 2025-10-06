import { interpret } from "@python/interpreter";
import { PyNumber, PyString, PyBoolean } from "@python/jikiObjects";

describe("variables concept", () => {
  describe("variable assignment", () => {
    test("assign number to variable", () => {
      const { frames, error } = interpret("x = 42");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject).toBeInstanceOf(PyNumber);
      expect(frames[0].result?.jikiObject.value).toBe(42);
    });

    test("assign string to variable", () => {
      const { frames, error } = interpret('message = "hello"');
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject).toBeInstanceOf(PyString);
      expect(frames[0].result?.jikiObject.value).toBe("hello");
    });

    test("assign boolean to variable", () => {
      const { frames, error } = interpret("flag = True");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject).toBeInstanceOf(PyBoolean);
      expect(frames[0].result?.jikiObject.value).toBe(true);
    });

    test("assign expression result to variable", () => {
      const { frames, error } = interpret("result = 5 + 3");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(8);
    });

    test("assign complex expression to variable", () => {
      const { frames, error } = interpret("complex = (10 + 5) * 2");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(30);
    });
  });

  describe("variable access", () => {
    test("access assigned variable", () => {
      const { frames, error } = interpret("x = 10\nx");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(2);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[1].status).toBe("SUCCESS");
      expect(frames[1].result?.jikiObject.value).toBe(10);
    });

    test("access string variable", () => {
      const { frames, error } = interpret('name = "Python"\nname');
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(2);
      expect(frames[1].result?.jikiObject.value).toBe("Python");
    });

    test("access boolean variable", () => {
      const { frames, error } = interpret("is_ready = False\nis_ready");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(2);
      expect(frames[1].result?.jikiObject.value).toBe(false);
    });
  });

  describe("variable reassignment", () => {
    test("reassign number variable", () => {
      const { frames, error } = interpret("count = 1\ncount = 5\ncount");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(3);
      expect(frames[0].result?.jikiObject.value).toBe(1);
      expect(frames[1].result?.jikiObject.value).toBe(5);
      expect(frames[2].result?.jikiObject.value).toBe(5);
    });

    test("reassign with different type", () => {
      const { frames, error } = interpret('value = 42\nvalue = "hello"\nvalue');
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(3);
      expect(frames[0].result?.jikiObject.value).toBe(42);
      expect(frames[1].result?.jikiObject.value).toBe("hello");
      expect(frames[2].result?.jikiObject.value).toBe("hello");
    });

    test("reassign with expression", () => {
      const { frames, error } = interpret("x = 5\nx = x * 2\nx");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(3);
      expect(frames[0].result?.jikiObject.value).toBe(5);
      expect(frames[1].result?.jikiObject.value).toBe(10);
      expect(frames[2].result?.jikiObject.value).toBe(10);
    });
  });

  describe("variables in expressions", () => {
    test("use variable in arithmetic", () => {
      const { frames, error } = interpret("a = 10\nb = 20\na + b");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(3);
      expect(frames[2].result?.jikiObject.value).toBe(30);
    });

    test("use variable in comparison", () => {
      const { frames, error } = interpret("age = 25\nage > 18");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(2);
      expect(frames[1].result?.jikiObject.value).toBe(true);
    });

    test("use variable in logical expression", () => {
      const { frames, error } = interpret("x = True\ny = False\nx and y");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(3);
      expect(frames[2].result?.jikiObject.value).toBe(false);
    });

    test("complex expression with multiple variables", () => {
      const { frames, error } = interpret("base = 5\nheight = 3\narea = base * height / 2\narea");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(4);
      expect(frames[3].result?.jikiObject.value).toBe(7.5);
    });
  });

  describe("variable naming", () => {
    test("single letter variable", () => {
      const { frames, error } = interpret("x = 1\nx");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(2);
      expect(frames[1].result?.jikiObject.value).toBe(1);
    });

    test("descriptive variable name", () => {
      const { frames, error } = interpret("user_count = 100\nuser_count");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(2);
      expect(frames[1].result?.jikiObject.value).toBe(100);
    });

    test("variable with numbers", () => {
      const { frames, error } = interpret("value1 = 10\nvalue2 = 20\nvalue1 + value2");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(3);
      expect(frames[2].result?.jikiObject.value).toBe(30);
    });
  });

  describe("variable chaining", () => {
    test("assign variable to another variable", () => {
      const { frames, error } = interpret("original = 42\ncopy = original\ncopy");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(3);
      expect(frames[2].result?.jikiObject.value).toBe(42);
    });

    test("chain multiple assignments", () => {
      const { frames, error } = interpret("a = 1\nb = a\nc = b\nc");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(4);
      expect(frames[3].result?.jikiObject.value).toBe(1);
    });
  });

  describe("multiple variable operations", () => {
    test("multiple variables in single expression", () => {
      const { frames, error } = interpret("w = 2\nx = 3\ny = 4\nz = 5\nw * x + y * z");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(5);
      // (2 * 3) + (4 * 5) = 6 + 20 = 26
      expect(frames[4].result?.jikiObject.value).toBe(26);
    });

    test("variables with string concatenation", () => {
      const { frames, error } = interpret('first = "Hello"\nsecond = " "\nthird = "World"\nfirst + second + third');
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(4);
      expect(frames[3].result?.jikiObject.value).toBe("Hello World");
    });
  });
});
