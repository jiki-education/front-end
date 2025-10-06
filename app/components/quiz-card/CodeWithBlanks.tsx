"use client";

import { useEffect, useRef } from "react";

export interface CodeBlank {
  id: string;
  placeholder?: string;
  correctAnswer: string;
}

interface CodeWithBlanksProps {
  codeLines: string[];
  blanks: Record<string, CodeBlank>;
  values: Record<string, string | undefined>;
  onChange: (id: string, value: string) => void;
  showLineNumbers?: boolean;
  disabled?: boolean;
  results?: Record<string, boolean>;
}

export function CodeWithBlanks({
  codeLines,
  blanks,
  values,
  onChange,
  showLineNumbers = true,
  disabled = false,
  results
}: CodeWithBlanksProps) {
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    const firstBlankId = Object.keys(blanks)[0];
    if (firstBlankId && inputRefs.current[firstBlankId]) {
      inputRefs.current[firstBlankId].focus();
    }
  }, [blanks]);

  const renderCodeLine = (line: string, lineIndex: number) => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    const blankPattern = /\{\{(\w+)\}\}/g;
    let match;

    while ((match = blankPattern.exec(line)) !== null) {
      const blankId = match[1];
      const blank = blanks[blankId];

      if (lastIndex < match.index) {
        parts.push(<span key={`text-${lineIndex}-${lastIndex}`}>{line.substring(lastIndex, match.index)}</span>);
      }

      const inputStyle = results
        ? results[blankId]
          ? "border-green-500 bg-green-50"
          : "border-red-500 bg-red-50"
        : "border-gray-300 focus:border-blue-500";

      parts.push(
        <input
          key={`blank-${blankId}`}
          ref={(el) => {
            inputRefs.current[blankId] = el;
          }}
          type="text"
          value={values[blankId] || ""}
          onChange={(e) => onChange(blankId, e.target.value)}
          placeholder={blank.placeholder || "..."}
          disabled={disabled}
          className={`inline-block px-2 py-0.5 mx-1 font-mono text-sm border-b-2
                     ${inputStyle} bg-transparent focus:outline-none
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200`}
          style={{
            width: `${Math.max((values[blankId]?.length || blank.placeholder?.length || 3) + 2, 8)}ch`
          }}
          onKeyDown={(e) => {
            if (e.key === "Tab" && !e.shiftKey) {
              e.preventDefault();
              const blankIds = Object.keys(blanks);
              const currentIndex = blankIds.indexOf(blankId);
              const nextId = blankIds[currentIndex + 1];
              if (nextId && inputRefs.current[nextId]) {
                inputRefs.current[nextId].focus();
              }
            }
          }}
        />
      );

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < line.length) {
      parts.push(<span key={`text-${lineIndex}-end`}>{line.substring(lastIndex)}</span>);
    }

    return parts;
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
      {codeLines.map((line, index) => (
        <div key={index} className="flex hover:bg-gray-100">
          {showLineNumbers && (
            <span className="select-none text-gray-400 mr-4 min-w-[2rem] text-right">{index + 1}.</span>
          )}
          <div className="flex-1 whitespace-pre">{renderCodeLine(line, index)}</div>
        </div>
      ))}
    </div>
  );
}
