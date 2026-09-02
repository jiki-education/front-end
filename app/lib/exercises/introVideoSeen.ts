// Whether a student has already been shown an exercise's intro video.
//
// Local to the browser on purpose: the intro is a nicety, not progress the API
// tracks, and the cost of a second device replaying it once is smaller than the
// cost of a round trip on every exercise open. A blocked localStorage (private
// browsing, quota) reads as "already seen" so a failure can never trap someone
// behind a modal they cannot dismiss for good.

const STORAGE_KEY_PREFIX = "exercise-intro-video-seen-";

function storageKey(exerciseSlug: string): string {
  return `${STORAGE_KEY_PREFIX}${exerciseSlug}`;
}

export function hasSeenIntroVideo(exerciseSlug: string): boolean {
  try {
    return localStorage.getItem(storageKey(exerciseSlug)) !== null;
  } catch {
    return true;
  }
}

export function markIntroVideoSeen(exerciseSlug: string): void {
  try {
    localStorage.setItem(storageKey(exerciseSlug), "1");
  } catch {
    // Ignore — the student just sees the intro again next time.
  }
}
