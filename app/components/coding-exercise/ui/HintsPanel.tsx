"use client";

import { useEffect, useState } from "react";
import { PanelHeader } from "./PanelHeader";
import EyeClosedIcon from "@/icons/eye-close.svg";
import EyeOpenIcon from "@/icons/eye-open.svg";
import style from "./hints-panel.module.css";

interface HintsViewProps {
  hints: string[] | undefined;
  className?: string;
}

export default function HintsPanel({ hints, className = "" }: HintsViewProps) {
  const [revealedHints, setRevealedHints] = useState<Set<number>>(new Set());

  useEffect(() => {
    console.debug("hints", hints);
  }, [hints]);

  if (!hints || hints.length === 0) {
    return (
      <div className={`p-4 ${className}`}>
        <p className="text-sm text-gray-500 italic">No hints available for this exercise.</p>
      </div>
    );
  }

  const handleRevealHint = (index: number) => {
    setRevealedHints((prev) => new Set([...prev, index]));
  };

  return (
    <div className={`${className}`}>
      <PanelHeader
        title="Hints"
        description="If you're stuck on this exercise, these hints can help guide you in the right direction. Click on a hint to reveal helpful tips."
      />

      <div className="py-24 px-32">
        <p className="mb-20">
          If you&apos;re stuck on this exercise, these hints can help guide you in the right direction. Click on a hint
          to reveal helpful tips.
        </p>
        <ul className="space-y-3">
          {hints.map((hint, index) => {
            const isRevealed = revealedHints.has(index);

            return (
              <li key={index}>
                <HintItem
                  question={`Hint ${index + 1}`}
                  answer={[hint]}
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
      </div>
    </div>
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
    >
      <div className={style?.hintQuestion}>
        <span>{question}</span>
        <button className={style?.hintRevealBtn} onClick={handleRevealClick}>
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
        </button>
      </div>
      <div className={style?.hintAnswer}>
        {showConfirmOverlay && (
          <div className={style?.hintConfirmOverlay}>
            <div className={style?.hintConfirmText}>Are you sure you want to reveal this hint?</div>
            <div className={style?.hintConfirmButtons}>
              <button className={style?.hintConfirmNo} onClick={handleCancelReveal}>
                Not for now
              </button>
              <button className={style?.hintConfirmYes} onClick={handleConfirmReveal}>
                Yes
              </button>
            </div>
          </div>
        )}
        <div className={style?.hintAnswerContent}>
          {answer.map((paragraph, index) => (
            <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
          ))}
        </div>
      </div>
    </div>
  );
}
