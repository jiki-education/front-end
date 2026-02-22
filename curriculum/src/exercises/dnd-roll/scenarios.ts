import type { Task, VisualScenario, VisualTestExpect } from "../types";
import type DndRollExercise from "./Exercise";

export const tasks = [
  {
    id: "roll-and-strike" as const,
    name: "Roll the dice and strike the goblin",
    description:
      "Roll three dice (d20 for attack, d6 for base damage, d4 for bonus), announce each roll, then strike the goblin with your attack roll and total damage (base + bonus).",
    hints: [
      "Use roll(20) to roll the 20-sided die and store the result in a variable",
      "Each call to roll() gives back a different number that you need to save",
      "You need to call announce() three times, once for each roll",
      "The total damage is the sum of the d6 roll and the d4 roll"
    ],
    requiredScenarios: ["rolls-15-4-3"],
    bonus: false
  }
] as const satisfies readonly Task[];

function rollExpectations(exercise: DndRollExercise, expectedRolls: [number, number, number]): VisualTestExpect[] {
  const [attack, damage, bonus] = expectedRolls;
  const totalDamage = damage + bonus;

  return [
    {
      pass: exercise.announcements.length === 3,
      errorHtml: `Expected 3 announcements but got ${exercise.announcements.length}. Make sure you announce each roll.`
    },
    {
      pass: exercise.announcements[0] === attack,
      errorHtml: `Expected the first announcement to be ${attack} (the attack roll) but got ${exercise.announcements[0]}.`
    },
    {
      pass: exercise.announcements[1] === damage,
      errorHtml: `Expected the second announcement to be ${damage} (the base damage roll) but got ${exercise.announcements[1]}.`
    },
    {
      pass: exercise.announcements[2] === bonus,
      errorHtml: `Expected the third announcement to be ${bonus} (the bonus roll) but got ${exercise.announcements[2]}.`
    },
    {
      pass: exercise.struck === true,
      errorHtml: "You didn't strike the goblin. Make sure you call <code>strike()</code>."
    },
    {
      pass: exercise.strikeAttack === attack,
      errorHtml: `Expected the attack to be ${attack} but got ${exercise.strikeAttack}. Pass the attack roll to <code>strike()</code>.`
    },
    {
      pass: exercise.strikeDamage === totalDamage,
      errorHtml: `Expected total damage to be ${totalDamage} (${damage} + ${bonus}) but got ${exercise.strikeDamage}. Add the base damage and bonus together.`
    }
  ];
}

export const scenarios: VisualScenario[] = [
  {
    slug: "rolls-15-4-3",
    name: "Rolls: 15, 4, 3",
    description: "Attack roll is 15, base damage is 4, bonus is 3. Total damage should be 7.",
    taskId: "roll-and-strike",
    setup(exercise) {
      (exercise as DndRollExercise).setupRolls([15, 4, 3]);
    },
    expectations(exercise) {
      return rollExpectations(exercise as DndRollExercise, [15, 4, 3]);
    }
  }
];
