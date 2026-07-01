import type { Task, VisualScenario } from "../types";
import type PlantTheFlowersScenariosExercise from "./Exercise";

export const tasks = [
  {
    id: "plant-flowers-evenly" as const,
    name: "Plant flowers evenly",
    description:
      "Use askNumberOfFlowers() to find out how many flowers to plant, calculate the gap, and plant them evenly spaced.",
    hints: [],
    requiredScenarios: ["1-flower", "3-flowers", "4-flowers", "9-flowers"],
    bonus: false
  }
] as const satisfies readonly Task[];

function flowerExpectations(exercise: PlantTheFlowersScenariosExercise, count: number) {
  const gap = 100 / (count + 1);
  const expectedPositions = Array.from({ length: count }, (_, i) => gap * (i + 1));
  const expects = [];

  expects.push({
    pass: exercise.flowers.length === count,
    errorHtml: `The owner expected to see ${count} flower${count === 1 ? "" : "s"} planted. But you planted ${exercise.flowers.length}.`
  });

  // Every expected position must have a flower.
  for (const position of expectedPositions) {
    expects.push({
      pass: exercise.hasFlowerAt(position),
      errorHtml: `Expected a flower at position ${position}, but didn't find one.`
    });
  }

  // No flowers should be planted at unexpected positions.
  const strayFlower = exercise.flowers.find((position) => !expectedPositions.includes(position));
  expects.push({
    pass: strayFlower === undefined,
    errorHtml:
      strayFlower === undefined
        ? ""
        : `Found a flower at position ${strayFlower}, which isn't where the owner wanted one. The flowers should be evenly spaced.`
  });

  return expects;
}

export const scenarios: VisualScenario[] = [
  {
    slug: "1-flower",
    name: "The owner wants 1 flower",
    description: "In this scenario, `askNumberOfFlowers()` will return 1. Plant 1 flower at position 50.",
    taskId: "plant-flowers-evenly",
    setup(exercise) {
      const ex = exercise as PlantTheFlowersScenariosExercise;
      ex.setupBackground("/static/images/exercise-assets/owners-bouquets/background.svg");
      ex.setupNumFlowers(1);
    },
    expectations(exercise) {
      return flowerExpectations(exercise as PlantTheFlowersScenariosExercise, 1);
    }
  },
  {
    slug: "3-flowers",
    name: "The owner wants 3 flowers",
    description: "In this scenario, `askNumberOfFlowers()` will return 3. Plant 3 flowers at positions 25, 50, and 75.",
    taskId: "plant-flowers-evenly",
    setup(exercise) {
      const ex = exercise as PlantTheFlowersScenariosExercise;
      ex.setupBackground("/static/images/exercise-assets/owners-bouquets/background.svg");
      ex.setupNumFlowers(3);
    },
    expectations(exercise) {
      return flowerExpectations(exercise as PlantTheFlowersScenariosExercise, 3);
    }
  },
  {
    slug: "4-flowers",
    name: "The owner wants 4 flowers",
    description:
      "In this scenario, `askNumberOfFlowers()` will return 4. Plant 4 flowers at positions 20, 40, 60, and 80.",
    taskId: "plant-flowers-evenly",
    setup(exercise) {
      const ex = exercise as PlantTheFlowersScenariosExercise;
      ex.setupBackground("/static/images/exercise-assets/owners-bouquets/background.svg");
      ex.setupNumFlowers(4);
    },
    expectations(exercise) {
      return flowerExpectations(exercise as PlantTheFlowersScenariosExercise, 4);
    }
  },
  {
    slug: "9-flowers",
    name: "The owner wants 9 flowers",
    description:
      "In this scenario, `askNumberOfFlowers()` will return 9. Plant 9 flowers at positions 10, 20, 30, 40, 50, 60, 70, 80, and 90.",
    taskId: "plant-flowers-evenly",
    setup(exercise) {
      const ex = exercise as PlantTheFlowersScenariosExercise;
      ex.setupBackground("/static/images/exercise-assets/owners-bouquets/background.svg");
      ex.setupNumFlowers(9);
    },
    expectations(exercise) {
      return flowerExpectations(exercise as PlantTheFlowersScenariosExercise, 9);
    }
  }
];
