"use client";

import { useMemo, useState } from "react";
import type { ComponentProps } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import dynamic from "next/dynamic";
import type JikiMuxPlayer from "@/components/ui/JikiMuxPlayer";
import spiralArrow from "../assets/arrow-spiral-purple.png";
import styles from "./HeroVideo.module.css";

const VIDEO_POSTER_URL = "https://assets.jiki.io/landing-video-thumbnail-ef14e.webp";
const PLAYBACK_ID = "zYEf6JjYXCZYUnqXllzzMaUO02aMaaMbX02m6erDKEg7A";

// Defer the dynamic() declaration until the component actually mounts (after the
// user clicks play). Declaring dynamic() at module scope creates a Suspense
// boundary in the parent server tree, which forces Next to stream metadata
// instead of shipping it in <head>.
function MuxPlayerLazy(props: ComponentProps<typeof JikiMuxPlayer>) {
  const Component = useMemo(() => dynamic(() => import("@/components/ui/JikiMuxPlayer"), { ssr: false }), []);
  return <Component {...props} />;
}

export function HeroVideo() {
  const t = useTranslations("landing.hero");
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);

  return (
    <div className={styles.container} data-video-container>
      {playing && (
        <div className={`${styles.muxOverlay} ${ready ? styles.ready : ""}`}>
          <MuxPlayerLazy
            playbackId={PLAYBACK_ID}
            poster={VIDEO_POSTER_URL}
            autoPlay
            // Reveal mux's UI on any of: canplay (iOS Safari may block autoplay so `playing` never fires),
            // playing (normal happy path), error (so mux's own error UI replaces our spinner).
            onCanPlay={() => setReady(true)}
            onPlaying={() => setReady(true)}
            onError={() => setReady(true)}
            metadata={{ video_title: "Waiting Page 1" }}
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              ["--seek-backward-button" as string]: "none",
              ["--seek-forward-button" as string]: "none"
            }}
          />
        </div>
      )}
      {!ready && (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className={styles.posterButton}
          aria-label={playing ? t("loadingVideo") : t("playVideo")}
          disabled={playing}
        >
          <Image
            src={VIDEO_POSTER_URL}
            alt=""
            fill
            priority
            fetchPriority="high"
            sizes="(max-width: 1023px) 100vw, 560px"
            className={styles.posterImage}
          />
          <span className={styles.playCircle} aria-hidden="true">
            {playing ? (
              <span className={styles.spinner} />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="m4.79386 21.6974 -1.49723 0.858V1.44481l1.49723 0.85806L20.2007 11.1325l1.5139 0.8676 -1.5139 0.8676 -15.40684 8.8297Z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </span>
        </button>
      )}
      {/* Decorative: leads the eye from the video down to the handwritten prompt. */}
      <Image src={spiralArrow} alt="" aria-hidden="true" className={styles.spiral} />
    </div>
  );
}
