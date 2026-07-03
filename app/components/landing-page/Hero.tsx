"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ComponentProps } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import dynamic from "next/dynamic";
import { annotate } from "rough-notation";
import type JikiMuxPlayer from "@/components/ui/JikiMuxPlayer";

// Defer the dynamic() declaration until the component actually mounts (after the
// user clicks play). Declaring dynamic() at module scope creates a Suspense
// boundary in the parent server tree, which forces Next to stream metadata
// instead of shipping it in <head>.
function MuxPlayerLazy(props: ComponentProps<typeof JikiMuxPlayer>) {
  const Component = useMemo(() => dynamic(() => import("@/components/ui/JikiMuxPlayer"), { ssr: false }), []);
  return <Component {...props} />;
}

const VIDEO_POSTER_URL = "https://assets.jiki.io/landing-video-thumbnail-ef14e.webp";
import ArrowIcon from "./icons/arrow-1.svg";
import styles from "./Hero.module.css";
import shared from "./shared.module.css";
import { useScrollingTestimonials } from "./hooks/useScrollingTestimonials";
import { useHamster } from "./hooks/useHamster";
import { SignupButton } from "./SignupButton";

export function Hero() {
  const t = useTranslations("landing.hero");
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const audienceRef = useRef<HTMLParagraphElement>(null);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const can = headlineRef.current?.querySelector<HTMLElement>("[data-anim='underline-can']");

    const annotations: { hide: () => void }[] = [];

    if (can) {
      const a = annotate(can, {
        type: "underline",
        color: "#fff",
        strokeWidth: 7,
        animationDuration: 700,
        iterations: 1,
        padding: -6,
        multiline: true,
        // @ts-expect-error rough-notation supports roughness even though its types omit it
        roughness: 0.5
      });
      a.show();
      annotations.push(a);
    }

    let headlineTimer: ReturnType<typeof setTimeout> | undefined;
    const headlineTarget = headlineRef.current?.querySelector<HTMLElement>("[data-anim='highlight-headline']");
    if (headlineTarget) {
      const w = window.innerWidth;
      const isSmallHeadline = w < 640 || (w >= 1024 && w < 1190);
      const a = annotate(headlineTarget, {
        type: "underline",
        color: "#ce19e6",
        strokeWidth: isSmallHeadline ? 4 : 6,
        animationDuration: 800,
        iterations: 2,
        padding: isSmallHeadline ? [-10, 0] : [-13, 0],
        multiline: true,
        // @ts-expect-error rough-notation supports roughness even though its types omit it
        roughness: 1
      });
      headlineTimer = setTimeout(() => a.show(), 400);
      annotations.push(a);
    }

    const audienceTimers: ReturnType<typeof setTimeout>[] = [];
    const audienceTargets = audienceRef.current?.querySelectorAll<HTMLElement>("[data-anim='highlight-audience']");
    audienceTargets?.forEach((el, i) => {
      const t = setTimeout(
        () => {
          const a = annotate(el, {
            type: "underline",
            color: "#FFF176",
            strokeWidth: 3,
            animationDuration: 800,
            iterations: 1,
            padding: [-2, 6],
            multiline: true,
            // @ts-expect-error rough-notation supports roughness even though its types omit it
            roughness: 1
          });
          a.show();
          annotations.push(a);
        },
        2500 + i * 1000
      );
      audienceTimers.push(t);
    });

    return () => {
      if (headlineTimer) clearTimeout(headlineTimer);
      audienceTimers.forEach((t) => clearTimeout(t));
      annotations.forEach((a) => a.hide());
    };
  }, []);

  return (
    <div className={styles.hero}>
      <div className={[styles["container"], shared["lg-container"]].join(" ")}>
        <div className={styles["hero-lhs"]}>
          <h1 ref={headlineRef} className={styles["rock-solid"]} data-rock-solid>
            {t("headlinePart1")}
            <span data-anim="highlight-headline" className={styles.headlineHighlight}>
              {t("headlineHighlight")}
            </span>
            {t("headlinePart2")}
          </h1>
          <p ref={taglineRef} className={`${styles.tagline}`} data-tagline>
            {t.rich("tagline", {
              year: new Date().getFullYear(),
              strong: (chunks) => <strong>{chunks}</strong>
            })}
          </p>
          <p ref={audienceRef} className={`${styles.tagline} `}>
            {t("audiencePrefix")}
            <span data-anim="highlight-audience" className={styles.highlightWhite}>
              {t("audience1")}
            </span>
            {t("audienceMiddle")}
            <span data-anim="highlight-audience" className={styles.highlightWhite}>
              {t("audience2")}
            </span>
            {t("audienceAfter2")}
            <span data-anim="highlight-audience" className={styles.highlightWhite}>
              {t("audience3")}
            </span>
            {t("audienceSuffix")}
          </p>
          <div className={styles["cta-wrapper"]}>
            <SignupButton />
            <div className={styles["cta-subtext"]}>{t("ctaSubtext")}</div>
          </div>
        </div>
        <div className={styles["hero-rhs"]}>
          <div className={styles["video-container"]} data-video-container>
            {playing && (
              <div className={`${styles["video-mux-overlay"]} ${ready ? styles["ready"] : ""}`}>
                <MuxPlayerLazy
                  playbackId="zYEf6JjYXCZYUnqXllzzMaUO02aMaaMbX02m6erDKEg7A"
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
                className={styles["video-poster-button"]}
                aria-label={playing ? t("loadingVideo") : t("playVideo")}
                disabled={playing}
              >
                <Image
                  src={VIDEO_POSTER_URL}
                  alt=""
                  fill
                  priority
                  fetchPriority="high"
                  sizes="(max-width: 1023px) 100vw, 580px"
                  className={styles["video-poster-image"]}
                />
                <span className={styles["video-play-circle"]} aria-hidden="true">
                  {playing ? (
                    <span className={styles["video-spinner"]} />
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
          </div>
          <WatchPrompt />
        </div>
      </div>
      <ScrollingTestimonials />
    </div>
  );
}

function WatchPrompt() {
  const t = useTranslations("landing.hero");
  return (
    <div className={styles["watch-prompt"]}>
      <ArrowIcon width={48} height={100} className={styles["watch-arrow"]} />
      <p>{t.rich("watchPrompt", { strong: (chunks) => <span className={styles.highlightWhite}>{chunks}</span> })}</p>
    </div>
  );
}

function ScrollingTestimonials() {
  const t = useTranslations("landing.hero.marquee");
  const { hamsterRef, smokeRef, containerRef: hamsterContainerRef } = useHamster();
  const { containerRef: marqueeContainerRef, ulRef } = useScrollingTestimonials(hamsterRef);

  return (
    <div className={styles["scrolling-testimonials"]} ref={hamsterContainerRef}>
      <div className={styles.hamster} ref={hamsterRef}></div>
      <div ref={smokeRef}></div>
      <div className={styles.inner} ref={marqueeContainerRef}>
        <ul ref={ulRef}>
          {Array.from({ length: 32 }, (_, i) => (
            <li key={i}>{t(`t${i + 1}` as Parameters<typeof t>[0])}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
