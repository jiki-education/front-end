import { useEffect, useRef } from "react";
import hljs from "highlight.js/lib/core";
import setupJikiscript from "@exercism/highlightjs-jikiscript";
import setupJavascript from "@jiki/highlightjs-javascript";

hljs.registerLanguage("jikiscript", setupJikiscript);
hljs.registerLanguage("javascript", setupJavascript);

interface HighlightedCodeProps {
  code: string;
  language: string;
}

export function HighlightedCode({ code, language }: HighlightedCodeProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    delete ref.current.dataset.highlighted;
    hljs.highlightElement(ref.current);
  }, [code, language]);

  return (
    <pre className="!p-0 !m-0 !bg-transparent inline">
      <code ref={ref} className={`language-${language} !p-0 !bg-transparent`}>
        {code}
      </code>
    </pre>
  );
}
