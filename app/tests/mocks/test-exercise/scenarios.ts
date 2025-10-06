import type { Task, Scenario, Exercise } from "@jiki/curriculum";
import type { TestExercise } from "@jiki/curriculum";

export const tasks: Task[] = [
  {
    id: "test-task-1",
    name: "Basic Test Task",
    bonus: false
  },
  {
    id: "test-task-bonus",
    name: "Bonus Test Task",
    bonus: true
  }
];

export const scenarios: Scenario[] = [
  {
    slug: "test-scenario-1",
    name: "Test Scenario 1",
    description: "Move to position 100",
    taskId: "test-task-1",
    setup: (exercise: Exercise) => {
      const testExercise = exercise as TestExercise;
      testExercise.setStartPosition(0);
      testExercise.setCounter(0);
    },
    expectations: (exercise: Exercise) => {
      const testExercise = exercise as TestExercise;
      const state = testExercise.getState();
      return [
        {
          pass: state.position === 100,
          actual: state.position,
          expected: 100,
          errorHtml: `Expected position to be 100, but got ${state.position}`
        }
      ];
    }
  },
  {
    slug: "test-scenario-2",
    name: "Test Scenario 2",
    description: "Call move() 5 times starting from position 0",
    taskId: "test-task-1",
    setup: (exercise: Exercise) => {
      const testExercise = exercise as TestExercise;
      testExercise.setStartPosition(0);
      testExercise.setCounter(0);
    },
    expectations: (exercise: Exercise) => {
      const testExercise = exercise as TestExercise;
      const state = testExercise.getState();
      return [
        {
          pass: state.position === 100,
          actual: state.position,
          expected: 100,
          errorHtml: `Expected position to be 100, but got ${state.position}`
        }
      ];
    }
  },
  {
    slug: "test-scenario-bonus",
    name: "Bonus Test Scenario",
    description: "Move to position 200",
    taskId: "test-task-bonus",
    setup: (exercise: Exercise) => {
      const testExercise = exercise as TestExercise;
      testExercise.setStartPosition(0);
      testExercise.setCounter(0);
    },
    expectations: (exercise: Exercise) => {
      const testExercise = exercise as TestExercise;
      const state = testExercise.getState();
      return [
        {
          pass: state.position === 200,
          actual: state.position,
          expected: 200,
          errorHtml: `Expected position to be 200, but got ${state.position}`
        }
      ];
    }
  }
];
