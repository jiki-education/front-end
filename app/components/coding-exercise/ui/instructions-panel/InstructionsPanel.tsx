"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
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
  isChallenge?: boolean;
  className?: string;
}

export default function InstructionsPanel({
  instructions,
  functions,
  conceptSlugs,
  exerciseTitle,
  exerciseSlug,
  levelId,
  isChallenge = false,
  className = ""
}: InstructionsPanelProps) {
  const t = useTranslations("codingExercise.instructionsPanel");
  const [activeSection, setActiveSection] = useState("instructions");
  const [isExpanded, setIsExpanded] = useState(true);
  const [concepts, setConcepts] = useState<ConceptCardData[]>([]);
  const [isLoadingConcepts, setIsLoadingConcepts] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const instructionsRef = useRef<HTMLDivElement>(null);
  const functionsRef = useRef<HTMLDivElement>(null);
  const conceptLibraryRef = useRef<HTMLDivElement>(null);

  // Distance below the container top at which a section's heading counts as "reached".
  const SECTION_OFFSET = 30;

  // Build exercise data from props
  const exerciseData: ExerciseData = {
    title: exerciseTitle,
    level: levelId.charAt(0).toUpperCase() + levelId.slice(1).replace(/-/g, " "),
    exerciseSlug,
    isChallenge
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

      // Active section = the lowest one whose (clamped) scroll target has been reached.
      const targets = sectionScrollTargets();
      if (!targets) {
        return;
      }

      const reached = scrollTop + 1; // +1 absorbs sub-pixel rounding
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
  }, [functions.length]);

  // Clamped scroll position at which each section becomes active; shared by detection and navigation so they can't disagree.
  const sectionScrollTargets = () => {
    const container = scrollContainerRef.current;
    if (!container || !instructionsRef.current || !conceptLibraryRef.current) {
      return null;
    }

    const maxScroll = container.scrollHeight - container.clientHeight;
    const targetFor = (el: HTMLDivElement) => Math.max(0, Math.min(el.offsetTop - SECTION_OFFSET, maxScroll));

    return {
      instructions: targetFor(instructionsRef.current),
      functions: functionsRef.current ? targetFor(functionsRef.current) : null,
      conceptLibrary: targetFor(conceptLibraryRef.current)
    };
  };

  const scrollToSection = (sectionRef: React.RefObject<HTMLDivElement | null>) => {
    const container = scrollContainerRef.current;
    if (!sectionRef.current || !container) {
      return;
    }

    // Scroll to the same clamped target handleScroll uses, so arriving highlights this button.
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
        return t("functionsTitle");
      case "concept-library":
        return t("conceptLibraryTitle");
      default:
        return t("instructionsTitle");
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
          isChallenge={isChallenge}
        />
      </div>
    </div>
  );
}
