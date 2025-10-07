"use client";

interface HintsViewProps {
  hints: string[] | undefined;
  className?: string;
}

export default function HintsView({ hints, className = "" }: HintsViewProps) {
  if (!hints || hints.length === 0) {
    return (
      <div className={`p-4 ${className}`}>
        <p className="text-sm text-gray-500 italic">No hints available for this exercise.</p>
      </div>
    );
  }

  return (
    <div className={`p-4 ${className}`}>
      <ul className="space-y-3">
        {hints.map((hint, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-medium">
              {index + 1}
            </span>
            <p className="flex-1 text-sm text-gray-700">{hint}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}