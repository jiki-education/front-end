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
      <div className="ui-textual-content ui-textual-content-compact" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
