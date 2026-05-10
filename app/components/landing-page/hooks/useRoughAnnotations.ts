"use client";

import { useEffect, useRef } from "react";
import { annotate } from "rough-notation";
import type { RoughAnnotationConfig } from "rough-notation/lib/model";

const defaultIntersectionOptions = { rootMargin: "0px 0px -30% 0px" };

const highlightConfig: Partial<RoughAnnotationConfig> & { roughness?: number } = {
  type: "highlight",
  color: "#FFF176",
  strokeWidth: 6,
  iterations: 1,
  multiline: true,
  animationDuration: 500,
  padding: 8,
  roughness: 2
};

const underlineConfig: Partial<RoughAnnotationConfig> & { roughness?: number } = {
  type: "underline",
  animationDuration: 500,
  color: "rgb(112, 42, 244)",
  multiline: true,
  iterations: 1,
  padding: -4,
  roughness: 1
};

export function useRoughAnnotations() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const highlightObserver = createAnnotateObserver(highlightConfig);
    const underlineObserver = createAnnotateObserver(underlineConfig);

    const highlights = container.querySelectorAll(".rough-highlight");
    const underlines = container.querySelectorAll(".rough-underline");

    highlights.forEach((el) => highlightObserver.observe(el));
    underlines.forEach((el) => underlineObserver.observe(el));

    return () => {
      highlightObserver.disconnect();
      underlineObserver.disconnect();
    };
  }, []);

  return containerRef;
}

function createAnnotateObserver(options: Partial<RoughAnnotationConfig>) {
  return new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        annotate(entry.target as HTMLElement, options as RoughAnnotationConfig).show();
        observer.unobserve(entry.target);
      }
    });
  }, defaultIntersectionOptions);
}
