import type { Task, VisualScenario } from "../types";
import type AnnalynsInfiltrationExercise from "./Exercise";

export const tasks = [
  {
    id: "plan-the-rescue" as const,
    name: "Plan the rescue",
    description:
      "For each camp, perform every action Annalyn can safely take: fast attack if the knight is asleep, spy if at least one of them is awake, signal the prisoner if the prisoner is awake and the archer asleep, and free the prisoner via either the dog route or the sneaky route.",
    hints: [],
    requiredScenarios: [
      "all-asleep-no-dog",
      "all-asleep-with-dog",
      "knight-awake-no-dog",
      "prisoner-awake-no-dog",
      "archer-and-prisoner-awake-no-dog",
      "all-awake-with-dog"
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

function buildExpectations(exercise: AnnalynsInfiltrationExercise, expected: ExpectedActions, camp: string) {
  return [
    {
      pass: exercise.didFastAttack === expected.fastAttack,
      errorHtml: expected.fastAttack
        ? `${camp} The knight is asleep, so Annalyn should make a <strong>fast attack</strong> — but she didn't.`
        : `${camp} The knight is awake, so a <strong>fast attack</strong> would fail — Annalyn should NOT attack here.`
    },
    {
      pass: exercise.didSpy === expected.spy,
      errorHtml: expected.spy
        ? `${camp} At least one of them is awake, so Annalyn should <strong>spy</strong> — but she didn't.`
        : `${camp} Everyone is asleep, so spying is a waste of time — Annalyn should NOT <strong>spy</strong> here.`
    },
    {
      pass: exercise.didSignal === expected.signal,
      errorHtml: expected.signal
        ? `${camp} The prisoner is awake and the archer asleep, so Annalyn should <strong>signal the prisoner</strong> — but she didn't.`
        : `${camp} The conditions for signalling aren't met, so Annalyn should NOT <strong>signal the prisoner</strong> here.`
    },
    {
      pass: exercise.didFree === expected.free,
      errorHtml: expected.free
        ? `${camp} Annalyn has a safe way to <strong>free the prisoner</strong> here — but she didn't take it.`
        : `${camp} There's no safe way to <strong>free the prisoner</strong> here, so Annalyn should NOT try.`
    }
  ];
}

export const scenarios: VisualScenario[] = [
  {
    slug: "all-asleep-no-dog",
    name: "Everyone asleep, no dog",
    description: "The whole camp is asleep and Annalyn left her dog at home.",
    taskId: "plan-the-rescue",
    setup(exercise) {
      (exercise as AnnalynsInfiltrationExercise).setupCamp(false, false, false, false);
    },
    expectations(exercise) {
      return buildExpectations(
        exercise as AnnalynsInfiltrationExercise,
        { fastAttack: true, spy: false, signal: false, free: false },
        "Everyone is asleep and there's no dog."
      );
    }
  },
  {
    slug: "all-asleep-with-dog",
    name: "Everyone asleep, with dog",
    description: "The whole camp is asleep and Annalyn brought her dog.",
    taskId: "plan-the-rescue",
    setup(exercise) {
      (exercise as AnnalynsInfiltrationExercise).setupCamp(false, false, false, true);
    },
    expectations(exercise) {
      return buildExpectations(
        exercise as AnnalynsInfiltrationExercise,
        { fastAttack: true, spy: false, signal: false, free: true },
        "Everyone is asleep and the dog is here."
      );
    }
  },
  {
    slug: "knight-awake-no-dog",
    name: "Only the knight is awake",
    description: "The knight is on watch while the archer and prisoner sleep. No dog.",
    taskId: "plan-the-rescue",
    setup(exercise) {
      (exercise as AnnalynsInfiltrationExercise).setupCamp(true, false, false, false);
    },
    expectations(exercise) {
      return buildExpectations(
        exercise as AnnalynsInfiltrationExercise,
        { fastAttack: false, spy: true, signal: false, free: false },
        "Only the knight is awake, and there's no dog."
      );
    }
  },
  {
    slug: "prisoner-awake-no-dog",
    name: "Only the prisoner is awake",
    description: "Both kidnappers sleep while the prisoner lies awake. No dog — the sneaky route is open.",
    taskId: "plan-the-rescue",
    setup(exercise) {
      (exercise as AnnalynsInfiltrationExercise).setupCamp(false, false, true, false);
    },
    expectations(exercise) {
      return buildExpectations(
        exercise as AnnalynsInfiltrationExercise,
        { fastAttack: true, spy: true, signal: true, free: true },
        "Only the prisoner is awake, and there's no dog."
      );
    }
  },
  {
    slug: "archer-and-prisoner-awake-no-dog",
    name: "Archer and prisoner awake",
    description: "The archer is on watch and the prisoner is awake too. No dog.",
    taskId: "plan-the-rescue",
    setup(exercise) {
      (exercise as AnnalynsInfiltrationExercise).setupCamp(false, true, true, false);
    },
    expectations(exercise) {
      return buildExpectations(
        exercise as AnnalynsInfiltrationExercise,
        { fastAttack: true, spy: true, signal: false, free: false },
        "The archer and prisoner are awake, and there's no dog."
      );
    }
  },
  {
    slug: "all-awake-with-dog",
    name: "Everyone awake, with dog",
    description: "The whole camp is wide awake. Even with the dog, freeing isn't safe.",
    taskId: "plan-the-rescue",
    setup(exercise) {
      (exercise as AnnalynsInfiltrationExercise).setupCamp(true, true, true, true);
    },
    expectations(exercise) {
      return buildExpectations(
        exercise as AnnalynsInfiltrationExercise,
        { fastAttack: false, spy: true, signal: false, free: false },
        "Everyone is awake, even though the dog is here."
      );
    }
  }
];
