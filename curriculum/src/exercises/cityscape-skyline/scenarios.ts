import type { Task, VisualScenario } from "../types";
import { FLOORS_SEED_OFFSET } from "../../exercise-categories/cityscape/CityScapeExercise";
import type CityScapeSkylineExercise from "./Exercise";

export const tasks = [
  {
    id: "build-skyline" as const,
    name: "tasks.buildSkyline.name",
    description: "tasks.buildSkyline.description",
    hints: [],
    requiredScenarios: ["buildings-1", "buildings-2", "buildings-3", "buildings-4"],
    bonus: false
  }
] as const satisfies readonly Task[];

// Pre-compute expected building dimensions using the same mulberry32 PRNG
// that the interpreter uses (from interpreters/src/shared/random.ts)
function mulberry32(seed: number): () => number {
  let state = seed | 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function getExpectedBuildings(numBuildings: number, seed: number): { width: number; floors: number }[] {
  // Width and floors draw from independent streams (mirroring CityScapeExercise),
  // so the expected values don't depend on the order the student calls the helpers.
  const widthRng = mulberry32(seed);
  const floorsRng = mulberry32(seed ^ FLOORS_SEED_OFFSET);
  const buildings: { width: number; floors: number }[] = [];
  for (let i = 0; i < numBuildings; i++) {
    // randomWidth: Math.floor(rng() * 3) * 2 + 3 gives 3, 5, or 7
    const width = Math.floor(widthRng() * 3) * 2 + 3;
    // randomNumFloors: Math.floor(rng() * 12) + 1 gives 1-12
    const floors = Math.floor(floorsRng() * 12) + 1;
    buildings.push({ width, floors });
  }
  return buildings;
}

// Scan the ground floor (row 2) for contiguous runs of built cells.
// Each run is one building's ground floor, so we can tell a building that is
// internally correct but in the wrong column apart from one that is broken.
function groundFloorRuns(exercise: CityScapeSkylineExercise): { start: number; end: number }[] {
  const runs: { start: number; end: number }[] = [];
  let start: number | null = null;
  for (let col = 1; col <= exercise.numCols(); col++) {
    const occupied = exercise.getCellAt(col, 2) !== null;
    if (occupied && start === null) {
      start = col;
    } else if (!occupied && start !== null) {
      runs.push({ start, end: col - 1 });
      start = null;
    }
  }
  if (start !== null) {
    runs.push({ start, end: exercise.numCols() });
  }
  return runs;
}

function skylineExpectations(exercise: CityScapeSkylineExercise, numBuildings: number) {
  const expectedBuildings = getExpectedBuildings(numBuildings, exercise.randomSeed!);
  const expects = [];

  // Only usable for position feedback when buildings map 1:1 onto runs;
  // merged or missing buildings fall through to the detailed checks below.
  const runs = groundFloorRuns(exercise);

  // Check total cell count
  const expectedTotal = expectedBuildings.reduce((sum, b) => sum + (b.floors + 1) * b.width, 0);
  expects.push({
    pass: exercise.totalCells() === expectedTotal,
    errorHtml: exercise.t("checks.totalCells", { expectedTotal, got: exercise.totalCells() })
  });

  // Check each building's structure
  let x = 2;
  for (let b = 0; b < numBuildings; b++) {
    const { width, floors } = expectedBuildings[b];
    const entranceOffset = (width - 1) / 2;
    const roofY = floors + 2;

    // A building that is internally fine but starts in the wrong column would
    // fail every check below with misleading messages. Catch that case first
    // and replace them with one precise message about the spacing.
    const run = runs.length === numBuildings ? runs[b] : undefined;
    if (run !== undefined && run.start !== x) {
      expects.push({
        pass: false,
        errorHtml: exercise.t("checks.wrongPosition", { building: b + 1, start: run.start, expected: x })
      });
      x += width + 1;
      continue;
    }

    // Ground floor: centered entrance
    expects.push({
      pass: exercise.hasCellAt(x + entranceOffset, 2, "entrance"),
      errorHtml: exercise.t("checks.wrongEntrance", { building: b + 1 })
    });

    // Ground floor: walls at edges
    expects.push({
      pass: exercise.hasCellAt(x, 2, "wall") && exercise.hasCellAt(x + width - 1, 2, "wall"),
      errorHtml: exercise.t("checks.wrongGroundWalls", { building: b + 1 })
    });

    // Roof: all walls across the full width
    let roofComplete = true;
    for (let c = 0; c < width; c++) {
      if (!exercise.hasCellAt(x + c, roofY, "wall")) {
        roofComplete = false;
      }
    }
    expects.push({
      pass: roofComplete,
      errorHtml: exercise.t("checks.wrongRoof", { building: b + 1 })
    });

    x += width + 1;
  }

  return expects;
}

export const scenarios: VisualScenario[] = [
  {
    slug: "buildings-1",
    name: "scenarios.buildings1.name",
    description: "scenarios.buildings1.description",
    taskId: "build-skyline",
    randomSeed: true,
    setup(exercise) {
      (exercise as CityScapeSkylineExercise).setupNumBuildings(1);
    },
    expectations(exercise) {
      return skylineExpectations(exercise as CityScapeSkylineExercise, 1);
    }
  },
  {
    slug: "buildings-2",
    name: "scenarios.buildings2.name",
    description: "scenarios.buildings2.description",
    taskId: "build-skyline",
    randomSeed: true,
    setup(exercise) {
      (exercise as CityScapeSkylineExercise).setupNumBuildings(2);
    },
    expectations(exercise) {
      return skylineExpectations(exercise as CityScapeSkylineExercise, 2);
    }
  },
  {
    slug: "buildings-3",
    name: "scenarios.buildings3.name",
    description: "scenarios.buildings3.description",
    taskId: "build-skyline",
    randomSeed: true,
    setup(exercise) {
      (exercise as CityScapeSkylineExercise).setupNumBuildings(3);
    },
    expectations(exercise) {
      return skylineExpectations(exercise as CityScapeSkylineExercise, 3);
    }
  },
  {
    slug: "buildings-4",
    name: "scenarios.buildings4.name",
    description: "scenarios.buildings4.description",
    taskId: "build-skyline",
    randomSeed: true,
    setup(exercise) {
      (exercise as CityScapeSkylineExercise).setupNumBuildings(4);
    },
    expectations(exercise) {
      return skylineExpectations(exercise as CityScapeSkylineExercise, 4);
    }
  }
];
