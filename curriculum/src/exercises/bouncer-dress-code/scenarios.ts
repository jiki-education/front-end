import type { Task, VisualScenario } from "../types";
import type BouncerDressCodeExercise from "./Exercise";

const IMAGE_BASE = "/static/images/exercise-assets/bouncer-dress-code";

function setupScenario(
  exercise: BouncerDressCodeExercise,
  slug: string,
  outfit: string,
  age: number,
  onGuestList: boolean
) {
  exercise.setupOutfit(outfit);
  exercise.setupAge(age);
  exercise.setupOnGuestList(onGuestList);
  exercise.setupBackground(`${IMAGE_BASE}/${slug}.webp`);
  exercise.setupResultImage(`${IMAGE_BASE}/${slug}.webp`);
}

export const tasks = [
  {
    id: "check-dress-code" as const,
    name: "tasks.checkDressCode.name",
    description: "tasks.checkDressCode.description",
    hints: [],
    requiredScenarios: [
      "ballgown",
      "tuxedo",
      "dress",
      "suit",
      "formal-teen",
      "smart-teen",
      "casual-child-listed",
      "casual-child-unlisted",
      "casual-adult-listed"
    ],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "ballgown",
    name: "scenarios.ballgown.name",
    description: "scenarios.ballgown.description",
    taskId: "check-dress-code",

    setup(exercise) {
      setupScenario(exercise as BouncerDressCodeExercise, "ballgown", "ballgown", 65, false);
    },

    expectations(exercise) {
      const ex = exercise as BouncerDressCodeExercise;
      return [
        {
          pass: ex.champagneOffered === true,
          errorHtml: ex.t("checks.ballgown.champagne")
        },
        {
          pass: ex.canapesOffered === true,
          errorHtml: ex.t("checks.ballgown.canapes")
        },
        {
          pass: ex.wasLetIn === true,
          errorHtml: ex.t("checks.ballgown.letIn")
        },
        {
          pass: ex.wasTurnedAway === false,
          errorHtml: ex.t("checks.ballgown.notTurnedAway")
        }
      ];
    }
  },
  {
    slug: "tuxedo",
    name: "scenarios.tuxedo.name",
    description: "scenarios.tuxedo.description",
    taskId: "check-dress-code",

    setup(exercise) {
      setupScenario(exercise as BouncerDressCodeExercise, "tuxedo", "tuxedo", 18, false);
    },

    expectations(exercise) {
      const ex = exercise as BouncerDressCodeExercise;
      return [
        {
          pass: ex.champagneOffered === true,
          errorHtml: ex.t("checks.tuxedo.champagne")
        },
        {
          pass: ex.canapesOffered === true,
          errorHtml: ex.t("checks.tuxedo.canapes")
        },
        {
          pass: ex.wasLetIn === true,
          errorHtml: ex.t("checks.tuxedo.letIn")
        },
        {
          pass: ex.wasTurnedAway === false,
          errorHtml: ex.t("checks.tuxedo.notTurnedAway")
        }
      ];
    }
  },
  {
    slug: "dress",
    name: "scenarios.dress.name",
    description: "scenarios.dress.description",
    taskId: "check-dress-code",

    setup(exercise) {
      setupScenario(exercise as BouncerDressCodeExercise, "dress", "dress", 35, false);
    },

    expectations(exercise) {
      const ex = exercise as BouncerDressCodeExercise;
      return [
        {
          pass: ex.canapesOffered === true,
          errorHtml: ex.t("checks.dress.canapes")
        },
        {
          pass: ex.champagneOffered === false,
          errorHtml: ex.t("checks.dress.noChampagne")
        },
        {
          pass: ex.wasLetIn === true,
          errorHtml: ex.t("checks.dress.letIn")
        },
        {
          pass: ex.wasTurnedAway === false,
          errorHtml: ex.t("checks.dress.notTurnedAway")
        }
      ];
    }
  },
  {
    slug: "suit",
    name: "scenarios.suit.name",
    description: "scenarios.suit.description",
    taskId: "check-dress-code",

    setup(exercise) {
      setupScenario(exercise as BouncerDressCodeExercise, "suit", "suit", 30, false);
    },

    expectations(exercise) {
      const ex = exercise as BouncerDressCodeExercise;
      return [
        {
          pass: ex.canapesOffered === true,
          errorHtml: ex.t("checks.suit.canapes")
        },
        {
          pass: ex.champagneOffered === false,
          errorHtml: ex.t("checks.suit.noChampagne")
        },
        {
          pass: ex.wasLetIn === true,
          errorHtml: ex.t("checks.suit.letIn")
        },
        {
          pass: ex.wasTurnedAway === false,
          errorHtml: ex.t("checks.suit.notTurnedAway")
        }
      ];
    }
  },
  {
    slug: "formal-teen",
    name: "scenarios.formalTeen.name",
    description: "scenarios.formalTeen.description",
    taskId: "check-dress-code",

    setup(exercise) {
      setupScenario(exercise as BouncerDressCodeExercise, "formal-teen", "ballgown", 13, false);
    },

    expectations(exercise) {
      const ex = exercise as BouncerDressCodeExercise;
      return [
        {
          pass: ex.wasLetIn === true,
          errorHtml: ex.t("checks.formalTeen.letIn")
        },
        {
          pass: ex.canapesOffered === true,
          errorHtml: ex.t("checks.formalTeen.canapes")
        },
        {
          pass: ex.champagneOffered === false,
          errorHtml: ex.t("checks.formalTeen.noChampagne")
        },
        {
          pass: ex.wasTurnedAway === false,
          errorHtml: ex.t("checks.formalTeen.notTurnedAway")
        }
      ];
    }
  },
  {
    slug: "smart-teen",
    name: "scenarios.smartTeen.name",
    description: "scenarios.smartTeen.description",
    taskId: "check-dress-code",

    setup(exercise) {
      setupScenario(exercise as BouncerDressCodeExercise, "smart-teen", "suit", 15, false);
    },

    expectations(exercise) {
      const ex = exercise as BouncerDressCodeExercise;
      return [
        {
          pass: ex.canapesOffered === true,
          errorHtml: ex.t("checks.smartTeen.canapes")
        },
        {
          pass: ex.champagneOffered === false,
          errorHtml: ex.t("checks.smartTeen.noChampagne")
        },
        {
          pass: ex.wasLetIn === true,
          errorHtml: ex.t("checks.smartTeen.letIn")
        },
        {
          pass: ex.wasTurnedAway === false,
          errorHtml: ex.t("checks.smartTeen.notTurnedAway")
        }
      ];
    }
  },
  {
    slug: "casual-child-listed",
    name: "scenarios.casualChildListed.name",
    description: "scenarios.casualChildListed.description",
    taskId: "check-dress-code",

    setup(exercise) {
      setupScenario(exercise as BouncerDressCodeExercise, "casual-child-listed", "denim", 15, true);
    },

    expectations(exercise) {
      const ex = exercise as BouncerDressCodeExercise;
      return [
        {
          pass: ex.wasLetIn === true,
          errorHtml: ex.t("checks.casualChildListed.letIn")
        },
        {
          pass: ex.wasTurnedAway === false,
          errorHtml: ex.t("checks.casualChildListed.notTurnedAway")
        },
        {
          pass: ex.champagneOffered === false,
          errorHtml: ex.t("checks.casualChildListed.noChampagne")
        },
        {
          pass: ex.canapesOffered === false,
          errorHtml: ex.t("checks.casualChildListed.noCanapes")
        }
      ];
    }
  },
  {
    slug: "casual-child-unlisted",
    name: "scenarios.casualChildUnlisted.name",
    description: "scenarios.casualChildUnlisted.description",
    taskId: "check-dress-code",

    setup(exercise) {
      setupScenario(exercise as BouncerDressCodeExercise, "casual-child-unlisted", "tracksuit", 15, false);
    },

    expectations(exercise) {
      const ex = exercise as BouncerDressCodeExercise;
      return [
        {
          pass: ex.wasTurnedAway === true,
          errorHtml: ex.t("checks.casualChildUnlisted.turnedAway")
        },
        {
          pass: ex.wasLetIn === false,
          errorHtml: ex.t("checks.casualChildUnlisted.notLetIn")
        },
        {
          pass: ex.champagneOffered === false,
          errorHtml: ex.t("checks.casualChildUnlisted.noChampagne")
        },
        {
          pass: ex.canapesOffered === false,
          errorHtml: ex.t("checks.casualChildUnlisted.noCanapes")
        }
      ];
    }
  },
  {
    slug: "casual-adult-listed",
    name: "scenarios.casualAdultListed.name",
    description: "scenarios.casualAdultListed.description",
    taskId: "check-dress-code",

    setup(exercise) {
      setupScenario(exercise as BouncerDressCodeExercise, "casual-adult-listed", "denim", 30, true);
    },

    expectations(exercise) {
      const ex = exercise as BouncerDressCodeExercise;
      return [
        {
          pass: ex.wasTurnedAway === true,
          errorHtml: ex.t("checks.casualAdultListed.turnedAway")
        },
        {
          pass: ex.wasLetIn === false,
          errorHtml: ex.t("checks.casualAdultListed.notLetIn")
        },
        {
          pass: ex.champagneOffered === false,
          errorHtml: ex.t("checks.casualAdultListed.noChampagne")
        },
        {
          pass: ex.canapesOffered === false,
          errorHtml: ex.t("checks.casualAdultListed.noCanapes")
        }
      ];
    },

    codeChecks: [
      {
        pass: (result) => result.assertors.numFunctionCallsInCode("get_outfit") <= 1,
        errorKey: "checks.codeQuality.getOutfitCalledOnce"
      },
      {
        pass: (result) => result.assertors.numFunctionCallsInCode("get_age") <= 1,
        errorKey: "checks.codeQuality.getAgeCalledOnce"
      },
      {
        pass: (result) => result.assertors.numFunctionCallsInCode("on_guest_list") <= 1,
        errorKey: "checks.codeQuality.onGuestListCalledOnce"
      },
      {
        pass: (result) => result.assertors.assertOperatorUsed("&&") || result.assertors.assertOperatorUsed("||"),
        errorKey: "checks.codeQuality.combinesConditions"
      }
    ]
  }
];
