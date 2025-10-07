import { interpret } from "@python/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

describe("Python Concepts - While Loops", () => {
  describe("basic while loop", () => {
    test("simple counting loop", () => {
      const code = `i = 0
sum = 0
while i < 5:
    sum = sum + i
    i = i + 1`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.variables.i.value).toBe(5);
      expect(lastFrame.variables.sum.value).toBe(10); // 0+1+2+3+4
    });

    test("while loop that doesn't execute", () => {
      const code = `count = 0
while False:
    count = count + 1`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.variables.count.value).toBe(0);
    });

    test("while loop with complex condition", () => {
      const code = `x = 10
y = 5
iterations = 0
while x > y and y > 0:
    x = x - 2
    y = y - 1
    iterations = iterations + 1`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.variables.iterations.value).toBe(5);
      expect(lastFrame.variables.x.value).toBe(0);
      expect(lastFrame.variables.y.value).toBe(0);
    });

    test("while loop with variable update in condition", () => {
      const code = `n = 5
result = 1
while n > 0:
    result = result * n
    n = n - 1`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.variables.result.value).toBe(120); // 5!
      expect(lastFrame.variables.n.value).toBe(0);
    });
  });

  describe("nested while loops", () => {
    test("simple nested while loops", () => {
      const code = `i = 0
total = 0
while i < 3:
    j = 0
    while j < 2:
        total = total + 1
        j = j + 1
    i = i + 1`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.variables.total.value).toBe(6); // 3 * 2
    });

    test("nested loops with interdependent conditions", () => {
      const code = `outer = 5
inner = 0
count = 0
while outer > 0:
    inner = outer
    while inner > 0:
        count = count + 1
        inner = inner - 1
    outer = outer - 1`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.variables.count.value).toBe(15); // 5+4+3+2+1
    });
  });

  describe("while loop with break", () => {
    test("break exits the loop early", () => {
      const code = `i = 0
sum = 0
while i < 10:
    if i == 5:
        break
    sum = sum + i
    i = i + 1`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.variables.i.value).toBe(5);
      expect(lastFrame.variables.sum.value).toBe(10); // 0+1+2+3+4
    });

    test("break in nested loop only exits inner loop", () => {
      const code = `outer = 0
inner_count = 0
while outer < 3:
    inner = 0
    while inner < 5:
        if inner == 2:
            break
        inner_count = inner_count + 1
        inner = inner + 1
    outer = outer + 1`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.variables.outer.value).toBe(3);
      expect(lastFrame.variables.inner_count.value).toBe(6); // 2 iterations * 3 outer loops
    });
  });

  describe("while loop with continue", () => {
    test("continue skips to next iteration", () => {
      const code = `i = 0
sum = 0
while i < 5:
    i = i + 1
    if i == 3:
        continue
    sum = sum + i`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.variables.i.value).toBe(5);
      expect(lastFrame.variables.sum.value).toBe(12); // 1+2+4+5 (skipping 3)
    });

    test("continue in nested loop only affects inner loop", () => {
      const code = `outer = 0
count = 0
while outer < 3:
    inner = 0
    while inner < 3:
        inner = inner + 1
        if inner == 2:
            continue
        count = count + 1
    outer = outer + 1`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.variables.outer.value).toBe(3);
      expect(lastFrame.variables.count.value).toBe(6); // 2 counts per outer loop * 3 outer loops
    });
  });

  describe("runtime errors", () => {
    test("non-boolean condition when truthiness is disabled", () => {
      const code = `i = 5
while i:
    i = i - 1`;
      const { frames, error } = interpret(code, { languageFeatures: { allowTruthiness: false } });
      expect(error).toBeNull();
      // Should have an error frame for the non-boolean condition
      const errorFrame = frames.find(f => f.status === "ERROR");
      expect(errorFrame).toBeDefined();
      expect(errorFrame?.error?.type).toBe("TruthinessDisabled");
    });

    test("undefined variable in condition", () => {
      const code = `while undefinedVar:
    x = 1`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const errorFrame = frames.find(f => f.status === "ERROR");
      expect(errorFrame).toBeDefined();
      expect(errorFrame?.error?.type).toBe("UndefinedVariable");
    });

    test("type error in condition", () => {
      const code = `x = "hello"
while x + 5:
    x = "world"`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const errorFrame = frames.find(f => f.status === "ERROR");
      expect(errorFrame).toBeDefined();
      expect(errorFrame?.error?.type).toBe("TypeCoercionNotAllowed");
    });
  });

  describe("while loop syntax errors", () => {
    test("missing colon after condition", () => {
      const code = `i = 0
while i < 5
    i = i + 1`;
      const { error } = interpret(code);
      expect(error).not.toBeNull();
    });

    test("missing condition", () => {
      const code = `i = 0
while:
    i = i + 1`;
      const { error } = interpret(code);
      expect(error).not.toBeNull();
    });

    test("missing body", () => {
      const code = `i = 0
while i < 5:`;
      const { error } = interpret(code);
      expect(error).not.toBeNull();
    });

    test("incorrect indentation in body", () => {
      const code = `i = 0
while i < 5:
i = i + 1`;
      const { error } = interpret(code);
      expect(error).not.toBeNull();
    });
  });

  describe("truthiness with allowTruthiness enabled", () => {
    test("non-zero number as condition", () => {
      const code = `i = 5
count = 0
while i:
    count = count + 1
    i = i - 1`;
      const { frames, error } = interpret(code, { languageFeatures: { allowTruthiness: true } });
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.variables.count.value).toBe(5);
      expect(lastFrame.variables.i.value).toBe(0);
    });

    test("non-empty string as condition", () => {
      const code = `text = "hello"
count = 0
while text:
    count = count + 1
    text = ""`;
      const { frames, error } = interpret(code, { languageFeatures: { allowTruthiness: true } });
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.variables.count.value).toBe(1);
    });

    test("empty list as condition (falsy)", () => {
      const code = `items = []
count = 0
while items:
    count = count + 1`;
      const { frames, error } = interpret(code, { languageFeatures: { allowTruthiness: true } });
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.variables.count.value).toBe(0);
    });

    test("non-empty list as condition (truthy)", () => {
      const code = `items = [1, 2, 3]
count = 0
while items:
    count = count + 1
    items = []`;
      const { frames, error } = interpret(code, { languageFeatures: { allowTruthiness: true } });
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.variables.count.value).toBe(1);
    });
  });
});
