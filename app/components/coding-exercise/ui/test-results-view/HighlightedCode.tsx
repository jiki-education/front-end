import { useEffect, useRef } from "react";
import hljs from "highlight.js/lib/core";
import setupJikiscript from "@exercism/highlightjs-jikiscript";
import setupJavascript from "@jiki/highlightjs-javascript";
import styles from "./HighlightedCode.module.css";

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
    <pre className={styles.pre}>
      <code ref={ref} className={`language-${language} ${styles.code}`}>
        {code}
      </code>
    </pre>
  );
}
