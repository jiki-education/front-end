"use client";

import HintsPanel from "@/components/coding-exercise/ui/HintsPanel";
import { GlobalModalProvider } from "@/lib/modal/GlobalModalProvider";
import type { VideoSource } from "@/types/lesson";
import styles from "./page.module.css";

const sampleHints = [
  { question: "Hint", answer: "Try using a <code>for</code> loop to iterate through the array." },
  { question: "Hint", answer: "Remember that arrays are zero-indexed in most programming languages." },
  { question: "Hint", answer: "Consider using the <code>modulo</code> operator to check for even/odd numbers." }
];

const walkthroughVideoData: VideoSource[] = [
  {
    provider: "mux",
    id: "PNbgUkVhy38y7OELdYseo1GAD01XG8FGLJ1nj9BvuKCU",
    durationSeconds: 120,
    uploadDate: "2026-01-01"
  }
];

export default function HintsWalkthroughPage() {
  return (
    <div className={styles.page}>
      <GlobalModalProvider />
      <div className={styles.container}>
        <h1 className={styles.title}>HintsPanel — Walkthrough Video Section</h1>

        <div className={styles.sections}>
          <Section label="Hints + Walkthrough Video">
            <HintsPanel hints={sampleHints} walkthroughVideoData={walkthroughVideoData} lessonSlug="test-lesson" />
          </Section>

          <Section label="Walkthrough Video Only (no hints)">
            <HintsPanel hints={[]} walkthroughVideoData={walkthroughVideoData} lessonSlug="test-lesson" />
          </Section>

          <Section label="Hints Only (no walkthrough)">
            <HintsPanel hints={sampleHints} />
          </Section>

          <Section label="Empty State (no hints, no walkthrough)">
            <HintsPanel hints={[]} />
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className={styles.sectionTitle}>{label}</h2>
      <div className={styles.sectionBody} style={{ maxWidth: 480 }}>
        {children}
      </div>
    </div>
  );
}
