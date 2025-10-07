import { Frame } from "@shared/frames";

/**
 * Type-safe helper to get a frame at a specific index
 * This helps avoid TypeScript "Object is possibly 'undefined'" errors
 */
export function getFrame(frames: Frame[], index: number): Frame {
  const frame = frames[index];
  if (!frame) {
    throw new Error(`Expected frame at index ${index}, but frames array has length ${frames.length}`);
  }
  return frame;
}

/**
 * Type-safe helper to get the first frame
 */
export function getFirstFrame(frames: Frame[]): Frame {
  return getFrame(frames, 0);
}

/**
 * Type-safe helper to get the last frame
 */
export function getLastFrame(frames: Frame[]): Frame {
  return getFrame(frames, frames.length - 1);
}
