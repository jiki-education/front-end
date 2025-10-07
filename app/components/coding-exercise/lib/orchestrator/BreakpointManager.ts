import type { StoreApi } from "zustand/vanilla";
import type { Frame } from "@jiki/interpreters";
import type { OrchestratorStore } from "../types";

/**
 * Manages breakpoint-related navigation and state
 */
export class BreakpointManager {
  constructor(private readonly store: StoreApi<OrchestratorStore>) {}

  /**
   * Static helper to find the previous frame that matches a breakpoint line
   * @param currentFrame - The current frame
   * @param frames - All available frames
   * @param breakpoints - Array of line numbers with breakpoints
   * @param foldedLines - Array of line numbers that are folded
   * @returns The previous breakpoint frame or undefined if none exists
   */
  static findPrevBreakpointFrame(
    currentFrame: Frame | undefined | null,
    frames: Frame[],
    breakpoints: number[],
    foldedLines: number[]
  ): Frame | undefined {
    if (!currentFrame || breakpoints.length === 0 || frames.length === 0) {
      return undefined;
    }

    // Filter breakpoints to exclude folded lines
    const visibleBreakpoints = breakpoints.filter((line) => !foldedLines.includes(line));
    if (visibleBreakpoints.length === 0) {
      return undefined;
    }

    // Find all frames before current frame that match a visible breakpoint
    const candidateFrames = frames.filter((frame) => {
      return frame.time < currentFrame.time && visibleBreakpoints.includes(frame.line);
    });

    if (candidateFrames.length === 0) {
      return undefined;
    }

    // Return the last (most recent) frame before current
    return candidateFrames[candidateFrames.length - 1];
  }

  /**
   * Static helper to find the next frame that matches a breakpoint line
   * @param currentFrame - The current frame
   * @param frames - All available frames
   * @param breakpoints - Array of line numbers with breakpoints
   * @param foldedLines - Array of line numbers that are folded
   * @returns The next breakpoint frame or undefined if none exists
   */
  static findNextBreakpointFrame(
    currentFrame: Frame | undefined | null,
    frames: Frame[],
    breakpoints: number[],
    foldedLines: number[]
  ): Frame | undefined {
    if (!currentFrame || breakpoints.length === 0 || frames.length === 0) {
      return undefined;
    }

    // Filter breakpoints to exclude folded lines
    const visibleBreakpoints = breakpoints.filter((line) => !foldedLines.includes(line));
    if (visibleBreakpoints.length === 0) {
      return undefined;
    }

    // Find the first frame after current that matches a visible breakpoint
    for (const frame of frames) {
      if (frame.time > currentFrame.time && visibleBreakpoints.includes(frame.line)) {
        return frame;
      }
    }

    return undefined;
  }

  /**
   * Navigate to the previous breakpoint
   */
  goToPrevBreakpoint(): void {
    const state = this.store.getState();
    if (state.prevBreakpointFrame) {
      state.setCurrentTestTime(state.prevBreakpointFrame.time);
    }
  }

  /**
   * Navigate to the next breakpoint
   */
  goToNextBreakpoint(): void {
    const state = this.store.getState();
    if (state.nextBreakpointFrame) {
      state.setCurrentTestTime(state.nextBreakpointFrame.time);
    }
  }
}
