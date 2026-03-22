import type { Task, VisualScenario, CodeCheck } from "../types";
import type CityScapeSkyscraperExercise from "./Exercise";

export const tasks = [
  {
    id: "build-skyscraper" as const,
    name: "Build the skyscraper",
    description:
      "Build a skyscraper with the correct number of floors, including a ground floor with entrance, upper floors with glass, and a wall roof.",
    hints: [],
    requiredScenarios: ["floors-6", "floors-8", "floors-10", "floors-12", "floors-16"],
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

  // Ground floor (y=2): wall, glass, entrance, glass, wall
  expects.push({
    pass: exercise.hasCellAt(17, 2, "wall") && exercise.hasCellAt(21, 2, "wall"),
    errorHtml: "The ground floor should have walls at positions (17, 2) and (21, 2)."
  });
  expects.push({
    pass: exercise.hasCellAt(18, 2, "glass") && exercise.hasCellAt(20, 2, "glass"),
    errorHtml: "The ground floor should have glass at positions (18, 2) and (20, 2)."
  });
  expects.push({
    pass: exercise.hasCellAt(19, 2, "entrance"),
    errorHtml: "The ground floor should have an entrance at position (19, 2)."
  });

  // Upper floors (y=3 to y=numFloors+1): wall, glass, glass, glass, wall
  for (let y = 3; y <= numFloors + 1; y++) {
    expects.push({
      pass: exercise.hasCellAt(17, y, "wall") && exercise.hasCellAt(21, y, "wall"),
      errorHtml: `Floor ${y} should have walls at positions (17, ${y}) and (21, ${y}).`
    });
    expects.push({
      pass:
        exercise.hasCellAt(18, y, "glass") && exercise.hasCellAt(19, y, "glass") && exercise.hasCellAt(20, y, "glass"),
      errorHtml: `Floor ${y} should have glass at positions (18, ${y}), (19, ${y}), and (20, ${y}).`
    });
  }

  // Roof (y = numFloors + 2): all walls
  const roofY = numFloors + 2;
  expects.push({
    pass:
      exercise.hasCellAt(17, roofY, "wall") &&
      exercise.hasCellAt(18, roofY, "wall") &&
      exercise.hasCellAt(19, roofY, "wall") &&
      exercise.hasCellAt(20, roofY, "wall") &&
      exercise.hasCellAt(21, roofY, "wall"),
    errorHtml: `The roof at y=${roofY} should be all walls.`
  });

  return expects;
}

const codeChecks: CodeCheck[] = [
  {
    pass: (result) => result.assertors.assertAllArgumentsAreVariables(),
    errorHtml:
      "You should use <strong>variables</strong> as arguments to functions, not literal values. Store values in variables first, then pass the variables."
  }
];

export const scenarios: VisualScenario[] = [
  {
    slug: "floors-6",
    name: "6-floor skyscraper",
    description: "Build a skyscraper with 6 floors.",
    taskId: "build-skyscraper",
    codeChecks,
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
    codeChecks,
    setup(exercise) {
      (exercise as CityScapeSkyscraperExercise).setupNumFloors(8);
    },
    expectations(exercise) {
      return skyscraperExpectations(exercise as CityScapeSkyscraperExercise, 8);
    }
  },
  {
    slug: "floors-10",
    name: "10-floor skyscraper",
    description: "Build a skyscraper with 10 floors.",
    taskId: "build-skyscraper",
    codeChecks,
    setup(exercise) {
      (exercise as CityScapeSkyscraperExercise).setupNumFloors(10);
    },
    expectations(exercise) {
      return skyscraperExpectations(exercise as CityScapeSkyscraperExercise, 10);
    }
  },
  {
    slug: "floors-12",
    name: "12-floor skyscraper",
    description: "Build a skyscraper with 12 floors.",
    taskId: "build-skyscraper",
    codeChecks,
    setup(exercise) {
      (exercise as CityScapeSkyscraperExercise).setupNumFloors(12);
    },
    expectations(exercise) {
      return skyscraperExpectations(exercise as CityScapeSkyscraperExercise, 12);
    }
  },
  {
    slug: "floors-16",
    name: "16-floor skyscraper",
    description: "Build a skyscraper with 16 floors.",
    taskId: "build-skyscraper",
    codeChecks,
    setup(exercise) {
      (exercise as CityScapeSkyscraperExercise).setupNumFloors(16);
    },
    expectations(exercise) {
      return skyscraperExpectations(exercise as CityScapeSkyscraperExercise, 16);
    }
  }
];
