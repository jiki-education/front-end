import type { Task, VisualScenario } from "../types";
import type CityScapeSkylineExercise from "./Exercise";

export const tasks = [
  {
    id: "build-skyline" as const,
    name: "Build the city skyline",
    description: "Build multiple buildings of random heights to create a city skyline.",
    hints: [
      "Use numBuildings() to find out how many buildings to create",
      "Track x position starting at 1, adding 5 for each building",
      "Use a random number for the number of upper floors per building",
      "Each building has a ground floor, some upper floors, and a roof"
    ],
    requiredScenarios: ["buildings-1", "buildings-2", "buildings-3", "buildings-4", "buildings-6"],
    bonus: false
  }
] as const satisfies readonly Task[];

// Pre-compute expected floors per building using the same mulberry32 PRNG
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

function getExpectedFloors(numBuildings: number, seed: number): number[] {
  const rng = mulberry32(seed);
  const floors: number[] = [];
  for (let i = 0; i < numBuildings; i++) {
    // randomInt(0, 6) = Math.floor(rng() * (6 - 0 + 1)) + 0
    floors.push(Math.floor(rng() * 7));
  }
  return floors;
}

function skylineExpectations(exercise: CityScapeSkylineExercise, numBuildings: number, seed: number) {
  const expectedFloors = getExpectedFloors(numBuildings, seed);
  const expects = [];

  // Check total cell count
  const expectedTotal = expectedFloors.reduce((sum, floors) => sum + (floors + 2) * 5, 0);
  expects.push({
    pass: exercise.totalCells() === expectedTotal,
    errorHtml: `Expected ${expectedTotal} total cells but found ${exercise.totalCells()}.`
  });

  // Check each building's structure
  let x = 1;
  for (let b = 0; b < numBuildings; b++) {
    const floors = expectedFloors[b];
    const roofY = floors + 2;

    // Ground floor: entrance at x+2
    expects.push({
      pass: exercise.hasCellAt(x + 2, 1, "entrance"),
      errorHtml: `Building ${b + 1}: Expected an entrance at (${x + 2}, 1).`
    });

    // Ground floor: walls at sides
    expects.push({
      pass: exercise.hasCellAt(x, 1, "wall") && exercise.hasCellAt(x + 4, 1, "wall"),
      errorHtml: `Building ${b + 1}: Expected walls at (${x}, 1) and (${x + 4}, 1).`
    });

    // Roof: all walls
    expects.push({
      pass:
        exercise.hasCellAt(x, roofY, "wall") &&
        exercise.hasCellAt(x + 1, roofY, "wall") &&
        exercise.hasCellAt(x + 2, roofY, "wall") &&
        exercise.hasCellAt(x + 3, roofY, "wall") &&
        exercise.hasCellAt(x + 4, roofY, "wall"),
      errorHtml: `Building ${b + 1}: Expected all walls on the roof at y=${roofY}.`
    });

    x += 5;
  }

  return expects;
}

export const scenarios: VisualScenario[] = [
  {
    slug: "buildings-1",
    name: "1 building",
    description: "Build a single building with random height.",
    taskId: "build-skyline",
    randomSeed: 42,
    setup(exercise) {
      (exercise as CityScapeSkylineExercise).setupNumBuildings(1);
    },
    expectations(exercise) {
      return skylineExpectations(exercise as CityScapeSkylineExercise, 1, 42);
    }
  },
  {
    slug: "buildings-2",
    name: "2 buildings",
    description: "Build 2 buildings with random heights.",
    taskId: "build-skyline",
    randomSeed: 123,
    setup(exercise) {
      (exercise as CityScapeSkylineExercise).setupNumBuildings(2);
    },
    expectations(exercise) {
      return skylineExpectations(exercise as CityScapeSkylineExercise, 2, 123);
    }
  },
  {
    slug: "buildings-3",
    name: "3 buildings",
    description: "Build 3 buildings with random heights.",
    taskId: "build-skyline",
    randomSeed: 777,
    setup(exercise) {
      (exercise as CityScapeSkylineExercise).setupNumBuildings(3);
    },
    expectations(exercise) {
      return skylineExpectations(exercise as CityScapeSkylineExercise, 3, 777);
    }
  },
  {
    slug: "buildings-4",
    name: "4 buildings",
    description: "Build 4 buildings with random heights.",
    taskId: "build-skyline",
    randomSeed: 2024,
    setup(exercise) {
      (exercise as CityScapeSkylineExercise).setupNumBuildings(4);
    },
    expectations(exercise) {
      return skylineExpectations(exercise as CityScapeSkylineExercise, 4, 2024);
    }
  },
  {
    slug: "buildings-6",
    name: "6 buildings",
    description: "Build 6 buildings filling the grid.",
    taskId: "build-skyline",
    randomSeed: 9999,
    setup(exercise) {
      (exercise as CityScapeSkylineExercise).setupNumBuildings(6);
    },
    expectations(exercise) {
      return skylineExpectations(exercise as CityScapeSkylineExercise, 6, 9999);
    }
  }
];
