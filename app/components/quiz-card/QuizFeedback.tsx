"use client";

import { AlertCircle } from "lucide-react";

interface QuizFeedbackProps {
  type: "correct" | "incorrect" | null;
  explanation?: string;
}

export function QuizFeedback({ type, explanation }: QuizFeedbackProps) {
  if (!type) {
    return null;
  }

  if (type === "correct") {
    return <div className="mt-4 text-green-600 font-semibold text-center">Correct!</div>;
  }

  return (
    <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-amber-900">
          <p className="font-semibold mb-1">Not quite right!</p>
          {explanation && <p>{explanation}</p>}
        </div>
      </div>
    </div>
  );
}
