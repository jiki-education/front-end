"use client";

import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import Modal from "react-modal";
import MuxPlayer, { type MuxPlayerRefAttributes } from "@/components/ui/JikiMuxPlayer";
import { hideModal } from "../store";
import { ConfirmationModal } from "./ConfirmationModal";
import baseStyles from "@/app/styles/components/modals.module.css";
import confirmStyles from "@/app/styles/components/confirmation-modal.module.css";
import styles from "./WelcomeModal.module.css";

const WELCOME_VIDEO_PLAYBACK_ID = "rhfF43a6sjaqX7E5Cxcvt7efmwn00knZZ202CvgViQRDc";

export function WelcomeModal() {
  const t = useTranslations("modals.welcome");
  const tCommon = useTranslations("common");
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

  const resumeVideo = () => {
    setConfirmSkip(false);
    playerRef.current?.play().catch(() => {
      // Browser may block programmatic playback; the user can resume manually.
    });
  };

  return (
    <div className={styles.content}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t("title")}</h2>
        <p className={styles.subtitle}>{t("subtitle")}</p>
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
      <button onClick={handleContinue} className={`ui-btn ui-btn-primary ui-btn-purple ui-btn-large ${styles.cta}`}>
        {tCommon("continue")}
      </button>
      {/* Nested dialog: cancel must leave WelcomeModal open, so closeOnAction={false}. */}
      <Modal
        isOpen={confirmSkip}
        onRequestClose={resumeVideo}
        className={`${baseStyles.modal} ${confirmStyles.modal}`}
        overlayClassName={`${baseStyles.modalOverlay} ${styles.skipConfirmOverlay}`}
        ariaHideApp={false}
      >
        <ConfirmationModal
          title={t("skipTitle")}
          message={t("skipMessage")}
          confirmText={t("skipConfirm")}
          cancelText={t("skipCancel")}
          closeOnAction={false}
          onConfirm={hideModal}
          onCancel={resumeVideo}
        />
      </Modal>
    </div>
  );
}
