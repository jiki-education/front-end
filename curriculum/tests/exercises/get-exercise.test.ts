import { describe, it, expect } from "vitest";
import { getExercise } from "../../src";

describe("getExercise", () => {
  it("should return exercise definition for valid slug", async () => {
    const exercise = await getExercise("basic-movement");

    expect(exercise).not.toBeNull();
    expect(exercise?.slug).toBe("basic-movement");
    expect(exercise?.title).toBe("Basic Movement");
    expect(exercise?.tasks).toBeDefined();
    expect(exercise?.scenarios).toBeDefined();
  });

  it("should return exercise definition for maze-solve-basic", async () => {
    const exercise = await getExercise("maze-solve-basic");

    expect(exercise).not.toBeNull();
    expect(exercise?.slug).toBe("maze-solve-basic");
    expect(exercise?.title).toBeDefined();
  });

  it("should return null for non-existent exercise", async () => {
    const exercise = await getExercise("non-existent-exercise");
    expect(exercise).toBeNull();
  });

  it("should return null for invalid slug", async () => {
    const exercise = await getExercise("");
    expect(exercise).toBeNull();
  });

  it("should handle case-sensitive slugs correctly", async () => {
    const exercise = await getExercise("Basic-Movement");
    expect(exercise).toBeNull();
  });
});
