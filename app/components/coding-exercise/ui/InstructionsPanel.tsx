"use client";

interface InstructionsPanelProps {
  instructions: string;
  className?: string;
}

export default function InstructionsPanel({ instructions, className = "" }: InstructionsPanelProps) {
  return (
    <div className={`bg-white ${className}`}>
      <div className="border-b border-gray-200 px-4 py-2">
        <h2 className="text-lg font-semibold text-gray-700">Instructions</h2>
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-700 leading-relaxed">{instructions}</p>
      </div>
    </div>
  );
}