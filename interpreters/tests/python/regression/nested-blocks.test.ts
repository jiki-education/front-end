import { describe, test, expect } from "vitest";
import type { TestAugmentedFrame } from "@shared/frames";
import { interpret } from "@python/interpreter";

describe("Python nested blocks regression tests", () => {
  describe("complex nesting patterns", () => {
    test("if inside else block", () => {
      const code = `result = ""
if False:
    result = "wrong"
else:
    result = "else1"
    if True:
        result = "else-if"`;

      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const finalFrame = frames[frames.length - 1];
      expect((finalFrame as TestAugmentedFrame).variables.result.value).toBe("else-if");
    });

    test("deeply nested if-else-if-else chains", () => {
      const code = `result = ""
if True:
    result = "a"
    if False:
        result = "b"
    else:
        result = "c"
        if True:
            result = "d"
            if False:
                result = "e"
            else:
                result = "f"
        else:
            result = "g"
else:
    result = "h"
    if True:
        result = "i"
    else:
        result = "j"`;

      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const finalFrame = frames[frames.length - 1];
      expect((finalFrame as TestAugmentedFrame).variables.result.value).toBe("f");
    });

    test("nested if inside nested else", () => {
      const code = `x = 0
y = 0
z = 0
if False:
    x = 1
else:
    x = 2
    if False:
        y = 1
    else:
        y = 2
        if True:
            z = 3
        else:
            z = 4`;

      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const finalFrame = frames[frames.length - 1];
      expect((finalFrame as TestAugmentedFrame).variables.x.value).toBe(2);
      expect((finalFrame as TestAugmentedFrame).variables.y.value).toBe(2);
      expect((finalFrame as TestAugmentedFrame).variables.z.value).toBe(3);
    });

    test("elif chains with nested blocks", () => {
      const code = `x = 5
result = ""
if x < 0:
    result = "negative"
elif x == 0:
    result = "zero"
elif x < 10:
    result = "small"
    if x == 5:
        result = "five"
        temp = "nested"
        result = result + "-" + temp
    else:
        result = "other"
else:
    result = "large"`;

      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const finalFrame = frames[frames.length - 1];
      expect((finalFrame as TestAugmentedFrame).variables.result.value).toBe("five-nested");
    });

    test("complex nested elif with inner if-else", () => {
      const code = `score = 85
grade = ""
detail = ""

if score >= 90:
    grade = "A"
    if score >= 95:
        detail = "excellent"
    else:
        detail = "very good"
elif score >= 80:
    grade = "B"
    if score >= 85:
        detail = "good"
        if score >= 88:
            detail = "very good"
        else:
            detail = "satisfactory"
    else:
        detail = "acceptable"
elif score >= 70:
    grade = "C"
else:
    grade = "F"
    if score >= 60:
        detail = "needs improvement"
    else:
        detail = "failing"`;

      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const finalFrame = frames[frames.length - 1];
      expect((finalFrame as TestAugmentedFrame).variables.grade.value).toBe("B");
      expect((finalFrame as TestAugmentedFrame).variables.detail.value).toBe("satisfactory");
    });

    test("nested if with variable shadowing", () => {
      const code = `x = 1
y = 2

if True:
    x = 10
    if True:
        y = 20
        if False:
            x = 100
        else:
            x = 30
            if True:
                y = 40`;

      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const finalFrame = frames[frames.length - 1];
      expect((finalFrame as TestAugmentedFrame).variables.x.value).toBe(30);
      expect((finalFrame as TestAugmentedFrame).variables.y.value).toBe(40);
    });

    test("multiple elif branches with nested conditions", () => {
      const code = `value = 7
result = 0

if value < 0:
    result = -1
elif value == 0:
    result = 0
elif value < 5:
    result = 1
    if value == 3:
        result = 3
elif value < 10:
    result = 2
    if value == 7:
        result = 7
        if True:
            result = 77
    elif value == 8:
        result = 8
    else:
        result = 9
else:
    result = 10`;

      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const finalFrame = frames[frames.length - 1];
      expect((finalFrame as TestAugmentedFrame).variables.result.value).toBe(77);
    });

    test("deeply nested else branches", () => {
      const code = `a = 0
b = 0
c = 0
d = 0

if False:
    a = 1
else:
    a = 2
    if False:
        b = 1
    else:
        b = 2
        if False:
            c = 1
        else:
            c = 2
            if False:
                d = 1
            else:
                d = 2`;

      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const finalFrame = frames[frames.length - 1];
      expect((finalFrame as TestAugmentedFrame).variables.a.value).toBe(2);
      expect((finalFrame as TestAugmentedFrame).variables.b.value).toBe(2);
      expect((finalFrame as TestAugmentedFrame).variables.c.value).toBe(2);
      expect((finalFrame as TestAugmentedFrame).variables.d.value).toBe(2);
    });

    test("complex control flow with counters", () => {
      const code = `count = 0
x = 5

if x > 0:
    count = count + 1
    if x > 3:
        count = count + 10
        if x == 5:
            count = count + 100
            if True:
                count = count + 1000
        else:
            count = count - 100
    else:
        count = count - 10
else:
    count = count - 1

final = 0
if count == 1111:
    final = 100`;

      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const finalFrame = frames[frames.length - 1];
      expect((finalFrame as TestAugmentedFrame).variables.count.value).toBe(1111);
      expect((finalFrame as TestAugmentedFrame).variables.final.value).toBe(100);
    });

    test("nested if-elif-else with multiple paths", () => {
      const code = `x = 3
y = 4
result = ""

if x > 5:
    if y > 5:
        result = "both high"
    elif y > 3:
        result = "x high, y medium"
    else:
        result = "x high, y low"
elif x > 2:
    if y > 5:
        result = "x medium, y high"
    elif y > 3:
        result = "both medium"
        if x == 3:
            if y == 4:
                result = "exact match"
            else:
                result = "x match only"
        else:
            result = "y match only"
    else:
        result = "x medium, y low"
else:
    if y > 5:
        result = "x low, y high"
    else:
        result = "both low"`;

      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const finalFrame = frames[frames.length - 1];
      expect((finalFrame as TestAugmentedFrame).variables.result.value).toBe("exact match");
    });
  });
});
