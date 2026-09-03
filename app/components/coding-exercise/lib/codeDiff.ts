/**
 * Derives per-message code diffs from stored snapshots (see codeSnapshotStore.ts)
 * so the LLM can see how a student's code evolved across the conversation.
 *
 * The diff shown for a user message is a unified diff of what the student
 * changed in their code SINCE THEIR PREVIOUS MESSAGE. Diffs are only produced
 * for the longest unbroken run of snapshots ending at the most recent message,
 * so a gap (e.g. messages sent from another browser) never produces a misleading
 * diff that spans code we never saw - it just produces no diff there.
 */

import { structuredPatch } from "diff";
import type { ChatMessage } from "./chat-types";
import { getSnapshots, makeSnapshotKey, type SnapshotMap } from "./codeSnapshotStore";

// A diff longer than this is replaced wholesale with a marker. A partial diff is
// worse than none: the model can't tell it's incomplete and may "fix" code it
// can't see. Mirrored by DIFF_MAX_LENGTH in the proxy's prompt-builder.
export const DIFF_MAX_LENGTH = 1000;

// Sentinel sent in place of an over-length diff (saves shipping a huge diff the
// proxy would only discard). The proxy renders it as "[Diff too long to render]"
// and independently re-applies the length guard.
export const DIFF_TOO_LONG = "[Diff too long to render]";

/**
 * Renders a minimal diff of two code snapshots: only the changed lines (no
 * surrounding context, no file headers), each prefixed with its line number so
 * the model knows where the change is without us shipping the unchanged code.
 * Removed lines carry their old line number, added lines their new one (for a
 * straight replacement these coincide). Returns:
 * - "" when the code is unchanged (a real signal: they asked without editing)
 * - DIFF_TOO_LONG when the diff exceeds DIFF_MAX_LENGTH
 * - lines like "6: -walk(3)" / "6: +walk(4)" otherwise
 */
export function renderDiff(oldCode: string, newCode: string): string {
  if (oldCode === newCode) {
    return "";
  }

  const patch = structuredPatch("a", "b", oldCode, newCode, "", "", { context: 0 });

  const lines: string[] = [];
  for (const hunk of patch.hunks) {
    let oldLine = hunk.oldStart;
    let newLine = hunk.newStart;
    for (const line of hunk.lines) {
      const marker = line[0];
      if (marker === "+") {
        lines.push(`${newLine}: ${line}`);
        newLine++;
      } else if (marker === "-") {
        lines.push(`${oldLine}: ${line}`);
        oldLine++;
      }
      // Context lines don't occur with context: 0; "\ No newline at end of file"
      // markers (marker === "\\") are skipped as noise.
    }
  }

  const text = lines.join("\n");
  if (text.length === 0) {
    return "";
  }
  return text.length > DIFF_MAX_LENGTH ? DIFF_TOO_LONG : text;
}

/**
 * Computes the code diff for every message, parallel to the input array.
 *
 * - assistant messages and user messages outside the contiguous run -> undefined
 * - the first message of the run (the base) -> undefined (nothing to diff against)
 * - subsequent run messages -> renderDiff result ("" / diff text / DIFF_TOO_LONG)
 */
export function computeCodeDiffs(messages: ChatMessage[], snapshots: SnapshotMap): (string | undefined)[] {
  const result: (string | undefined)[] = new Array(messages.length).fill(undefined);

  const userIndices = messages.map((m, i) => (m.role === "user" ? i : -1)).filter((i) => i !== -1);

  const hasSnapshot = (i: number) => makeSnapshotKey(i, messages[i].content) in snapshots;

  // The run is the longest suffix of user messages that all have snapshots.
  const run: number[] = [];
  for (let k = userIndices.length - 1; k >= 0; k--) {
    if (!hasSnapshot(userIndices[k])) {
      break;
    }
    run.unshift(userIndices[k]);
  }

  for (let k = 1; k < run.length; k++) {
    const prev = run[k - 1];
    const curr = run[k];
    const oldCode = snapshots[makeSnapshotKey(prev, messages[prev].content)];
    const newCode = snapshots[makeSnapshotKey(curr, messages[curr].content)];
    result[curr] = renderDiff(oldCode, newCode);
  }

  return result;
}

/**
 * Convenience wrapper used at send time: loads the conversation's snapshots and
 * returns the diffs for `messages` (the prior history plus the just-sent message
 * as the final entry). The caller splits the final entry off as the diff leading
 * into the current code.
 */
export function buildCodeDiffs(conversationKey: string, messages: ChatMessage[]): (string | undefined)[] {
  return computeCodeDiffs(messages, getSnapshots(conversationKey));
}
