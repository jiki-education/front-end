/* eslint-disable @next/next/no-img-element */
"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { marked } from "marked";
import hljs from "highlight.js/lib/core";
import setupJikiscript from "@exercism/highlightjs-jikiscript";
import setupJavascript from "@jiki/highlightjs-javascript";
import { PanelHeader } from "./PanelHeader";
import EyeClosedIcon from "@/icons/eye-close.svg";
import EyeOpenIcon from "@/icons/eye-open.svg";
import { showWalkthroughConfirm } from "@/lib/modal/app";
import { useWalkthroughProgress } from "@/lib/modal/modals/useWalkthroughProgress";
import type { VideoSource } from "@/types/lesson";
import type { Hint } from "@jiki/curriculum";
import style from "./hints-panel.module.css";

hljs.registerLanguage("jikiscript", setupJikiscript);
hljs.registerLanguage("javascript", setupJavascript);

const MuxPlayer = dynamic(() => import("@/components/ui/JikiMuxPlayer"), { ssr: false });

interface HintsViewProps {
  hints: Hint[] | undefined;
  walkthroughVideoData?: VideoSource[] | null;
  lessonSlug?: string;
  className?: string;
}

export default function HintsPanel({ hints, walkthroughVideoData, lessonSlug, className = "" }: HintsViewProps) {
  const t = useTranslations("codingExercise.hintsPanel");
  const [revealedHints, setRevealedHints] = useState<Set<number>>(new Set());
  const [walkthroughUnlocked, setWalkthroughUnlocked] = useState(false);

  const hasHints = hints && hints.length > 0;
  const hasWalkthrough = walkthroughVideoData && walkthroughVideoData.length > 0 && lessonSlug;

  if (!hasHints && !hasWalkthrough) {
    return (
      <div className={`p-4 ${className}`}>
        <p className="text-sm text-gray-500 italic">{t("empty")}</p>
      </div>
    );
  }

  const handleRevealHint = (index: number) => {
    setRevealedHints((prev) => new Set([...prev, index]));
  };

  const handleWalkthroughClick = () => {
    if (!hasWalkthrough) {
      return;
    }
    if (walkthroughUnlocked) {
      return;
    }
    showWalkthroughConfirm({
      onConfirm: () => setWalkthroughUnlocked(true)
    });
  };

  return (
    <div className={`${className}`}>
      <PanelHeader title={t("title")} description={t("description")} />

      <div className="py-24 px-32">
        {hasHints && (
          <ul className="space-y-12">
            {hints.map((hint, index) => {
              const isRevealed = revealedHints.has(index);

              return (
                <li key={index}>
                  <HintItem
                    question={hint.question}
                    answer={[hint.answer]}
                    style={style}
                    isRevealed={isRevealed}
                    onReveal={() => handleRevealHint(index)}
                    onHide={() =>
                      setRevealedHints((prev) => {
                        const newSet = new Set(prev);
                        newSet.delete(index);
                        return newSet;
                      })
                    }
                  />
                </li>
              );
            })}
          </ul>
        )}

        {hasWalkthrough && (
          <div className={style.walkthroughSection}>
            <h3>{t("deepDiveHeading")}</h3>
            <p>{t("deepDiveDescription")}</p>
            {walkthroughUnlocked ? (
              <InlineWalkthroughPlayer playbackId={walkthroughVideoData[0].id} lessonSlug={lessonSlug} />
            ) : (
              <div className={style.walkthroughThumbWrapper} onClick={handleWalkthroughClick}>
                <img
                  src={`https://image.mux.com/${walkthroughVideoData[0].id}/thumbnail.jpg?width=400&height=225`}
                  alt={t("walkthroughThumbnailAlt")}
                  className={style.walkthroughThumb}
                />
                <div className={style.walkthroughPlayBtn}>
                  <svg viewBox="0 0 24 24">
                    <polygon points="6,4 20,12 6,20" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function InlineWalkthroughPlayer({ playbackId, lessonSlug }: { playbackId: string; lessonSlug: string }) {
  const { playerRef, handleTimeUpdate, handleVideoEnd, handleCanPlay } = useWalkthroughProgress(lessonSlug);

  return (
    <div className={style.walkthroughPlayerWrapper}>
      <MuxPlayer
        ref={playerRef}
        playbackId={playbackId}
        autoPlay={true}
        className={style.walkthroughPlayer}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleVideoEnd}
        onCanPlay={handleCanPlay}
      />
    </div>
  );
}

function HintAnswerContent({ answer, style }: { answer: string[]; style: any }) {
  const ref = useRef<HTMLDivElement>(null);
  const markdown = answer.join("\n\n");

  useEffect(() => {
    if (ref.current) {
      ref.current.querySelectorAll("pre code").forEach((block) => {
        hljs.highlightElement(block as HTMLElement);
      });
    }
  }, [markdown]);

  return (
    <div
      ref={ref}
      className={style?.hintAnswerContent}
      dangerouslySetInnerHTML={{ __html: marked.parse(markdown, { async: false }) }}
    />
  );
}

interface HintItemProps {
  question: string;
  answer: string[];
  isRevealed?: boolean;
  onReveal?: () => void;
  onHide?: () => void;
  style?: any;
}

function HintItem({ question, answer, isRevealed = false, onReveal, onHide, style }: HintItemProps) {
  const t = useTranslations("codingExercise.hintsPanel");
  const [showConfirmOverlay, setShowConfirmOverlay] = useState(false);

  const handleRevealClick = () => {
    if (!isRevealed) {
      setShowConfirmOverlay(true);
    } else {
      onHide?.();
    }
  };

  const handleConfirmReveal = () => {
    setShowConfirmOverlay(false);
    onReveal?.();
  };

  const handleCancelReveal = () => {
    setShowConfirmOverlay(false);
  };

  return (
    <div
      className={`${style?.hintItem} ${showConfirmOverlay ? style?.confirming : ""} ${isRevealed ? style?.expanded : ""}`}
      onClick={handleRevealClick}
    >
      <div className={style?.hintQuestion}>
        <span dangerouslySetInnerHTML={{ __html: marked.parseInline(question, { async: false }) }} />
        <div className={style?.hintRevealBtn}>
          {isRevealed ? (
            <>
              <EyeClosedIcon width={14} height={14} />
              <span className={style?.hideText}>{t("hide")}</span>
            </>
          ) : (
            <>
              <EyeOpenIcon width={14} height={14} />
              <span className={style?.revealText}>{t("reveal")}</span>
            </>
          )}
        </div>
      </div>
      <div className={style?.hintAnswer} onClick={(e) => e.stopPropagation()}>
        {showConfirmOverlay && (
          <div className={style?.hintConfirmOverlay} onClick={(e) => e.stopPropagation()}>
            <div className={style?.hintConfirmText}>{t("confirmReveal")}</div>
            <div className={style?.hintConfirmButtons}>
              <button className="ui-btn ui-btn-xs ui-btn-tertiary" onClick={handleCancelReveal}>
                {t("confirmNo")}
              </button>
              <button className="ui-btn ui-btn-xs ui-btn-primary" onClick={handleConfirmReveal}>
                {t("confirmYes")}
              </button>
            </div>
          </div>
        )}
        <HintAnswerContent answer={answer} style={style} />
      </div>
    </div>
  );
}
