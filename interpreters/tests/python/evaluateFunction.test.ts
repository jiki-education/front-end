import { compile, evaluateFunction } from "@python/interpreter";
import { unwrapPyObject } from "@python/jikiObjects";

describe("evaluateFunction", () => {
  test("compile errors throw (matches JikiScript behavior)", () => {
    const code = `invalid Python syntax @#$`;
    expect(() => evaluateFunction(code, {}, "foo")).toThrow();
  });

  test("function with runtime error", () => {
    const { value, frames, error } = evaluateFunction(
      `
def move():
    foo()
    `,
      {},
      "move"
    );
    expect(value).toBeUndefined();
    expect(frames.length).toBeGreaterThan(0);
    const errorFrame = frames.find(f => f.status === "ERROR");
    expect(errorFrame).toBeDefined();
    expect(errorFrame!.error).not.toBeNull();
    expect(errorFrame!.error!.category).toBe("RuntimeError");
    expect(errorFrame!.error!.type).toBe("UndefinedVariable");
    expect(error).toBeNull();
  });

  test("later frame with error", () => {
    const code = `
def move():
    x = 1
    y = 2
    foo()
    `;
    const { value, frames, error } = evaluateFunction(code, {}, "move");

    expect(value).toBeUndefined();
    expect(frames.length).toBeGreaterThan(2);
    const errorFrame = frames.find(f => f.status === "ERROR");
    expect(errorFrame).toBeDefined();
    expect(errorFrame!.error).not.toBeNull();
    expect(errorFrame!.error!.category).toBe("RuntimeError");
    expect(errorFrame!.error!.type).toBe("UndefinedVariable");
    expect(error).toBeNull();
  });

  test.skip("missing function", () => {
    const code = `
def m0ve():
    pass
    `;
    const { value, frames, error } = evaluateFunction(code, {}, "move");

    expect(value).toBeUndefined();
    expect(frames.length).toBeGreaterThan(0);
    const errorFrame = frames.find(f => f.status === "ERROR");
    expect(errorFrame).toBeDefined();
    expect(errorFrame!.error).not.toBeNull();
    expect(errorFrame!.error!.category).toBe("RuntimeError");
    expect(errorFrame!.error!.type).toBe("UndefinedVariable");
    expect(error).toBeNull();
  });

  test.skip("incorrect number of arguments", () => {
    const code = `
def move(foo):
    pass
    `;
    const { value, frames, error } = evaluateFunction(code, {}, "move", 1, 2);

    expect(value).toBeUndefined();
    expect(frames.length).toBeGreaterThan(0);
    const errorFrame = frames.find(f => f.status === "ERROR");
    expect(errorFrame).toBeDefined();
    expect(errorFrame!.error).not.toBeNull();
    expect(errorFrame!.error!.category).toBe("RuntimeError");
    expect(errorFrame!.error!.type).toBe("InvalidNumberOfArguments");
    expect(error).toBeNull();
  });

  test("function without arguments returning a value", () => {
    const { value, frames } = evaluateFunction(
      `
def move():
    return 1
    `,
      {},
      "move"
    );
    expect(value).toBe(1);
    expect(frames).toBeArrayOfSize(1);
    expect(unwrapPyObject(frames[0].result?.jikiObject)).toBe(1);
  });

  test("function with arguments", () => {
    const { value, frames } = evaluateFunction(
      `
def add(x, y):
    return x + y
    `,
      {},
      "add",
      5,
      3
    );
    expect(value).toBe(8);
    expect(frames).toBeArrayOfSize(1);
  });

  test("function with string arguments", () => {
    const { value } = evaluateFunction(
      `
def greet(name):
    return "Hello, " + name
    `,
      {},
      "greet",
      "World"
    );
    expect(value).toBe("Hello, World");
  });

  test("function with list arguments", () => {
    const { value } = evaluateFunction(
      `
def sum_list(numbers):
    total = 0
    for num in numbers:
        total = total + num
    return total
    `,
      {},
      "sum_list",
      [1, 2, 3, 4, 5]
    );
    expect(value).toBe(15);
  });

  test("function with list indexing", () => {
    const { value } = evaluateFunction(
      `
def get_element(lst, index):
    return lst[index]
    `,
      {},
      "get_element",
      [10, 20, 30],
      1
    );
    expect(value).toBe(20);
  });

  test.skip("function returning None (no return statement)", () => {
    const { value } = evaluateFunction(
      `
def do_nothing():
    pass
    `,
      {},
      "do_nothing"
    );
    // Python functions without return return None, which unwraps to null
    expect(value).toBeNull();
  });

  test("function returning boolean", () => {
    const { value } = evaluateFunction(
      `
def is_even(n):
    return n % 2 == 0
    `,
      {},
      "is_even",
      4
    );
    expect(value).toBe(true);
  });

  test("function returning list", () => {
    const { value } = evaluateFunction(
      `
def make_list(a, b, c):
    return [a, b, c]
    `,
      {},
      "make_list",
      1,
      2,
      3
    );
    expect(value).toEqual([1, 2, 3]);
  });

  test("function with variable assignment", () => {
    const { value } = evaluateFunction(
      `
def calculate():
    a = 5
    b = 10
    return a * b
    `,
      {},
      "calculate"
    );
    expect(value).toBe(50);
  });

  test("function with conditional", () => {
    const { value } = evaluateFunction(
      `
def max_value(a, b):
    if a > b:
        return a
    else:
        return b
    `,
      {},
      "max_value",
      10,
      20
    );
    expect(value).toBe(20);
  });

  test("function with while loop", () => {
    const { value } = evaluateFunction(
      `
def count_to(n):
    i = 0
    total = 0
    while i < n:
        total = total + i
        i = i + 1
    return total
    `,
      {},
      "count_to",
      5
    );
    expect(value).toBe(10); // 0 + 1 + 2 + 3 + 4
  });

  test("function with nested function call", () => {
    const { value } = evaluateFunction(
      `
def double(x):
    return x * 2

def quadruple(x):
    return double(double(x))
    `,
      {},
      "quadruple",
      5
    );
    expect(value).toBe(20);
  });

  test("function with string concatenation", () => {
    const { value } = evaluateFunction(
      `
def make_greeting(first, last):
    return "Hello, " + first + " " + last
    `,
      {},
      "make_greeting",
      "John",
      "Doe"
    );
    expect(value).toBe("Hello, John Doe");
  });

  test("function with list modification", () => {
    const { value } = evaluateFunction(
      `
def modify_list(lst):
    lst[0] = 100
    return lst
    `,
      {},
      "modify_list",
      [1, 2, 3]
    );
    expect(value).toEqual([100, 2, 3]);
  });

  test("function with multiple return paths", () => {
    const { value } = evaluateFunction(
      `
def sign(n):
    if n > 0:
        return "positive"
    elif n < 0:
        return "negative"
    else:
        return "zero"
    `,
      {},
      "sign",
      -5
    );
    expect(value).toBe("negative");
  });
});
