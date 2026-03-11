import { forwardRef, useEffect, useRef } from "react";
import { marked } from "marked";
import hljs from "highlight.js/lib/core";
import setupJikiscript from "@exercism/highlightjs-jikiscript";
import setupJavascript from "@jiki/highlightjs-javascript";
import styles from "./instructions-panel.module.css";

hljs.registerLanguage("jikiscript", setupJikiscript);
hljs.registerLanguage("javascript", setupJavascript);

interface InstructionsContentProps {
  instructions: string;
}

const InstructionsContent = forwardRef<HTMLDivElement, InstructionsContentProps>(function InstructionsContent(
  { instructions },
  ref
) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.querySelectorAll("pre code").forEach((block) => {
        hljs.highlightElement(block as HTMLElement);
      });
    }
  }, [instructions]);

  return (
    <div ref={ref} className={styles.instructionsContainer}>
      <h2>Instructions</h2>
      <div
        ref={contentRef}
        className={styles.instructionsContent}
        dangerouslySetInnerHTML={{
          __html: marked(instructions)
        }}
      />
    </div>
  );
});

export default InstructionsContent;
