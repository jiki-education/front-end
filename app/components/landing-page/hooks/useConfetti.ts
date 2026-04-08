"use client";

import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";

export function useConfetti() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const confettiCanvas = document.createElement("canvas");
    Object.assign(confettiCanvas.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      zIndex: "9999"
    });
    document.body.appendChild(confettiCanvas);
    const myConfetti = confetti.create(confettiCanvas, { resize: true });

    const observer = new IntersectionObserver(([entry], obs) => {
      if (entry.isIntersecting) {
        launchConfetti(myConfetti);
        obs.disconnect();
      }
    });

    observer.observe(el);

    return () => {
      observer.disconnect();
      confettiCanvas.remove();
    };
  }, []);

  return ref;
}

function launchConfetti(myConfetti: confetti.CreateTypes) {
  const duration = 300;
  const end = Date.now() + duration;
  const colors = ["#FE3C00", "#AFC8F3", "#4C2E55", "#E9DE3F", "#BEEEAB"];

  function createConfetti(originX: number) {
    myConfetti({
      particleCount: 7,
      angle: originX === 0 ? 60 : 120,
      spread: 50,
      origin: { x: originX, y: 1 },
      colors
    });
  }

  (function frame() {
    createConfetti(0);
    createConfetti(1);
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}
