"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSound } from "@/lib/sound";

export function SoundToggle() {
  const { muted, toggleMute } = useSound();
  const t = useTranslations("common.soundToggle");

  return (
    <button
      onClick={toggleMute}
      className="p-2 rounded-lg hover:bg-bg-secondary transition-colors"
      aria-label={muted ? t("unmute") : t("mute")}
    >
      {muted ? (
        <VolumeX className="w-20 h-20 text-text-secondary" />
      ) : (
        <Volume2 className="w-20 h-20 text-text-secondary" />
      )}
    </button>
  );
}
