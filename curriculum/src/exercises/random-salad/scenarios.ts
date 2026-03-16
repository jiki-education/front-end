import type { Task, VisualScenario } from "../types";
import type RandomSaladExercise from "./Exercise";

export const tasks = [
  {
    id: "make-random-salad" as const,
    name: "Make a random salad",
    description: "Generate a random amount of each ingredient using Math.randomInt() and make the salad.",
    hints: [],
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
  const leaves = randomInt(40, 100);
  const tomatoes = randomInt(5, Math.floor(leaves / 5));
  const croutons = randomInt(tomatoes, tomatoes * 2);
  const olives = randomInt(1, Math.floor(tomatoes / 2));
  return { leaves, tomatoes, croutons, olives };
}

export const scenarios: VisualScenario[] = [
  {
    slug: "random-salad",
    name: "Random salad",
    description: "Make a salad with random amounts of each ingredient.",
    taskId: "make-random-salad",
    randomSeed: true,
    setup(exercise) {
      const ex = exercise as RandomSaladExercise;
      ex.setupBackground("/static/images/exercise-assets/random-salad/plate.png");
    },
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
          errorHtml: `We expected ${expected.leaves} leaves in the salad, but you only put in ${ex.saladLeaves}. Your partner won't be happy! Check your ranges.`
        },
        {
          pass: ex.saladTomatoes === expected.tomatoes,
          errorHtml: `We expected ${expected.tomatoes} tomatoes in the salad, but you only put in ${ex.saladTomatoes}. Your partner won't be happy! Check your ranges.`
        },
        {
          pass: ex.saladCroutons === expected.croutons,
          errorHtml: `We expected ${expected.croutons} croutons in the salad, but you only put in ${ex.saladCroutons}. Your partner won't be happy! Check your ranges.`
        },
        {
          pass: ex.saladOlives === expected.olives,
          errorHtml: `We expected ${expected.olives} olives in the salad, but you only put in ${ex.saladOlives}. Your partner won't be happy! Check your ranges.`
        }
      ];
    }
  }
];
