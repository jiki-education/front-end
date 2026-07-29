import type { Task, VisualScenario } from "../types";
import type StarsExercise from "./Exercise";

export const tasks = [
  {
    id: "draw-stars" as const,
    name: "tasks.drawStars.name",
    description: "tasks.drawStars.description",
    hints: [],
    requiredScenarios: ["count-1", "count-3", "count-5", "count-0", "count-10"],
    bonus: false
  }
] as const satisfies readonly Task[];

// The pyramid has `count` rows. Row `rowFromBottom` (0 = bottom, the longest) should
// hold `count - rowFromBottom` stars, for a total of count*(count+1)/2. The per-row
// checks come first (most actionable), then the overall total catches extra/missing rows.
function pyramidExpectations(count: number) {
  return (exercise: StarsExercise) => {
    if (count === 0) {
      return [{ pass: exercise.totalStars() === 0, errorHtml: exercise.t("checks.shouldBeEmpty") }];
    }

    // row 0 = bottom (longest); each row above holds one fewer star.
    const rowChecks = [];
    for (let rowFromBottom = 0; rowFromBottom < count; rowFromBottom++) {
      rowChecks.push({
        pass: exercise.countStarsInRow(rowFromBottom) === count - rowFromBottom,
        errorHtml: exercise.t(`checks.row${rowFromBottom + 1}`)
      });
    }
    rowChecks.push({
      pass: exercise.totalStars() === (count * (count + 1)) / 2,
      errorHtml: exercise.t("checks.total")
    });
    return rowChecks;
  };
}

function pyramidScenario(count: number, slug: string, nameKey: string, descriptionKey: string): VisualScenario {
  return {
    slug,
    name: nameKey,
    description: descriptionKey,
    taskId: "draw-stars",
    functionCall: { name: "layout_stars", args: [count] },
    setup(exercise) {
      (exercise as StarsExercise).setupTemplate(count);
    },
    expectations(exercise) {
      return pyramidExpectations(count)(exercise as StarsExercise);
    },
    // Enforce the "build it up with push, don't hardcode the list" rule from the
    // instructions. A valid solution has exactly one array literal (the starting `[]`);
    // writing out the finished list adds another.
    codeChecks: [
      {
        pass: (result) => result.assertors.assertMethodCalled("push"),
        errorKey: "checks.codeQuality.mustUsePush"
      },
      {
        pass: (result) => result.assertors.countArrayLiterals() <= 1,
        errorKey: "checks.codeQuality.noHardcodedArray"
      }
    ]
  };
}

export const scenarios: VisualScenario[] = [
  pyramidScenario(1, "count-1", "scenarios.count1.name", "scenarios.count1.description"),
  pyramidScenario(3, "count-3", "scenarios.count3.name", "scenarios.count3.description"),
  pyramidScenario(5, "count-5", "scenarios.count5.name", "scenarios.count5.description"),
  pyramidScenario(0, "count-0", "scenarios.count0.name", "scenarios.count0.description"),
  pyramidScenario(10, "count-10", "scenarios.count10.name", "scenarios.count10.description")
];
