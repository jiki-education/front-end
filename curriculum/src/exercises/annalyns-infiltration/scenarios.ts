import type { Task, VisualScenario } from "../types";
import type AnnalynsInfiltrationExercise from "./Exercise";

const IMAGE_BASE = "/static/images/exercise-assets/annalyns-infiltration";

export const tasks = [
  {
    id: "plan-the-rescue" as const,
    name: "Plan the rescue",
    description:
      "For each camp, perform every action Annalyn can safely take: fast attack if the knight is asleep, spy if at least one of them is awake, signal the prisoner if the prisoner is awake and the archer asleep, and free the prisoner via either the behaving-dog route or the sneaky route.",
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

function actionExpectation(
  count: number,
  shouldDo: boolean,
  actionLabel: string,
  shouldMsg: string,
  shouldNotMsg: string
) {
  if (shouldDo) {
    if (count === 0) {
      return { pass: false, errorHtml: shouldMsg };
    }
    if (count > 1) {
      return {
        pass: false,
        errorHtml: `Annalyn <strong>should</strong> only ${actionLabel} once here, but she did it ${count} times.`
      };
    }
    return { pass: true, errorHtml: "" };
  }
  return {
    pass: count === 0,
    errorHtml: shouldNotMsg
  };
}

function buildExpectations(exercise: AnnalynsInfiltrationExercise, expected: ExpectedActions) {
  return [
    actionExpectation(
      exercise.fastAttackCount,
      expected.fastAttack,
      "fast attack",
      "Annalyn <strong>should</strong> make a fast attack here, but she didn't. The knight is asleep, so she can strike before he wakes.",
      "Annalyn <strong>should not</strong> make a fast attack here. The knight is awake, so attacking would get her caught."
    ),
    actionExpectation(
      exercise.spyCount,
      expected.spy,
      "spy",
      "Annalyn <strong>should</strong> spy here, but she didn't. At least one person in the camp is awake, so there's something to watch.",
      "Annalyn <strong>should not</strong> spy here. Everyone is asleep, so there's nothing to learn."
    ),
    actionExpectation(
      exercise.signalCount,
      expected.signal,
      "signal the prisoner",
      "Annalyn <strong>should</strong> signal the prisoner here, but she didn't. The prisoner is awake and the archer is asleep, so the signal will get through.",
      "Annalyn <strong>should not</strong> signal the prisoner here. Either the prisoner is asleep or the archer is awake, so signalling would fail."
    ),
    actionExpectation(
      exercise.freeCount,
      expected.free,
      "free the prisoner",
      "Annalyn <strong>should</strong> free the prisoner here, but she didn't. She can do it here without getting caught.",
      "Annalyn <strong>should not</strong> try to free the prisoner here. She'd get caught."
    )
  ];
}

export const scenarios: VisualScenario[] = [
  {
    slug: "all-asleep-naughty-dog",
    name: "Everyone asleep, dog misbehaving",
    description: "The whole camp is asleep, but Annalyn's dog is misbehaving so it's no help.",
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
    name: "Everyone asleep, dog behaving",
    description: "The whole camp is asleep and Annalyn's dog is behaving itself.",
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
    name: "Only the knight is awake",
    description: "The knight is on watch while the archer and prisoner sleep. The dog is misbehaving.",
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
    name: "Only the prisoner is awake",
    description:
      "Both kidnappers sleep while the prisoner lies awake. The dog is misbehaving — the sneaky route is open.",
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
    name: "Archer and prisoner awake",
    description: "The archer is on watch and the prisoner is awake too. The dog is behaving.",
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
    name: "Everyone awake, dog behaving",
    description: "The whole camp is wide awake. Even with the dog behaving, freeing isn't safe.",
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
