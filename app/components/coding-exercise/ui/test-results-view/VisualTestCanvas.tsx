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
    view.classList.add("container-size", "aspect-square", "max-w-[100cqi]", "bg-white", "relative");
    viewContainerRef.current.appendChild(view);
    // Intentional DOM manipulation to show the view element
    // Next16: eslint-disable-next-line react-hooks/immutability
    view.style.display = "block";

    return () => {
      view.style.display = "none";
      document.body.appendChild(view);
    };
  }, [view]);

  return (
    <div className={styles.rightVideoContainer}>
      <div className="h-full aspect-square max-h-[calc(50cqi-17px)]">
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
