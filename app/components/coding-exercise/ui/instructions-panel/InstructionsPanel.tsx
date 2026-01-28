"use client";

import { useState, useRef, useEffect } from "react";
import DynamicHeader, { type ExerciseData } from "./DynamicHeader";
import InstructionsContent from "./InstructionsContent";
import FunctionsGrid from "./FunctionsGrid";
import LibrarySection from "./LibrarySection";
import { fetchConceptsBySlugs } from "@/lib/api/concepts";
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

  // Build exercise data from props
  const exerciseData: ExerciseData = {
    title: exerciseTitle,
    progress: "", // TODO: Get actual progress from API/orchestrator when available
    level: levelId.charAt(0).toUpperCase() + levelId.slice(1).replace(/-/g, " "),
    exerciseSlug
  };

  // Fetch concepts when conceptSlugs change
  useEffect(() => {
    async function loadConcepts() {
      if (!conceptSlugs || conceptSlugs.length === 0) {
        setConcepts([]);
        return;
      }

      setIsLoadingConcepts(true);
      try {
        const conceptData = await fetchConceptsBySlugs(conceptSlugs);

        // Transform API response to ConceptCardData format
        const transformedConcepts: ConceptCardData[] = conceptData.map((concept) => ({
          slug: concept.slug,
          title: concept.title,
          description: concept.description,
          subConceptCount: undefined // This field is not in the API response
        }));

        setConcepts(transformedConcepts);
      } catch (error) {
        console.error("Failed to fetch concepts:", error);
        setConcepts([]); // Fall back to empty array on error
      } finally {
        setIsLoadingConcepts(false);
      }
    }

    void loadConcepts();
  }, [conceptSlugs]);

  // Handle scroll to update active section
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) {
      return;
    }

    const handleScroll = () => {
      const scrollTop = scrollContainer.scrollTop;
      const scrollHeight = scrollContainer.scrollHeight;
      const clientHeight = scrollContainer.clientHeight;
      const _instructionsTop = instructionsRef.current?.offsetTop || 0;
      const functionsTop = functionsRef.current?.offsetTop || 0;
      const conceptLibraryTop = conceptLibraryRef.current?.offsetTop || 0;

      // Update expansion state - expanded when at very top (within 20px)
      setIsExpanded(scrollTop <= 20);

      // Check if user has scrolled to the bottom (within 5px threshold)
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5;

      // Update active section
      if (isAtBottom) {
        // Always switch to concept library when at the bottom
        setActiveSection("concept-library");
      } else if (scrollTop >= conceptLibraryTop - 100) {
        setActiveSection("concept-library");
      } else if (scrollTop >= functionsTop - 100) {
        setActiveSection("functions");
      } else {
        setActiveSection("instructions");
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigation functions
  const scrollToSection = (sectionRef: React.RefObject<HTMLDivElement | null>) => {
    if (!sectionRef.current || !scrollContainerRef.current) {
      return;
    }

    const container = scrollContainerRef.current;
    const targetElement = sectionRef.current;
    const containerTop = container.getBoundingClientRect().top;
    const targetTop = targetElement.getBoundingClientRect().top;
    const scrollOffset = targetTop - containerTop + container.scrollTop + 30;

    container.scrollTo({
      top: scrollOffset,
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
        onNavigateToInstructions={() => scrollToSection(instructionsRef)}
        onNavigateToFunctions={() => scrollToSection(functionsRef)}
        onNavigateToConceptLibrary={() => scrollToSection(conceptLibraryRef)}
        getSectionTitle={getSectionTitle}
      />

      {/* Scrollable Content */}
      <div ref={scrollContainerRef} className={styles.scrollableContent}>
        {/* Instructions Section */}
        <div ref={instructionsRef}>
          <InstructionsContent instructions={instructions} />
        </div>

        {/* Functions Section */}
        <div ref={functionsRef}>
          <FunctionsGrid functions={functions} />
        </div>

        {/* Concept Library Section */}
        <div ref={conceptLibraryRef}>
          <LibrarySection concepts={concepts} isLoading={isLoadingConcepts} isProject={isProject} />
        </div>
      </div>
    </div>
  );
}
