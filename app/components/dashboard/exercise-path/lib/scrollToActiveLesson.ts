const ACTIVE_LESSON_SELECTOR = "[data-active-lesson='true']";

export function scrollToActiveLesson(target: HTMLElement | null | undefined) {
  target?.scrollIntoView({ behavior: "instant", block: "center" });
}

export function scrollToActiveLessonInContainer(container: HTMLElement | null) {
  if (!container) {
    return;
  }
  scrollToActiveLesson(container.querySelector<HTMLElement>(ACTIVE_LESSON_SELECTOR));
}
