"use client";

import type { ReactNode } from "react";
import React, { createContext, useContext } from "react";
import { useSound } from "./useSound";
import type { SoundConfig, SoundName } from "./types";

interface SoundContextType {
  playSound: (soundName: SoundName, config?: SoundConfig) => void;
  muted: boolean;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
  volume: number;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: ReactNode }) {
  const sound = useSound();

  return <SoundContext.Provider value={sound}>{children}</SoundContext.Provider>;
}

export function useSoundContext() {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error("useSoundContext must be used within a SoundProvider");
  }
  return context;
}
