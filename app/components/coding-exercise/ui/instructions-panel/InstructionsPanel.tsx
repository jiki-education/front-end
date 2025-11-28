"use client";

import { useState, useRef, useEffect } from "react";
import DynamicHeader, { type ExerciseData } from "./DynamicHeader";
import InstructionsContent from "./InstructionsContent";
import FunctionsGrid from "./FunctionsGrid";
import ConceptLibrary from "./ConceptLibrary";
import { mockInstructionsData } from "./mockInstructionsData";
import styles from "./instructions-panel.module.css";

interface InstructionsPanelProps {
  instructions: string;
  className?: string;
}

export default function InstructionsPanel({ instructions: _instructions, className = "" }: InstructionsPanelProps) {
  const [activeSection, setActiveSection] = useState("instructions");
  const [isExpanded, setIsExpanded] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const instructionsRef = useRef<HTMLDivElement>(null);
  const functionsRef = useRef<HTMLDivElement>(null);
  const conceptLibraryRef = useRef<HTMLDivElement>(null);

  // Mock exercise data - this would come from orchestrator
  const exerciseData: ExerciseData = {
    title: "Acronym Generator Challenge",
    progress: "5 of 12",
    level: "Functions",
    icon: "/static/images/project-icons/icon-calculator.png"
  };

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
          <InstructionsContent instructions={mockInstructionsData.instructions} />
        </div>

        {/* Functions Section */}
        <div ref={functionsRef}>
          <FunctionsGrid functions={mockInstructionsData.functions} />
        </div>

        {/* Concept Library Section */}
        <div ref={conceptLibraryRef}>
          <ConceptLibrary concepts={mockInstructionsData.conceptLibrary} />
        </div>
      </div>
    </div>
  );
}
