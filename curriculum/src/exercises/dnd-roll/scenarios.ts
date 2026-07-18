import type { Task, VisualScenario, VisualTestExpect } from "../types";
import type DndRollExercise from "./Exercise";

export const tasks = [
  {
    id: "roll-and-strike" as const,
    name: "tasks.rollAndStrike.name",
    description: "tasks.rollAndStrike.description",
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
      errorHtml: exercise.t("checks.announcementCount", { got: exercise.announcements.length })
    },
    {
      pass: exercise.announcements[0] === attack,
      errorHtml: exercise.t("checks.firstAnnouncement", { attack, got: exercise.announcements[0] })
    },
    {
      pass: exercise.announcements[1] === damage,
      errorHtml: exercise.t("checks.secondAnnouncement", { damage, got: exercise.announcements[1] })
    },
    {
      pass: exercise.announcements[2] === bonus,
      errorHtml: exercise.t("checks.thirdAnnouncement", { bonus, got: exercise.announcements[2] })
    },
    {
      pass: exercise.struck === true,
      errorHtml: exercise.t("checks.notStruck")
    },
    {
      pass: exercise.strikeAttack === attack,
      errorHtml: exercise.t("checks.wrongAttack", { attack, got: exercise.strikeAttack })
    },
    {
      pass: exercise.strikeDamage === totalDamage,
      errorHtml: exercise.t("checks.wrongDamage", { totalDamage, damage, bonus, got: exercise.strikeDamage })
    }
  ];
}

export const scenarios: VisualScenario[] = [
  {
    slug: "random-rolls",
    name: "scenarios.randomRolls.name",
    description: "scenarios.randomRolls.description",
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
