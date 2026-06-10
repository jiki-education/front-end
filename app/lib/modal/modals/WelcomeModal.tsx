"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { MuxPlayerRefAttributes } from "@/components/ui/JikiMuxPlayer";
import { hideModal } from "../store";
import baseStyles from "@/app/styles/components/modals.module.css";
import confirmStyles from "@/app/styles/components/confirmation-modal.module.css";
import styles from "./WelcomeModal.module.css";

const MuxPlayer = dynamic(() => import("@/components/ui/JikiMuxPlayer"), { ssr: false });

const WELCOME_VIDEO_PLAYBACK_ID = "rhfF43a6sjaqX7E5Cxcvt7efmwn00knZZ202CvgViQRDc";

export function WelcomeModal() {
  const playerRef = useRef<MuxPlayerRefAttributes>(null);
  const [watched, setWatched] = useState(false);
  const [confirmSkip, setConfirmSkip] = useState(false);

  const handleContinue = () => {
    if (watched) {
      hideModal();
      return;
    }
    playerRef.current?.pause();
    setConfirmSkip(true);
  };

  const handleKeepWatching = () => {
    setConfirmSkip(false);
    playerRef.current?.play().catch(() => {
      // Browser may block programmatic playback; the user can resume manually.
    });
  };

  return (
    <div className={styles.content}>
      <div className={styles.header}>
        <h2 className={styles.title}>Welcome to Jiki!</h2>
        <p className={styles.subtitle}>Watch this short video to get started.</p>
      </div>
      <div className={styles.videoWrapper}>
        <MuxPlayer
          ref={playerRef}
          playbackId={WELCOME_VIDEO_PLAYBACK_ID}
          autoPlay={true}
          className={styles.muxPlayer}
          onEnded={() => setWatched(true)}
        />
      </div>
      <button onClick={handleContinue} className={`ui-btn ui-btn-purple ui-btn-large ${styles.cta}`}>
        Continue
      </button>
      {confirmSkip &&
        typeof document !== "undefined" &&
        createPortal(
          <div className={baseStyles.modalOverlay} style={{ zIndex: 1100 }}>
            <div className={`${baseStyles.modal} ${confirmStyles.modal}`} role="dialog" aria-modal="true">
              <h2 className={confirmStyles.modalTitle}>Skip the welcome video?</h2>
              <p className={confirmStyles.modalMessage}>
                This video helps you get the most out of Jiki. Are you sure you want to skip it?
              </p>
              <div className={confirmStyles.modalButtons}>
                <button
                  onClick={handleKeepWatching}
                  className="ui-btn ui-btn-tertiary ui-btn-default whitespace-nowrap"
                >
                  Keep watching
                </button>
                <button onClick={hideModal} className="ui-btn ui-btn-primary ui-btn-default whitespace-nowrap">
                  Skip video
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
