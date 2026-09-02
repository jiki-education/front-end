import dynamic from "next/dynamic";
import { forwardRef, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { marked } from "marked";
import hljs from "highlight.js/lib/core";
import setupJikiscript from "@exercism/highlightjs-jikiscript";
import setupJavascript from "@jiki/highlightjs-javascript";
import type { VideoSource } from "@/types/lesson";
import styles from "./instructions-panel.module.css";

const VideoPlayer = dynamic(() => import("@/components/ui/JikiVideoPlayer"), { ssr: false });
const YouTubePlayer = dynamic(() => import("@/components/youtube-player/JikiYouTubePlayer"), { ssr: false });

hljs.registerLanguage("jikiscript", setupJikiscript);
hljs.registerLanguage("javascript", setupJavascript);

interface InstructionsContentProps {
  instructions: string;
  // Sits below the prose so the student can rewatch the intro they were shown
  // when they first opened the exercise.
  introVideo?: VideoSource;
}

const InstructionsContent = forwardRef<HTMLDivElement, InstructionsContentProps>(function InstructionsContent(
  { instructions, introVideo },
  ref
) {
  const t = useTranslations("codingExercise.instructionsPanel");
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
      <h2>{t("instructionsTitle")}</h2>
      <div
        ref={contentRef}
        className={styles.instructionsContent}
        dangerouslySetInnerHTML={{
          __html: marked.parse(instructions, { async: false })
        }}
      />
      {introVideo && (
        <div className={styles.introVideoSection}>
          <h3>{t("introVideoTitle")}</h3>
          <div className={styles.introVideoWrapper}>
            {introVideo.provider === "youtube" ? (
              <YouTubePlayer videoId={introVideo.id} className={styles.introVideoPlayer} />
            ) : (
              <VideoPlayer playbackId={introVideo.id} className={styles.introVideoPlayer} />
            )}
          </div>
        </div>
      )}
    </div>
  );
});

export default InstructionsContent;
