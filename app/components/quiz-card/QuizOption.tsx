"use client";

import { Check, X } from "lucide-react";

export type QuizOptionState =
  | "default"
  | "hovered"
  | "clicked"
  | "selected"
  | "correct"
  | "incorrect"
  | "correct-reveal";

interface QuizOptionProps {
  text: string;
  index: number;
  state: QuizOptionState;
  isCorrect: boolean;
  onSelect: () => void;
  disabled: boolean;
}

export function QuizOption({ text, index, state, onSelect, disabled }: QuizOptionProps) {
  const letter = String.fromCharCode(65 + index);

  const getButtonStyles = () => {
    const base =
      "w-full px-4 py-3 text-left rounded-lg transition-all duration-200 flex items-center justify-between group";

    switch (state) {
      case "default":
        return `${base} bg-white border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50`;
      case "hovered":
        return `${base} bg-blue-50 border-2 border-blue-300`;
      case "clicked":
        return `${base} bg-blue-100 border-2 border-blue-400 scale-[0.98]`;
      case "selected":
        return `${base} bg-blue-100 border-2 border-blue-500 shadow-md`;
      case "correct":
        return `${base} bg-green-100 border-2 border-green-500 shadow-md`;
      case "incorrect":
        return `${base} bg-red-100 border-2 border-red-500 shadow-md`;
      case "correct-reveal":
        return `${base} bg-green-50 border-2 border-green-400 shadow-sm`;
      default:
        return base;
    }
  };

  const showIcon = state === "correct" || state === "incorrect" || state === "correct-reveal";

  return (
    <button
      onClick={onSelect}
      disabled={disabled}
      className={getButtonStyles()}
      onMouseDown={() => !disabled && state === "default"}
      onMouseUp={() => !disabled && state === "default"}
    >
      <div className="flex items-center gap-3">
        <span className="font-semibold text-gray-600">{letter}.</span>
        <span className="text-gray-800">{text}</span>
      </div>
      {showIcon && (
        <div className="ml-2">
          {state === "correct" && <Check className="w-5 h-5 text-green-600" />}
          {state === "incorrect" && <X className="w-5 h-5 text-red-600" />}
          {state === "correct-reveal" && <Check className="w-5 h-5 text-green-600" />}
        </div>
      )}
    </button>
  );
}
