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
    name: "Check the name",
    description:
      "Ask the person their name and check if it starts with the allowed letters for tonight's party. If it does, let them in. Otherwise, turn them away.",
    hints: [
      "Use ask_name() and get_allowed_start() to get the two strings you need to compare",
      "Think about how to compare characters one by one — check each letter of the allowed start against the same position in the name",
      "What if the allowed start is longer than the name? That person definitely can't get in!",
      "You'll need to calculate the lengths of both words. Think back to what you did in Sign Painter Price.",
      "Use a counter variable to track which position you're comparing"
    ],
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
    name: "S Party: Sarah arrives",
    description: 'Tonight only names starting with "S" are allowed. Sarah should get in!',
    taskId: "check-the-name",

    setup(exercise) {
      setupScenario(exercise as NicheNamedPartyExercise, "Sarah", "S");
    },

    expectations(exercise) {
      const ex = exercise as NicheNamedPartyExercise;
      return [
        {
          pass: ex.wasLetIn === true,
          errorHtml: "Sarah's name starts with \"S\" — she should be let in, but she wasn't."
        },
        {
          pass: ex.wasTurnedAway === false,
          errorHtml: 'Sarah\'s name starts with "S" — she should NOT be turned away.'
        }
      ];
    }
  },
  {
    slug: "brad-s-party",
    name: "S Party: Brad arrives",
    description: 'Tonight only names starting with "S" are allowed. Brad should be turned away.',
    taskId: "check-the-name",

    setup(exercise) {
      setupScenario(exercise as NicheNamedPartyExercise, "Brad", "S");
    },

    expectations(exercise) {
      const ex = exercise as NicheNamedPartyExercise;
      return [
        {
          pass: ex.wasLetIn === false,
          errorHtml: "Brad's name doesn't start with \"S\" — he should NOT be let in."
        },
        {
          pass: ex.wasTurnedAway === true,
          errorHtml: "Brad's name doesn't start with \"S\" — he should be turned away, but he wasn't."
        }
      ];
    }
  },
  {
    slug: "bradley-brad-party",
    name: "Brad Party: Bradley arrives",
    description: 'Tonight only names starting with "Brad" are allowed. Bradley should get in!',
    taskId: "check-the-name",

    setup(exercise) {
      setupScenario(exercise as NicheNamedPartyExercise, "Bradley", "Brad");
    },

    expectations(exercise) {
      const ex = exercise as NicheNamedPartyExercise;
      return [
        {
          pass: ex.wasLetIn === true,
          errorHtml: "Bradley's name starts with \"Brad\" — he should be let in, but he wasn't."
        },
        {
          pass: ex.wasTurnedAway === false,
          errorHtml: 'Bradley\'s name starts with "Brad" — he should NOT be turned away.'
        }
      ];
    }
  },
  {
    slug: "brian-brad-party",
    name: "Brad Party: Brian arrives",
    description: 'Tonight only names starting with "Brad" are allowed. Brian should be turned away.',
    taskId: "check-the-name",

    setup(exercise) {
      setupScenario(exercise as NicheNamedPartyExercise, "Brian", "Brad");
    },

    expectations(exercise) {
      const ex = exercise as NicheNamedPartyExercise;
      return [
        {
          pass: ex.wasLetIn === false,
          errorHtml: "Brian's name doesn't start with \"Brad\" — he should NOT be let in."
        },
        {
          pass: ex.wasTurnedAway === true,
          errorHtml: "Brian's name doesn't start with \"Brad\" — he should be turned away, but he wasn't."
        }
      ];
    }
  },
  {
    slug: "silence",
    name: "S Party: Silence...",
    description: "The person doesn't say their name. An empty name can't start with anything — turn them away!",
    taskId: "check-the-name",

    setup(exercise) {
      setupScenario(exercise as NicheNamedPartyExercise, "", "S");
    },

    expectations(exercise) {
      const ex = exercise as NicheNamedPartyExercise;
      return [
        {
          pass: ex.wasLetIn === false,
          errorHtml: "The person didn't say their name — they should NOT be let in."
        },
        {
          pass: ex.wasTurnedAway === true,
          errorHtml: "The person didn't say their name — they should be turned away, but they weren't."
        }
      ];
    }
  },
  {
    slug: "cher-cher-party",
    name: "Cher Party: Cher arrives",
    description: 'Tonight only names starting with "Cher" are allowed. Cher\'s name is exactly "Cher" — let her in!',
    taskId: "check-the-name",

    setup(exercise) {
      setupScenario(exercise as NicheNamedPartyExercise, "Cher", "Cher");
    },

    expectations(exercise) {
      const ex = exercise as NicheNamedPartyExercise;
      return [
        {
          pass: ex.wasLetIn === true,
          errorHtml: "Cher's name is exactly \"Cher\" — she should be let in, but she wasn't."
        },
        {
          pass: ex.wasTurnedAway === false,
          errorHtml: 'Cher\'s name is exactly "Cher" — she should NOT be turned away.'
        }
      ];
    }
  }
];
