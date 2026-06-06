"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { hideModal } from "../store";
import styles from "./WelcomeModal.module.css";

const MuxPlayer = dynamic(() => import("@mux/mux-player-react"), { ssr: false });

const WELCOME_VIDEO_PLAYBACK_ID = "rhfF43a6sjaqX7E5Cxcvt7efmwn00knZZ202CvgViQRDc";

export function WelcomeModal() {
  const [watched, setWatched] = useState(false);

  return (
    <div className={styles.content}>
      <div className={styles.header}>
        <h2 className={styles.title}>Welcome to Jiki!</h2>
        <p className={styles.subtitle}>Watch this short video to get started.</p>
      </div>
      <div className={styles.videoWrapper}>
        <MuxPlayer
          playbackId={WELCOME_VIDEO_PLAYBACK_ID}
          streamType="on-demand"
          autoPlay={true}
          loop={false}
          muted={false}
          volume={0.5}
          defaultHiddenCaptions={true}
          className={styles.muxPlayer}
          onEnded={() => setWatched(true)}
        />
      </div>
      <button onClick={hideModal} disabled={!watched} className={`ui-btn ui-btn-purple ui-btn-large ${styles.cta}`}>
        Get Started
      </button>
    </div>
  );
}
