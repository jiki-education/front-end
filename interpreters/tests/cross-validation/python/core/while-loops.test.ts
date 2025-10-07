import { describe } from "vitest";
import { testPython } from "../../utils/test-runner";

describe("Python while loops cross-validation", () => {
  describe("basic while loops", () => {
    testPython(
      "simple countdown",
      `
x = 5
result = 0
while x > 0:
    result = result + x
    x = x - 1
      `,
      { expectedValue: 15 } // 5+4+3+2+1
    );

    testPython(
      "while loop that doesn't execute",
      `
x = 0
result = 10
while x > 5:
    result = result + x
      `,
      { expectedValue: 10 }
    );

    testPython(
      "while loop with boolean condition",
      `
done = False
count = 0
while not done:
    count = count + 1
    if count >= 3:
        done = True
result = count
      `,
      { expectedValue: 3 }
    );
  });

  describe("while loop with break", () => {
    testPython(
      "break exits loop early",
      `
i = 0
result = 0
while i < 10:
    if i == 5:
        break
    result = result + i
    i = i + 1
      `,
      { expectedValue: 10 } // 0+1+2+3+4
    );

    testPython(
      "break with complex condition",
      `
x = 1
result = 0
while x < 100:
    result = result + x
    if result > 20:
        break
    x = x * 2
      `,
      { expectedValue: 31 } // 1+2+4+8+16
    );
  });

  describe("while loop with continue", () => {
    testPython(
      "continue skips iteration",
      `
i = 0
result = 0
while i < 5:
    i = i + 1
    if i == 3:
        continue
    result = result + i
      `,
      { expectedValue: 12 } // 1+2+4+5 (skipping 3)
    );

    testPython(
      "continue with multiple conditions",
      `
x = 0
result = 0
while x < 10:
    x = x + 1
    if x % 2 == 0:
        continue
    result = result + x
      `,
      { expectedValue: 25 } // 1+3+5+7+9
    );
  });

  describe("nested while loops", () => {
    testPython(
      "simple nested loops",
      `
i = 0
result = 0
while i < 3:
    j = 0
    while j < 2:
        result = result + 1
        j = j + 1
    i = i + 1
      `,
      { expectedValue: 6 } // 3 * 2
    );

    testPython(
      "nested loops with break",
      `
outer = 0
result = 0
while outer < 4:
    inner = 0
    while inner < 3:
        if inner == 2:
            break
        result = result + 1
        inner = inner + 1
    outer = outer + 1
      `,
      { expectedValue: 8 } // 2 per outer loop * 4 outer loops
    );
  });

  describe("while loop with complex conditions", () => {
    testPython(
      "and condition",
      `
x = 10
y = 5
result = 0
while x > 0 and y > 0:
    result = result + 1
    x = x - 2
    y = y - 1
      `,
      { expectedValue: 5 }
    );

    testPython(
      "or condition",
      `
x = 3
y = 0
result = 0
while x > 0 or y > 0:
    result = result + 1
    x = x - 1
      `,
      { expectedValue: 3 }
    );

    testPython(
      "comparison in condition",
      `
x = 1
result = 0
while x < 10:
    result = result + x
    x = x * 2
      `,
      { expectedValue: 15 } // 1+2+4+8
    );
  });

  describe("while loop modifying condition variable", () => {
    testPython(
      "factorial using while",
      `
n = 5
result = 1
while n > 0:
    result = result * n
    n = n - 1
      `,
      { expectedValue: 120 } // 5!
    );

    testPython(
      "fibonacci using while",
      `
a = 0
b = 1
n = 7
while n > 0:
    temp = a
    a = b
    b = temp + b
    n = n - 1
result = a
      `,
      { expectedValue: 13 } // 7th Fibonacci number
    );
  });
});
