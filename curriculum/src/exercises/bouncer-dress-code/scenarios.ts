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
    name: "Enforce the door policy",
    description:
      "Check each person's outfit, age, and guest-list status, then apply the rules. Formal or smart clothes get in with canapés. Adults in formal clothes also get champagne. Under-18s in other clothes get in only if they're on the guest list. Everyone else is turned away.",
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
    name: "Ballgown",
    description: "A woman in her 60s wearing a ballgown. She gets champagne and canapés, and is let in.",
    taskId: "check-dress-code",

    setup(exercise) {
      setupScenario(exercise as BouncerDressCodeExercise, "ballgown", "ballgown", 65, false);
    },

    expectations(exercise) {
      const ex = exercise as BouncerDressCodeExercise;
      return [
        {
          pass: ex.champagneOffered === true,
          errorHtml: "She's an adult in formal wear, so she should be offered champagne, but she wasn't."
        },
        {
          pass: ex.canapesOffered === true,
          errorHtml: "Formal guests are offered canapés too, but she wasn't."
        },
        {
          pass: ex.wasLetIn === true,
          errorHtml: "Anyone in formal wear should be let in, but she wasn't."
        },
        {
          pass: ex.wasTurnedAway === false,
          errorHtml: "A guest in formal wear should NOT be turned away."
        }
      ];
    }
  },
  {
    slug: "tuxedo",
    name: "Tuxedo",
    description: "A man in a tuxedo who has just turned 18. He gets champagne and canapés, and is let in.",
    taskId: "check-dress-code",

    setup(exercise) {
      setupScenario(exercise as BouncerDressCodeExercise, "tuxedo", "tuxedo", 18, false);
    },

    expectations(exercise) {
      const ex = exercise as BouncerDressCodeExercise;
      return [
        {
          pass: ex.champagneOffered === true,
          errorHtml: "He's 18, which counts as an adult, so he should be offered champagne, but he wasn't."
        },
        {
          pass: ex.canapesOffered === true,
          errorHtml: "Formal guests are offered canapés too, but he wasn't."
        },
        {
          pass: ex.wasLetIn === true,
          errorHtml: "Anyone in formal wear should be let in, but he wasn't."
        },
        {
          pass: ex.wasTurnedAway === false,
          errorHtml: "A guest in formal wear should NOT be turned away."
        }
      ];
    }
  },
  {
    slug: "dress",
    name: "Dress",
    description: "A woman in a dress. She's let in with canapés.",
    taskId: "check-dress-code",

    setup(exercise) {
      setupScenario(exercise as BouncerDressCodeExercise, "dress", "dress", 35, false);
    },

    expectations(exercise) {
      const ex = exercise as BouncerDressCodeExercise;
      return [
        {
          pass: ex.canapesOffered === true,
          errorHtml: "She's in smart wear, so she should be offered canapés, but she wasn't."
        },
        {
          pass: ex.champagneOffered === false,
          errorHtml: "Champagne is for formal wear, so a smart guest shouldn't be offered it."
        },
        {
          pass: ex.wasLetIn === true,
          errorHtml: "A guest in smart wear should be let in, but she wasn't."
        },
        {
          pass: ex.wasTurnedAway === false,
          errorHtml: "A guest in smart wear should NOT be turned away."
        }
      ];
    }
  },
  {
    slug: "suit",
    name: "Suit",
    description: "A man in a suit. He's let in with canapés.",
    taskId: "check-dress-code",

    setup(exercise) {
      setupScenario(exercise as BouncerDressCodeExercise, "suit", "suit", 30, false);
    },

    expectations(exercise) {
      const ex = exercise as BouncerDressCodeExercise;
      return [
        {
          pass: ex.canapesOffered === true,
          errorHtml: "He's in smart wear, so he should be offered canapés, but he wasn't."
        },
        {
          pass: ex.champagneOffered === false,
          errorHtml: "Champagne is for formal wear, so a smart guest shouldn't be offered it."
        },
        {
          pass: ex.wasLetIn === true,
          errorHtml: "A guest in smart wear should be let in, but he wasn't."
        },
        {
          pass: ex.wasTurnedAway === false,
          errorHtml: "A guest in smart wear should NOT be turned away."
        }
      ];
    }
  },
  {
    slug: "formal-teen",
    name: "Child in a ballgown",
    description: "A 13-year-old in a ballgown. She's let in with canapés, but is too young for champagne.",
    taskId: "check-dress-code",

    setup(exercise) {
      setupScenario(exercise as BouncerDressCodeExercise, "formal-teen", "ballgown", 13, false);
    },

    expectations(exercise) {
      const ex = exercise as BouncerDressCodeExercise;
      return [
        {
          pass: ex.wasLetIn === true,
          errorHtml: "Anyone in formal wear is let in, whatever their age, but she wasn't."
        },
        {
          pass: ex.canapesOffered === true,
          errorHtml: "Formal guests are offered canapés whatever their age, but she wasn't."
        },
        {
          pass: ex.champagneOffered === false,
          errorHtml: "She's under 18, so she shouldn't be offered champagne. Champagne is for adults only."
        },
        {
          pass: ex.wasTurnedAway === false,
          errorHtml: "A guest in formal wear should NOT be turned away."
        }
      ];
    }
  },
  {
    slug: "smart-teen",
    name: "Teenager in a suit",
    description: "A 15-year-old in a suit. He's let in with canapés, regardless of age.",
    taskId: "check-dress-code",

    setup(exercise) {
      setupScenario(exercise as BouncerDressCodeExercise, "smart-teen", "suit", 15, false);
    },

    expectations(exercise) {
      const ex = exercise as BouncerDressCodeExercise;
      return [
        {
          pass: ex.canapesOffered === true,
          errorHtml: "Smart wear gets canapés whatever their age, but he wasn't offered any."
        },
        {
          pass: ex.champagneOffered === false,
          errorHtml: "Champagne is for formal wear, so a smart guest shouldn't be offered it."
        },
        {
          pass: ex.wasLetIn === true,
          errorHtml: "A guest in smart wear should be let in, but he wasn't."
        },
        {
          pass: ex.wasTurnedAway === false,
          errorHtml: "A guest in smart wear should NOT be turned away."
        }
      ];
    }
  },
  {
    slug: "casual-child-listed",
    name: "Child in denim, on the list",
    description: "A 15-year-old in denim who's on the guest list. They're let in.",
    taskId: "check-dress-code",

    setup(exercise) {
      setupScenario(exercise as BouncerDressCodeExercise, "casual-child-listed", "denim", 15, true);
    },

    expectations(exercise) {
      const ex = exercise as BouncerDressCodeExercise;
      return [
        {
          pass: ex.wasLetIn === true,
          errorHtml: "An under-18 on the guest list is allowed in, even in casual clothes, but they weren't."
        },
        {
          pass: ex.wasTurnedAway === false,
          errorHtml: "An under-18 on the guest list should NOT be turned away."
        },
        {
          pass: ex.champagneOffered === false,
          errorHtml: "They're not in formal wear, so no champagne."
        },
        {
          pass: ex.canapesOffered === false,
          errorHtml: "They're not in formal or smart wear, so no canapés."
        }
      ];
    }
  },
  {
    slug: "casual-child-unlisted",
    name: "Child in a tracksuit, not on the list",
    description: "A 15-year-old in a tracksuit who isn't on the guest list. They're turned away.",
    taskId: "check-dress-code",

    setup(exercise) {
      setupScenario(exercise as BouncerDressCodeExercise, "casual-child-unlisted", "tracksuit", 15, false);
    },

    expectations(exercise) {
      const ex = exercise as BouncerDressCodeExercise;
      return [
        {
          pass: ex.wasTurnedAway === true,
          errorHtml: "An under-18 in casual clothes who isn't on the guest list should be turned away."
        },
        {
          pass: ex.wasLetIn === false,
          errorHtml: "An under-18 in casual clothes who isn't on the guest list should NOT be let in."
        },
        {
          pass: ex.champagneOffered === false,
          errorHtml: "They're not in formal wear, so no champagne."
        },
        {
          pass: ex.canapesOffered === false,
          errorHtml: "They're not in formal or smart wear, so no canapés."
        }
      ];
    }
  },
  {
    slug: "casual-adult-listed",
    name: "Adult in denim, on the list",
    description: "A 30-year-old in denim who's on the guest list. They're still turned away.",
    taskId: "check-dress-code",

    setup(exercise) {
      setupScenario(exercise as BouncerDressCodeExercise, "casual-adult-listed", "denim", 30, true);
    },

    expectations(exercise) {
      const ex = exercise as BouncerDressCodeExercise;
      return [
        {
          pass: ex.wasTurnedAway === true,
          errorHtml:
            "The guest-list exception is only for under-18s, so an adult in casual clothes is turned away even if they're on the list."
        },
        {
          pass: ex.wasLetIn === false,
          errorHtml: "An adult in casual clothes should NOT be let in, even if they're on the guest list."
        },
        {
          pass: ex.champagneOffered === false,
          errorHtml: "They're not in formal wear, so no champagne."
        },
        {
          pass: ex.canapesOffered === false,
          errorHtml: "They're not in formal or smart wear, so no canapés."
        }
      ];
    },

    codeChecks: [
      {
        pass: (result) => result.assertors.numFunctionCallsInCode("get_outfit") <= 1,
        errorHtml: "You should only use <code>getOutfit()</code> once."
      },
      {
        pass: (result) => result.assertors.numFunctionCallsInCode("get_age") <= 1,
        errorHtml: "You should only use <code>getAge()</code> once."
      },
      {
        pass: (result) => result.assertors.numFunctionCallsInCode("on_guest_list") <= 1,
        errorHtml: "You should only use <code>onGuestList()</code> once."
      },
      {
        pass: (result) => result.assertors.assertOperatorUsed("&&") || result.assertors.assertOperatorUsed("||"),
        errorHtml: "This challenge is about combining conditions. Try using what you've learned in the previous lesson."
      }
    ]
  }
];
