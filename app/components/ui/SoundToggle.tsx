"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useSound } from "@/lib/sound";

export function SoundToggle() {
  const { muted, toggleMute } = useSound();

  return (
    <button
      onClick={toggleMute}
      className="p-2 rounded-lg hover:bg-bg-secondary transition-colors"
      aria-label={muted ? "Unmute sounds" : "Mute sounds"}
    >
      {muted ? (
        <VolumeX className="w-20 h-20 text-text-secondary" />
      ) : (
        <Volume2 className="w-20 h-20 text-text-secondary" />
      )}
    </button>
  );
}
