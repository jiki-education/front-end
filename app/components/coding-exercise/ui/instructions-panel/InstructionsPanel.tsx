"use client";

import { useState, useRef, useEffect } from "react";
import DynamicHeader, { type ExerciseData } from "./DynamicHeader";
import InstructionsContent from "./InstructionsContent";
import FunctionsGrid from "./FunctionsGrid";
import ConceptLibrary from "./ConceptLibrary";
import { mockInstructionsData } from "./mockInstructionsData";

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
      const _instructionsTop = instructionsRef.current?.offsetTop || 0;
      const functionsTop = functionsRef.current?.offsetTop || 0;
      const conceptLibraryTop = conceptLibraryRef.current?.offsetTop || 0;

      // Update expansion state - expanded when at very top (within 20px)
      setIsExpanded(scrollTop <= 20);

      // Update active section
      if (scrollTop >= conceptLibraryTop - 100) {
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
    sectionRef.current?.scrollIntoView({ 
      behavior: "smooth",
      block: "start"
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
    <div className={`h-full flex flex-col ${className}`}>
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
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-auto px-6 py-6 bg-gray-50 scroll-smooth"
      >
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