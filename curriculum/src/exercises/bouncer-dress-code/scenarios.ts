import type { Task, VisualScenario } from "../types";
import type BouncerDressCodeExercise from "./Exercise";

const IMAGE_BASE = "/static/images/exercise-assets/bouncer-dress-code";

export const tasks = [
  {
    id: "check-dress-code" as const,
    name: "Enforce the dress code",
    description:
      'Check the person\'s outfit and apply the dress code: fancy outfits ("ballgown" or "tuxedo") get champagne and entry, smart outfits ("suit" or "dress") get entry, anything else gets turned away.',
    hints: [],
    requiredScenarios: ["ballgown", "tuxedo", "suit", "dress", "denim", "tracksuit"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "ballgown",
    name: "Wearing a ballgown",
    description: "A guest in a ballgown — offer champagne and let them in!",
    taskId: "check-dress-code",

    setup(exercise) {
      const ex = exercise as BouncerDressCodeExercise;
      ex.setupOutfit("ballgown");
      ex.setupBackground(`${IMAGE_BASE}/ballgown.jpg`);
      ex.setupResultImage(`${IMAGE_BASE}/ballgown-result.jpg`);
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
    name: "Wearing a tuxedo",
    description: "A guest in a tuxedo — offer champagne and let them in!",
    taskId: "check-dress-code",

    setup(exercise) {
      const ex = exercise as BouncerDressCodeExercise;
      ex.setupOutfit("tuxedo");
      ex.setupBackground(`${IMAGE_BASE}/tuxedo.jpg`);
      ex.setupResultImage(`${IMAGE_BASE}/tuxedo-result.jpg`);
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
    name: "Wearing a suit",
    description: "A guest in a suit — let them in, but no champagne.",
    taskId: "check-dress-code",

    setup(exercise) {
      const ex = exercise as BouncerDressCodeExercise;
      ex.setupOutfit("suit");
      ex.setupBackground(`${IMAGE_BASE}/suit.jpg`);
      ex.setupResultImage(`${IMAGE_BASE}/suit-result.jpg`);
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
    name: "Wearing a dress",
    description: "A guest in a dress — let them in, but no champagne.",
    taskId: "check-dress-code",

    setup(exercise) {
      const ex = exercise as BouncerDressCodeExercise;
      ex.setupOutfit("dress");
      ex.setupBackground(`${IMAGE_BASE}/dress.jpg`);
      ex.setupResultImage(`${IMAGE_BASE}/dress-result.jpg`);
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
    slug: "denim",
    name: "Wearing denim",
    description: "A guest in denim — turn them away!",
    taskId: "check-dress-code",

    setup(exercise) {
      const ex = exercise as BouncerDressCodeExercise;
      ex.setupOutfit("denim");
      ex.setupBackground(`${IMAGE_BASE}/denim.jpg`);
      ex.setupResultImage(`${IMAGE_BASE}/denim-result.jpg`);
    },

    expectations(exercise) {
      const ex = exercise as BouncerDressCodeExercise;
      return [
        {
          pass: ex.champagneOffered === false,
          errorHtml: "They're wearing denim — no champagne for them."
        },
        {
          pass: ex.wasLetIn === false,
          errorHtml: "They're wearing denim — they should NOT be let in."
        },
        {
          pass: ex.wasTurnedAway === true,
          errorHtml: "They're wearing denim — they should be turned away, but they weren't."
        }
      ];
    }
  },
  {
    slug: "tracksuit",
    name: "Wearing a tracksuit",
    description: "A guest in a tracksuit — turn them away!",
    taskId: "check-dress-code",

    setup(exercise) {
      const ex = exercise as BouncerDressCodeExercise;
      ex.setupOutfit("tracksuit");
      ex.setupBackground(`${IMAGE_BASE}/tracksuit.jpg`);
      ex.setupResultImage(`${IMAGE_BASE}/tracksuit-result.jpg`);
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
