import type { Task, VisualScenario } from "../types";
import type NicheNamedPartyExercise from "./Exercise";

const IMAGE_BASE = "https://assets.exercism.org/bootcamp/graphics/bouncer-dress-code";

function setupScenario(exercise: NicheNamedPartyExercise, name: string, allowedStart: string) {
  exercise.setupName(name);
  exercise.setupAllowedStart(allowedStart);
  exercise.setupImages(`${IMAGE_BASE}-base.png`, `${IMAGE_BASE}-entry.png`, `${IMAGE_BASE}-turned-away.png`);
}

export const tasks = [
  {
    id: "check-the-name" as const,
    name: "tasks.checkTheName.name",
    description: "tasks.checkTheName.description",
    hints: [],
    requiredScenarios: [
      "sarah-s-party",
      "brad-s-party",
      "bradley-brad-party",
      "brian-brad-party",
      "silence",
      "cher-cher-party"
    ],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "sarah-s-party",
    name: "scenarios.sarahSParty.name",
    description: "scenarios.sarahSParty.description",
    taskId: "check-the-name",

    setup(exercise) {
      setupScenario(exercise as NicheNamedPartyExercise, "Sarah", "S");
    },

    expectations(exercise) {
      const ex = exercise as NicheNamedPartyExercise;
      return [
        {
          pass: ex.wasLetIn === true,
          errorHtml: ex.t("checks.sarahLetIn")
        },
        {
          pass: ex.wasTurnedAway === false,
          errorHtml: ex.t("checks.sarahNotTurnedAway")
        }
      ];
    }
  },
  {
    slug: "brad-s-party",
    name: "scenarios.bradSParty.name",
    description: "scenarios.bradSParty.description",
    taskId: "check-the-name",

    setup(exercise) {
      setupScenario(exercise as NicheNamedPartyExercise, "Brad", "S");
    },

    expectations(exercise) {
      const ex = exercise as NicheNamedPartyExercise;
      return [
        {
          pass: ex.wasLetIn === false,
          errorHtml: ex.t("checks.bradNotLetIn")
        },
        {
          pass: ex.wasTurnedAway === true,
          errorHtml: ex.t("checks.bradTurnedAway")
        }
      ];
    }
  },
  {
    slug: "bradley-brad-party",
    name: "scenarios.bradleyBradParty.name",
    description: "scenarios.bradleyBradParty.description",
    taskId: "check-the-name",

    setup(exercise) {
      setupScenario(exercise as NicheNamedPartyExercise, "Bradley", "Brad");
    },

    expectations(exercise) {
      const ex = exercise as NicheNamedPartyExercise;
      return [
        {
          pass: ex.wasLetIn === true,
          errorHtml: ex.t("checks.bradleyLetIn")
        },
        {
          pass: ex.wasTurnedAway === false,
          errorHtml: ex.t("checks.bradleyNotTurnedAway")
        }
      ];
    }
  },
  {
    slug: "brian-brad-party",
    name: "scenarios.brianBradParty.name",
    description: "scenarios.brianBradParty.description",
    taskId: "check-the-name",

    setup(exercise) {
      setupScenario(exercise as NicheNamedPartyExercise, "Brian", "Brad");
    },

    expectations(exercise) {
      const ex = exercise as NicheNamedPartyExercise;
      return [
        {
          pass: ex.wasLetIn === false,
          errorHtml: ex.t("checks.brianNotLetIn")
        },
        {
          pass: ex.wasTurnedAway === true,
          errorHtml: ex.t("checks.brianTurnedAway")
        }
      ];
    }
  },
  {
    slug: "silence",
    name: "scenarios.silence.name",
    description: "scenarios.silence.description",
    taskId: "check-the-name",

    setup(exercise) {
      setupScenario(exercise as NicheNamedPartyExercise, "", "S");
    },

    expectations(exercise) {
      const ex = exercise as NicheNamedPartyExercise;
      return [
        {
          pass: ex.wasLetIn === false,
          errorHtml: ex.t("checks.silenceNotLetIn")
        },
        {
          pass: ex.wasTurnedAway === true,
          errorHtml: ex.t("checks.silenceTurnedAway")
        }
      ];
    }
  },
  {
    slug: "cher-cher-party",
    name: "scenarios.cherCherParty.name",
    description: "scenarios.cherCherParty.description",
    taskId: "check-the-name",

    setup(exercise) {
      setupScenario(exercise as NicheNamedPartyExercise, "Cher", "Cher");
    },

    expectations(exercise) {
      const ex = exercise as NicheNamedPartyExercise;
      return [
        {
          pass: ex.wasLetIn === true,
          errorHtml: ex.t("checks.cherLetIn")
        },
        {
          pass: ex.wasTurnedAway === false,
          errorHtml: ex.t("checks.cherNotTurnedAway")
        }
      ];
    }
  }
];
