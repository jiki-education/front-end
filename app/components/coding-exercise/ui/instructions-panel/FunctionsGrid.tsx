import type { FunctionInfo } from "./mockInstructionsData";

interface FunctionsGridProps {
  functions: FunctionInfo[];
  className?: string;
}

export default function FunctionsGrid({ 
  functions, 
  className = "" 
}: FunctionsGridProps) {
  return (
    <div className={`mb-8 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Functions</h3>
      <div className="space-y-4">
        {functions.map((func, index) => (
          <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="font-mono text-sm font-semibold text-blue-600">
                {func.signature}
              </div>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                {func.category}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-3">{func.description}</p>
            {func.examples && func.examples.length > 0 && (
              <div className="border-t border-gray-100 pt-3">
                <p className="text-xs font-semibold text-gray-500 mb-2">Examples:</p>
                <div className="space-y-1">
                  {func.examples.map((example, idx) => (
                    <div key={idx} className="font-mono text-xs text-gray-600 bg-gray-50 p-2 rounded">
                      {example}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}