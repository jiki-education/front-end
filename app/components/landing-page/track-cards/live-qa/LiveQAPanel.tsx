"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import liveQaSession from "../../assets/live-qa-session.webp";
import fred from "../../assets/testimonials/fred.webp";
import oleksandra from "../../assets/testimonials/oleksandra.webp";
import shaun from "../../assets/testimonials/shaun.webp";
import lukas from "../../assets/testimonials/lukas.webp";
import priya from "../../assets/testimonials/priya.webp";
import { useInView } from "../../hooks/useInView";
import { ChatBubble } from "./ChatBubble";
import { EmojiBurst } from "./EmojiBurst";
import styles from "./LiveQAPanel.module.css";

const MESSAGE_INTERVAL = 3200;

// Names are people's names, so they stay put; only the messages are translated.
const SPEAKERS = [
  { key: "fred", name: "Fred", face: fred },
  { key: "oleksandra", name: "Oleksandra", face: oleksandra },
  { key: "shaun", name: "Shaun", face: shaun },
  { key: "lukas", name: "Lukas", face: lukas },
  { key: "priya", name: "Priya", face: priya }
] as const;

// The faces that pop up around the photo, and where each sits.
const WATCHERS = [
  { key: "oleksandra", face: oleksandra, place: styles.topStart },
  { key: "shaun", face: shaun, place: styles.bottomStart },
  { key: "lukas", face: lukas, place: styles.bottomEnd }
] as const;

const CHECKS = ["joinLive", "catchUp", "getSupport"] as const;

export function LiveQAPanel() {
  const t = useTranslations("landing.learnToBuild");
  // Only runs while the panel is on screen. The design's version ran from page load
  // whether or not you could see it, and never stopped.
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = setInterval(() => setCycle((c) => c + 1), MESSAGE_INTERVAL);
    return () => clearInterval(timer);
  }, [inView]);

  const speaker = SPEAKERS[cycle % SPEAKERS.length];
  // Deliberately not the person who just posted, so it reads as other people watching
  // rather than the commenter turning up twice.
  const watcher = WATCHERS.filter((w) => w.key !== speaker.key)[cycle % 2];

  return (
    <div className={styles.frame} ref={ref}>
      <Image
        src={liveQaSession}
        alt={t("liveQaAlt")}
        className={styles.image}
        sizes="(max-width: 900px) 100vw, 511px"
      />

      {/* One face pops in per message, with its reactions rising off it. Held back until
          the panel is on screen: the burst's jitter is random, so rendering it on the
          server would not match what the client then draws. */}
      {inView && (
        <span key={cycle} className={`${styles.watcher} ${watcher.place}`}>
          <Image src={watcher.face} alt="" aria-hidden="true" className={styles.watcherImage} sizes="52px" />
          <EmojiBurst cycle={cycle} />
        </span>
      )}

      <ChatBubble name={speaker.name} face={speaker.face} message={t(`liveQa_${speaker.key}`)} cycle={cycle} />

      <ul className={styles.checks}>
        {CHECKS.map((key) => (
          <li key={key} className={styles.check}>
            <svg className={styles.checkIcon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M5 13l4 4L19 7"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {t(key)}
          </li>
        ))}
      </ul>
    </div>
  );
}
