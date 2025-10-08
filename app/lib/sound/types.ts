export type SoundName = "success" | "error" | "task-completed";

export interface SoundConfig {
  volume?: number;
  loop?: boolean;
  preload?: boolean;
}

export interface SoundManagerOptions {
  basePath?: string;
  defaultVolume?: number;
  muted?: boolean;
}
