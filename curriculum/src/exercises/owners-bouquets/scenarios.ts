import type { Task, VisualScenario } from "../types";
import type PlantTheFlowersScenariosExercise from "./Exercise";

export const tasks = [
  {
    id: "plant-flowers-evenly" as const,
    name: "tasks.plantFlowersEvenly.name",
    description: "tasks.plantFlowersEvenly.description",
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
    errorHtml: exercise.t("checks.flowerCount", { count, got: exercise.flowers.length })
  });

  // Every expected position must have a flower.
  for (const position of expectedPositions) {
    expects.push({
      pass: exercise.hasFlowerAt(position),
      errorHtml: exercise.t("checks.flowerAtPosition", { position })
    });
  }

  // No flowers should be planted at unexpected positions.
  const strayFlower = exercise.flowers.find((position) => !expectedPositions.includes(position));
  expects.push({
    pass: strayFlower === undefined,
    errorHtml: strayFlower === undefined ? "" : exercise.t("checks.strayFlower", { position: strayFlower })
  });

  return expects;
}

export const scenarios: VisualScenario[] = [
  {
    slug: "1-flower",
    name: "scenarios.oneFlower.name",
    description: "scenarios.oneFlower.description",
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
    name: "scenarios.threeFlowers.name",
    description: "scenarios.threeFlowers.description",
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
    name: "scenarios.fourFlowers.name",
    description: "scenarios.fourFlowers.description",
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
    name: "scenarios.nineFlowers.name",
    description: "scenarios.nineFlowers.description",
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
