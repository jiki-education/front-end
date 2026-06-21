import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise allows a student to explore string iteration with a counter and an
    early-return on the immediate-failure condition (a major fault).
  `,

  tasks: {
    "did-they-pass": {
      description: `
        Anchor steps: loop the marks; return false immediately on a major (💥); count
        minors (❌); after the loop, return minors < 5.

        Worth steering on:
        - The early return for a major is the teaching point; a student who instead tallies
          majors and checks at the end is missing the cleaner pattern.
        - Only minors need counting; ✅ requires no handling.
        - Boundary: 5 or more minors fail, so the final check is minors < 5. The
          "scraped-through" (4 minors) vs "one-mistake-too-many" (5 minors) scenarios test this.
      `
    }
  }
};
