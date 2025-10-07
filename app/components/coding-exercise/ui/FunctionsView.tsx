"use client";

import { marked } from "marked";

interface FunctionDoc {
  name: string;
  description: string;
  usage: string;
}

interface FunctionsViewProps {
  functions?: FunctionDoc[];
}

export default function FunctionsView({ functions }: FunctionsViewProps) {
  if (!functions || functions.length === 0) {
    return <div className="p-4 text-gray-500 text-sm">No functions available for this exercise.</div>;
  }

  return (
    <div className="p-4 space-y-6 overflow-y-auto">
      {functions.map((func, index) => (
        <div key={index} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
          <h3 className="font-mono font-semibold text-gray-900 mb-2">{func.name}</h3>

          <div className="prose prose-sm max-w-none">
            <div className="text-gray-700 mb-3" dangerouslySetInnerHTML={{ __html: marked(func.description) }} />
          </div>

          <div className="mt-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Usage Example</p>
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: marked(`\`\`\`javascript\n${func.usage}\n\`\`\``) }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
