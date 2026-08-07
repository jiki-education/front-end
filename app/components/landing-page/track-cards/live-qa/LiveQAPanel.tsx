"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import liveQaSession from "../../assets/live-qa-session.webp";
import fred from "../../assets/testimonials/fred.webp";
import oleksandra from "../../assets/testimonials/oleksandra.webp";
import shaun from "../../assets/testimonials/shaun.webp";
import lukas from "../../assets/testimonials/lukas.webp";
import drac from "../../assets/testimonials/drac.webp";
import thom from "../../assets/testimonials/thom.webp";
import sharpiemath from "../../assets/testimonials/sharpiemath.webp";
import nanouss01 from "../../assets/testimonials/nanouss01.webp";
import jj from "../../assets/testimonials/jj.webp";
import kcash from "../../assets/testimonials/kcash.webp";
import mArtigiani from "../../assets/testimonials/m_artigiani.webp";
import ricksn from "../../assets/testimonials/ricksn.webp";
import vignesh from "../../assets/testimonials/vignesh.webp";
import kazzybits from "../../assets/testimonials/kazzybits.webp";
import abhinav from "../../assets/testimonials/abhinav.webp";
import { useInView } from "../../hooks/useInView";
import { Pop } from "./Pop";
import { pickSlot, resolvePosition, type EdgePosition } from "./edgePositions";
import { typewriterDuration } from "./Typewriter";
import styles from "./LiveQAPanel.module.css";

/**
 * The live Q&A panel: a still photo of a session, with the audience popping up around it.
 *
 * How it behaves:
 *
 * - People appear on the EDGE of the photo, centred on the edge, so each face sits half
 *   on the photo and half off it.
 * - The edge is divided into ten slots, named by edge and band (top-left, left-middle
 *   and so on). A slot picks the region; the exact point is jittered within that band,
 *   so faces move around rather than landing on the same spots.
 * - A new face never uses a slot adjacent to either of the last two used, so two faces
 *   are never near each other.
 * - No slot sits in the top-right quarter or on a corner.
 * - Faces cycle in strict order through a large pool of real students, so the same face
 *   is never on screen twice. The comments cycle separately, since there are many more
 *   faces than messages.
 * - A bubble opens away from the nearest edge: leftwards past the middle of the photo,
 *   and upwards low down, where it would otherwise cover the checks row.
 * - Two are on screen at once, on independent lifetimes, so they overlap.
 * - Every third person says something. The rest just appear and react.
 * - A speaker stays as long as their message needs: it types out, then sits there for a
 *   second before leaving. Someone who only reacts is gone much sooner.
 * - Speakers claim more space from their neighbours than reactors do, since two bubbles
 *   near each other crowd; reactors can sit closer together.
 * - Only one speech bubble is ever on screen at a time, or two would overlap and neither
 *   would be readable.
 * - A bubble opens to the RIGHT of its face, or LEFT if the face is in the last quarter.
 *   It opens DOWNWARDS, or UPWARDS if the face is in the bottom third, so it never
 *   pushes into the checks row beneath the photo.
 * - Nothing runs until the panel is scrolled into view, and nothing runs at all under
 *   reduced motion, which shows a single static face instead.
 */

const SPAWN_INTERVAL = 1400;
const MAX_ON_SCREEN = 2;
/** Every third person says something; the rest just appear and react. */
const SPEAKS_EVERY = 3;

/** Someone who only reacts is gone quickly. */
const WATCHER_LIFETIME = 2200;
/** A speaker's bubble has to be readable, so it is timed off its own message: long
 *  enough to arrive, type the whole thing out, sit there for a beat, and leave. */
const SPEAKER_ENTRY = 500;
const SPEAKER_HOLD = 1000;
const SPEAKER_EXIT = 600;

