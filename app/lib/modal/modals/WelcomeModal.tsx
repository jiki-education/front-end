"use client";

import dynamic from "next/dynamic";
import { hideModal } from "../store";
import CrossIcon from "@/icons/cross.svg";
import styles from "./WelcomeModal.module.css";

const MuxPlayer = dynamic(() => import("@mux/mux-player-react"), { ssr: false });

// TODO: Replace with the real welcome video playback ID once available
const WELCOME_VIDEO_PLAYBACK_ID = "PNbgUkVhy38y7OELdYseo1GAD01XG8FGLJ1nj9BvuKCU";

export function WelcomeModal() {
  return (
    <div className={styles.overlay}>
      <button className={styles.closeButton} onClick={hideModal}>
        <CrossIcon className={styles.closeIcon} />
        Close
      </button>
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            Welcome to <span className={styles.highlight}>Jiki!</span>
          </h2>
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
            className={styles.muxPlayer}
            onEnded={hideModal}
          />
        </div>
        <button onClick={hideModal} className="ui-btn ui-btn-primary ui-btn-large">
          Get started
        </button>
      </div>
    </div>
  );
}
