"use client";

import { useState, useRef, useEffect } from "react";
import DynamicHeader, { type ExerciseData } from "./DynamicHeader";
import InstructionsContent from "./InstructionsContent";
import FunctionsGrid from "./FunctionsGrid";
import LibrarySection from "./LibrarySection";
import { getConceptsBySlugs } from "@/lib/api/concepts";
import type { ConceptCardData } from "@/components/concepts/ConceptCard";
import type { FunctionInfo } from "@jiki/curriculum";
import styles from "./instructions-panel.module.css";

interface InstructionsPanelProps {
  instructions: string;
  functions: FunctionInfo[];
  conceptSlugs?: string[];
  exerciseTitle: string;
  exerciseSlug: string;
  levelId: string;
  isProject?: boolean;
  className?: string;
}

export default function InstructionsPanel({
  instructions,
  functions,
  conceptSlugs,
  exerciseTitle,
  exerciseSlug,
  levelId,
  isProject = false,
  className = ""
}: InstructionsPanelProps) {
  const [activeSection, setActiveSection] = useState("instructions");
  const [isExpanded, setIsExpanded] = useState(true);
  const [concepts, setConcepts] = useState<ConceptCardData[]>([]);
  const [isLoadingConcepts, setIsLoadingConcepts] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const instructionsRef = useRef<HTMLDivElement>(null);
  const functionsRef = useRef<HTMLDivElement>(null);
  const conceptLibraryRef = useRef<HTMLDivElement>(null);

  // Distance below the top of the scroll container at which a section's heading is
  // considered "reached". Both scrolling-to and detecting the active section use this
  // single value, so the two stay in sync by construction.
  const SECTION_OFFSET = 30;

  // Build exercise data from props
  const exerciseData: ExerciseData = {
    title: exerciseTitle,
    level: levelId.charAt(0).toUpperCase() + levelId.slice(1).replace(/-/g, " "),
    exerciseSlug,
    isProject
  };

  // Fetch concepts on mount - conceptSlugs are static for a given exercise
  useEffect(() => {
    async function loadConcepts() {
      if (!conceptSlugs || conceptSlugs.length === 0) {
        setConcepts([]);
        return;
      }

      setIsLoadingConcepts(true);
      try {
        const conceptData = await getConceptsBySlugs(conceptSlugs);

        const transformedConcepts: ConceptCardData[] = conceptData.map((concept) => ({
          slug: concept.slug,
          title: concept.title,
          description: concept.description
        }));

        setConcepts(transformedConcepts);
      } catch (error) {
        console.error("Failed to fetch concepts:", error);
        setConcepts([]);
      } finally {
        setIsLoadingConcepts(false);
      }
    }

    void loadConcepts();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- conceptSlugs are static for the lifetime of the exercise
  }, []);

  // Handle scroll to update active section
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) {
      return;
    }

    const handleScroll = () => {
      const scrollTop = scrollContainer.scrollTop;

      // Use different thresholds for expanding/collapsing header based on current state to prevent jitter
      setIsExpanded((prev) => {
        if (prev) {
          return scrollTop <= 60;
        }
        return scrollTop <= 10;
      });

      // The active section is the one whose scroll target the container has reached.
      // Targets are clamped to the container's max scroll, so a section too near the
      // bottom (whose heading can't reach the reference line) still becomes active once
      // the container is scrolled as far down as it can go toward it. When several
      // sections clamp to the same bottom target, the earliest of them wins — scrolling
      // "to Functions" lands at the bottom showing Functions at the top, so that's what
      // should highlight. This keeps the two rules in sync: clicking scrolls to a
      // section's target, and reaching that target is exactly what highlights it.
      const targets = sectionScrollTargets();
      if (!targets) {
        return;
      }

      // +1 tolerance absorbs sub-pixel rounding between the scrolled position and the target.
      const reached = scrollTop + 1;
      if (targets.functions !== null && targets.functions <= reached && targets.functions >= targets.conceptLibrary) {
        // Functions and Concept Library clamp to the same bottom target: Functions wins.
        setActiveSection("functions");
      } else if (reached >= targets.conceptLibrary) {
        setActiveSection("concept-library");
      } else if (targets.functions !== null && reached >= targets.functions) {
        setActiveSection("functions");
      } else {
        setActiveSection("instructions");
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sectionScrollTargets reads refs, recomputed per scroll
  }, [functions.length]);

  // The clamped scroll position at which each section becomes active. A section's
  // natural target lands its heading SECTION_OFFSET below the container top; clamping
  // to maxScroll handles sections too near the bottom to reach that line. Detection
  // and navigation both read these, so they cannot disagree.
  const sectionScrollTargets = () => {
    const container = scrollContainerRef.current;
    if (!container) {
      return null;
    }

    const maxScroll = container.scrollHeight - container.clientHeight;
    const targetFor = (ref: React.RefObject<HTMLDivElement | null>) => {
      if (!ref.current) {
        return null;
      }
      const natural = ref.current.offsetTop - SECTION_OFFSET;
      return Math.max(0, Math.min(natural, maxScroll));
    };

    const conceptLibrary = targetFor(conceptLibraryRef);
    return {
      instructions: targetFor(instructionsRef) ?? 0,
      functions: functions.length > 0 ? targetFor(functionsRef) : null,
      conceptLibrary: conceptLibrary ?? Infinity
    };
  };

  // Navigation functions
  const scrollToSection = (sectionRef: React.RefObject<HTMLDivElement | null>) => {
    const container = scrollContainerRef.current;
    if (!sectionRef.current || !container) {
      return;
    }

    // Scroll to the section's clamped target — the same value handleScroll uses to
    // decide the active section, so arriving here highlights this section's button.
    const target = Math.max(
      0,
      Math.min(sectionRef.current.offsetTop - SECTION_OFFSET, container.scrollHeight - container.clientHeight)
    );

    container.scrollTo({
      top: target,
      behavior: "smooth"
    });
  };

  const getSectionTitle = () => {
    switch (activeSection) {
      case "functions":
        return "Functions";
      case "concept-library":
        return "Concept Library";
      default:
        return "Instructions";
    }
  };

  return (
    <div className={`${styles.container} ${className}`}>
      {/* Dynamic Header */}
      <DynamicHeader
        isExpanded={isExpanded}
        activeSection={activeSection}
        exerciseData={exerciseData}
        hasFunctions={functions.length > 0}
        onNavigateToInstructions={() => scrollToSection(instructionsRef)}
        onNavigateToFunctions={() => scrollToSection(functionsRef)}
        onNavigateToConceptLibrary={() => scrollToSection(conceptLibraryRef)}
        getSectionTitle={getSectionTitle}
      />

      {/* Scrollable Content */}
      <div ref={scrollContainerRef} className={styles.scrollableContent}>
        {/* Instructions Section */}
        <InstructionsContent ref={instructionsRef} instructions={instructions} />

        {/* Functions Section */}
        {functions.length > 0 && (
          <div ref={functionsRef}>
            <FunctionsGrid functions={functions} />
          </div>
        )}

        {/* Concept Library Section */}
        <LibrarySection
          ref={conceptLibraryRef}
          concepts={concepts}
          isLoading={isLoadingConcepts}
          isProject={isProject}
        />
      </div>
    </div>
  );
}
