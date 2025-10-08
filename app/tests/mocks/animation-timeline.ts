import type { AnimationTimeline } from "@/components/coding-exercise/lib/AnimationTimeline";

interface MockAnimationTimelineOptions {
  duration?: number; // in microseconds
  paused?: boolean;
  completed?: boolean;
  hasPlayedOrScrubbed?: boolean;
}

/**
 * Creates a mock AnimationTimeline for testing purposes.
 * All time values are in microseconds for consistency with the frame system.
 *
 * @param options - Optional overrides for AnimationTimeline properties
 * @returns A mock AnimationTimeline object that satisfies the type requirements
 */
export function createMockAnimationTimeline(options: MockAnimationTimelineOptions = {}): AnimationTimeline {
  const {
    duration = 1000000, // Default 1 second in microseconds
    paused = true,
    completed = false,
    hasPlayedOrScrubbed = false
  } = options;

  // Mock functions that can be overridden in tests if needed
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const pause = typeof jest !== "undefined" && jest.fn ? jest.fn() : () => {};
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const play = typeof jest !== "undefined" && jest.fn ? jest.fn() : () => {};
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const seek = typeof jest !== "undefined" && jest.fn ? jest.fn() : () => {};
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const onUpdate = typeof jest !== "undefined" && jest.fn ? jest.fn() : () => {};
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const clearUpdateCallbacks = typeof jest !== "undefined" && jest.fn ? jest.fn() : () => {};
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const onComplete = typeof jest !== "undefined" && jest.fn ? jest.fn() : () => {};
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const clearCompleteCallbacks = typeof jest !== "undefined" && jest.fn ? jest.fn() : () => {};

  return {
    pause,
    play,
    paused,
    duration,
    completed,
    hasPlayedOrScrubbed,
    seek,
    onUpdate,
    clearUpdateCallbacks,
    onComplete,
    clearCompleteCallbacks,
    showPlayButton: true
  } as unknown as AnimationTimeline;
}

/**
 * Creates a simple mock AnimationTimeline with just the duration set.
 * Convenience function for common test scenarios.
 *
 * @param durationInMicroseconds - Duration in microseconds
 * @returns A mock AnimationTimeline with the specified duration
 */
export function mockAnimationTimelineWithDuration(durationInMicroseconds: number): AnimationTimeline {
  return createMockAnimationTimeline({ duration: durationInMicroseconds });
}
