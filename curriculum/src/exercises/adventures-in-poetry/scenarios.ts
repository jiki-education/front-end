import type { CodeCheck, Task, VisualScenario } from "../types";
import type AdventuresInPoetryExercise from "./Exercise";

// The guard-clause shape is what this exercise teaches, and `continue` is never
// forced by semantics alone — anything written with it can be rewritten as a
// wrapping `if`. Three rules together leave the flat guard list as the only
// shape that fits:
//   - no `&&`/`||`, so the skip conditions can't collapse into one condition
//   - no nesting past the loop and one `if`, so they can't stack up instead
//   - no user-defined functions, so the body can't be moved somewhere the
//     nesting counter starts again from zero
//
// TODO: `countNestingDepth() <= 2` is still to be added to the interpreter
// assertors. Until it lands the sibling-`if` shape passes these checks, so the
// guard list is taught but not yet enforced.
const styleChecks: CodeCheck[] = [
  {
    pass: (result, language) => {
      const and = language === "javascript" ? "&&" : "and";
      const or = language === "javascript" ? "||" : "or";
      return !result.assertors.assertOperatorUsed(and) && !result.assertors.assertOperatorUsed(or);
    },
    errorKey: "checks.noLogicalOperators"
  },
  {
    pass: (result) => result.assertors.countFunctionDefinitions() === 0,
    errorKey: "checks.noFunctions"
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

export const tasks = [
  {
    id: "collect-the-poem" as const,
    name: "tasks.collectThePoem.name",
    description: "tasks.collectThePoem.description",
    hints: [],
    requiredScenarios: ["not-lost", "hope", "wandered", "mists", "hope-continued", "highlands", "tyger", "pleure"],
    bonus: false
  }
] as const satisfies readonly Task[];

// Each scenario is a row of squares. "" is bare grass, 🏁 ends the walk, other
// emoji are scenery, and everything else is a piece of the poem.
interface PoemScenario {
  slug: string;
  track: string[];
  expected: string;
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
    slug: "tyger",
    track: ["Tyger", "Tyger", ",", "", "burning", "bright", "🏁"],
    expected: "Tyger Tyger, burning bright"
  },
  {
    slug: "pleure",
    track: ["", "", "Il", "pleure", "", "dans", "mon", "cœur", "🏁"],
    expected: "Il pleure dans mon cœur"
  }
];

export const scenarios: VisualScenario[] = poemScenarios.map(({ slug, track, expected }) => {
  const camelSlug = slug.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());

  return {
    slug,
    name: `scenarios.${camelSlug}.name`,
    description: `scenarios.${camelSlug}.description`,
    taskId: "collect-the-poem",
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
    codeChecks: styleChecks
  };
});
