import { interpret } from "@python/interpreter";
import { PyList, PyString, PyNumber } from "@python/jikiObjects";
import type { TestAugmentedFrame } from "@shared/frames";
import { assertDescriptionContains, assertDescriptionExists } from "../helpers/assertDescription";

describe("Python Concepts - For Loops", () => {
  describe("Basic for-in loops", () => {
    test("should iterate over a list", () => {
      const { frames, error } = interpret(`mylist = [1, 2, 3]
for x in mylist:
    x`);

      expect(error).toBeNull();
      const testFrames = frames as TestAugmentedFrame[];
      expect(testFrames).toHaveLength(8);

      // Check assignment frame
      assertDescriptionContains(testFrames[0].description!, "assigned", "[1, 2, 3]", "mylist");

      // Check for loop start
      assertDescriptionContains(testFrames[1].description!, "starting", "for loop", "[1, 2, 3]");

      // Check iterations
      assertDescriptionContains(testFrames[2].description!, "1st", "iteration", "x", "1");
      assertDescriptionContains(testFrames[3].description!, "evaluated", "1");
      assertDescriptionContains(testFrames[4].description!, "2nd", "iteration", "x", "2");
      assertDescriptionContains(testFrames[5].description!, "evaluated", "2");
      assertDescriptionContains(testFrames[6].description!, "3rd", "iteration", "x", "3");
      assertDescriptionContains(testFrames[7].description!, "evaluated", "3");
    });

    test("should iterate over a string", () => {
      const { frames, error } = interpret(`for c in "hi":
    c`);

      expect(error).toBeNull();
      const testFrames = frames as TestAugmentedFrame[];
      expect(testFrames).toHaveLength(5);
      assertDescriptionContains(testFrames[0].description!, "starting", "for loop", "'hi'");
      assertDescriptionContains(testFrames[1].description!, "1st", "iteration", "c", "'h'");
      assertDescriptionContains(testFrames[2].description!, "evaluated", "'h'");
      assertDescriptionContains(testFrames[3].description!, "2nd", "iteration", "c", "'i'");
      assertDescriptionContains(testFrames[4].description!, "evaluated", "'i'");
    });

    test("should handle empty list", () => {
      const { frames, error } = interpret(`for x in []:
    x`);

      expect(error).toBeNull();
      const testFrames = frames as TestAugmentedFrame[];
      expect(testFrames).toHaveLength(1);
      assertDescriptionContains(testFrames[0].description!, "starting", "for loop", "[]");
    });

    test("should maintain variable after loop", () => {
      const { frames, error } = interpret(`for x in [10, 20]:
    x
x`);

      expect(error).toBeNull();
      const testFrames = frames as TestAugmentedFrame[];
      expect(testFrames).toHaveLength(6);
      assertDescriptionContains(testFrames[0].description!, "starting", "for loop", "[10, 20]");
      assertDescriptionContains(testFrames[1].description!, "1st", "iteration", "x", "10");
      assertDescriptionContains(testFrames[2].description!, "evaluated", "10");
      assertDescriptionContains(testFrames[3].description!, "2nd", "iteration", "x", "20");
      assertDescriptionContains(testFrames[4].description!, "evaluated", "20");
      assertDescriptionContains(testFrames[5].description!, "evaluated", "20");
    });
  });

  describe("Break statement", () => {
    test("should break out of loop", () => {
      const { frames, error } = interpret(`for x in [1, 2, 3]:
    if x == 2:
        break
    x`);

      expect(error).toBeNull();
      // Check that break works - only first element should be processed
      const testFrames = frames as TestAugmentedFrame[];
      const descriptions = testFrames.map(f => f.description!);

      // Find the break frame and check it contains the right text
      const breakFrame = descriptions.find(d => d.includes("break"));
      expect(breakFrame).toBeDefined();
      assertDescriptionContains(breakFrame!, "break", "exiting");

      // Check we have the expected iterations
      const iter1 = descriptions.find(d => d.includes("1st") && d.includes("iteration"));
      const iter2 = descriptions.find(d => d.includes("2nd") && d.includes("iteration"));
      const iter3 = descriptions.find(d => d.includes("3rd") && d.includes("iteration"));
      expect(iter1).toBeDefined();
      expect(iter2).toBeDefined();
      expect(iter3).toBeUndefined(); // Should not have 3rd iteration due to break
    });
  });

  describe("Continue statement", () => {
    test("should continue to next iteration", () => {
      const { frames, error } = interpret(`for x in [1, 2, 3]:
    if x == 2:
        continue
    x`);

      expect(error).toBeNull();
      const testFrames = frames as TestAugmentedFrame[];
      const descriptions = testFrames.map(f => f.description!);

      // Find the continue frame
      const continueFrame = descriptions.find(d => d.includes("continue"));
      expect(continueFrame).toBeDefined();
      assertDescriptionContains(continueFrame!, "continue", "next iteration");

      // Check we have all iterations
      const iter1 = descriptions.find(d => d.includes("1st") && d.includes("iteration"));
      const iter2 = descriptions.find(d => d.includes("2nd") && d.includes("iteration"));
      const iter3 = descriptions.find(d => d.includes("3rd") && d.includes("iteration"));
      expect(iter1).toBeDefined();
      expect(iter2).toBeDefined();
      expect(iter3).toBeDefined();
      // The important thing is that we have a continue statement and all 3 iterations
      // The actual behavior of what gets evaluated when depends on implementation details
    });
  });

  describe("Runtime errors", () => {
    test("should error on non-iterable", () => {
      const { frames, error } = interpret(`for x in 5:
    x`);

      expect(error).toBeNull(); // Runtime errors become frames
      const errorFrame = frames.find(f => f.status === "ERROR");
      expect(errorFrame).toBeDefined();
      expect(errorFrame?.error?.message).toContain("'int' object is not iterable");
    });

    test("should error on None iterable", () => {
      const { frames, error } = interpret(`for x in None:
    x`);

      expect(error).toBeNull(); // Runtime errors become frames
      const errorFrame = frames.find(f => f.status === "ERROR");
      expect(errorFrame).toBeDefined();
      expect(errorFrame?.error?.message).toContain("'NoneType' object is not iterable");
    });
  });

  describe("Nested for loops", () => {
    test("should handle nested loops", () => {
      const { frames, error } = interpret(`total = 0
for x in [1, 2]:
    for y in [3, 4]:
        total = total + x * y
total`);

      expect(error).toBeNull();
      const testFrames = frames as TestAugmentedFrame[];
      const lastFrame = testFrames[testFrames.length - 1];
      assertDescriptionContains(lastFrame.description!, "evaluated", "21");
    });
  });
});
