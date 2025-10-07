import { describe } from "vitest";
import { testPython } from "../../utils/test-runner";

describe("Python statement return values cross-validation", () => {
  describe("if statements don't produce values", () => {
    testPython(
      "if statement with assignment returns None from function",
      `
def test():
    if True:
        x = 5
    # No explicit return, so function returns None

result = test()
      `,
      { expectedValue: null }
    );

    testPython(
      "if-else with assignments returns None from function",
      `
def test():
    if True:
        x = 5
    else:
        x = 10

result = test()
      `,
      { expectedValue: null }
    );

    testPython(
      "nested if statements return None from function",
      `
def test():
    if True:
        if False:
            x = 1
        else:
            x = 2

result = test()
      `,
      { expectedValue: null }
    );
  });

  describe("while loops don't produce values", () => {
    testPython(
      "while loop returns None from function",
      `
def test():
    x = 5
    while x > 0:
        x = x - 1

result = test()
      `,
      { expectedValue: null }
    );

    testPython(
      "while loop with break returns None from function",
      `
def test():
    x = 0
    while x < 10:
        x = x + 1
        if x == 5:
            break

result = test()
      `,
      { expectedValue: null }
    );

    testPython(
      "while loop with continue returns None from function",
      `
def test():
    x = 0
    while x < 5:
        x = x + 1
        if x == 3:
            continue

result = test()
      `,
      { expectedValue: null }
    );
  });

  describe("for loops don't produce values", () => {
    testPython(
      "for loop returns None from function",
      `
def test():
    for i in [1, 2, 3]:
        x = i * 2

result = test()
      `,
      { expectedValue: null }
    );

    testPython(
      "for loop with break returns None from function",
      `
def test():
    for i in [1, 2, 3, 4, 5]:
        if i == 3:
            break

result = test()
      `,
      { expectedValue: null }
    );

    testPython(
      "for loop with continue returns None from function",
      `
def test():
    for i in [1, 2, 3, 4, 5]:
        if i == 3:
            continue

result = test()
      `,
      { expectedValue: null }
    );

    testPython(
      "empty for loop returns None from function",
      `
def test():
    for i in []:
        x = i

result = test()
      `,
      { expectedValue: null }
    );
  });

  describe("only explicit return produces values", () => {
    testPython(
      "explicit return produces value",
      `
def test():
    if True:
        return 42

result = test()
      `,
      { expectedValue: 42 }
    );

    testPython(
      "return in loop produces value",
      `
def test():
    for i in [1, 2, 3]:
        if i == 2:
            return i * 10

result = test()
      `,
      { expectedValue: 20 }
    );

    testPython(
      "return in while loop produces value",
      `
def test():
    x = 0
    while x < 5:
        x = x + 1
        if x == 3:
            return x * 100

result = test()
      `,
      { expectedValue: 300 }
    );
  });

  describe("mixed statements and expressions", () => {
    testPython(
      "assignment statement doesn't produce value, function returns None",
      `
def test():
    x = 42  # Assignment statement

result = test()
      `,
      { expectedValue: null }
    );

    testPython(
      "last statement is assignment, function returns None",
      `
def test():
    x = 10
    y = 20
    z = x + y

result = test()
      `,
      { expectedValue: null }
    );

    testPython(
      "only return statement produces function value",
      `
def test():
    x = 10
    y = 20
    return x + y

result = test()
      `,
      { expectedValue: 30 }
    );
  });
});
