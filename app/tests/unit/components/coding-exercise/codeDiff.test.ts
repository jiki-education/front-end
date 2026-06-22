import {
  renderDiff,
  computeCodeDiffs,
  DIFF_MAX_LENGTH,
  DIFF_TOO_LONG
} from "@/components/coding-exercise/lib/codeDiff";
import { makeSnapshotKey, type SnapshotMap } from "@/components/coding-exercise/lib/codeSnapshotStore";
import type { ChatMessage } from "@/components/coding-exercise/lib/chat-types";

// Builds a snapshots map keyed exactly as computeCodeDiffs expects, given a list
// of [conversationIndex, content, code] tuples.
function snapshots(entries: [number, string, string][]): SnapshotMap {
  const map: SnapshotMap = {};
  for (const [index, content, code] of entries) {
    map[makeSnapshotKey(index, content)] = code;
  }
  return map;
}

function user(content: string): ChatMessage {
  return { role: "user", content };
}
function assistant(content: string): ChatMessage {
  return { role: "assistant", content };
}

describe("renderDiff", () => {
  it("returns '' when code is unchanged", () => {
    expect(renderDiff("move()\n", "move()\n")).toBe("");
  });

  it("renders a unified diff without Index/---/+++ headers", () => {
    const diff = renderDiff("move()\n", "move()\nmove()\n");
    expect(diff).toContain("@@");
    expect(diff).toContain("+move()");
    expect(diff).not.toContain("Index:");
    expect(diff).not.toContain("---");
    expect(diff).not.toContain("+++");
  });

  it("returns the too-long marker when the diff exceeds DIFF_MAX_LENGTH", () => {
    const big = Array.from({ length: 400 }, (_, i) => `line ${i}`).join("\n");
    expect(renderDiff("", big)).toBe(DIFF_TOO_LONG);
  });

  it("renders a real diff just under the limit but the marker just over it", () => {
    // Each added line is "+x\n" style; tune line content so we straddle the cap.
    const underLines = Array.from({ length: 20 }, () => "x").join("\n");
    expect(renderDiff("", underLines).length).toBeLessThanOrEqual(DIFF_MAX_LENGTH);
    expect(renderDiff("", underLines)).not.toBe(DIFF_TOO_LONG);

    const overLines = Array.from({ length: 500 }, () => "xxxxxxxxxx").join("\n");
    expect(renderDiff("", overLines)).toBe(DIFF_TOO_LONG);
  });
});

describe("computeCodeDiffs", () => {
  it("makes the first run message the base (no diff) and diffs the rest", () => {
    const messages = [user("q1"), assistant("a1"), user("q2"), assistant("a2"), user("q3")];
    const snaps = snapshots([
      [0, "q1", "move()\n"],
      [2, "q2", "move()\nmove()\n"],
      [4, "q3", "move()\nmove()\nmove()\n"]
    ]);

    const diffs = computeCodeDiffs(messages, snaps);

    expect(diffs[0]).toBeUndefined(); // base of the run
    expect(diffs[1]).toBeUndefined(); // assistant
    expect(diffs[2]).toContain("+move()"); // q2 changed code vs q1
    expect(diffs[3]).toBeUndefined(); // assistant
    expect(diffs[4]).toContain("+move()"); // q3 changed code vs q2
  });

  it("distinguishes 'no changes' ('') from 'no data' (undefined)", () => {
    const messages = [user("q1"), user("q2"), user("q3")];
    const snaps = snapshots([
      [0, "q1", "move()\n"],
      [1, "q2", "move()\n"], // identical to q1 -> no changes
      [2, "q3", "move()\nturn()\n"]
    ]);

    const diffs = computeCodeDiffs(messages, snaps);

    expect(diffs[0]).toBeUndefined(); // base
    expect(diffs[1]).toBe(""); // present but unchanged -> no changes
    expect(diffs[2]).toContain("+turn()"); // changed
  });

  it("never fabricates a diff across a middle gap (two-browser case)", () => {
    // Browser holds snapshots for q1 and q3 but not q2 (sent from another device).
    const messages = [user("q1"), user("q2"), user("q3")];
    const snaps = snapshots([
      [0, "q1", "move()\n"],
      [2, "q3", "move()\nturn()\n"]
    ]);

    const diffs = computeCodeDiffs(messages, snaps);

    // Run must end at the latest message (q3) and be unbroken: q2 missing breaks
    // it, so the run is just [q3] -> base only, no diffs anywhere.
    expect(diffs).toEqual([undefined, undefined, undefined]);
  });

  it("only diffs the contiguous run ending at the latest message", () => {
    // snapshots for q1,q2 then a gap at q3 then q4,q5 -> only q5 gets a diff.
    const messages = [user("q1"), user("q2"), user("q3"), user("q4"), user("q5")];
    const snaps = snapshots([
      [0, "q1", "a\n"],
      [1, "q2", "a\nb\n"],
      // q3 (index 2) missing
      [3, "q4", "a\nb\nc\n"],
      [4, "q5", "a\nb\nc\nd\n"]
    ]);

    const diffs = computeCodeDiffs(messages, snaps);

    expect(diffs[0]).toBeUndefined();
    expect(diffs[1]).toBeUndefined();
    expect(diffs[2]).toBeUndefined();
    expect(diffs[3]).toBeUndefined(); // base of the run
    expect(diffs[4]).toContain("+d"); // q5 diff vs q4
  });

  it("produces no diffs when snapshots don't reach the latest message", () => {
    // Latest message has no snapshot (e.g. most recent turn came from elsewhere).
    const messages = [user("q1"), user("q2")];
    const snaps = snapshots([[0, "q1", "a\n"]]); // q2 missing

    expect(computeCodeDiffs(messages, snaps)).toEqual([undefined, undefined]);
  });

  it("degrades to no diff when content drift makes the hash mismatch", () => {
    const messages = [user("q1"), user("q2")];
    // Snapshot stored under q2's index but a DIFFERENT content (conversation
    // diverged): the hash won't match, so it's treated as missing.
    const snaps = snapshots([
      [0, "q1", "a\n"],
      [1, "different content", "a\nb\n"]
    ]);

    expect(computeCodeDiffs(messages, snaps)).toEqual([undefined, undefined]);
  });
});
