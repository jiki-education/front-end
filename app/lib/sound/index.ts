import SoundManager from "./SoundManager";
import type { SoundConfig, SoundName } from "./types";

// Initialize sound manager
const soundManager = SoundManager.getInstance();

// Simple function that can be called from anywhere
export function playSound(soundName: SoundName, config?: SoundConfig): void {
  soundManager.play(soundName, config);
}

// Export everything for flexibility
export { SoundManager };
export { useSound } from "./useSound";
export { SoundProvider, useSoundContext } from "./SoundProvider";
export type { SoundConfig, SoundManagerOptions, SoundName } from "./types";
