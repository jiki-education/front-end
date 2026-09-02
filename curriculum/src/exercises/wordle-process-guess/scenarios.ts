import { expectRowStates } from "../../exercise-categories/wordle/expectRowStates";
import type { Task, VisualScenario } from "../types";
import type ProcessGuessExercise from "./Exercise";

export const tasks = [
  {
    id: "process-guess" as const,
    name: "tasks.processGuess.name",
    description: "tasks.processGuess.description",
    hints: [],
    requiredScenarios: ["all-correct", "absent", "present", "complex", "different-word"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "all-correct",
    name: "scenarios.allCorrect.name",
    description: "scenarios.allCorrect.description",
    taskId: "process-guess",
    functionCall: { name: "process_guess", args: ["hello", "hello"] },
    setup(exercise) {
      (exercise as ProcessGuessExercise).drawGuesses(["hello"]);
    },
    expectations(exercise) {
      const ex = exercise as ProcessGuessExercise;
      return [expectRowStates(ex, 0, ["correct", "correct", "correct", "correct", "correct"], false)];
    }
  },
  {
    slug: "absent",
    name: "scenarios.absent.name",
    description: "scenarios.absent.description",
    taskId: "process-guess",
    functionCall: { name: "process_guess", args: ["hello", "hallu"] },
    setup(exercise) {
      (exercise as ProcessGuessExercise).drawGuesses(["hallu"]);
    },
    expectations(exercise) {
      const ex = exercise as ProcessGuessExercise;
      return [expectRowStates(ex, 0, ["correct", "absent", "correct", "correct", "absent"], false)];
    }
  },
  {
    slug: "present",
    name: "scenarios.present.name",
    description: "scenarios.present.description",
    taskId: "process-guess",
    functionCall: { name: "process_guess", args: ["hello", "hlelo"] },
    setup(exercise) {
      (exercise as ProcessGuessExercise).drawGuesses(["hlelo"]);
    },
    expectations(exercise) {
      const ex = exercise as ProcessGuessExercise;
      return [expectRowStates(ex, 0, ["correct", "present", "present", "correct", "correct"], false)];
    }
  },
  {
    slug: "complex",
    name: "scenarios.complex.name",
    description: "scenarios.complex.description",
    taskId: "process-guess",
    functionCall: { name: "process_guess", args: ["hello", "ehola"] },
    setup(exercise) {
      (exercise as ProcessGuessExercise).drawGuesses(["ehola"]);
    },
    expectations(exercise) {
      const ex = exercise as ProcessGuessExercise;
      return [expectRowStates(ex, 0, ["present", "present", "present", "correct", "absent"], false)];
    }
  },
  {
    slug: "different-word",
    name: "scenarios.differentWord.name",
    description: "scenarios.differentWord.description",
    taskId: "process-guess",
    functionCall: { name: "process_guess", args: ["break", "beaks"] },
    setup(exercise) {
      (exercise as ProcessGuessExercise).drawGuesses(["beaks"]);
    },
    expectations(exercise) {
      const ex = exercise as ProcessGuessExercise;
      return [expectRowStates(ex, 0, ["correct", "present", "present", "present", "absent"], false)];
    }
  }
];
