"use client";

import { useTranslations } from "next-intl";

interface CodeInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  isCorrect?: boolean;
  isIncorrect?: boolean;
}

export function CodeInput({ value, onChange, placeholder, disabled = false, isCorrect, isIncorrect }: CodeInputProps) {
  const t = useTranslations("quizCard");
  const resolvedPlaceholder = placeholder ?? t("codeInputPlaceholder");

  const getBorderStyle = () => {
    if (isCorrect) {
      return "border-green-500 bg-green-50";
    }
    if (isIncorrect) {
      return "border-red-500 bg-red-50";
    }
    return "border-gray-300 focus:border-blue-500 bg-gray-50";
  };

  return (
    <div className="w-full">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={resolvedPlaceholder}
        disabled={disabled}
        className={`w-full h-32 px-4 py-3 font-mono text-sm rounded-lg border-2 
                   ${getBorderStyle()}
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-all duration-200 resize-none`}
        spellCheck={false}
      />
    </div>
  );
}
