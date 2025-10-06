"use client";

import { useCallback, useEffect, useState } from "react";
import SoundManager from "./SoundManager";
import type { SoundConfig, SoundName } from "./types";

export function useSound() {
  const [muted, setMuted] = useState(false);
  const soundManager = SoundManager.getInstance();

  useEffect(() => {
    setMuted(soundManager.isMuted());
  }, [soundManager]);

  const playSound = useCallback(
    (soundName: SoundName, config?: SoundConfig) => {
      soundManager.play(soundName, config);
    },
    [soundManager]
  );

  const toggleMute = useCallback(() => {
    const newMuted = !muted;
    soundManager.setMuted(newMuted);
    setMuted(newMuted);
  }, [muted, soundManager]);

  const setVolume = useCallback(
    (volume: number) => {
      soundManager.setGlobalVolume(volume);
    },
    [soundManager]
  );

  return {
    playSound,
    muted,
    toggleMute,
    setVolume,
    volume: soundManager.getGlobalVolume()
  };
}
