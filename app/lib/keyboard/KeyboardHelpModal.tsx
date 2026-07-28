import React from "react";
import { formatShortcutForDisplay } from "./utils";
import type { RegisteredShortcut } from "./types";
import styles from "./KeyboardHelpModal.module.css";

interface KeyboardHelpModalProps {
  shortcuts: RegisteredShortcut[];
}

export function KeyboardHelpModal({ shortcuts }: KeyboardHelpModalProps) {
  // Filter and sort shortcuts
  const filteredShortcuts = shortcuts
    .filter((s) => s.options.description)
    .sort((a, b) => {
      const scopeA = a.options.scope || "global";
      const scopeB = b.options.scope || "global";
      if (scopeA !== scopeB) {
        return scopeA.localeCompare(scopeB);
      }
      return a.keys.localeCompare(b.keys);
    });

  // Group by scope
  const grouped = filteredShortcuts.reduce(
    (acc, shortcut) => {
      const scope = shortcut.options.scope || "global";
      // ESLint doesn't realize acc[scope] can be defined from previous iterations
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!acc[scope]) {
        acc[scope] = [];
      }
      acc[scope].push(shortcut);
      return acc;
    },
    {} as Record<string, RegisteredShortcut[]>
  );

  return (
    <div className={styles.groups}>
      {Object.entries(grouped).map(([scope, items]) => (
        <div key={scope} className={styles.group}>
          <h3 className={styles.groupTitle}>{scope === "global" ? "Global" : scope}</h3>
          <div className={styles.shortcuts}>
            {items.map((item, index) => (
              <div key={`${scope}-${index}`} className={styles.shortcut}>
                <span className={styles.description}>{item.options.description}</span>
                <kbd className={styles.keys}>{formatShortcutForDisplay(item.keys)}</kbd>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
