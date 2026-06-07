"use client";

/**
 * Flags API
 *
 * Tracks per-user flags (welcome modal dismissed, tour completed, etc).
 * Backed by the API at /internal/settings/flags/:key with a localStorage
 * cache so repeat checks are instant and survive transient API failures.
 *
 * Note: keys have a maximum length of 100 characters (enforced by the API).
 */

import { api } from "./client";

const STORAGE_PREFIX = "jiki_flag_";

interface FlagResponse {
  flagged: boolean;
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
 * Returns true if the flag is set. Checks localStorage first; on a miss,
 * falls back to the API and caches a positive result.
 */
export async function checkFlag(key: string): Promise<boolean> {
  if (readLocal(key)) {
    return true;
  }

  try {
    const response = await api.get<FlagResponse>(`/internal/settings/flags/${key}`);
    if (response.data.flagged) {
      writeLocal(key);
      return true;
    }
  } catch {
    return false;
  }

  return false;
}

/**
 * Marks the flag set, both on the server and in localStorage.
 */
export async function setFlag(key: string): Promise<void> {
  writeLocal(key);
  await api.post(`/internal/settings/flags/${key}`);
}

export function clearFlagLocal(key: string) {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.removeItem(storageKey(key));
}
