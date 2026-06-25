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
      return buildExpectations(
        exercise as AnnalynsInfiltrationExercise,
        { fastAttack: true, spy: false, signal: false, free: false },
        "Everyone is asleep and the dog is misbehaving."
      );
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
      return buildExpectations(
        exercise as AnnalynsInfiltrationExercise,
        { fastAttack: true, spy: false, signal: false, free: true },
        "Everyone is asleep and the dog is behaving."
      );
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
      return buildExpectations(
        exercise as AnnalynsInfiltrationExercise,
        { fastAttack: false, spy: true, signal: false, free: false },
        "Only the knight is awake, and the dog is misbehaving."
      );
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
      return buildExpectations(
        exercise as AnnalynsInfiltrationExercise,
        { fastAttack: true, spy: true, signal: true, free: true },
        "Only the prisoner is awake, and the dog is misbehaving."
      );
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
      return buildExpectations(
        exercise as AnnalynsInfiltrationExercise,
        { fastAttack: true, spy: true, signal: false, free: false },
        "The archer and prisoner are awake, and the dog is behaving."
      );
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
      return buildExpectations(
        exercise as AnnalynsInfiltrationExercise,
        { fastAttack: false, spy: true, signal: false, free: false },
        "Everyone is awake, even though the dog is behaving."
      );
    }
  }
];
