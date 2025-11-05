"use client";

interface InstructionsPanelProps {
  instructions: string;
  className?: string;
}

export default function InstructionsPanel({ instructions, className = "" }: InstructionsPanelProps) {
  return (
    <div className={`bg-bg-primary ${className}`}>
      <div className="border-b border-border-primary px-4 py-2">
        <h2 className="text-lg font-semibold text-text-primary">Instructions</h2>
      </div>
      <div className="p-4">
        <p className="text-sm text-text-primary leading-relaxed">{instructions}</p>
      </div>
    </div>
  );
}
