import type { Task, VisualScenario, CodeCheck } from "../types";
import type CityScapeSkyscraperExercise from "./Exercise";

export const tasks = [
  {
    id: "build-skyscraper" as const,
    name: "tasks.buildSkyscraper.name",
    description: "tasks.buildSkyscraper.description",
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
    errorHtml: exercise.t("checks.totalCells", { expected: totalCells, got: exercise.totalCells() })
  });

  // Ground floor (y=2): wall, glass, entrance, glass, wall
  expects.push({
    pass: exercise.hasCellAt(17, 2, "wall") && exercise.hasCellAt(21, 2, "wall"),
    errorHtml: exercise.t("checks.groundWalls")
  });
  expects.push({
    pass: exercise.hasCellAt(18, 2, "glass") && exercise.hasCellAt(20, 2, "glass"),
    errorHtml: exercise.t("checks.groundGlass")
  });
  expects.push({
    pass: exercise.hasCellAt(19, 2, "entrance"),
    errorHtml: exercise.t("checks.groundEntrance")
  });

  // Upper floors (y=3 to y=numFloors+1): wall, glass, glass, glass, wall
  for (let y = 3; y <= numFloors + 1; y++) {
    expects.push({
      pass: exercise.hasCellAt(17, y, "wall") && exercise.hasCellAt(21, y, "wall"),
      errorHtml: exercise.t("checks.floorWalls", { y })
    });
    expects.push({
      pass:
        exercise.hasCellAt(18, y, "glass") && exercise.hasCellAt(19, y, "glass") && exercise.hasCellAt(20, y, "glass"),
      errorHtml: exercise.t("checks.floorGlass", { y })
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
    errorHtml: exercise.t("checks.roof", { roofY })
  });

  return expects;
}

const codeChecks: CodeCheck[] = [
  {
    pass: (result) => result.assertors.assertAllArgumentsAreVariables(),
    errorKey: "checks.codeQuality.allArgumentsAreVariables"
  }
];

export const scenarios: VisualScenario[] = [
  {
    slug: "floors-6",
    name: "scenarios.floors6.name",
    description: "scenarios.floors6.description",
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
    name: "scenarios.floors8.name",
    description: "scenarios.floors8.description",
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
    name: "scenarios.floors10.name",
    description: "scenarios.floors10.description",
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
    name: "scenarios.floors12.name",
    description: "scenarios.floors12.description",
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
    name: "scenarios.floors16.name",
    description: "scenarios.floors16.description",
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
