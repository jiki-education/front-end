import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches combining conditions with the 'or' operator and
    executing multiple actions within a single branch. Students use get_outfit()
    to retrieve a string, then use if/else if/else with 'or' to classify
    the outfit and take the appropriate action(s).

    The exercise has six scenarios: two per category (fancy, smart, casual).
  `,

  tasks: {
    "check-dress-code": {
      description: `
        Students need to:
        1. Call get_outfit() and store the result in a variable
        2. Use if/else if/else with 'or' to check outfit categories
        3. Fancy ("ballgown" or "tuxedo"): call both offer_champagne() and let_in()
        4. Smart ("suit" or "dress"): call let_in()
        5. Anything else: call turn_away()

        Key functions:
        - get_outfit(): returns the outfit as a string
        - offer_champagne(): offers champagne
        - let_in(): lets the person in
        - turn_away(): turns the person away

        Common mistakes:
        - Forgetting 'or' and writing separate if statements for each outfit
        - Writing 'outfit == "ballgown" or "tuxedo"' instead of
          'outfit == "ballgown" or outfit == "tuxedo"'
        - Forgetting to call let_in() for fancy outfits (only calling offer_champagne)
        - Using 'and' instead of 'or'

        Teaching strategy:
        - Build on the if/else if/else from bouncer-wristbands
        - Focus on the 'or' operator: checking if outfit matches ANY of the values
        - Emphasize that each condition needs the full comparison (outfit == "X")
        - Show that multiple function calls can go inside one branch
      `
    }
  }
};
