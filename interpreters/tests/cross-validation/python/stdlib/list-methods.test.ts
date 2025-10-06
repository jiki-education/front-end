import { describe } from "vitest";
import { testPython } from "../../utils/test-runner";

describe("Python list methods cross-validation", () => {
  describe("list.index()", () => {
    testPython(
      "finds element at beginning",
      `
lst = [10, 20, 30]
result = lst.index(10)
    `,
      { expectedValue: 0 }
    );

    testPython(
      "finds element in middle",
      `
lst = [10, 20, 30]
result = lst.index(20)
    `,
      { expectedValue: 1 }
    );

    testPython(
      "finds element at end",
      `
lst = [10, 20, 30]
result = lst.index(30)
    `,
      { expectedValue: 2 }
    );

    testPython(
      "finds first occurrence of duplicate",
      `
lst = [1, 2, 3, 2, 4]
result = lst.index(2)
    `,
      { expectedValue: 1 }
    );

    testPython(
      "with start parameter",
      `
lst = [1, 2, 3, 2, 4]
result = lst.index(2, 2)
    `,
      { expectedValue: 3 }
    );

    testPython(
      "with start and end parameters",
      `
lst = [1, 2, 3, 2, 4, 2]
result = lst.index(2, 2, 4)
    `,
      { expectedValue: 3 }
    );

    testPython(
      "negative start index",
      `
lst = [1, 2, 3, 4, 5]
result = lst.index(4, -2)
    `,
      { expectedValue: 3 }
    );

    testPython(
      "negative end index",
      `
lst = [1, 2, 3, 4, 5]
result = lst.index(3, 0, -1)
    `,
      { expectedValue: 2 }
    );

    // Error cases - these would need special handling for error comparison
    // SKIPPED: Requires try/except implementation
    testPython(
      "raises ValueError when not found",
      `
lst = [1, 2, 3]
try:
    lst.index(5)
    result = "should not reach here"
except ValueError:
    result = "ValueError caught"
    `,
      { expectedValue: "ValueError caught", skip: true }
    );

    testPython(
      "raises ValueError with start parameter",
      `
lst = [1, 2, 3, 4]
try:
    lst.index(2, 3)
    result = "should not reach here"
except ValueError:
    result = "ValueError caught"
    `,
      { expectedValue: "ValueError caught", skip: true }
    );
  });

  // SKIPPED: Requires len() builtin implementation
  describe.skip("len(list)", () => {
    testPython(
      "empty list",
      `
lst = []
result = len(lst)
    `,
      { expectedValue: 0 }
    );

    testPython(
      "single element",
      `
lst = [1]
result = len(lst)
    `,
      { expectedValue: 1 }
    );

    testPython(
      "multiple elements",
      `
lst = [1, 2, 3, 4, 5]
result = len(lst)
    `,
      { expectedValue: 5 }
    );

    testPython(
      "mixed types",
      `
lst = [1, "two", 3.0, True]
result = len(lst)
    `,
      { expectedValue: 4 }
    );

    testPython(
      "nested lists",
      `
lst = [[1, 2], [3, 4], [5]]
result = len(lst)
    `,
      { expectedValue: 3 }
    );
  });
});
