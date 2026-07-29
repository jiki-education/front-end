"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSound } from "@/lib/sound";
import styles from "./SoundToggle.module.css";

export function SoundToggle() {
  const { muted, toggleMute } = useSound();
  const t = useTranslations("common.soundToggle");

  return (
    <button onClick={toggleMute} className={styles.button} aria-label={muted ? t("unmute") : t("mute")}>
      {muted ? <VolumeX className={styles.icon} /> : <Volume2 className={styles.icon} />}
    </button>
  );
}
