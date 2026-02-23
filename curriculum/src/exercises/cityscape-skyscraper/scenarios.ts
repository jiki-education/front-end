import type { Task, VisualScenario } from "../types";
import type CityScapeSkyscraperExercise from "./Exercise";

export const tasks = [
  {
    id: "build-skyscraper" as const,
    name: "Build the skyscraper",
    description:
      "Build a skyscraper with the correct number of floors, including a ground floor with entrance, upper floors with glass, and a wall roof.",
    hints: [
      "Use numFloors() to find out how many floors to build",
      "The ground floor has an entrance in the middle",
      "Upper floors have glass instead of an entrance",
      "The roof is all walls"
    ],
    requiredScenarios: ["floors-3", "floors-4", "floors-5", "floors-6", "floors-8"],
    bonus: false
  }
] as const satisfies readonly Task[];

function skyscraperExpectations(exercise: CityScapeSkyscraperExercise, numFloors: number) {
  // numFloors() returns numFloors. Solution does floors = numFloors - 1 upper floors.
  // Total rows = 1 (ground) + (numFloors - 1) (upper) + 1 (roof) = numFloors + 1
  const totalRows = numFloors + 1;
  const totalCells = totalRows * 5;
  const expects = [];

  expects.push({
    pass: exercise.totalCells() === totalCells,
    errorHtml: `Expected ${totalCells} cells but found ${exercise.totalCells()}.`
  });

  // Ground floor (y=1): wall, glass, entrance, glass, wall
  expects.push({
    pass: exercise.hasCellAt(1, 1, "wall") && exercise.hasCellAt(5, 1, "wall"),
    errorHtml: "The ground floor should have walls at positions (1, 1) and (5, 1)."
  });
  expects.push({
    pass: exercise.hasCellAt(2, 1, "glass") && exercise.hasCellAt(4, 1, "glass"),
    errorHtml: "The ground floor should have glass at positions (2, 1) and (4, 1)."
  });
  expects.push({
    pass: exercise.hasCellAt(3, 1, "entrance"),
    errorHtml: "The ground floor should have an entrance at position (3, 1)."
  });

  // Upper floors (y=2 to y=numFloors): wall, glass, glass, glass, wall
  for (let y = 2; y <= numFloors; y++) {
    expects.push({
      pass: exercise.hasCellAt(1, y, "wall") && exercise.hasCellAt(5, y, "wall"),
      errorHtml: `Floor ${y} should have walls at positions (1, ${y}) and (5, ${y}).`
    });
    expects.push({
      pass: exercise.hasCellAt(2, y, "glass") && exercise.hasCellAt(3, y, "glass") && exercise.hasCellAt(4, y, "glass"),
      errorHtml: `Floor ${y} should have glass at positions (2, ${y}), (3, ${y}), and (4, ${y}).`
    });
  }

  // Roof (y = numFloors + 1): all walls
  const roofY = numFloors + 1;
  expects.push({
    pass:
      exercise.hasCellAt(1, roofY, "wall") &&
      exercise.hasCellAt(2, roofY, "wall") &&
      exercise.hasCellAt(3, roofY, "wall") &&
      exercise.hasCellAt(4, roofY, "wall") &&
      exercise.hasCellAt(5, roofY, "wall"),
    errorHtml: `The roof at y=${roofY} should be all walls.`
  });

  return expects;
}

export const scenarios: VisualScenario[] = [
  {
    slug: "floors-3",
    name: "3-floor skyscraper",
    description: "Build a skyscraper with 3 floors.",
    taskId: "build-skyscraper",
    setup(exercise) {
      (exercise as CityScapeSkyscraperExercise).setupNumFloors(3);
    },
    expectations(exercise) {
      return skyscraperExpectations(exercise as CityScapeSkyscraperExercise, 3);
    }
  },
  {
    slug: "floors-4",
    name: "4-floor skyscraper",
    description: "Build a skyscraper with 4 floors.",
    taskId: "build-skyscraper",
    setup(exercise) {
      (exercise as CityScapeSkyscraperExercise).setupNumFloors(4);
    },
    expectations(exercise) {
      return skyscraperExpectations(exercise as CityScapeSkyscraperExercise, 4);
    }
  },
  {
    slug: "floors-5",
    name: "5-floor skyscraper",
    description: "Build a skyscraper with 5 floors.",
    taskId: "build-skyscraper",
    setup(exercise) {
      (exercise as CityScapeSkyscraperExercise).setupNumFloors(5);
    },
    expectations(exercise) {
      return skyscraperExpectations(exercise as CityScapeSkyscraperExercise, 5);
    }
  },
  {
    slug: "floors-6",
    name: "6-floor skyscraper",
    description: "Build a skyscraper with 6 floors.",
    taskId: "build-skyscraper",
    setup(exercise) {
      (exercise as CityScapeSkyscraperExercise).setupNumFloors(6);
    },
    expectations(exercise) {
      return skyscraperExpectations(exercise as CityScapeSkyscraperExercise, 6);
    }
  },
  {
    slug: "floors-8",
    name: "8-floor skyscraper",
    description: "Build a skyscraper with 8 floors.",
    taskId: "build-skyscraper",
    setup(exercise) {
      (exercise as CityScapeSkyscraperExercise).setupNumFloors(8);
    },
    expectations(exercise) {
      return skyscraperExpectations(exercise as CityScapeSkyscraperExercise, 8);
    }
  }
];
