import type { SoundConfig, SoundManagerOptions, SoundName } from "./types";

class SoundManager {
  private static instance: SoundManager | null = null;
  private readonly sounds: Map<SoundName, HTMLAudioElement> = new Map();
  private readonly basePath: string;
  private globalVolume: number;
  private muted: boolean;

  private constructor(options: SoundManagerOptions = {}) {
    this.basePath = options.basePath || "/sounds";
    this.globalVolume = options.defaultVolume || 0.5;
    this.muted = options.muted || false;

    // Load mute preference from localStorage
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("soundMuted");
      if (stored !== null) {
        this.muted = stored === "true";
      }
    }

    // Start preloading sounds asynchronously
    this.preloadSounds();
  }

  static getInstance(options?: SoundManagerOptions): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager(options);
    }
    return SoundManager.instance;
  }

  private preloadSounds() {
    // Only preload sounds in browser environment
    if (typeof window === "undefined" || typeof Audio === "undefined") {
      return;
    }

    const soundFiles: Record<SoundName, string> = {
      success: "success.wav",
      error: "error.wav"
    };

    for (const [name, file] of Object.entries(soundFiles) as Array<[SoundName, string]>) {
      try {
        const audio = new Audio(`${this.basePath}/${file}`);
        audio.preload = "auto";
        audio.volume = this.globalVolume;
        this.sounds.set(name, audio);
      } catch (error) {
        console.warn(`Failed to preload sound: ${name}`, error);
      }
    }
  }

  play(soundName: SoundName, config: SoundConfig = {}): void {
    if (this.muted) {
      return;
    }

    const audio = this.sounds.get(soundName);
    if (!audio) {
      console.warn(`Sound not found: ${soundName}`);
      return;
    }

    try {
      // Clone the audio to allow overlapping plays
      const audioClone = audio.cloneNode() as HTMLAudioElement;
      audioClone.volume = config.volume ?? this.globalVolume;
      audioClone.loop = config.loop ?? false;

      // Clean up after playing
      audioClone.addEventListener("ended", () => {
        audioClone.remove();
      });

      audioClone.play().catch((error) => {
        console.warn(`Failed to play sound: ${soundName}`, error);
      });
    } catch (error) {
      console.warn(`Error playing sound: ${soundName}`, error);
    }
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    if (typeof window !== "undefined") {
      localStorage.setItem("soundMuted", String(muted));
    }
  }

  isMuted(): boolean {
    return this.muted;
  }

  setGlobalVolume(volume: number): void {
    this.globalVolume = Math.max(0, Math.min(1, volume));
    this.sounds.forEach((audio) => {
      audio.volume = this.globalVolume;
    });
  }

  getGlobalVolume(): number {
    return this.globalVolume;
  }
}

export default SoundManager;
