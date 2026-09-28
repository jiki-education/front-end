"use client";

import { useHamster } from "../hooks/useHamster";
import { useScrollingTestimonials } from "../hooks/useScrollingTestimonials";
import styles from "./ScrollingTestimonials.module.css";

// The marquee that closes the hero, with the hamster running above it. Behaviour and
// styling are carried over unchanged from the previous hero.
export function ScrollingTestimonials({ marquee }: { marquee: string[] }) {
  const { hamsterRef, smokeRef, containerRef: hamsterContainerRef } = useHamster();
  const { containerRef: marqueeContainerRef, ulRef } = useScrollingTestimonials(hamsterRef);

  return (
    // The hamster runs the way it is drawn and the belt is animated leftward, so the strip keeps
    // its own direction in RTL rather than mirroring. Bidi still orders the glyphs inside each
    // blurb, so RTL copy reads correctly; only the belt's travel is pinned.
    <div className={styles.scrollingTestimonials} ref={hamsterContainerRef} dir="ltr">
      <div className={styles.hamster} ref={hamsterRef}></div>
      <div ref={smokeRef}></div>
      <div className={styles.inner} ref={marqueeContainerRef}>
        <ul ref={ulRef} data-testid="marquee">
          {marquee.map((blurb, i) => (
            <li key={i}>{blurb}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
