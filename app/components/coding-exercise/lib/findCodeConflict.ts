import { loadCodeMirrorContent } from "./localStorage";

// Matches the fudge the orchestrator's merge rules use, so the two never disagree.
const ONE_MINUTE = 60 * 1000;

export interface CodeConflict {
  localCode: string;
  serverCode: string;
}

/**
 * Detects when an exercise needs the student to pick between two versions of
 * their code: the one saved on this device and a meaningfully newer one saved
 * to their account (from running code on another device). Every other
 * combination resolves silently via the orchestrator's merge rules.
 */
export function findCodeConflict(
  exerciseSlug: string,
  serverData?: { code: string; createdAt?: string }
): CodeConflict | null {
  if (!serverData?.createdAt) {
    return null;
  }

  const local = loadCodeMirrorContent(exerciseSlug);
  if (!local.success || !local.data) {
    return null;
  }
  if (local.data.code === serverData.code) {
    return null;
  }

  const serverTime = new Date(serverData.createdAt).getTime();
  const localTime = new Date(local.data.storedAt).getTime();
  if (isNaN(serverTime) || isNaN(localTime)) {
    return null;
  }
  if (serverTime <= localTime + ONE_MINUTE) {
    return null;
  }

  return { localCode: local.data.code, serverCode: serverData.code };
}
