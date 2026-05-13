"use client";

import { useEffect } from "react";

export function useStickyNav() {
  useEffect(() => {
    const navFixed = document.querySelector<HTMLElement>("[data-nav-fixed]");
    const navSticky = document.querySelector<HTMLElement>("[data-nav-sticky]");
    const navContents = document.querySelector<HTMLElement>("[data-nav-contents]");
    const exercismFace = document.querySelector<HTMLElement>("[data-exercism-face]");
    const tagline = document.querySelector<HTMLElement>("[data-tagline]");
    const videoContainer = document.querySelector<HTMLElement>("[data-video-container]");
    const bootcampSection = document.querySelector<HTMLElement>("[data-bootcamp-section]");
    const rockSolid = document.querySelector<HTMLElement>("[data-rock-solid]");

    if (!navFixed || !navSticky || !navContents) return;

    const ON_PURPLE_CLASS = "on-purple";
    let isRockSolidIntersecting = true;

    const intersectionCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.target === rockSolid) {
          isRockSolidIntersecting = entry.isIntersecting;
        }
        if (entry.target === tagline) {
          if (entry.isIntersecting || isRockSolidIntersecting) {
            makeInline();
          } else {
            makeSticky();
          }
        }
        if (entry.target === videoContainer) {
          if (entry.isIntersecting && !isRockSolidIntersecting) {
            smoothOpacityChange(0);
          } else {
            smoothOpacityChange(1);
          }
        }
      });
    };

    const bootcampObserverCb: IntersectionObserverCallback = (entries) => {
      if (entries[0].isIntersecting) {
        addOnPurpleClass();
      } else {
        removeOnPurpleClass();
      }
    };

    const bootcampObserver = new IntersectionObserver(bootcampObserverCb, {
      rootMargin: "0px 0px -90% 0px"
    });
    const navObserver = new IntersectionObserver(intersectionCallback);

    if (rockSolid) navObserver.observe(rockSolid);
    if (tagline) navObserver.observe(tagline);
    if (videoContainer) navObserver.observe(videoContainer);
    if (bootcampSection) bootcampObserver.observe(bootcampSection);

    function smoothOpacityChange(opacity: number) {
      navSticky!.style.opacity = `${opacity}`;
    }

    function makeSticky() {
      navSticky!.style.height = "auto";
      navSticky!.style.padding = "10px";
      navSticky!.append(navContents!);
    }

    function makeInline() {
      navSticky!.style.height = "0px";
      navSticky!.style.padding = "0px";
      navFixed!.append(navContents!);
    }

    function addOnPurpleClass() {
      if (exercismFace) exercismFace.style.filter = "invert(1)";
      navSticky!.classList.add(ON_PURPLE_CLASS);
    }

    function removeOnPurpleClass() {
      if (exercismFace) exercismFace.style.filter = "";
      navSticky!.classList.remove(ON_PURPLE_CLASS);
    }

    return () => {
      navObserver.disconnect();
      bootcampObserver.disconnect();
    };
  }, []);
}
