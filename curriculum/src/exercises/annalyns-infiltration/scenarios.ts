import type { Task, VisualScenario, VisualTestExpect } from "../types";
import type AnnalynsInfiltrationExercise from "./Exercise";

const IMAGE_BASE = "/static/images/exercise-assets/annalyns-infiltration";

export const tasks = [
  {
    id: "plan-the-rescue" as const,
    name: "tasks.planTheRescue.name",
    description: "tasks.planTheRescue.description",
    hints: [],
    requiredScenarios: [
      "all-asleep-naughty-dog",
      "all-asleep-behaving-dog",
      "knight-awake-naughty-dog",
      "prisoner-awake-naughty-dog",
      "archer-and-prisoner-awake-behaving-dog",
      "all-awake-behaving-dog"
    ],
    bonus: false
  }
] as const satisfies readonly Task[];

interface ExpectedActions {
  fastAttack: boolean;
  spy: boolean;
  signal: boolean;
  free: boolean;
}

type ActionKey = "fastAttack" | "spy" | "signal" | "free";

function actionExpectation(
  exercise: AnnalynsInfiltrationExercise,
  count: number,
  shouldDo: boolean,
  actionKey: ActionKey
): VisualTestExpect {
  if (shouldDo) {
    if (count === 0) {
      return { pass: false, errorHtml: exercise.t(`checks.${actionKey}.should`) };
    }
    if (count > 1) {
      return {
        pass: false,
        errorHtml: exercise.t(`checks.${actionKey}.tooMany`, { count })
      };
    }
    return { pass: true, errorHtml: "" };
  }
  return {
    pass: count === 0,
    errorHtml: exercise.t(`checks.${actionKey}.shouldNot`)
  };
}

function buildExpectations(exercise: AnnalynsInfiltrationExercise, expected: ExpectedActions) {
  return [
    actionExpectation(exercise, exercise.fastAttackCount, expected.fastAttack, "fastAttack"),
    actionExpectation(exercise, exercise.spyCount, expected.spy, "spy"),
    actionExpectation(exercise, exercise.signalCount, expected.signal, "signal"),
    actionExpectation(exercise, exercise.freeCount, expected.free, "free")
  ];
}

export const scenarios: VisualScenario[] = [
  {
    slug: "all-asleep-naughty-dog",
    name: "scenarios.allAsleepNaughtyDog.name",
    description: "scenarios.allAsleepNaughtyDog.description",
    taskId: "plan-the-rescue",
    setup(exercise) {
      const ex = exercise as AnnalynsInfiltrationExercise;
      ex.setupCamp(false, false, false, false);
      ex.setupBackground(`${IMAGE_BASE}/all-asleep-naughty-dog.webp`);
    },
    expectations(exercise) {
      return buildExpectations(exercise as AnnalynsInfiltrationExercise, {
        fastAttack: true,
        spy: false,
        signal: false,
        free: false
      });
    }
  },
  {
    slug: "all-asleep-behaving-dog",
    name: "scenarios.allAsleepBehavingDog.name",
    description: "scenarios.allAsleepBehavingDog.description",
    taskId: "plan-the-rescue",
    setup(exercise) {
      const ex = exercise as AnnalynsInfiltrationExercise;
      ex.setupCamp(false, false, false, true);
      ex.setupBackground(`${IMAGE_BASE}/all-asleep-behaving-dog.webp`);
    },
    expectations(exercise) {
      return buildExpectations(exercise as AnnalynsInfiltrationExercise, {
        fastAttack: true,
        spy: false,
        signal: false,
        free: true
      });
    }
  },
  {
    slug: "knight-awake-naughty-dog",
    name: "scenarios.knightAwakeNaughtyDog.name",
    description: "scenarios.knightAwakeNaughtyDog.description",
    taskId: "plan-the-rescue",
    setup(exercise) {
      const ex = exercise as AnnalynsInfiltrationExercise;
      ex.setupCamp(true, false, false, false);
      ex.setupBackground(`${IMAGE_BASE}/knight-awake-naughty-dog.webp`);
    },
    expectations(exercise) {
      return buildExpectations(exercise as AnnalynsInfiltrationExercise, {
        fastAttack: false,
        spy: true,
        signal: false,
        free: false
      });
    }
  },
  {
    slug: "prisoner-awake-naughty-dog",
    name: "scenarios.prisonerAwakeNaughtyDog.name",
    description: "scenarios.prisonerAwakeNaughtyDog.description",
    taskId: "plan-the-rescue",
    setup(exercise) {
      const ex = exercise as AnnalynsInfiltrationExercise;
      ex.setupCamp(false, false, true, false);
      ex.setupBackground(`${IMAGE_BASE}/prisoner-awake-naughty-dog.webp`);
    },
    expectations(exercise) {
      return buildExpectations(exercise as AnnalynsInfiltrationExercise, {
        fastAttack: true,
        spy: true,
        signal: true,
        free: true
      });
    }
  },
  {
    slug: "archer-and-prisoner-awake-behaving-dog",
    name: "scenarios.archerAndPrisonerAwakeBehavingDog.name",
    description: "scenarios.archerAndPrisonerAwakeBehavingDog.description",
    taskId: "plan-the-rescue",
    setup(exercise) {
      const ex = exercise as AnnalynsInfiltrationExercise;
      ex.setupCamp(false, true, true, true);
      ex.setupBackground(`${IMAGE_BASE}/archer-and-prisoner-awake-behaving-dog.webp`);
    },
    expectations(exercise) {
      return buildExpectations(exercise as AnnalynsInfiltrationExercise, {
        fastAttack: true,
        spy: true,
        signal: false,
        free: false
      });
    }
  },
  {
    slug: "all-awake-behaving-dog",
    name: "scenarios.allAwakeBehavingDog.name",
    description: "scenarios.allAwakeBehavingDog.description",
    taskId: "plan-the-rescue",
    setup(exercise) {
      const ex = exercise as AnnalynsInfiltrationExercise;
      ex.setupCamp(true, true, true, true);
      ex.setupBackground(`${IMAGE_BASE}/all-awake-behaving-dog.webp`);
    },
    expectations(exercise) {
      return buildExpectations(exercise as AnnalynsInfiltrationExercise, {
        fastAttack: false,
        spy: true,
        signal: false,
        free: false
      });
    }
  }
];
