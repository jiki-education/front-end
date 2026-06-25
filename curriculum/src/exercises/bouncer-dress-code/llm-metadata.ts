import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    A single-task exercise practising the combination of && and || in one condition, including the
    parentheses needed for correct precedence. The canonical solution is a standalone champagne check
    (adult && formal) followed by an entry-and-canapés if / else if / else chain. The whole program is
    the single task rather than a progression of steps.
  `,

  tasks: {
    "check-dress-code": {
      description: `
        Common student mistakes to watch for:
        - Writing outfit === "ballgown" || "tuxedo" instead of giving each side of the || its own full
          comparison (outfit === "ballgown" || outfit === "tuxedo").
        - Forgetting the parentheses in age >= 18 && (outfit === "ballgown" || outfit === "tuxedo").
          Without them the precedence is wrong.
        - Leaving an outfit out of the canapés / entry condition: canapés and entry go to ALL FOUR
          formal and smart outfits.
        - Treating champagne as something that gates entry. It is an independent check, so a formal
          under-18 is still let in with canapés, just without champagne.
        - Dropping either half of age < 18 && onGuestList(): an adult on the guest list is still turned
          away, and an under-18 who is not on the list is too.

        Important: grouping conditions with brackets (putting an || inside an && using parentheses) has
        NOT been taught at this level yet, so most students will not have seen it. Do not bring it up
        pre-emptively. Only if a student actually reaches a point where they need to combine && and ||
        in one condition and is stuck or confused, explain how parentheses group part of a condition.
      `
    }
  }
};
