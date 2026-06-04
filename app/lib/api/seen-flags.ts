"use client";

/**
 * Seen Flags API
 *
 * Tracks "things the user has seen" (welcome modal, feature announcements, etc).
 * Backed by the API at /internal/settings/seen_flags/:key with a localStorage
 * cache so repeat checks are instant and survive transient API failures.
 *
 * Note: keys have a maximum length of 100 characters (enforced by the API).
 */

import { api } from "./client";

const STORAGE_PREFIX = "jiki_seen_flag_";

interface SeenFlagResponse {
  seen: boolean;
}

function storageKey(key: string) {
  return `${STORAGE_PREFIX}${key}`;
}

function readLocal(key: string): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return localStorage.getItem(storageKey(key)) === "true";
}

function writeLocal(key: string) {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.setItem(storageKey(key), "true");
}

/**
 * Returns true if the flag is seen. Checks localStorage first; on a miss,
 * falls back to the API and caches a positive result.
 */
export async function checkSeenFlag(key: string): Promise<boolean> {
  if (readLocal(key)) {
    return true;
  }

  try {
    const response = await api.get<SeenFlagResponse>(`/internal/settings/seen_flags/${key}`);
    if (response.data.seen) {
      writeLocal(key);
      return true;
    }
  } catch {
    return false;
  }

  return false;
}

/**
 * Marks the flag as seen, both on the server and in localStorage.
 */
export async function setSeenFlag(key: string): Promise<void> {
  writeLocal(key);
  await api.post<SeenFlagResponse>(`/internal/settings/seen_flags/${key}`);
}

export function clearSeenFlagLocal(key: string) {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.removeItem(storageKey(key));
}
