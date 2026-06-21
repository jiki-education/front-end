import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise allows a student to explore parsing text into words and
    counting frequencies in a dictionary. It splits into three milestones:
    basic counting, case/apostrophe handling, then a bonus on edge-case
    apostrophes. Encourage decomposing into helpers (isLetter, extractWords,
    countWords).
  `,

  tasks: {
    "basic-word-counting": {
      description: `
        First milestone: lowercase + split into words + tally into a dict.

        The non-obvious traps: consecutive separators can produce empty
        "words" that must be discarded, and numbers count as words (so a
        letters-only character test is wrong).
      `
    },
    "case-normalization": {
      description: `
        Student has basic counting working; this milestone hardens case
        handling and, crucially, requires apostrophes INSIDE contractions to
        be kept rather than treated as separators. Multiple spaces must not
        leak empty strings into the word list. Note: the student does not see
        these steps broken down.
      `
    },
    "bonus-apostrophes": {
      description: `
        Bonus. The hard distinction: an apostrophe in the MIDDLE of a word is
        kept (can't), but leading/trailing apostrophes used as quotes must be
        stripped ('large' -> large). The usual approach is to only keep an
        apostrophe when it sits between two letters. Note: the student does not
        see these steps broken down.
      `
    }
  }
};
