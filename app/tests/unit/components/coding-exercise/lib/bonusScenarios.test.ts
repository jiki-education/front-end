import {
  bonusScenarioSlugs,
  countOutstandingBonusTasks,
  firstFailingBonusScenario,
  firstOutstandingBonusTaskId
} from "@/components/coding-exercise/lib/bonusScenarios";
import type { TestResult, TestSuiteResult } from "@/components/coding-exercise/lib/test-results-types";
import { createMockExercise } from "@/tests/mocks/exercise";

// The mock exercise has:
//  - task "test-task-1" (required) with scenarios test-scenario-1, test-scenario-2
//  - task "test-task-bonus" (bonus) with scenario test-scenario-bonus
const exercise = createMockExercise();

function makeResult(statuses: Record<string, TestResult["status"]>): TestSuiteResult {
  const tests = Object.entries(statuses).map(([slug, status]) => ({ slug, status }) as TestResult);
  return { tests, passed: false };
}

describe("bonusScenarioSlugs", () => {
  it("returns only slugs belonging to bonus tasks", () => {
    expect(bonusScenarioSlugs(exercise)).toEqual(new Set(["test-scenario-bonus"]));
  });

  it("returns an empty set when there are no bonus tasks", () => {
    const noBonus = createMockExercise({
      tasks: [{ id: "test-task-1", name: "Basic Test Task", bonus: false }]
    });
    expect(bonusScenarioSlugs(noBonus)).toEqual(new Set());
  });
});

describe("countOutstandingBonusTasks", () => {
  it("counts a bonus task as outstanding when its scenario is failing", () => {
    const result = makeResult({
      "test-scenario-1": "pass",
      "test-scenario-2": "pass",
      "test-scenario-bonus": "fail"
    });
    expect(countOutstandingBonusTasks(exercise, result)).toBe(1);
  });

  it("counts zero once every bonus scenario passes", () => {
    const result = makeResult({
      "test-scenario-1": "pass",
      "test-scenario-2": "pass",
      "test-scenario-bonus": "pass"
    });
    expect(countOutstandingBonusTasks(exercise, result)).toBe(0);
  });

  it("ignores non-bonus tasks", () => {
    const result = makeResult({
      "test-scenario-1": "fail",
      "test-scenario-2": "fail",
      "test-scenario-bonus": "pass"
    });
    expect(countOutstandingBonusTasks(exercise, result)).toBe(0);
  });
});

describe("firstFailingBonusScenario", () => {
  it("returns the first failing bonus scenario's test result", () => {
    const result = makeResult({
      "test-scenario-1": "pass",
      "test-scenario-2": "pass",
      "test-scenario-bonus": "fail"
    });
    expect(firstFailingBonusScenario(exercise, result)?.slug).toBe("test-scenario-bonus");
  });

  it("ignores failing non-bonus scenarios", () => {
    const result = makeResult({
      "test-scenario-1": "fail",
      "test-scenario-2": "pass",
      "test-scenario-bonus": "pass"
    });
    expect(firstFailingBonusScenario(exercise, result)).toBeNull();
  });

  it("returns null when every bonus scenario passes", () => {
    const result = makeResult({
      "test-scenario-1": "pass",
      "test-scenario-2": "pass",
      "test-scenario-bonus": "pass"
    });
    expect(firstFailingBonusScenario(exercise, result)).toBeNull();
  });
});

describe("firstOutstandingBonusTaskId", () => {
  it("returns the id of the first outstanding bonus task", () => {
    const result = makeResult({
      "test-scenario-1": "pass",
      "test-scenario-2": "pass",
      "test-scenario-bonus": "fail"
    });
    expect(firstOutstandingBonusTaskId(exercise, result)).toBe("test-task-bonus");
  });

  it("returns null when no bonus tasks are outstanding", () => {
    const result = makeResult({
      "test-scenario-1": "pass",
      "test-scenario-2": "pass",
      "test-scenario-bonus": "pass"
    });
    expect(firstOutstandingBonusTaskId(exercise, result)).toBeNull();
  });
});
