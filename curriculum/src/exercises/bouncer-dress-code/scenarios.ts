import type { Task, VisualScenario } from "../types";
import type BouncerDressCodeExercise from "./Exercise";

const IMAGE_BASE = "https://assets.exercism.org/bootcamp/graphics/bouncer-dress-code";

function setupScenario(exercise: BouncerDressCodeExercise, outfit: string) {
  exercise.setupOutfit(outfit);
  exercise.setupImages(
    `${IMAGE_BASE}-base.png`,
    `${IMAGE_BASE}-champagne-entry.png`,
    `${IMAGE_BASE}-entry.png`,
    `${IMAGE_BASE}-turned-away.png`
  );
}

export const tasks = [
  {
    id: "check-dress-code" as const,
    name: "Enforce the dress code",
    description:
      'Check the person\'s outfit and apply the dress code: fancy outfits ("ballgown" or "tuxedo") get champagne and entry, smart outfits ("suit" or "dress") get entry, anything else gets turned away.',
    hints: [
      "Use get_outfit() to find out what the person is wearing",
      'Use or to check for two outfits: outfit == "ballgown" or outfit == "tuxedo"',
      "Call both offer_champagne() and let_in() for fancy outfits",
      "Use else for the default case (turn away)"
    ],
    requiredScenarios: ["ballgown", "tuxedo", "suit", "dress", "jeans", "tracksuit"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "ballgown",
    name: "Wearing a ballgown (fancy)",
    description: "A guest in a ballgown — offer champagne and let them in!",
    taskId: "check-dress-code",

    setup(exercise) {
      setupScenario(exercise as BouncerDressCodeExercise, "ballgown");
    },

    expectations(exercise) {
      const ex = exercise as BouncerDressCodeExercise;
      return [
        {
          pass: ex.champagneOffered === true,
          errorHtml: "They're wearing a ballgown — they should be offered champagne, but they weren't."
        },
        {
          pass: ex.wasLetIn === true,
          errorHtml: "They're wearing a ballgown — they should be let in, but they weren't."
        },
        {
          pass: ex.wasTurnedAway === false,
          errorHtml: "They're wearing a ballgown — they should NOT be turned away."
        }
      ];
    }
  },
  {
    slug: "tuxedo",
    name: "Wearing a tuxedo (fancy)",
    description: "A guest in a tuxedo — offer champagne and let them in!",
    taskId: "check-dress-code",

    setup(exercise) {
      setupScenario(exercise as BouncerDressCodeExercise, "tuxedo");
    },

    expectations(exercise) {
      const ex = exercise as BouncerDressCodeExercise;
      return [
        {
          pass: ex.champagneOffered === true,
          errorHtml: "They're wearing a tuxedo — they should be offered champagne, but they weren't."
        },
        {
          pass: ex.wasLetIn === true,
          errorHtml: "They're wearing a tuxedo — they should be let in, but they weren't."
        },
        {
          pass: ex.wasTurnedAway === false,
          errorHtml: "They're wearing a tuxedo — they should NOT be turned away."
        }
      ];
    }
  },
  {
    slug: "suit",
    name: "Wearing a suit (smart)",
    description: "A guest in a suit — let them in, but no champagne.",
    taskId: "check-dress-code",

    setup(exercise) {
      setupScenario(exercise as BouncerDressCodeExercise, "suit");
    },

    expectations(exercise) {
      const ex = exercise as BouncerDressCodeExercise;
      return [
        {
          pass: ex.champagneOffered === false,
          errorHtml: "They're wearing a suit — no champagne for smart outfits."
        },
        {
          pass: ex.wasLetIn === true,
          errorHtml: "They're wearing a suit — they should be let in, but they weren't."
        },
        {
          pass: ex.wasTurnedAway === false,
          errorHtml: "They're wearing a suit — they should NOT be turned away."
        }
      ];
    }
  },
  {
    slug: "dress",
    name: "Wearing a dress (smart)",
    description: "A guest in a dress — let them in, but no champagne.",
    taskId: "check-dress-code",

    setup(exercise) {
      setupScenario(exercise as BouncerDressCodeExercise, "dress");
    },

    expectations(exercise) {
      const ex = exercise as BouncerDressCodeExercise;
      return [
        {
          pass: ex.champagneOffered === false,
          errorHtml: "They're wearing a dress — no champagne for smart outfits."
        },
        {
          pass: ex.wasLetIn === true,
          errorHtml: "They're wearing a dress — they should be let in, but they weren't."
        },
        {
          pass: ex.wasTurnedAway === false,
          errorHtml: "They're wearing a dress — they should NOT be turned away."
        }
      ];
    }
  },
  {
    slug: "jeans",
    name: "Wearing jeans (casual)",
    description: "A guest in jeans — turn them away!",
    taskId: "check-dress-code",

    setup(exercise) {
      setupScenario(exercise as BouncerDressCodeExercise, "jeans");
    },

    expectations(exercise) {
      const ex = exercise as BouncerDressCodeExercise;
      return [
        {
          pass: ex.champagneOffered === false,
          errorHtml: "They're wearing jeans — no champagne for them."
        },
        {
          pass: ex.wasLetIn === false,
          errorHtml: "They're wearing jeans — they should NOT be let in."
        },
        {
          pass: ex.wasTurnedAway === true,
          errorHtml: "They're wearing jeans — they should be turned away, but they weren't."
        }
      ];
    }
  },
  {
    slug: "tracksuit",
    name: "Wearing a tracksuit (casual)",
    description: "A guest in a tracksuit — turn them away!",
    taskId: "check-dress-code",

    setup(exercise) {
      setupScenario(exercise as BouncerDressCodeExercise, "tracksuit");
    },

    expectations(exercise) {
      const ex = exercise as BouncerDressCodeExercise;
      return [
        {
          pass: ex.champagneOffered === false,
          errorHtml: "They're wearing a tracksuit — no champagne for them."
        },
        {
          pass: ex.wasLetIn === false,
          errorHtml: "They're wearing a tracksuit — they should NOT be let in."
        },
        {
          pass: ex.wasTurnedAway === true,
          errorHtml: "They're wearing a tracksuit — they should be turned away, but they weren't."
        }
      ];
    }
  }
];
