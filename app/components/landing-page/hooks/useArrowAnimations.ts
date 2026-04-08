"use client";

import { useEffect, useRef } from "react";
import Lottie from "lottie-web";
import arrowAnimation from "../lottiefiles/arrow-animation.json";
import arrow3 from "../lottiefiles/arrow-3.json";

function getAnimationData(id: string) {
  switch (id) {
    case "rhodri":
    case "jiki":
      return arrow3;
    default:
      return arrowAnimation;
  }
}

export function useArrowAnimation<T extends HTMLElement = HTMLElement>(id: string) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            Lottie.loadAnimation({
              container: entry.target as HTMLElement,
              renderer: "svg",
              loop: false,
              autoplay: true,
              animationData: getAnimationData(id)
            });
            obs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -30% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [id]);

  return ref;
}
