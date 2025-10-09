"use client";

import { useState } from "react";

interface HintsViewProps {
  hints: string[] | undefined;
  className?: string;
}

export default function HintsView({ hints, className = "" }: HintsViewProps) {
  const [revealedHints, setRevealedHints] = useState<Set<number>>(new Set());

  if (!hints || hints.length === 0) {
    return (
      <div className={`p-4 ${className}`}>
        <p className="text-sm text-gray-500 italic">No hints available for this exercise.</p>
      </div>
    );
  }

  const handleRevealHint = (index: number) => {
    setRevealedHints((prev) => new Set([...prev, index]));
  };

  return (
    <div className={`p-4 ${className}`}>
      <ul className="space-y-3">
        {hints.map((hint, index) => {
          const isRevealed = revealedHints.has(index);

          return (
            <li key={index} className="relative">
              <div className={`flex items-start gap-3 transition-all duration-300 ${!isRevealed ? "blur-sm" : ""}`}>
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-medium">
                  {index + 1}
                </span>
                <p className="flex-1 text-sm text-gray-700">{hint}</p>
              </div>

              {!isRevealed && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded">
                  <button
                    onClick={() => handleRevealHint(index)}
                    className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded font-medium hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    Reveal hint {index + 1}
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
