"use client";

import { useEffect, useState } from "react";
import { marked } from "marked";

interface QuizContentProps {
  markdown: string;
}

export function QuizContent({ markdown }: QuizContentProps) {
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    const parseMarkdown = async () => {
      const parsed = await marked(markdown);
      setHtml(parsed);
    };
    void parseMarkdown();
  }, [markdown]);

  return (
    <div className="quiz-content">
      <div className="prose prose-sm max-w-none text-gray-800" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
