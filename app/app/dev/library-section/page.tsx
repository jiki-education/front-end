"use client";

import { useState } from "react";
import {
  LibrarySection,
  LibraryWithConcepts,
  LibraryEmptyState,
  LibraryProjectsState
} from "@/components/coding-exercise/ui/instructions-panel";
import type { ConceptCardData } from "@/components/concepts/ConceptCard";

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

type LibraryState = "loading" | "with-concepts" | "empty" | "projects";

export default function LibrarySectionDevPage() {
  const [selectedState, setSelectedState] = useState<LibraryState>("with-concepts");
  const [conceptCount, setConceptCount] = useState(2);

  const states: { value: LibraryState; label: string }[] = [
    { value: "loading", label: "Loading" },
    { value: "with-concepts", label: "With Concepts" },
    { value: "empty", label: "Empty State" },
    { value: "projects", label: "Projects State" }
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Library Section States</h1>

        {/* Controls */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Controls</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">State</label>
            <div className="flex flex-wrap gap-2">
              {states.map((state) => (
                <button
                  key={state.value}
                  onClick={() => setSelectedState(state.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedState === state.value
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {state.label}
                </button>
              ))}
            </div>
          </div>

          {selectedState === "with-concepts" && (
            <div>
              <label className="block text-sm font-medium mb-2">Number of Concepts: {conceptCount}</label>
              <input
                type="range"
                min="1"
                max="4"
                value={conceptCount}
                onChange={(e) => setConceptCount(Number(e.target.value))}
                className="w-full"
              />
            </div>
          )}
        </div>

        {/* Preview with LibrarySection component */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200 px-6 py-3">
            <h2 className="text-lg font-semibold">LibrarySection Component</h2>
            <p className="text-sm text-gray-500">Uses the main component with state logic</p>
          </div>
          <div className="p-6">
            <LibrarySection
              concepts={selectedState === "with-concepts" ? mockConcepts.slice(0, conceptCount) : []}
              isLoading={selectedState === "loading"}
              isProject={selectedState === "projects"}
            />
          </div>
        </div>

        {/* Individual Components Preview */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200 px-6 py-3">
            <h2 className="text-lg font-semibold">Individual Components</h2>
            <p className="text-sm text-gray-500">Direct component rendering</p>
          </div>
          <div className="p-6 space-y-8">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">LibraryWithConcepts</h3>
              <div className="border border-gray-200 rounded-lg p-4">
                <LibraryWithConcepts concepts={mockConcepts.slice(0, conceptCount)} />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">LibraryEmptyState</h3>
              <div className="border border-gray-200 rounded-lg p-4">
                <LibraryEmptyState />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">LibraryProjectsState</h3>
              <div className="border border-gray-200 rounded-lg p-4">
                <LibraryProjectsState />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
