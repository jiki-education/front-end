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
      // document.body is a temporary parking parent and can genuinely be null
      // during page teardown (typed non-null but seen null in production -
      // JIKI-FRONT-END-3R, same class as #873), so skip it safely.
      (document.body as HTMLElement | null)?.appendChild(oldView);
      oldView.style.display = "none";
    }

    viewContainerRef.current.innerHTML = "";
    view.classList.add("container-size", "aspect-square", "max-w-[100cqi]", "bg-white", "relative");
    viewContainerRef.current.appendChild(view);
    // Intentional DOM manipulation to show the view element
    // Next16: eslint-disable-next-line react-hooks/immutability
    view.style.display = "block";

    return () => {
      view.style.display = "none";
      // document.body can be null when this cleanup runs during page teardown
      // (typed non-null but seen null in production - JIKI-FRONT-END-3R, same
      // class as #873).
      (document.body as HTMLElement | null)?.appendChild(view);
    };
  }, [view]);

  return (
    <div className={styles.rightVideoContainer}>
      <div className="h-full aspect-square max-h-[100cqi]">
        <div
          className={assembleClassNames(
            "w-full h-full aspect-square [container-type:inline-size] relative",
            isSpotlightActive && "spotlight"
          )}
          ref={viewContainerRef}
        />
      </div>
    </div>
  );
}
