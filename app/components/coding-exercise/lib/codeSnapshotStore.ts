/**
 * Per-message code snapshots, persisted to localStorage.
 *
 * To let the LLM see how a student's code evolved across a conversation, we
 * store the full editor contents at the moment each user message is sent. Diffs
 * between consecutive snapshots are derived later (see codeDiff.ts); snapshots
 * are the source of truth because only they let us distinguish "the student
 * changed nothing" from "we have no data for that message".
 *
 * Snapshots are keyed by message IDENTITY (position in the shared, append-only
 * conversation + a hash of the message content), NOT by tail position. That is
 * what makes cross-device use correct: if a student alternates browsers, each
 * browser only holds snapshots for the messages it sent, and identity-based
 * lookup represents those gaps faithfully instead of mis-pairing snapshots with
 * the wrong messages. A hash mismatch (e.g. after the conversation diverges)
 * simply yields "no snapshot", so we degrade to showing no diff rather than a
 * wrong one.
 */

// Keep at most this many snapshots per conversation. The proxy only renders the
// last 10 history messages, so a small buffer beyond that is plenty; we prune
// the oldest (lowest-index) entries to keep localStorage bounded.
const MAX_SNAPSHOTS = 15;

const STORAGE_VERSION = 1;
const KEY_PREFIX = "jiki_code_snapshots_";

export type SnapshotMap = Record<string, string>;

interface StoredSnapshots {
  version: number;
  conversationKey: string;
  storedAt: string;
  snapshots: SnapshotMap;
}

function isLocalStorageAvailable(): boolean {
  try {
    const testKey = "__test__";
    localStorage.setItem(testKey, "test");
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * A small, fast, dependency-free string hash (FNV-1a). Collisions only ever
 * cause a snapshot to be treated as missing, so a 32-bit hash is ample here.
 */
export function shortHash(str: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(36);
}

/**
 * Builds the snapshot key for a message: its absolute index in the conversation
 * plus a hash of its content. Index gives stable identity across devices/reloads
 * (the conversation is append-only); the content hash guards against drift.
 */
export function makeSnapshotKey(index: number, content: string): string {
  return `${index}:${shortHash(content)}`;
}

function storageKeyFor(conversationKey: string): string {
  return `${KEY_PREFIX}${conversationKey}`;
}

function indexFromSnapshotKey(snapshotKey: string): number {
  return Number.parseInt(snapshotKey.slice(0, snapshotKey.indexOf(":")), 10);
}

/**
 * Loads all stored snapshots for a conversation. Returns an empty map if none
 * are stored or localStorage is unavailable/corrupt.
 */
export function getSnapshots(conversationKey: string): SnapshotMap {
  if (!isLocalStorageAvailable()) {
    return {};
  }

  try {
    const stored = localStorage.getItem(storageKeyFor(conversationKey));
    if (!stored) {
      return {};
    }

    const parsed = JSON.parse(stored) as StoredSnapshots;
    if (parsed.version !== STORAGE_VERSION || parsed.conversationKey !== conversationKey) {
      return {};
    }

    return parsed.snapshots;
  } catch {
    return {};
  }
}

/**
 * Stores a single snapshot, pruning the oldest entries to stay within
 * MAX_SNAPSHOTS. Failures (quota, unavailable storage) are swallowed: a missing
 * snapshot only means a diff won't be shown, never a broken send.
 */
export function saveSnapshot(conversationKey: string, index: number, content: string, code: string): void {
  if (!isLocalStorageAvailable()) {
    return;
  }

  const snapshots = getSnapshots(conversationKey);
  snapshots[makeSnapshotKey(index, content)] = code;

  // Prune oldest (lowest-index) entries when over the cap.
  const keys = Object.keys(snapshots);
  if (keys.length > MAX_SNAPSHOTS) {
    keys
      .sort((a, b) => indexFromSnapshotKey(a) - indexFromSnapshotKey(b))
      .slice(0, keys.length - MAX_SNAPSHOTS)
      .forEach((key) => delete snapshots[key]);
  }

  const data: StoredSnapshots = {
    version: STORAGE_VERSION,
    conversationKey,
    storedAt: new Date().toISOString(),
    snapshots
  };

  try {
    localStorage.setItem(storageKeyFor(conversationKey), JSON.stringify(data));
  } catch {
    // Ignore quota / write failures - diffs are best-effort.
  }
}
