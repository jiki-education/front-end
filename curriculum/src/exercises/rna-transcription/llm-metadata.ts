import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches string manipulation, array indexing, and character mapping.
    Students learn to transform one string into another using a lookup-based approach.
    Key concepts: iteration over strings, parallel arrays for mapping, string building with concatenation.
  `,

  tasks: {
    "transcribe-dna-to-rna": {
      description: `
        Students need to convert each DNA nucleotide to its RNA complement.
        The mapping is: G->C, C->G, T->A, A->U.

        Common approaches:
        1. Use parallel arrays: one for DNA nucleotides, one for RNA, and find the index.
        2. Use if/else chains to check each nucleotide.

        Common mistakes:
        - Forgetting to handle the empty string case (though it works naturally with iteration)
        - Getting the mapping wrong (especially A->U since RNA uses U not T)
        - Not building up the result string correctly with concatenate()

        The elegant solution uses parallel arrays and a helper function to look up the complement.
      `
    }
  }
};
