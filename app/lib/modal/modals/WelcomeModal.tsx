"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Tooltip from "@/components/ui/Tooltip";
import { hideModal } from "../store";
import styles from "./WelcomeModal.module.css";

const MuxPlayer = dynamic(() => import("@/components/ui/JikiMuxPlayer"), { ssr: false });

const WELCOME_VIDEO_PLAYBACK_ID = "rhfF43a6sjaqX7E5Cxcvt7efmwn00knZZ202CvgViQRDc";
const VIDEO_LOAD_FALLBACK_MS = 5000;

export function WelcomeModal() {
  const [watched, setWatched] = useState(false);
  const [canPlay, setCanPlay] = useState(false);

  useEffect(() => {
    if (canPlay) {
      return;
    }
    const timer = setTimeout(() => setWatched(true), VIDEO_LOAD_FALLBACK_MS);
    return () => clearTimeout(timer);
  }, [canPlay]);

  const button = (
    <button
      onClick={watched ? hideModal : undefined}
      aria-disabled={!watched}
      style={watched ? undefined : { opacity: 0.5, cursor: "not-allowed" }}
      className={`ui-btn ui-btn-purple ui-btn-large ${styles.cta}`}
    >
      Get Started
    </button>
  );

  return (
    <div className={styles.content}>
      <div className={styles.header}>
        <h2 className={styles.title}>Welcome to Jiki!</h2>
        <p className={styles.subtitle}>Watch this short video to get started.</p>
      </div>
      <div className={styles.videoWrapper}>
        <MuxPlayer
          playbackId={WELCOME_VIDEO_PLAYBACK_ID}
          autoPlay={true}
          className={styles.muxPlayer}
          onCanPlay={() => setCanPlay(true)}
          onEnded={() => setWatched(true)}
        />
      </div>
      {watched ? (
        button
      ) : (
        <Tooltip content="Please watch the video to continue" placement="top">
          {button}
        </Tooltip>
      )}
    </div>
  );
}
