import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise allows a student to explore chunking a string into fixed-size
    groups, mapping via a dictionary, and early loop termination. It builds across
    three tasks: single-codon lookup, then multi-codon chunking, then STOP handling.
  `,

  tasks: {
    "basic-translations": {
      description: `
        First step of the progression: just a codon-to-amino-acid dictionary
        lookup for single 3-character codons (empty input gives an empty list).
        The only real care needed is spelling the keys/values exactly.
      `
    },
    "multiple-codons": {
      description: `
        Builds on basic-translations: the student now has single-codon lookup
        working and must split the RNA into 3-character chunks before mapping
        each. Easiest as a separate rnaToCodons helper that accumulates 3 chars,
        pushes, and resets. Watch for forgetting to reset the accumulator.
      `
    },
    "stop-codon-behavior": {
      description: `
        Final step: chunking and mapping already work; now the student must stop
        translation at the first codon that maps to "STOP", without adding "STOP"
        to the result. Order is the trap: check for STOP and break BEFORE pushing.
        Anything after a STOP codon is ignored.
      `
    }
  }
};
