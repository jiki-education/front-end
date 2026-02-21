import type { Task, VisualScenario } from "../types";
import type RandomSaladExercise from "./Exercise";

export const tasks = [
  {
    id: "make-random-salad" as const,
    name: "Make a random salad",
    description: "Generate a random amount of each ingredient using Math.randomInt() and make the salad.",
    hints: [
      "Use Math.randomInt(20, 100) for the number of leaves",
      "Use Math.randomInt(5, 20) for the number of tomatoes",
      "Use Math.randomInt(10, 50) for the number of croutons",
      "Use Math.randomInt(1, 10) for the amount of dressing"
    ],
    requiredScenarios: ["random-salad"],
    bonus: false
  }
] as const satisfies readonly Task[];

function mulberry32(seed: number): () => number {
  let state = seed | 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function getExpectedIngredients(seed: number) {
  const rng = mulberry32(seed);
  const randomInt = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min;
  return {
    leaves: randomInt(20, 100),
    tomatoes: randomInt(5, 20),
    croutons: randomInt(10, 50),
    dressing: randomInt(1, 10)
  };
}

export const scenarios: VisualScenario[] = [
  {
    slug: "random-salad",
    name: "Random salad",
    description: "Make a salad with random amounts of each ingredient.",
    taskId: "make-random-salad",
    randomSeed: true,
    expectations(exercise) {
      const ex = exercise as RandomSaladExercise;
      const expected = getExpectedIngredients(exercise.randomSeed!);
      return [
        {
          pass: ex.saladMade === true,
          errorHtml: "You didn't make the salad. Make sure you call <code>makeSalad()</code> with all four ingredients."
        },
        {
          pass: ex.saladLeaves === expected.leaves,
          errorHtml: `Expected ${expected.leaves} leaves but got ${ex.saladLeaves}. Use <code>Math.randomInt(20, 100)</code> for the leaves.`
        },
        {
          pass: ex.saladTomatoes === expected.tomatoes,
          errorHtml: `Expected ${expected.tomatoes} tomatoes but got ${ex.saladTomatoes}. Use <code>Math.randomInt(5, 20)</code> for the tomatoes.`
        },
        {
          pass: ex.saladCroutons === expected.croutons,
          errorHtml: `Expected ${expected.croutons} croutons but got ${ex.saladCroutons}. Use <code>Math.randomInt(10, 50)</code> for the croutons.`
        },
        {
          pass: ex.saladDressing === expected.dressing,
          errorHtml: `Expected ${expected.dressing} spoonfuls of dressing but got ${ex.saladDressing}. Use <code>Math.randomInt(1, 10)</code> for the dressing.`
        }
      ];
    }
  }
];
