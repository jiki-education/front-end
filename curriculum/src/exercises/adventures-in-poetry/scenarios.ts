import type { CodeCheck, Task, VisualScenario } from "../types";
import type AdventuresInPoetryExercise from "./Exercise";

// The guard-clause shape is what this exercise teaches, and `continue` is never
// forced by semantics alone — anything written with it can be rewritten as a
// wrapping `if`. Three rules together leave the flat guard list as the only
// shape that fits:
//   - no `&&`, so the skip conditions can't collapse into one condition, and
//     no `!`, because `!(a || b)` is `a && b` by De Morgan and would hand the
//     ban straight back. `||` on its own is allowed, and with it the guard list
//     is the SHORTEST correct solution (27 lines against 29 for a
//     flag-and-sibling-ifs version), so the shape is reached by tidying rather
//     than forced. The De Morgan route is narrowed rather than closed:
//     `(a || b) === false` is the same trick without the operator.
//
// `continue` and `break` are also required outright, and the solution is held
// to its own line count, so the flat guard list is both the required shape and
// a tight one.
//   - no nesting past the loop and one `if`, so they can't stack up instead
//   - no user-defined functions, so the body can't be moved somewhere the
//     nesting counter starts again from zero
//
// Together these leave the flat guard list as the only shape that fits, so
// `continue` and `break` are arrived at rather than demanded by name.
const styleChecks: CodeCheck[] = [
  {
    pass: (result, language) => {
      const and = language === "javascript" ? "&&" : "and";
      const not = language === "javascript" ? "!" : "not";
      return !result.assertors.assertOperatorUsed(and) && !result.assertors.assertOperatorUsed(not);
    },
    errorKey: "checks.noAndOrNot"
  },
  {
    pass: (result) => result.assertors.countFunctionDefinitions() === 0,
    errorKey: "checks.noFunctions"
  },
  {
    pass: (result) => result.assertors.countNestingDepth() <= 2,
    errorKey: "checks.tooDeeplyNested"
  },
  {
    pass: (result) => result.assertors.assertStatement("ContinueStatement"),
    errorKey: "checks.needsContinue"
  },
  {
    pass: (result) => result.assertors.assertStatement("BreakStatement"),
    errorKey: "checks.needsBreak"
  },
  {
    pass: (result) => result.assertors.numFunctionCallsInCode("recite") === 1,
    errorKey: "checks.reciteOnce"
  }
];

// Bonus only: reward getting the guard list tight. Each language's limit is its
// own canonical solution's line count.
const lineCountCheck: CodeCheck[] = [
  {
    pass: (result, language) => {
      const limit = language === "python" ? 25 : language === "jikiscript" ? 33 : 32;
      return result.assertors.assertMaxLinesOfCode(limit);
    },
    errorKey: "checks.tooManyLines"
  }
];

export const tasks = [
  {
    id: "collect-the-poem" as const,
    name: "tasks.collectThePoem.name",
    description: "tasks.collectThePoem.description",
    hints: [],
    requiredScenarios: [
      "not-lost",
      "hope",
      "wandered",
      "mists",
      "hope-continued",
      "highlands",
      "heart-scenery",
      "tyger",
      "pleure"
    ],
    bonus: false
  },
  {
    id: "solve-tightly" as const,
    name: "tasks.solveTightly.name",
    description: "tasks.solveTightly.description",
    hints: [],
    requiredScenarios: ["yasegaeru"],
    bonus: true
  }
] as const satisfies readonly Task[];

// Each scenario is a row of squares. "" is bare grass, 🏁 ends the walk, other
// emoji are scenery, and everything else is a piece of the poem.
interface PoemScenario {
  slug: string;
  track: string[];
  expected: string;
  taskId?: string;
  extraChecks?: CodeCheck[];
}

const poemScenarios: PoemScenario[] = [
  {
    slug: "not-lost",
    track: ["Not", "", "all", "those", "", "who", "wander", "are", "lost", "🏁"],
    expected: "Not all those who wander are lost"
  },
  {
    slug: "hope",
    track: ["Hope", "", "is", "the", "", "thing", "with", "", "feathers", "🏁"],
    expected: "Hope is the thing with feathers"
  },
  {
    slug: "wandered",
    track: ["I", "🌿", "wandered", "", "lonely", "🐛", "as", "a", "🍄", "cloud", "🏁"],
    expected: "I wandered lonely as a cloud"
  },
  {
    slug: "mists",
    track: ["Season", "of", "", "mists", "🦋", "and", "mellow", "", "fruitfulness", "🌿", "🏁"],
    expected: "Season of mists and mellow fruitfulness"
  },
  {
    slug: "hope-continued",
    track: ["Hope", "is", "the", "thing", "with", "feathers", "that", "perches", "in", "the", "soul", "🏁"],
    expected: "Hope is the thing with feathers that"
  },
  {
    slug: "highlands",
    track: ["My", "heart", "'", "s", "", "in", "the", "Highlands", "🏁"],
    expected: "My heart's in the Highlands"
  },
  {
    slug: "heart-scenery",
    track: ["My", "heart", "'", "🍄", "s", "", "in", "the", "Highlands", "🏁"],
    expected: "My heart's in the Highlands"
  },
  {
    slug: "tyger",
    track: ["Tyger", "Tyger", ",", "", "burning", "bright", "🏁"],
    expected: "Tyger Tyger, burning bright"
  },
  {
    slug: "pleure",
    track: ["", "", "Il", "pleure", "", "dans", "mon", "cœur", "🏁"],
    expected: "Il pleure dans mon cœur"
  },
  {
    slug: "yasegaeru",
    track: ["Yasegaeru", "", "makeru", "na", "🐛", "Issa", "kore", "ni", "ari", "🏁"],
    expected: "Yasegaeru makeru na Issa kore ni ari",
    taskId: "solve-tightly",
    extraChecks: lineCountCheck
  }
];

export const scenarios: VisualScenario[] = poemScenarios.map(({ slug, track, expected, taskId, extraChecks }) => {
  const camelSlug = slug.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());

  return {
    slug,
    name: `scenarios.${camelSlug}.name`,
    description: `scenarios.${camelSlug}.description`,
    taskId: taskId ?? "collect-the-poem",
    setup(exercise) {
      (exercise as AdventuresInPoetryExercise).setupTrack(track);
    },
    expectations(exercise) {
      const ex = exercise as AdventuresInPoetryExercise;
      return [
        {
          pass: ex.recited,
          errorHtml: exercise.t("checks.notRecited")
        },
        {
          pass: ex.recitedPoem === expected,
          errorHtml: exercise.t("checks.wrongPoem", {
            expected,
            got: ex.recitedPoem ?? ""
          })
        }
      ];
    },
    codeChecks: extraChecks ? [...styleChecks, ...extraChecks] : styleChecks
  };
});
