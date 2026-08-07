import Image, { type StaticImageData } from "next/image";
import styles from "./StickyNote.module.css";

// Four ring colours cycle down the wall so no two adjacent notes match. The angles do
// the same, keeping the wall irregular without any of it being random at runtime.
const RING_VARIANTS = [styles.ringPurple, styles.ringAmber, styles.ringBlue, styles.ringGreen];
const ANGLES = [-1.1, 0.7, -0.6, 1.2, -1.4, 0.5];

interface StickyNoteProps {
  html: string;
  name: string;
  role: string;
  avatar: StaticImageData;
  index: number;
}

export function StickyNote({ html, name, role, avatar, index }: StickyNoteProps) {
  return (
    <div
      className={`${styles.note} ${RING_VARIANTS[index % RING_VARIANTS.length]}`}
      style={{ "--angle": `${ANGLES[index % ANGLES.length]}deg` } as React.CSSProperties}
    >
      <span className={styles.tape} aria-hidden="true" />
      {/* Quote copy is authored HTML, limited to <strong>. */}
      <p dangerouslySetInnerHTML={{ __html: html }} />
      <div className={styles.footer}>
        <Image src={avatar} alt={name} className={styles.avatar} sizes="52px" />
        <div className={styles.who}>
          <strong>{name}</strong>
          <span className={styles.role}>{role}</span>
        </div>
        <Stars />
      </div>
    </div>
  );
}

function Stars() {
  return (
    <span className={styles.stars} aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20">
          <path d="M10 1.6l2.47 5 5.53.8-4 3.9.94 5.5L10 14.2l-4.94 2.6.94-5.5-4-3.9 5.53-.8z" />
        </svg>
      ))}
    </span>
  );
}
