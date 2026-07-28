"use client";

import { useState } from "react";
import {
  LibrarySection,
  LibraryWithConcepts,
  LibraryEmptyState,
  LibraryChallengesState
} from "@/components/coding-exercise/ui/instructions-panel";
import type { ConceptCardData } from "@/components/concepts/ConceptCard";
import styles from "./page.module.css";

const mockConcepts: ConceptCardData[] = [
  {
    slug: "functions",
    title: "Functions",
    description: "Reusable blocks of code that perform specific tasks"
  },
  {
    slug: "conditionals",
    title: "Conditional Logic",
    description: "Using if statements to make decisions in your code"
  },
  {
    slug: "variables",
    title: "Variables",
    description: "Named containers for storing data values"
  },
  {
    slug: "loops",
    title: "Loops",
    description: "Repeating code multiple times with for and while loops"
  }
];

type LibraryState = "loading" | "with-concepts" | "empty" | "challenges";

export default function LibrarySectionDevPage() {
  const [selectedState, setSelectedState] = useState<LibraryState>("with-concepts");
  const [conceptCount, setConceptCount] = useState(2);

  const states: { value: LibraryState; label: string }[] = [
    { value: "loading", label: "Loading" },
    { value: "with-concepts", label: "With Concepts" },
    { value: "empty", label: "Empty State" },
    { value: "challenges", label: "Challenges State" }
  ];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Library Section States</h1>

        {/* Controls */}
        <div className={styles.controlsCard}>
          <h2 className={styles.controlsTitle}>Controls</h2>

          <div className={styles.control}>
            <label className={styles.label}>State</label>
            <div className={styles.stateButtons}>
              {states.map((state) => (
                <button
                  key={state.value}
                  onClick={() => setSelectedState(state.value)}
                  className={styles.stateButton}
                  data-active={selectedState === state.value}
                >
                  {state.label}
                </button>
              ))}
            </div>
          </div>

          {selectedState === "with-concepts" && (
            <div>
              <label className={styles.label}>Number of Concepts: {conceptCount}</label>
              <input
                type="range"
                min="1"
                max="4"
                value={conceptCount}
                onChange={(e) => setConceptCount(Number(e.target.value))}
                className={styles.range}
              />
            </div>
          )}
        </div>

        {/* Preview with LibrarySection component */}
        <div className={styles.previewCard}>
          <div className={styles.previewHeader}>
            <h2 className={styles.previewTitle}>LibrarySection Component</h2>
            <p className={styles.previewSubtitle}>Uses the main component with state logic</p>
          </div>
          <div className={styles.previewBody}>
            <LibrarySection
              concepts={selectedState === "with-concepts" ? mockConcepts.slice(0, conceptCount) : []}
              isLoading={selectedState === "loading"}
              isChallenge={selectedState === "challenges"}
            />
          </div>
        </div>

        {/* Individual Components Preview */}
        <div className={styles.componentsCard}>
          <div className={styles.previewHeader}>
            <h2 className={styles.previewTitle}>Individual Components</h2>
            <p className={styles.previewSubtitle}>Direct component rendering</p>
          </div>
          <div className={styles.componentsBody}>
            <div>
              <h3 className={styles.componentLabel}>LibraryWithConcepts</h3>
              <div className={styles.componentBox}>
                <LibraryWithConcepts concepts={mockConcepts.slice(0, conceptCount)} />
              </div>
            </div>

            <div>
              <h3 className={styles.componentLabel}>LibraryEmptyState</h3>
              <div className={styles.componentBox}>
                <LibraryEmptyState />
              </div>
            </div>

            <div>
              <h3 className={styles.componentLabel}>LibraryChallengesState</h3>
              <div className={styles.componentBox}>
                <LibraryChallengesState />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
