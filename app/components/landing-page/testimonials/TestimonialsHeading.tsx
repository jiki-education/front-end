"use client";

import Link from "next/link";
import { useConfetti } from "../hooks/useConfetti";
import styles from "./TestimonialsHeading.module.css";

// A torn strip of tape behind the heading. The ragged edges are CSS masks, so there is
// no artwork to commission and the strip stretches to whatever the copy needs.
export function TestimonialsHeading({
  heading,
  subheading,
  href
}: {
  heading: string;
  subheading: string;
  href: string;
}) {
  const confettiRef = useConfetti();

  return (
    <div className={styles.strip}>
      <h2 className={styles.heading} ref={confettiRef}>
        {heading}
      </h2>
      <p className={styles.sub}>
        <Subheading text={subheading} href={href} />
      </p>
    </div>
  );
}

// The subheading is a single editorial sentence containing one <link>…</link> span (kept
// intact so the whole sentence stays translatable). Split it into before/link/after and
// wrap the link text in a locale-aware <Link>.
function Subheading({ text, href }: { text: string; href: string }) {
  const match = text.match(/^([\s\S]*)<link>([\s\S]*)<\/link>([\s\S]*)$/);
  if (!match) return <>{text}</>;

  const [, before, linkText, after] = match;
  return (
    <>
      {before}
      <Link className={styles.link} href={href}>
        {linkText}
      </Link>
      {after}
    </>
  );
}
