import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise lets a student explore character-by-character mapping, transforming one
    string into another via a lookup. It can be done with parallel arrays (DNA and RNA,
    matched by index) or an if/else chain per nucleotide.
  `,

  tasks: {
    "transcribe-dna-to-rna": {
      description: `
        The student converts each DNA nucleotide to its RNA complement (G->C, C->G, T->A,
        A->U).

        Common mistakes worth watching for:
        - Getting A->U wrong, since RNA uses U rather than T.
        - Building the result incorrectly instead of concatenating each mapped character.
      `
    }
  }
};
