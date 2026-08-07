"use client";

import type { CSSProperties } from "react";
import Image, { type StaticImageData } from "next/image";
import { ChatBubble } from "./ChatBubble";
import { EmojiBurst } from "./EmojiBurst";
import type { EdgePosition } from "./edgePositions";
import styles from "./Pop.module.css";

interface PopProps {
  face: StaticImageData;
  name: string;
  /** Absent for a watcher: they appear and react, but say nothing. */
  message?: string;
  position: EdgePosition;
  seed: number;
  /** How long this pop is on screen. Its entrance and exit scale to fit. */
  lifetime: number;
}

// One person appearing on the edge of the photo: their face, their reactions, and their
// comment if they have one.
export function Pop({ face, name, message, position, seed, lifetime }: PopProps) {
  return (
    <span
      className={styles.pop}
      style={{ "--x": `${position.x}%`, "--y": `${position.y}%`, "--lifetime": `${lifetime}ms` } as CSSProperties}
    >
      <Image src={face} alt="" aria-hidden="true" className={styles.face} sizes="52px" />
      <EmojiBurst seed={seed} />
      {message && (
        <span className={`${styles.bubbleSlot} ${styles[position.side]} ${styles[position.vertical]}`}>
          <ChatBubble name={name} message={message} side={position.side} />
        </span>
      )}
    </span>
  );
}
