import type { Task, VisualScenario, VisualTestExpect } from "../types";
import type DndRollExercise from "./Exercise";

export const tasks = [
  {
    id: "roll-and-strike" as const,
    name: "Roll the dice and strike the goblin",
    description:
      "Roll three dice (d20 for attack, d12 for base damage, d10 for bonus), announce each roll, then strike the goblin with your attack roll and total damage (base + bonus).",
    hints: [],
    requiredScenarios: ["random-rolls"],
    bonus: false
  }
] as const satisfies readonly Task[];

function rollExpectations(exercise: DndRollExercise): VisualTestExpect[] {
  const attack = exercise.initialRolls[20];
  const damage = exercise.initialRolls[12];
  const bonus = exercise.initialRolls[10];
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
    slug: "random-rolls",
    name: "Roll and strike",
    description:
      "Roll d20 for attack, d12 for base damage, d10 for bonus. Strike the goblin with your attack and total damage.",
    taskId: "roll-and-strike",
    setup(exercise) {
      (exercise as DndRollExercise).setupRolls({
        20: Math.floor(Math.random() * 20) + 1,
        12: Math.floor(Math.random() * 12) + 1,
        10: Math.floor(Math.random() * 10) + 1
      });
    },
    expectations(exercise) {
      return rollExpectations(exercise as DndRollExercise);
    }
  }
];
