/**
 * Robust localStorage system for CodeMirror content
 * Handles exercise-specific storage with error handling and fallbacks
 */

export interface CodeMirrorLocalStorageData {
  code: string;
  storedAt: string;
  readonlyRanges?: { from: number; to: number }[];
  exerciseId: string;
  version: number; // For future migrations
}

export interface LocalStorageResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Version for data structure - increment when changing data format
const STORAGE_VERSION = 1;

// Key prefix for all CodeMirror localStorage entries
const KEY_PREFIX = "jiki_exercise_";

/**
 * Generates a localStorage key for a specific exercise
 */
function getStorageKey(exerciseId: string): string {
  return `${KEY_PREFIX}${exerciseId}`;
}

/**
 * Checks if localStorage is available and functional
 */
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
 * Safely parses JSON with error handling
 */
function safeParse<T>(jsonString: string): LocalStorageResult<T> {
  try {
    const data = JSON.parse(jsonString) as T;
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to parse JSON"
    };
  }
}

/**
 * Safely stringifies data with error handling
 */
function safeStringify<T>(data: T): LocalStorageResult<string> {
  try {
    const jsonString = JSON.stringify(data);
    return { success: true, data: jsonString };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to stringify data"
    };
  }
}

/**
 * Saves CodeMirror content to localStorage
 */
export function saveCodeMirrorContent(
  exerciseId: string,
  code: string,
  readonlyRanges?: { from: number; to: number }[]
): LocalStorageResult<void> {
  if (!isLocalStorageAvailable()) {
    return { success: false, error: "localStorage is not available" };
  }

  const data: CodeMirrorLocalStorageData = {
    code,
    storedAt: new Date().toISOString(),
    readonlyRanges,
    exerciseId,
    version: STORAGE_VERSION
  };

  const stringifyResult = safeStringify(data);
  if (!stringifyResult.success) {
    return { success: false, error: stringifyResult.error };
  }

  try {
    const key = getStorageKey(exerciseId);
    localStorage.setItem(key, stringifyResult.data!);
    return { success: true };
  } catch (error) {
    // Handle quota exceeded or other storage errors
    if (error instanceof Error && error.name === "QuotaExceededError") {
      return { success: false, error: "Storage quota exceeded" };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save to localStorage"
    };
  }
}

/**
 * Loads CodeMirror content from localStorage
 */
export function loadCodeMirrorContent(exerciseId: string): LocalStorageResult<CodeMirrorLocalStorageData> {
  if (!isLocalStorageAvailable()) {
    return { success: false, error: "localStorage is not available" };
  }

  try {
    const key = getStorageKey(exerciseId);
    const stored = localStorage.getItem(key);

    if (!stored) {
      return { success: false, error: "No data found for this exercise" };
    }

    const parseResult = safeParse<CodeMirrorLocalStorageData>(stored);
    if (!parseResult.success) {
      return parseResult;
    }

    const data = parseResult.data!;

    // Version check for future migrations
    if (data.version !== STORAGE_VERSION) {
      return {
        success: false,
        error: `Data version mismatch. Expected ${STORAGE_VERSION}, got ${data.version}`
      };
    }

    // Validate exercise ID matches
    if (data.exerciseId !== exerciseId) {
      return {
        success: false,
        error: "Exercise ID mismatch in stored data"
      };
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to load from localStorage"
    };
  }
}

/**
 * Removes CodeMirror content for a specific exercise
 */
export function clearCodeMirrorContent(exerciseId: string): LocalStorageResult<void> {
  if (!isLocalStorageAvailable()) {
    return { success: false, error: "localStorage is not available" };
  }

  try {
    const key = getStorageKey(exerciseId);
    localStorage.removeItem(key);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to clear localStorage"
    };
  }
}

/**
 * Gets all stored exercises (for cleanup/management)
 */
export function getAllStoredExercises(): LocalStorageResult<string[]> {
  if (!isLocalStorageAvailable()) {
    return { success: false, error: "localStorage is not available" };
  }

  try {
    const exerciseIds: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(KEY_PREFIX)) {
        const exerciseId = key.substring(KEY_PREFIX.length);
        exerciseIds.push(exerciseId);
      }
    }

    return { success: true, data: exerciseIds };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get stored exercises"
    };
  }
}

/**
 * Cleanup old entries (older than specified days)
 */
export function cleanupOldEntries(maxAgeInDays: number = 30): LocalStorageResult<number> {
  if (!isLocalStorageAvailable()) {
    return { success: false, error: "localStorage is not available" };
  }

  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - maxAgeInDays);

    let removedCount = 0;
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(KEY_PREFIX)) {
        const stored = localStorage.getItem(key);
        if (stored) {
          const parseResult = safeParse<CodeMirrorLocalStorageData>(stored);
          if (parseResult.success && parseResult.data) {
            const storedDate = new Date(parseResult.data.storedAt);
            if (storedDate < cutoffDate) {
              keysToRemove.push(key);
            }
          }
        }
      }
    }

    // Remove old entries
    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
      removedCount++;
    });

    return { success: true, data: removedCount };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to cleanup old entries"
    };
  }
}
