/* eslint-disable @next/next/no-img-element */
"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { marked } from "marked";
import hljs from "highlight.js/lib/core";
import setupJikiscript from "@exercism/highlightjs-jikiscript";
import setupJavascript from "@jiki/highlightjs-javascript";
import { PanelHeader } from "./PanelHeader";
import EyeClosedIcon from "@/icons/eye-close.svg";
import EyeOpenIcon from "@/icons/eye-open.svg";
import { showWalkthroughConfirm } from "@/lib/modal/store";
import { useWalkthroughProgress } from "@/lib/modal/modals/useWalkthroughProgress";
import type { VideoSource } from "@/types/lesson";
import type { Hint } from "@jiki/curriculum";
import style from "./hints-panel.module.css";

hljs.registerLanguage("jikiscript", setupJikiscript);
hljs.registerLanguage("javascript", setupJavascript);

const MuxPlayer = dynamic(() => import("@mux/mux-player-react"), { ssr: false });

interface HintsViewProps {
  hints: Hint[] | undefined;
  walkthroughVideoData?: VideoSource[] | null;
  lessonSlug?: string;
  className?: string;
}

export default function HintsPanel({ hints, walkthroughVideoData, lessonSlug, className = "" }: HintsViewProps) {
  const [revealedHints, setRevealedHints] = useState<Set<number>>(new Set());
  const [walkthroughUnlocked, setWalkthroughUnlocked] = useState(false);

  const hasHints = hints && hints.length > 0;
  const hasWalkthrough = walkthroughVideoData && walkthroughVideoData.length > 0 && lessonSlug;

  if (!hasHints && !hasWalkthrough) {
    return (
      <div className={`p-4 ${className}`}>
        <p className="text-sm text-gray-500 italic">No hints available for this exercise.</p>
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
      <PanelHeader
        title="Hints"
        description="If you're stuck on this exercise, these hints can help guide you in the right direction. Click on a hint to reveal helpful tips."
      />

      <div className="py-24 px-32">
        {hasHints && (
          <ul className="space-y-3">
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
            <h3>Walkthrough Video</h3>
            <p>Still stuck? Watch a step-by-step walkthrough of this exercise.</p>
            {walkthroughUnlocked ? (
              <InlineWalkthroughPlayer playbackId={walkthroughVideoData[0].id} lessonSlug={lessonSlug} />
            ) : (
              <div className={style.walkthroughThumbWrapper} onClick={handleWalkthroughClick}>
                <img
                  src={`https://image.mux.com/${walkthroughVideoData[0].id}/thumbnail.jpg?width=400&height=225`}
                  alt="Walkthrough video thumbnail"
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
        streamType="on-demand"
        autoPlay={true}
        loop={false}
        muted={false}
        volume={0.5}
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

  return <div ref={ref} className={style?.hintAnswerContent} dangerouslySetInnerHTML={{ __html: marked(markdown) }} />;
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
        <span>{question}</span>
        <div className={style?.hintRevealBtn}>
          {isRevealed ? (
            <>
              <EyeClosedIcon width={14} height={14} />
              <span className={style?.hideText}>Hide</span>
            </>
          ) : (
            <>
              <EyeOpenIcon width={14} height={14} />
              <span className={style?.revealText}>Reveal</span>
            </>
          )}
        </div>
      </div>
      <div className={style?.hintAnswer}>
        {showConfirmOverlay && (
          <div className={style?.hintConfirmOverlay} onClick={(e) => e.stopPropagation()}>
            <div className={style?.hintConfirmText}>Are you sure you want to reveal this hint?</div>
            <div className={style?.hintConfirmButtons}>
              <button className="ui-btn ui-btn-small ui-btn-tertiary" onClick={handleCancelReveal}>
                Not for now
              </button>
              <button className="ui-btn ui-btn-small ui-btn-primary" onClick={handleConfirmReveal}>
                Yes
              </button>
            </div>
          </div>
        )}
        <HintAnswerContent answer={answer} style={style} />
      </div>
    </div>
  );
}
