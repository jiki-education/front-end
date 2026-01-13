import { useEffect, useRef } from "react";
import { assembleClassNames } from "@/lib/assemble-classnames";
import styles from "../../CodingExercise.module.css";

interface VisualTestCanvasProps {
  view: HTMLElement;
  isSpotlightActive?: boolean;
}

export function VisualTestCanvas({ view, isSpotlightActive = false }: VisualTestCanvasProps) {
  const viewContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!viewContainerRef.current) {
      return;
    }

    // Clean up old view
    if (viewContainerRef.current.children.length > 0) {
      const oldView = viewContainerRef.current.children[0] as HTMLElement;
      document.body.appendChild(oldView);
      oldView.style.display = "none";
    }

    viewContainerRef.current.innerHTML = "";
    view.classList.add("container-size", "aspect-square", "max-h-[100cqh]", "max-w-[100cqw]", "bg-white", "relative");
    viewContainerRef.current.appendChild(view);
    view.style.display = "block";

    return () => {
      view.style.display = "none";
      document.body.appendChild(view);
    };
  }, [view]);

  return (
    <div className={styles.rightVideoContainer}>
      <div
        className={assembleClassNames(
          "w-auto h-full max-h-full aspect-square shrink [container-type:size] relative",
          isSpotlightActive && "spotlight"
        )}
        ref={viewContainerRef}
      />
    </div>
  );
}
