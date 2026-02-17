import type { Task, VisualScenario } from "../types";
import type PlantTheFlowersScenariosExercise from "./Exercise";

export const tasks = [
  {
    id: "plant-flowers-evenly" as const,
    name: "Plant flowers evenly",
    description:
      "Use num_flowers() to find out how many flowers to plant, calculate the gap, and plant them evenly spaced.",
    hints: [
      "Call num_flowers() and store the result",
      "The gap formula is 100 / (count + 1)",
      "Start at position = gap, then add gap each time",
      "Use a repeat loop to plant all the flowers"
    ],
    requiredScenarios: ["1-flower", "3-flowers", "4-flowers", "9-flowers"],
    bonus: false
  }
] as const satisfies readonly Task[];

function flowerExpectations(exercise: PlantTheFlowersScenariosExercise, count: number) {
  const gap = 100 / (count + 1);
  const expects = [];

  expects.push({
    pass: exercise.flowers.length === count,
    errorHtml: `Expected ${count} flower${count === 1 ? "" : "s"}, but found ${exercise.flowers.length}.`
  });

  expects.push({
    pass: exercise.hasFlowerAt(gap),
    errorHtml: `Expected a flower at position ${gap}, but didn't find one.`
  });

  if (count > 1) {
    expects.push({
      pass: exercise.hasFlowerAt(gap * count),
      errorHtml: `Expected a flower at position ${gap * count}, but didn't find one.`
    });
  }

  if (count >= 3) {
    const midIndex = Math.ceil(count / 2);
    const midPosition = gap * midIndex;
    expects.push({
      pass: exercise.hasFlowerAt(midPosition),
      errorHtml: `Expected a flower at position ${midPosition}, but didn't find one.`
    });
  }

  return expects;
}

export const scenarios: VisualScenario[] = [
  {
    slug: "1-flower",
    name: "1 flower",
    description: "Plant 1 flower at position 50.",
    taskId: "plant-flowers-evenly",
    setup(exercise) {
      (exercise as PlantTheFlowersScenariosExercise).setupNumFlowers(1);
    },
    expectations(exercise) {
      return flowerExpectations(exercise as PlantTheFlowersScenariosExercise, 1);
    }
  },
  {
    slug: "3-flowers",
    name: "3 flowers",
    description: "Plant 3 flowers at positions 25, 50, and 75.",
    taskId: "plant-flowers-evenly",
    setup(exercise) {
      (exercise as PlantTheFlowersScenariosExercise).setupNumFlowers(3);
    },
    expectations(exercise) {
      return flowerExpectations(exercise as PlantTheFlowersScenariosExercise, 3);
    }
  },
  {
    slug: "4-flowers",
    name: "4 flowers",
    description: "Plant 4 flowers at positions 20, 40, 60, and 80.",
    taskId: "plant-flowers-evenly",
    setup(exercise) {
      (exercise as PlantTheFlowersScenariosExercise).setupNumFlowers(4);
    },
    expectations(exercise) {
      return flowerExpectations(exercise as PlantTheFlowersScenariosExercise, 4);
    }
  },
  {
    slug: "9-flowers",
    name: "9 flowers",
    description: "Plant 9 flowers at positions 10, 20, 30, 40, 50, 60, 70, 80, and 90.",
    taskId: "plant-flowers-evenly",
    setup(exercise) {
      (exercise as PlantTheFlowersScenariosExercise).setupNumFlowers(9);
    },
    expectations(exercise) {
      return flowerExpectations(exercise as PlantTheFlowersScenariosExercise, 9);
    }
  }
];
