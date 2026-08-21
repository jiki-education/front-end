import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    A challenge unlocked after Pangram, deliberately capped at the level BEFORE string methods exist — so there is NO
    built-in toUpperCase / isLetter / includes. The intended shape mirrors Pangram: the student hand-builds small helper
    functions (case conversion via lined-up lowercase/uppercase alphabet strings, letter-testing) and composes them in a
    boundary-flag loop over the phrase. If a student reaches for a string method, the block is expected — redirect them to
    building the tool themselves, as they did in Pangram.
  `,

  tasks: {
    "create-acronym-function": {
      description: `
        Walk the phrase one character at a time, tracking whether the current character starts a new word (true at the
        start, and after any space or hyphen). Non-obvious traps that the scenarios pin down:
        (1) word boundaries are BOTH spaces and hyphens (simufta: "- " runs of delimiters must not add blank letters);
        (2) only LETTERS count — underscores, apostrophes, commas and emoji must be skipped, not treated as word-starts
        (trnt "_Not_" fails a naive "anything after a delimiter" approach; hc, emoji rely on the same guard);
        (3) already-uppercase letters must pass through unchanged (gimp "GNU" -> G), so case conversion must handle both
        cases, and the letter it appends must be uppercased since some words are lowercase (ror).
      `
    },
    "solve-tightly": {
      description: `
        Optional bonus, gated only by a line-count check (<= 46 lines in JavaScript). The intended win is decomposition:
        pull the letter-testing and case-swapping into small helpers that acronym reuses. A student who inlines those
        alphabet scans, or duplicates them for "is it a letter?" and "uppercase it" separately, overshoots the limit.
        Nudge toward reuse, not code-golf tricks.
      `
    }
  }
};

// smoke test comment, no English touched