// Real students, with the names they are credited under in the testimonials. Names are
// people's names, so they stay put; only the messages are translated.
const PEOPLE = [
  { name: "Fred", face: fred },
  { name: "Oleksandra", face: oleksandra },
  { name: "Thom Chittom", face: thom },
  { name: "Shaun", face: shaun },
  { name: "@nanouss01", face: nanouss01 },
  { name: "Lucas", face: lukas },
  { name: "Chris", face: sharpiemath },
  { name: "Cpt Drac", face: drac },
  { name: "@kcash", face: kcash },
  { name: "Vignesh", face: vignesh },
  { name: "@JJ", face: jj },
  { name: "Rick", face: ricksn },
  { name: "@Kazzybits", face: kazzybits },
  { name: "@m_artigiani", face: mArtigiani },
  { name: "@abhinav", face: abhinav }
] as const;

// Five comments, cycling independently of who is on screen: there are far more faces
// than messages, so tying each message to one person would mean most of the pool never
// said anything.
const MESSAGES = ["fred", "oleksandra", "shaun", "lukas", "drac"] as const;

const CHECKS = ["joinLive", "catchUp", "getSupport"] as const;

interface ActivePop {
  id: number;
  person: (typeof PEOPLE)[number];
  message?: string;
  position: EdgePosition;
  lifetime: number;
}

export function LiveQAPanel() {
  const t = useTranslations("landing.learnToBuild");
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const [pops, setPops] = useState<ActivePop[]>([]);

  // People cycle in order, so the same face is never on screen twice. Positions are
  // picked at random from the slots not crowded by the last two used.
  const spawnCount = useRef(0);
  const activeCount = useRef(0);
  const messageIndex = useRef(0);
  const recentSlots = useRef<[number | null, number | null]>([null, null]);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const spawn = () => {
      // Bail before taking a turn in the cycle, or a skipped spawn would burn a person
      // and a position for nothing.
      if (activeCount.current >= MAX_ON_SCREEN) return;

      const n = spawnCount.current++;
      const person = PEOPLE[n % PEOPLE.length];
      const speaks = n % SPEAKS_EVERY === 0;
      const message = speaks ? t(`liveQa_${MESSAGES[messageIndex.current++ % MESSAGES.length]}`) : undefined;

      const slot = pickSlot(
        recentSlots.current[0],
        recentSlots.current[1],
        speaks ? "speaker" : "watcher",
        Math.random
      );
      recentSlots.current = [slot, recentSlots.current[0]];

      const lifetime = message
        ? SPEAKER_ENTRY + typewriterDuration(message) + SPEAKER_HOLD + SPEAKER_EXIT
        : WATCHER_LIFETIME;

      const id = n;
      activeCount.current++;
      setPops((current) => [
        ...current,
        { id, person, position: resolvePosition(slot, Math.random), message, lifetime }
      ]);

      timeouts.push(
        setTimeout(() => {
          activeCount.current--;
          setPops((c) => c.filter((p) => p.id !== id));
        }, lifetime)
      );
    };

    spawn();
    const timer = setInterval(spawn, SPAWN_INTERVAL);

    return () => {
      clearInterval(timer);
      timeouts.forEach(clearTimeout);
      activeCount.current = 0;
    };
  }, [inView, t]);

  return (
    <div className={styles.frame} ref={ref}>
      {/* The faces are positioned against the photo alone, so an edge position lands on
          the photo's edge rather than the bottom of this block, which also holds the
          checks row. */}
      <div className={styles.photo}>
        <Image
          src={liveQaSession}
          alt={t("liveQaAlt")}
          className={styles.image}
          sizes="(max-width: 900px) 100vw, 511px"
        />

        {/* Client-only: positions and emoji are randomised, so rendering them on the
            server would not match what the client then draws. */}
        {pops.map((pop) => (
          <Pop
            key={pop.id}
            face={pop.person.face}
            name={pop.person.name}
            message={pop.message}
            position={pop.position}
            seed={pop.id}
            lifetime={pop.lifetime}
          />
        ))}
      </div>

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
