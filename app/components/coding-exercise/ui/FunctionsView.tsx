"use client";

import { marked } from "marked";
import type { FunctionInfo } from "@jiki/curriculum";

interface FunctionsViewProps {
  functions?: FunctionInfo[];
}

export default function FunctionsView({ functions }: FunctionsViewProps) {
  if (!functions || functions.length === 0) {
    return <div className="p-4 text-gray-500 text-sm">No functions available for this exercise.</div>;
  }

  return (
    <div className="p-4 space-y-6 overflow-y-auto">
      {functions.map((func, index) => (
        <div key={index} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-mono font-semibold text-gray-900">{func.signature}</h3>
            <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">{func.category}</span>
          </div>

          <div className="prose prose-sm max-w-none">
            <div className="text-gray-700 mb-3" dangerouslySetInnerHTML={{ __html: marked(func.description) }} />
          </div>

          {func.examples && func.examples.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Examples</p>
              <div className="space-y-2">
                {func.examples.map((example, idx) => (
                  <div
                    key={idx}
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: marked(`\`\`\`javascript\n${example}\n\`\`\``) }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
