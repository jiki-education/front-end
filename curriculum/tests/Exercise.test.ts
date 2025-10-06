import { describe, it, expect } from "vitest";
import { TestExercise } from "../src/mocks/TestExercise";

describe("Exercise", () => {
  describe("getView", () => {
    it("should return the view element", () => {
      const exercise = new TestExercise();
      const view = exercise.getView();

      expect(view).toBeDefined();
      expect(view).toBe(exercise.view);
      expect(view).toBeInstanceOf(HTMLElement);
    });

    it("should have an id on the view element", () => {
      const exercise = new TestExercise();
      const view = exercise.getView();

      expect(view.id).toBeDefined();
      expect(view.id).toMatch(/^exercise-[a-z0-9-]+-[a-z0-9]+$/);
    });

    it("should populate the view with initial content", () => {
      const exercise = new TestExercise();
      const view = exercise.getView();

      expect(view.innerHTML).toContain("Character");
      expect(view.innerHTML).toContain("Counter:");
      expect(view.innerHTML).toContain("position: absolute");
    });
  });
});
