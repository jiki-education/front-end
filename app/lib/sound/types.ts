export type SoundName = "success" | "error" | "task-completed";

export interface SoundConfig {
  volume?: number;
  loop?: boolean;
  preload?: boolean;
}

export interface SoundManagerOptions {
  defaultVolume?: number;
  muted?: boolean;
}
