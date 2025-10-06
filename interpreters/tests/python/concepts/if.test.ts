import { interpret } from "@python/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";
import { assertDescriptionContains, assertDescriptionExists } from "../helpers/assertDescription";
describe("Python If Statements", () => {
  test("executes then branch when condition is true", () => {
    const code = `x = 1
if True:
    x = 5`;

    const { frames, error } = interpret(code);

    expect(error).toBeNull();
    expect(frames.length).toBeGreaterThan(0);

    // Check that x was changed to 5
    const finalFrame = frames[frames.length - 1];
    expect((finalFrame as TestAugmentedFrame).variables.x.value).toBe(5);
  });

  test("skips then branch when condition is false", () => {
    const code = `x = 1
if False:
    x = 5`;

    const { frames, error } = interpret(code);

    expect(error).toBeNull();
    expect(frames.length).toBeGreaterThan(0);

    // Check that x was not changed
    const finalFrame = frames[frames.length - 1];
    expect((finalFrame as TestAugmentedFrame).variables.x.value).toBe(1);
  });

  test("executes with boolean expression conditions", () => {
    const code = `x = 10
if x > 5:
    y = 20`;

    const { frames, error } = interpret(code);

    expect(error).toBeNull();
    expect(frames.length).toBeGreaterThan(0);

    // Check that y was created
    const finalFrame = frames[frames.length - 1];
    expect((finalFrame as TestAugmentedFrame).variables.y.value).toBe(20);
  });

  test("works with complex conditions", () => {
    const code = `a = True
b = False
if a and not b:
    result = 42`;

    const { frames, error } = interpret(code);

    expect(error).toBeNull();
    expect(frames.length).toBeGreaterThan(0);

    // Check that result was created
    const finalFrame = frames[frames.length - 1];
    expect((finalFrame as TestAugmentedFrame).variables.result.value).toBe(42);
  });

  test("executes multiple statements in then branch", () => {
    const code = `if True:
    x = 1
    y = 2
    z = 3`;

    const { frames, error } = interpret(code);

    expect(error).toBeNull();
    expect(frames.length).toBeGreaterThan(0);

    // Check that all variables were created
    const finalFrame = frames[frames.length - 1];
    expect((finalFrame as TestAugmentedFrame).variables.x.value).toBe(1);
    expect((finalFrame as TestAugmentedFrame).variables.y.value).toBe(2);
    expect((finalFrame as TestAugmentedFrame).variables.z.value).toBe(3);
  });

  test("handles nested if statements", () => {
    const code = `x = 1
if True:
    x = 2
    if True:
        x = 3`;

    const { frames, error } = interpret(code);

    expect(error).toBeNull();
    expect(frames.length).toBeGreaterThan(0);

    // Check that x was set to 3 by the nested if
    const finalFrame = frames[frames.length - 1];
    expect((finalFrame as TestAugmentedFrame).variables.x.value).toBe(3);
  });

  test("throws error for non-boolean condition", () => {
    const code = `if 5:
    x = 1`;

    const { frames, error } = interpret(code);

    expect(error).toBeNull();
    expect(frames.length).toBeGreaterThan(0);

    // Check that there's an error frame
    const errorFrame = frames.find(f => f.status === "ERROR");
    expect(errorFrame).toBeTruthy();
    expect(errorFrame?.error?.message).toContain("TruthinessDisabled");
  });

  test("generates proper frame descriptions", () => {
    const code = `if True:
    x = 42`;

    const { frames, error } = interpret(code);

    expect(error).toBeNull();
    expect(frames.length).toBeGreaterThan(0);

    // Check that if frame has proper description
    const ifFrame = frames.find(f => {
      const desc = (f as TestAugmentedFrame).description;
      return desc && desc.includes("condition");
    });
    expect(ifFrame).toBeTruthy();
    assertDescriptionContains((ifFrame as TestAugmentedFrame).description!, "condition", "True");
  });

  test("handles comparison operators as conditions", () => {
    const code = `x = 10
y = 5
if x > y:
    result = "greater"`;

    const { frames, error } = interpret(code);

    expect(error).toBeNull();
    expect(frames.length).toBeGreaterThan(0);

    const finalFrame = frames[frames.length - 1];
    expect((finalFrame as TestAugmentedFrame).variables.result.value).toBe("greater");
  });

  test("handles equality comparison", () => {
    const code = `a = 5
b = 5
if a == b:
    equal = True`;

    const { frames, error } = interpret(code);

    expect(error).toBeNull();

    const finalFrame = frames[frames.length - 1];
    expect((finalFrame as TestAugmentedFrame).variables.equal.value).toBe(true);
  });

  test("executes else branch when condition is false", () => {
    const code = `x = 1
if False:
    x = 5
else:
    x = 10`;

    const { frames, error } = interpret(code);

    expect(error).toBeNull();
    expect(frames.length).toBeGreaterThan(0);

    // Check that x was set to 10 by the else branch
    const finalFrame = frames[frames.length - 1];
    expect((finalFrame as TestAugmentedFrame).variables.x.value).toBe(10);
  });

  test("executes then branch when condition is true with else present", () => {
    const code = `x = 1
if True:
    x = 5
else:
    x = 10`;

    const { frames, error } = interpret(code);

    expect(error).toBeNull();
    expect(frames.length).toBeGreaterThan(0);

    // Check that x was set to 5 by the then branch
    const finalFrame = frames[frames.length - 1];
    expect((finalFrame as TestAugmentedFrame).variables.x.value).toBe(5);
  });

  test("handles multiple statements in else branch", () => {
    const code = `if False:
    a = 1
else:
    b = 2
    c = 3`;

    const { frames, error } = interpret(code);

    expect(error).toBeNull();

    const finalFrame = frames[frames.length - 1];
    expect((finalFrame as TestAugmentedFrame).variables.b.value).toBe(2);
    expect((finalFrame as TestAugmentedFrame).variables.c.value).toBe(3);
    expect((finalFrame as TestAugmentedFrame).variables.a).toBeUndefined();
  });

  test("executes elif when if condition is false", () => {
    const code = `x = 1
if False:
    x = 5
elif True:
    x = 10
else:
    x = 15`;

    const { frames, error } = interpret(code);

    expect(error).toBeNull();

    // Check that x was set to 10 by the elif branch
    const finalFrame = frames[frames.length - 1];
    expect((finalFrame as TestAugmentedFrame).variables.x.value).toBe(10);
  });

  test("executes first true condition in if-elif chain", () => {
    const code = `result = 0
if False:
    result = 1
elif False:
    result = 2
elif True:
    result = 3
elif True:
    result = 4`;

    const { frames, error } = interpret(code);

    expect(error).toBeNull();

    // Should execute the first True elif (result = 3)
    const finalFrame = frames[frames.length - 1];
    expect((finalFrame as TestAugmentedFrame).variables.result.value).toBe(3);
  });

  test("executes else when all conditions are false", () => {
    const code = `x = 1
if False:
    x = 5
elif False:
    x = 10
else:
    x = 15`;

    const { frames, error } = interpret(code);

    expect(error).toBeNull();

    // Check that x was set to 15 by the else branch
    const finalFrame = frames[frames.length - 1];
    expect((finalFrame as TestAugmentedFrame).variables.x.value).toBe(15);
  });

  test("handles elif with expressions", () => {
    const code = `x = 10
y = 5
if x < y:
    result = "less"
elif x > y:
    result = "greater"
else:
    result = "equal"`;

    const { frames, error } = interpret(code);

    expect(error).toBeNull();

    const finalFrame = frames[frames.length - 1];
    expect((finalFrame as TestAugmentedFrame).variables.result.value).toBe("greater");
  });
});
