import type { Task, VisualScenario } from "../types";
import type CityScapeSkylineExercise from "./Exercise";

export const tasks = [
  {
    id: "build-skyline" as const,
    name: "Build the city skyline",
    description: "Build multiple buildings of random widths and heights to create a city skyline.",
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
  const rng = mulberry32(seed);
  const buildings: { width: number; floors: number }[] = [];
  for (let i = 0; i < numBuildings; i++) {
    // randomWidth: Math.floor(rng() * 3) * 2 + 3 gives 3, 5, or 7
    const width = Math.floor(rng() * 3) * 2 + 3;
    // randomNumFloors: Math.floor(rng() * 12) + 1 gives 1-12
    const floors = Math.floor(rng() * 12) + 1;
    buildings.push({ width, floors });
  }
  return buildings;
}

function skylineExpectations(exercise: CityScapeSkylineExercise, numBuildings: number) {
  const expectedBuildings = getExpectedBuildings(numBuildings, exercise.randomSeed!);
  const expects = [];

  // Check total cell count
  const expectedTotal = expectedBuildings.reduce((sum, b) => sum + (b.floors + 2) * b.width, 0);
  expects.push({
    pass: exercise.totalCells() === expectedTotal,
    errorHtml: `Expected ${expectedTotal} total cells but found ${exercise.totalCells()}.`
  });

  // Check each building's structure
  let x = 2;
  for (let b = 0; b < numBuildings; b++) {
    const { width, floors } = expectedBuildings[b];
    const entranceOffset = (width - 1) / 2;
    const roofY = floors + 3;

    // Ground floor: centered entrance
    expects.push({
      pass: exercise.hasCellAt(x + entranceOffset, 2, "entrance"),
      errorHtml: `Building ${b + 1}: Expected an entrance at (${x + entranceOffset}, 2).`
    });

    // Ground floor: walls at edges
    expects.push({
      pass: exercise.hasCellAt(x, 2, "wall") && exercise.hasCellAt(x + width - 1, 2, "wall"),
      errorHtml: `Building ${b + 1}: Expected walls at (${x}, 2) and (${x + width - 1}, 2).`
    });

    // Roof: all walls
    for (let c = 0; c < width; c++) {
      expects.push({
        pass: exercise.hasCellAt(x + c, roofY, "wall"),
        errorHtml: `Building ${b + 1}: Expected a wall on the roof at (${x + c}, ${roofY}).`
      });
    }

    x += width + 1;
  }

  return expects;
}

export const scenarios: VisualScenario[] = [
  {
    slug: "buildings-1",
    name: "1 building",
    description: "Build a single building with random width and height.",
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
    name: "2 buildings",
    description: "Build 2 buildings with random widths and heights.",
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
    name: "3 buildings",
    description: "Build 3 buildings with random widths and heights.",
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
    name: "4 buildings",
    description: "Build 4 buildings with random widths and heights.",
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
